const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class PatientModel {
    // Tạo bệnh nhân mới
    static async create(patientData) {
        const {
            ten_benh_nhan,
            so_dien_thoai_benh_nhan,
            gioi_tinh_benh_nhan,
            chieu_cao_benh_nhan = null,
            can_nang_benh_nhan = null
        } = patientData;

        const ma_benh_nhan = UUIDUtil.generate();

        const query = `
      INSERT INTO bang_benh_nhan (
        ma_benh_nhan,
        ten_benh_nhan,
        so_dien_thoai_benh_nhan,
        gioi_tinh_benh_nhan,
        chieu_cao_benh_nhan,
        can_nang_benh_nhan
      ) VALUES (
        UUID_TO_BIN(?),
        ?,
        ?,
        ?,
        ?,
        ?
      )
    `;

        console.log('📝 Creating patient with data:', { ma_benh_nhan, ten_benh_nhan, so_dien_thoai_benh_nhan }); // Debug

        await db.execute(query, [
            ma_benh_nhan,
            ten_benh_nhan,
            so_dien_thoai_benh_nhan,
            gioi_tinh_benh_nhan,
            chieu_cao_benh_nhan,
            can_nang_benh_nhan
        ]);

        return ma_benh_nhan;
    }

    // Tìm bệnh nhân theo ID
    static async findById(patientId) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_benh_nhan) as ma_benh_nhan,
        ten_benh_nhan,
        so_dien_thoai_benh_nhan,
        gioi_tinh_benh_nhan,
        chieu_cao_benh_nhan,
        can_nang_benh_nhan
      FROM bang_benh_nhan
      WHERE ma_benh_nhan = UUID_TO_BIN(?)
    `;

        const [rows] = await db.execute(query, [patientId]);
        return rows[0] || null;
    }

    // Tìm bệnh nhân theo SĐT
    static async findByPhone(phone) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_benh_nhan) as ma_benh_nhan,
        ten_benh_nhan,
        so_dien_thoai_benh_nhan,
        gioi_tinh_benh_nhan,
        chieu_cao_benh_nhan,
        can_nang_benh_nhan
      FROM bang_benh_nhan
      WHERE so_dien_thoai_benh_nhan = ?
      LIMIT 1
    `;

        const [rows] = await db.execute(query, [phone]);
        return rows[0] || null;
    }

    // Lấy danh sách bệnh nhân
    static async findAll(page = 1, limit = 10, search = '', gender = null) {
        const pageInt = parseInt(page) || 1;
        const limitInt = parseInt(limit) || 10;
        const offset = (pageInt - 1) * limitInt;

        let query = `
      SELECT 
        BIN_TO_UUID(ma_benh_nhan) as ma_benh_nhan,
        ten_benh_nhan,
        gioi_tinh_benh_nhan,
        so_dien_thoai_benh_nhan,
        chieu_cao_benh_nhan,
        can_nang_benh_nhan,
        hinh_anh_benh_nhan
      FROM bang_benh_nhan
    `;

        const params = [];
        const conditions = [];

        if (search) {
            conditions.push('(ten_benh_nhan LIKE ? OR so_dien_thoai_benh_nhan LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }

        if (gender !== null && gender !== undefined) {
            conditions.push('gioi_tinh_benh_nhan = ?');
            params.push(parseInt(gender));
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` ORDER BY ten_benh_nhan ASC LIMIT ${offset}, ${limitInt}`;

        const [rows] = await db.execute(query, params);

        // Đếm tổng số
        let countQuery = 'SELECT COUNT(*) as total FROM bang_benh_nhan';
        if (conditions.length > 0) {
            countQuery += ' WHERE ' + conditions.join(' AND ');
        }

        const [countResult] = await db.execute(countQuery, params);

        return {
            data: rows,
            pagination: {
                total: countResult[0].total,
                page: pageInt,
                limit: limitInt,
                totalPages: Math.ceil(countResult[0].total / limitInt)
            }
        };
    }

    // Tìm bệnh nhân theo ID
    static async findById(patientId) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_benh_nhan) as ma_benh_nhan,
        ten_benh_nhan,
        gioi_tinh_benh_nhan,
        so_dien_thoai_benh_nhan,
        chieu_cao_benh_nhan,
        can_nang_benh_nhan,
        hinh_anh_benh_nhan
      FROM bang_benh_nhan
      WHERE ma_benh_nhan = ?
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(patientId)]);
        return rows[0] || null;
    }

    // Tìm bệnh nhân theo số điện thoại
    static async findByPhone(phone) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_benh_nhan) as ma_benh_nhan,
        ten_benh_nhan,
        gioi_tinh_benh_nhan,
        so_dien_thoai_benh_nhan,
        chieu_cao_benh_nhan,
        can_nang_benh_nhan
      FROM bang_benh_nhan
      WHERE so_dien_thoai_benh_nhan = ?
    `;

        const [rows] = await db.execute(query, [phone]);
        return rows[0] || null;
    }

    // Cập nhật bệnh nhân
    static async update(patientId, updateData) {
        const {
            ten_benh_nhan,
            gioi_tinh_benh_nhan,
            so_dien_thoai_benh_nhan,
            chieu_cao_benh_nhan,
            can_nang_benh_nhan,
            hinh_anh_benh_nhan
        } = updateData;

        const fields = [];
        const values = [];

        if (ten_benh_nhan !== undefined) {
            fields.push('ten_benh_nhan = ?');
            values.push(ten_benh_nhan);
        }

        if (gioi_tinh_benh_nhan !== undefined) {
            fields.push('gioi_tinh_benh_nhan = ?');
            values.push(gioi_tinh_benh_nhan);
        }

        if (so_dien_thoai_benh_nhan !== undefined) {
            fields.push('so_dien_thoai_benh_nhan = ?');
            values.push(so_dien_thoai_benh_nhan);
        }

        if (chieu_cao_benh_nhan !== undefined) {
            fields.push('chieu_cao_benh_nhan = ?');
            values.push(chieu_cao_benh_nhan);
        }

        if (can_nang_benh_nhan !== undefined) {
            fields.push('can_nang_benh_nhan = ?');
            values.push(can_nang_benh_nhan);
        }

        if (hinh_anh_benh_nhan !== undefined) {
            fields.push('hinh_anh_benh_nhan = ?');
            values.push(hinh_anh_benh_nhan);
        }

        if (fields.length === 0) {
            throw new Error('Không có dữ liệu để cập nhật');
        }

        values.push(UUIDUtil.toBinary(patientId));

        const query = `
      UPDATE bang_benh_nhan 
      SET ${fields.join(', ')}
      WHERE ma_benh_nhan = ?
    `;

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    // Xóa bệnh nhân
    static async delete(patientId) {
        const query = 'DELETE FROM bang_benh_nhan WHERE ma_benh_nhan = ?';
        const [result] = await db.execute(query, [UUIDUtil.toBinary(patientId)]);
        return result.affectedRows > 0;
    }

    // Kiểm tra số điện thoại đã tồn tại
    static async existsByPhone(phone, excludeId = null) {
        let query = 'SELECT COUNT(*) as count FROM bang_benh_nhan WHERE so_dien_thoai_benh_nhan = ?';
        const params = [phone];

        if (excludeId) {
            query += ' AND ma_benh_nhan != ?';
            params.push(UUIDUtil.toBinary(excludeId));
        }

        const [rows] = await db.execute(query, params);
        return rows[0].count > 0;
    }

    // Kiểm tra bệnh nhân có đang được sử dụng không
    static async isInUse(patientId) {
        const queries = [
            'SELECT COUNT(*) as count FROM bang_lich_hen WHERE ma_benh_nhan = ?',
            'SELECT COUNT(*) as count FROM bang_ho_so_benh_an WHERE ma_benh_nhan = ?',
            'SELECT COUNT(*) as count FROM bang_hoa_don WHERE ma_benh_nhan_hoa_don = ?'
        ];

        const patientIdBinary = UUIDUtil.toBinary(patientId);

        for (const query of queries) {
            const [rows] = await db.execute(query, [patientIdBinary]);
            if (rows[0].count > 0) {
                return true;
            }
        }

        return false;
    }

    // Lấy lịch sử khám bệnh
    static async getMedicalHistory(patientId, page = 1, limit = 10) {
        const pageInt = parseInt(page) || 1;
        const limitInt = parseInt(limit) || 10;
        const offset = (pageInt - 1) * limitInt;

        const query = `
      SELECT 
        BIN_TO_UUID(hs.ma_ho_so_benh_an) as ma_ho_so_benh_an,
        BIN_TO_UUID(hs.ma_bac_si) as ma_bac_si,
        nd.ten_nguoi_dung as ten_bac_si,
        nd.ho_nguoi_dung as ho_bac_si,
        ck.ten_chuyen_khoa,
        hs.chieu_cao,
        hs.can_nang,
        hs.huyet_ap,
        hs.nhiet_do,
        hs.nhip_tim,
        hs.trieu_chung,
        hs.chuan_doan,
        hs.phuong_phap_dieu_tri,
        hs.ngay_tao_ho_so
      FROM bang_ho_so_benh_an hs
      INNER JOIN bang_bac_si bs ON hs.ma_bac_si = bs.ma_bac_si
      INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
      LEFT JOIN bang_chuyen_khoa ck ON hs.ma_chuyen_khoa = ck.ma_chuyen_khoa
      WHERE hs.ma_benh_nhan = ?
      ORDER BY hs.ngay_tao_ho_so DESC
      LIMIT ${offset}, ${limitInt}
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(patientId)]);

        // Đếm tổng số
        const countQuery = `
      SELECT COUNT(*) as total 
      FROM bang_ho_so_benh_an 
      WHERE ma_benh_nhan = ?
    `;
        const [countResult] = await db.execute(countQuery, [UUIDUtil.toBinary(patientId)]);

        return {
            data: rows,
            pagination: {
                total: countResult[0].total,
                page: pageInt,
                limit: limitInt,
                totalPages: Math.ceil(countResult[0].total / limitInt)
            }
        };
    }

    // Lấy lịch hẹn của bệnh nhân
    static async getAppointments(patientId, page = 1, limit = 10, status = null) {
        const pageInt = parseInt(page) || 1;
        const limitInt = parseInt(limit) || 10;
        const offset = (pageInt - 1) * limitInt;

        let query = `
      SELECT 
        BIN_TO_UUID(lh.ma_lich_hen) as ma_lich_hen,
        BIN_TO_UUID(lh.ma_bac_si) as ma_bac_si,
        nd.ten_nguoi_dung as ten_bac_si,
        nd.ho_nguoi_dung as ho_bac_si,
        ck.ten_chuyen_khoa,
        dv.ten_dich_vu,
        lh.trang_thai_lich_hen,
        lh.ly_do_kham_lich_hen,
        lh.ngay_tao_lich_hen,
        lh.thoi_gian_xac_nhan,
        lh.thoi_gian_vao_kham,
        lh.thoi_gian_hoan_thanh,
        tg.ngay,
        tg.thoi_gian_bat_dau,
        tg.thoi_gian_ket_thuc
      FROM bang_lich_hen lh
      INNER JOIN bang_bac_si bs ON lh.ma_bac_si = bs.ma_bac_si
      INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
      LEFT JOIN bang_chuyen_khoa ck ON lh.ma_chuyen_khoa = ck.ma_chuyen_khoa
      LEFT JOIN bang_dich_vu dv ON lh.ma_dich_vu_lich_hen = dv.ma_dich_vu
      LEFT JOIN bang_thoi_gian_chi_tiet tg ON lh.ma_lich_hen = tg.ma_lich_hen
      WHERE lh.ma_benh_nhan = ?
    `;

        const params = [UUIDUtil.toBinary(patientId)];

        if (status !== null && status !== undefined) {
            query += ' AND lh.trang_thai_lich_hen = ?';
            params.push(parseInt(status));
        }

        query += ` ORDER BY lh.ngay_tao_lich_hen DESC LIMIT ${offset}, ${limitInt}`;

        const [rows] = await db.execute(query, params);

        // Đếm tổng số
        let countQuery = 'SELECT COUNT(*) as total FROM bang_lich_hen WHERE ma_benh_nhan = ?';
        const countParams = [UUIDUtil.toBinary(patientId)];

        if (status !== null && status !== undefined) {
            countQuery += ' AND trang_thai_lich_hen = ?';
            countParams.push(parseInt(status));
        }

        const [countResult] = await db.execute(countQuery, countParams);

        return {
            data: rows,
            pagination: {
                total: countResult[0].total,
                page: pageInt,
                limit: limitInt,
                totalPages: Math.ceil(countResult[0].total / limitInt)
            }
        };
    }

    // Thống kê bệnh nhân theo giới tính
    static async getStatsByGender() {
        const query = `
      SELECT 
        gioi_tinh_benh_nhan,
        COUNT(*) as so_luong,
        CASE 
          WHEN gioi_tinh_benh_nhan = 0 THEN 'Nữ'
          WHEN gioi_tinh_benh_nhan = 1 THEN 'Nam'
          ELSE 'Khác'
        END as gioi_tinh
      FROM bang_benh_nhan
      WHERE gioi_tinh_benh_nhan IS NOT NULL
      GROUP BY gioi_tinh_benh_nhan
    `;

        const [rows] = await db.execute(query);
        return rows;
    }

    // Lấy bệnh nhân mới nhất
    static async getRecentPatients(limit = 10) {
        const query = `
      SELECT 
        BIN_TO_UUID(bn.ma_benh_nhan) as ma_benh_nhan,
        bn.ten_benh_nhan,
        bn.gioi_tinh_benh_nhan,
        bn.so_dien_thoai_benh_nhan,
        COUNT(lh.ma_lich_hen) as so_lan_kham
      FROM bang_benh_nhan bn
      LEFT JOIN bang_lich_hen lh ON bn.ma_benh_nhan = lh.ma_benh_nhan
      GROUP BY bn.ma_benh_nhan, bn.ten_benh_nhan, bn.gioi_tinh_benh_nhan, bn.so_dien_thoai_benh_nhan
      ORDER BY bn.ma_benh_nhan DESC
      LIMIT ${parseInt(limit)}
    `;

        const [rows] = await db.execute(query);
        return rows;
    }

    // Tính BMI (Body Mass Index)
    static calculateBMI(height, weight) {
        if (!height || !weight || height <= 0 || weight <= 0) {
            return null;
        }

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        return {
            bmi: parseFloat(bmi.toFixed(2)),
            category: this.getBMICategory(bmi)
        };
    }

    // Phân loại BMI
    static getBMICategory(bmi) {
        if (bmi < 18.5) return 'Gầy';
        if (bmi < 25) return 'Bình thường';
        if (bmi < 30) return 'Thừa cân';
        return 'Béo phì';
    }
}

module.exports = PatientModel;