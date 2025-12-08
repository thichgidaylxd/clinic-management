const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class DoctorModel {
    // Tạo bác sĩ mới
    static async create(doctorData) {
        const {
            ma_nguoi_dung_bac_si,
            ma_chuc_vu_bac_si,
            bang_cap_bac_si,
            so_nam_kinh_nghiem_bac_si,
            dang_hoat_dong_bac_si
        } = doctorData;

        const ma_bac_si = UUIDUtil.generate();

        const query = `
      INSERT INTO bang_bac_si (
        ma_bac_si,
        ma_nguoi_dung_bac_si,
        ma_chuc_vu_bac_si,
        bang_cap_bac_si,
        so_nam_kinh_nghiem_bac_si,
        dang_hoat_dong_bac_si
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

        await db.execute(query, [
            UUIDUtil.toBinary(ma_bac_si),
            UUIDUtil.toBinary(ma_nguoi_dung_bac_si),
            ma_chuc_vu_bac_si ? UUIDUtil.toBinary(ma_chuc_vu_bac_si) : null,
            bang_cap_bac_si || null,
            so_nam_kinh_nghiem_bac_si || 0,
            dang_hoat_dong_bac_si !== undefined ? dang_hoat_dong_bac_si : 1
        ]);

        return ma_bac_si;
    }

    // Lấy danh sách bác sĩ
    static async findAll(page = 1, limit = 10, search = '', status = null, positionId = null) {
        const pageInt = parseInt(page) || 1;
        const limitInt = parseInt(limit) || 10;
        const offset = (pageInt - 1) * limitInt;

        let query = `
      SELECT 
        BIN_TO_UUID(bs.ma_bac_si) as ma_bac_si,
        BIN_TO_UUID(bs.ma_nguoi_dung_bac_si) as ma_nguoi_dung_bac_si,
        BIN_TO_UUID(bs.ma_chuc_vu_bac_si) as ma_chuc_vu_bac_si,
        bs.bang_cap_bac_si,
        bs.so_nam_kinh_nghiem_bac_si,
        bs.dang_hoat_dong_bac_si,
        bs.ngay_tao_bac_si,
        bs.ngay_cap_nhat_bac_si,
        nd.ten_nguoi_dung,
        nd.ho_nguoi_dung,
        nd.email_nguoi_dung,
        nd.so_dien_thoai_nguoi_dung,
        nd.gioi_tinh_nguoi_dung,
        cv.ten_chuc_vu
      FROM bang_bac_si bs
      INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
      LEFT JOIN bang_chuc_vu cv ON bs.ma_chuc_vu_bac_si = cv.ma_chuc_vu
    `;

        const params = [];
        const conditions = [];

        if (search) {
            conditions.push('(nd.ten_nguoi_dung LIKE ? OR nd.ho_nguoi_dung LIKE ? OR nd.email_nguoi_dung LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (status !== null && status !== undefined) {
            conditions.push('bs.dang_hoat_dong_bac_si = ?');
            params.push(parseInt(status));
        }

        if (positionId) {
            conditions.push('bs.ma_chuc_vu_bac_si = ?');
            params.push(UUIDUtil.toBinary(positionId));
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` ORDER BY bs.ngay_tao_bac_si DESC LIMIT ${offset}, ${limitInt}`;

        const [rows] = await db.execute(query, params);

        // Đếm tổng số
        let countQuery = `
      SELECT COUNT(*) as total 
      FROM bang_bac_si bs
      INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
    `;
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

    // Tìm bác sĩ theo ID
    static async findById(doctorId) {
        const query = `
      SELECT 
        BIN_TO_UUID(bs.ma_bac_si) as ma_bac_si,
        BIN_TO_UUID(bs.ma_nguoi_dung_bac_si) as ma_nguoi_dung_bac_si,
        BIN_TO_UUID(bs.ma_chuc_vu_bac_si) as ma_chuc_vu_bac_si,
        bs.bang_cap_bac_si,
        bs.so_nam_kinh_nghiem_bac_si,
        bs.dang_hoat_dong_bac_si,
        bs.ngay_tao_bac_si,
        bs.ngay_cap_nhat_bac_si,
        nd.ten_nguoi_dung,
        nd.ho_nguoi_dung,
        nd.email_nguoi_dung,
        nd.so_dien_thoai_nguoi_dung,
        nd.gioi_tinh_nguoi_dung,
        nd.dia_chi_nguoi_dung,
        cv.ten_chuc_vu
      FROM bang_bac_si bs
      INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
      LEFT JOIN bang_chuc_vu cv ON bs.ma_chuc_vu_bac_si = cv.ma_chuc_vu
      WHERE bs.ma_bac_si = ?
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(doctorId)]);
        return rows[0] || null;
    }

    // Tìm bác sĩ theo user ID
    static async findByUserId(userId) {
        const query = `
      SELECT 
        BIN_TO_UUID(bs.ma_bac_si) as ma_bac_si,
        BIN_TO_UUID(bs.ma_nguoi_dung_bac_si) as ma_nguoi_dung_bac_si,
        BIN_TO_UUID(bs.ma_chuc_vu_bac_si) as ma_chuc_vu_bac_si,
        bs.bang_cap_bac_si,
        bs.so_nam_kinh_nghiem_bac_si,
        bs.dang_hoat_dong_bac_si,
        cv.ten_chuc_vu
      FROM bang_bac_si bs
      LEFT JOIN bang_chuc_vu cv ON bs.ma_chuc_vu_bac_si = cv.ma_chuc_vu
      WHERE bs.ma_nguoi_dung_bac_si = ?
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(userId)]);
        return rows[0] || null;
    }

    // Cập nhật bác sĩ
    static async update(doctorId, updateData) {
        const {
            ma_chuc_vu_bac_si,
            bang_cap_bac_si,
            so_nam_kinh_nghiem_bac_si,
            dang_hoat_dong_bac_si
        } = updateData;

        const fields = [];
        const values = [];

        if (ma_chuc_vu_bac_si !== undefined) {
            fields.push('ma_chuc_vu_bac_si = ?');
            values.push(ma_chuc_vu_bac_si ? UUIDUtil.toBinary(ma_chuc_vu_bac_si) : null);
        }

        if (bang_cap_bac_si !== undefined) {
            fields.push('bang_cap_bac_si = ?');
            values.push(bang_cap_bac_si);
        }

        if (so_nam_kinh_nghiem_bac_si !== undefined) {
            fields.push('so_nam_kinh_nghiem_bac_si = ?');
            values.push(so_nam_kinh_nghiem_bac_si);
        }

        if (dang_hoat_dong_bac_si !== undefined) {
            fields.push('dang_hoat_dong_bac_si = ?');
            values.push(dang_hoat_dong_bac_si);
        }

        if (fields.length === 0) {
            throw new Error('Không có dữ liệu để cập nhật');
        }

        values.push(UUIDUtil.toBinary(doctorId));

        const query = `
      UPDATE bang_bac_si 
      SET ${fields.join(', ')}
      WHERE ma_bac_si = ?
    `;

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    // Xóa bác sĩ
    static async delete(doctorId) {
        const query = 'DELETE FROM bang_bac_si WHERE ma_bac_si = ?';
        const [result] = await db.execute(query, [UUIDUtil.toBinary(doctorId)]);
        return result.affectedRows > 0;
    }

    // Kiểm tra user đã là bác sĩ chưa
    static async existsByUserId(userId, excludeId = null) {
        let query = 'SELECT COUNT(*) as count FROM bang_bac_si WHERE ma_nguoi_dung_bac_si = ?';
        const params = [UUIDUtil.toBinary(userId)];

        if (excludeId) {
            query += ' AND ma_bac_si != ?';
            params.push(UUIDUtil.toBinary(excludeId));
        }

        const [rows] = await db.execute(query, params);
        return rows[0].count > 0;
    }

    // Kiểm tra bác sĩ có đang được sử dụng không
    static async isInUse(doctorId) {
        const queries = [
            'SELECT COUNT(*) as count FROM bang_lich_lam_viec WHERE ma_bac_si_lich_lam_viec = ?',
            'SELECT COUNT(*) as count FROM bang_lich_hen WHERE ma_bac_si = ?',
            'SELECT COUNT(*) as count FROM bang_ho_so_benh_an WHERE ma_bac_si = ?',
            'SELECT COUNT(*) as count FROM bang_danh_gia_bac_si WHERE ma_bac_si_danh_gia = ?'
        ];

        const doctorIdBinary = UUIDUtil.toBinary(doctorId);

        for (const query of queries) {
            const [rows] = await db.execute(query, [doctorIdBinary]);
            if (rows[0].count > 0) {
                return true;
            }
        }

        return false;
    }

    // Lấy đánh giá của bác sĩ
    static async getRatings(doctorId, page = 1, limit = 10) {
        const pageInt = parseInt(page) || 1;
        const limitInt = parseInt(limit) || 10;
        const offset = (pageInt - 1) * limitInt;

        const query = `
      SELECT 
        BIN_TO_UUID(dg.ma_danh_gia) as ma_danh_gia,
        BIN_TO_UUID(dg.ma_nguoi_dung_danh_gia) as ma_nguoi_dung_danh_gia,
        dg.noi_dung_danh_gia,
        dg.so_sao_danh_gia,
        dg.trang_thai_danh_gia,
        dg.ngay_tao_danh_gia,
        nd.ten_nguoi_dung,
        nd.ho_nguoi_dung
      FROM bang_danh_gia_bac_si dg
      INNER JOIN bang_nguoi_dung nd ON dg.ma_nguoi_dung_danh_gia = nd.ma_nguoi_dung
      WHERE dg.ma_bac_si_danh_gia = ? AND dg.trang_thai_danh_gia = 1
      ORDER BY dg.ngay_tao_danh_gia DESC
      LIMIT ${offset}, ${limitInt}
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(doctorId)]);

        // Đếm tổng số
        const countQuery = `
      SELECT COUNT(*) as total 
      FROM bang_danh_gia_bac_si 
      WHERE ma_bac_si_danh_gia = ? AND trang_thai_danh_gia = 1
    `;
        const [countResult] = await db.execute(countQuery, [UUIDUtil.toBinary(doctorId)]);

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

    // Lấy thống kê đánh giá
    static async getRatingStats(doctorId) {
        const query = `
      SELECT 
        COUNT(*) as tong_danh_gia,
        AVG(so_sao_danh_gia) as diem_trung_binh,
        SUM(CASE WHEN so_sao_danh_gia = 5 THEN 1 ELSE 0 END) as sao_5,
        SUM(CASE WHEN so_sao_danh_gia = 4 THEN 1 ELSE 0 END) as sao_4,
        SUM(CASE WHEN so_sao_danh_gia = 3 THEN 1 ELSE 0 END) as sao_3,
        SUM(CASE WHEN so_sao_danh_gia = 2 THEN 1 ELSE 0 END) as sao_2,
        SUM(CASE WHEN so_sao_danh_gia = 1 THEN 1 ELSE 0 END) as sao_1
      FROM bang_danh_gia_bac_si
      WHERE ma_bac_si_danh_gia = ? AND trang_thai_danh_gia = 1
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(doctorId)]);
        return rows[0] || null;
    }

    // Lấy bác sĩ có đánh giá cao nhất
    static async getTopRated(limit = 10) {
        const query = `
      SELECT 
        BIN_TO_UUID(bs.ma_bac_si) as ma_bac_si,
        nd.ten_nguoi_dung,
        nd.ho_nguoi_dung,
        cv.ten_chuc_vu,
        bs.so_nam_kinh_nghiem_bac_si,
        COUNT(dg.ma_danh_gia) as tong_danh_gia,
        AVG(dg.so_sao_danh_gia) as diem_trung_binh
      FROM bang_bac_si bs
      INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
      LEFT JOIN bang_chuc_vu cv ON bs.ma_chuc_vu_bac_si = cv.ma_chuc_vu
      LEFT JOIN bang_danh_gia_bac_si dg ON bs.ma_bac_si = dg.ma_bac_si_danh_gia 
        AND dg.trang_thai_danh_gia = 1
      WHERE bs.dang_hoat_dong_bac_si = 1
      GROUP BY bs.ma_bac_si, nd.ten_nguoi_dung, nd.ho_nguoi_dung, 
               cv.ten_chuc_vu, bs.so_nam_kinh_nghiem_bac_si
      HAVING COUNT(dg.ma_danh_gia) > 0
      ORDER BY diem_trung_binh DESC, tong_danh_gia DESC
      LIMIT ${parseInt(limit)}
    `;

        const [rows] = await db.execute(query);
        return rows;
    }

    // Thống kê bác sĩ theo chức vụ
    static async getStatsByPosition() {
        const query = `
      SELECT 
        BIN_TO_UUID(cv.ma_chuc_vu) as ma_chuc_vu,
        cv.ten_chuc_vu,
        COUNT(bs.ma_bac_si) as so_luong_bac_si,
        SUM(CASE WHEN bs.dang_hoat_dong_bac_si = 1 THEN 1 ELSE 0 END) as dang_hoat_dong,
        SUM(CASE WHEN bs.dang_hoat_dong_bac_si = 0 THEN 1 ELSE 0 END) as ngung_hoat_dong
      FROM bang_chuc_vu cv
      LEFT JOIN bang_bac_si bs ON cv.ma_chuc_vu = bs.ma_chuc_vu_bac_si
      GROUP BY cv.ma_chuc_vu, cv.ten_chuc_vu
      ORDER BY so_luong_bac_si DESC
    `;

        const [rows] = await db.execute(query);
        return rows;
    }
}

module.exports = DoctorModel;