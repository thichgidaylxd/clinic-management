const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class ServiceModel {
    // Tạo dịch vụ mới
    static async create(serviceData) {
        const {
            ma_chuyen_khoa_dich_vu,
            ten_dich_vu,
            mo_ta_dich_vu,
            don_gia_dich_vu
        } = serviceData;

        const ma_dich_vu = UUIDUtil.generate();

        const query = `
      INSERT INTO bang_dich_vu (
        ma_dich_vu,
        ma_chuyen_khoa_dich_vu,
        ten_dich_vu,
        mo_ta_dich_vu,
        don_gia_dich_vu
      ) VALUES (?, ?, ?, ?, ?)
    `;

        await db.execute(query, [
            UUIDUtil.toBinary(ma_dich_vu),
            ma_chuyen_khoa_dich_vu ? UUIDUtil.toBinary(ma_chuyen_khoa_dich_vu) : null,
            ten_dich_vu,
            mo_ta_dich_vu || null,
            don_gia_dich_vu
        ]);

        return ma_dich_vu;
    }

    // Lấy danh sách dịch vụ
    static async findAll(page = 1, limit = 10, search = '', specialtyId = null) {
        const pageInt = parseInt(page) || 1;
        const limitInt = parseInt(limit) || 10;
        const offset = (pageInt - 1) * limitInt;

        let query = `
      SELECT 
        BIN_TO_UUID(dv.ma_dich_vu) as ma_dich_vu,
        BIN_TO_UUID(dv.ma_chuyen_khoa_dich_vu) as ma_chuyen_khoa_dich_vu,
        dv.ten_dich_vu,
        dv.mo_ta_dich_vu,
        dv.don_gia_dich_vu,
        dv.ngay_tao_dich_vu,
        dv.ngay_cap_nhat_dich_vu,
        ck.ten_chuyen_khoa
      FROM bang_dich_vu dv
      LEFT JOIN bang_chuyen_khoa ck ON dv.ma_chuyen_khoa_dich_vu = ck.ma_chuyen_khoa
    `;

        const params = [];
        const conditions = [];

        if (search) {
            conditions.push('dv.ten_dich_vu LIKE ?');
            params.push(`%${search}%`);
        }

        if (specialtyId) {
            conditions.push('dv.ma_chuyen_khoa_dich_vu = ?');
            params.push(UUIDUtil.toBinary(specialtyId));
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` ORDER BY dv.ngay_tao_dich_vu DESC LIMIT ${offset}, ${limitInt}`;

        const [rows] = await db.execute(query, params);

        // Đếm tổng số
        let countQuery = 'SELECT COUNT(*) as total FROM bang_dich_vu dv';
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

    // Tìm dịch vụ theo ID
    static async findById(serviceId) {
        const query = `
      SELECT 
        BIN_TO_UUID(dv.ma_dich_vu) as ma_dich_vu,
        BIN_TO_UUID(dv.ma_chuyen_khoa_dich_vu) as ma_chuyen_khoa_dich_vu,
        dv.ten_dich_vu,
        dv.mo_ta_dich_vu,
        dv.don_gia_dich_vu,
        dv.ngay_tao_dich_vu,
        dv.ngay_cap_nhat_dich_vu,
        ck.ten_chuyen_khoa
      FROM bang_dich_vu dv
      LEFT JOIN bang_chuyen_khoa ck ON dv.ma_chuyen_khoa_dich_vu = ck.ma_chuyen_khoa
      WHERE dv.ma_dich_vu = ?
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(serviceId)]);
        return rows[0] || null;
    }

    // Tìm theo tên
    static async findByName(name) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_dich_vu) as ma_dich_vu,
        ten_dich_vu
      FROM bang_dich_vu
      WHERE ten_dich_vu = ?
    `;

        const [rows] = await db.execute(query, [name]);
        return rows[0] || null;
    }

    // Lấy dịch vụ theo chuyên khoa
    static async findBySpecialty(specialtyId) {
        const query = `
        SELECT 
            BIN_TO_UUID(dv.ma_dich_vu) as ma_dich_vu,
            dv.ten_dich_vu,
            dv.mo_ta_dich_vu,
            dv.don_gia_dich_vu,
            BIN_TO_UUID(dv.ma_chuyen_khoa_dich_vu) as ma_chuyen_khoa,
            ck.ten_chuyen_khoa
        FROM bang_dich_vu dv
        LEFT JOIN bang_chuyen_khoa ck ON dv.ma_chuyen_khoa_dich_vu = ck.ma_chuyen_khoa
        WHERE dv.ma_chuyen_khoa_dich_vu = ?
        ORDER BY dv.ten_dich_vu
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(specialtyId)]);
        return rows;
    }

    // Cập nhật dịch vụ
    static async update(serviceId, updateData) {
        const {
            ma_chuyen_khoa_dich_vu,
            ten_dich_vu,
            mo_ta_dich_vu,
            don_gia_dich_vu
        } = updateData;

        const fields = [];
        const values = [];

        if (ma_chuyen_khoa_dich_vu !== undefined) {
            fields.push('ma_chuyen_khoa_dich_vu = ?');
            values.push(ma_chuyen_khoa_dich_vu ? UUIDUtil.toBinary(ma_chuyen_khoa_dich_vu) : null);
        }

        if (ten_dich_vu !== undefined) {
            fields.push('ten_dich_vu = ?');
            values.push(ten_dich_vu);
        }

        if (mo_ta_dich_vu !== undefined) {
            fields.push('mo_ta_dich_vu = ?');
            values.push(mo_ta_dich_vu);
        }

        if (don_gia_dich_vu !== undefined) {
            fields.push('don_gia_dich_vu = ?');
            values.push(don_gia_dich_vu);
        }

        if (fields.length === 0) {
            throw new Error('Không có dữ liệu để cập nhật');
        }

        values.push(UUIDUtil.toBinary(serviceId));

        const query = `
      UPDATE bang_dich_vu 
      SET ${fields.join(', ')}
      WHERE ma_dich_vu = ?
    `;

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    // Xóa dịch vụ
    static async delete(serviceId) {
        const query = 'DELETE FROM bang_dich_vu WHERE ma_dich_vu = ?';
        const [result] = await db.execute(query, [UUIDUtil.toBinary(serviceId)]);
        return result.affectedRows > 0;
    }

    // Kiểm tra tên dịch vụ đã tồn tại
    static async existsByName(name, excludeId = null) {
        let query = 'SELECT COUNT(*) as count FROM bang_dich_vu WHERE ten_dich_vu = ?';
        const params = [name];

        if (excludeId) {
            query += ' AND ma_dich_vu != ?';
            params.push(UUIDUtil.toBinary(excludeId));
        }

        const [rows] = await db.execute(query, params);
        return rows[0].count > 0;
    }

    // Kiểm tra dịch vụ có đang được sử dụng không
    static async isInUse(serviceId) {
        const query = 'SELECT COUNT(*) as count FROM bang_lich_hen WHERE ma_dich_vu_lich_hen = ?';
        const [rows] = await db.execute(query, [UUIDUtil.toBinary(serviceId)]);
        return rows[0].count > 0;
    }

    // Thống kê dịch vụ theo chuyên khoa
    static async getStatsBySpecialty() {
        const query = `
      SELECT 
        BIN_TO_UUID(ck.ma_chuyen_khoa) as ma_chuyen_khoa,
        ck.ten_chuyen_khoa,
        COUNT(dv.ma_dich_vu) as so_luong_dich_vu,
        MIN(dv.don_gia_dich_vu) as gia_thap_nhat,
        MAX(dv.don_gia_dich_vu) as gia_cao_nhat,
        AVG(dv.don_gia_dich_vu) as gia_trung_binh
      FROM bang_chuyen_khoa ck
      LEFT JOIN bang_dich_vu dv ON ck.ma_chuyen_khoa = dv.ma_chuyen_khoa_dich_vu
      GROUP BY ck.ma_chuyen_khoa, ck.ten_chuyen_khoa
      ORDER BY so_luong_dich_vu DESC
    `;

        const [rows] = await db.execute(query);
        return rows;
    }

    // Lấy dịch vụ phổ biến nhất
    static async getMostPopular(limit = 10) {
        const query = `
      SELECT 
        BIN_TO_UUID(dv.ma_dich_vu) as ma_dich_vu,
        dv.ten_dich_vu,
        dv.don_gia_dich_vu,
        ck.ten_chuyen_khoa,
        COUNT(lh.ma_lich_hen) as so_luot_su_dung
      FROM bang_dich_vu dv
      LEFT JOIN bang_chuyen_khoa ck ON dv.ma_chuyen_khoa_dich_vu = ck.ma_chuyen_khoa
      LEFT JOIN bang_lich_hen lh ON dv.ma_dich_vu = lh.ma_dich_vu_lich_hen
      GROUP BY dv.ma_dich_vu, dv.ten_dich_vu, dv.don_gia_dich_vu, ck.ten_chuyen_khoa
      ORDER BY so_luot_su_dung DESC
      LIMIT ${parseInt(limit)}
    `;

        const [rows] = await db.execute(query);
        return rows;
    }
}

module.exports = ServiceModel;