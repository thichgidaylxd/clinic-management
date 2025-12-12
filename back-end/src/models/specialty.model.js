const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class SpecialtyModel {
    // Tạo chuyên khoa mới
    static async create(specialtyData) {
        const {
            ten_chuyen_khoa,
            mo_ta_chuyen_khoa,
            hinh_anh_chuyen_khoa
        } = specialtyData;

        const ma_chuyen_khoa = UUIDUtil.generate();

        const query = `
      INSERT INTO bang_chuyen_khoa (
        ma_chuyen_khoa,
        ten_chuyen_khoa,
        mo_ta_chuyen_khoa,
        hinh_anh_chuyen_khoa
      ) VALUES (?, ?, ?, ?)
    `;

        await db.execute(query, [
            UUIDUtil.toBinary(ma_chuyen_khoa),
            ten_chuyen_khoa,
            mo_ta_chuyen_khoa || null,
            hinh_anh_chuyen_khoa || null
        ]);

        return ma_chuyen_khoa;
    }

    // Lấy tất cả chuyên khoa
    static async findAll(page = 1, limit = 10, search = '') {
        // Parse sang integer
        const pageInt = parseInt(page) || 1;
        const limitInt = parseInt(limit) || 10;
        const offset = (pageInt - 1) * limitInt;

        let query = `
      SELECT 
        BIN_TO_UUID(ma_chuyen_khoa) as ma_chuyen_khoa,
        ten_chuyen_khoa,
        mo_ta_chuyen_khoa,
        hinh_anh_chuyen_khoa,
        ngay_tao_chuyen_khoa,
        ngay_cap_nhat_chuyen_khoa
      FROM bang_chuyen_khoa
    `;

        const params = [];

        if (search) {
            query += ' WHERE ten_chuyen_khoa LIKE ?';
            params.push(`%${search}%`);
        }

        // Không dùng placeholder cho LIMIT - dùng số trực tiếp
        query += ` ORDER BY ten_chuyen_khoa ASC LIMIT ${offset}, ${limitInt}`;

        const [rows] = await db.execute(query, params);

        // Đếm tổng số
        let countQuery = 'SELECT COUNT(*) as total FROM bang_chuyen_khoa';
        if (search) {
            countQuery += ' WHERE ten_chuyen_khoa LIKE ?';
        }

        const [countResult] = await db.execute(
            countQuery,
            search ? [`%${search}%`] : []
        );

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

    // Tìm chuyên khoa theo ID
    static async findById(specialtyId) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_chuyen_khoa) as ma_chuyen_khoa,
        ten_chuyen_khoa,
        mo_ta_chuyen_khoa,
        hinh_anh_chuyen_khoa,
        ngay_tao_chuyen_khoa,
        ngay_cap_nhat_chuyen_khoa
      FROM bang_chuyen_khoa
      WHERE ma_chuyen_khoa = ?
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(specialtyId)]);
        return rows[0] || null;
    }

    // Tìm theo tên
    static async findByName(name) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_chuyen_khoa) as ma_chuyen_khoa,
        ten_chuyen_khoa
      FROM bang_chuyen_khoa
      WHERE ten_chuyen_khoa = ?
    `;

        const [rows] = await db.execute(query, [name]);
        return rows[0] || null;
    }

    // Cập nhật chuyên khoa
    static async update(specialtyId, updateData) {
        const {
            ten_chuyen_khoa,
            mo_ta_chuyen_khoa,
            hinh_anh_chuyen_khoa
        } = updateData;

        const fields = [];
        const values = [];

        if (ten_chuyen_khoa !== undefined) {
            fields.push('ten_chuyen_khoa = ?');
            values.push(ten_chuyen_khoa);
        }

        if (mo_ta_chuyen_khoa !== undefined) {
            fields.push('mo_ta_chuyen_khoa = ?');
            values.push(mo_ta_chuyen_khoa);
        }

        if (hinh_anh_chuyen_khoa !== undefined) {
            fields.push('hinh_anh_chuyen_khoa = ?');
            values.push(hinh_anh_chuyen_khoa);
        }

        if (fields.length === 0) {
            throw new Error('Không có dữ liệu để cập nhật');
        }

        values.push(UUIDUtil.toBinary(specialtyId));

        const query = `
      UPDATE bang_chuyen_khoa 
      SET ${fields.join(', ')}
      WHERE ma_chuyen_khoa = ?
    `;

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    // Xóa chuyên khoa
    static async delete(specialtyId) {
        const query = 'DELETE FROM bang_chuyen_khoa WHERE ma_chuyen_khoa = ?';
        const [result] = await db.execute(query, [UUIDUtil.toBinary(specialtyId)]);
        return result.affectedRows > 0;
    }

    // Kiểm tra tên chuyên khoa đã tồn tại
    static async existsByName(name, excludeId = null) {
        let query = 'SELECT COUNT(*) as count FROM bang_chuyen_khoa WHERE ten_chuyen_khoa = ?';
        const params = [name];

        if (excludeId) {
            query += ' AND ma_chuyen_khoa != ?';
            params.push(UUIDUtil.toBinary(excludeId));
        }

        const [rows] = await db.execute(query, params);
        return rows[0].count > 0;
    }

    // Kiểm tra chuyên khoa có đang được sử dụng không
    static async isInUse(specialtyId) {
        const queries = [
            'SELECT COUNT(*) as count FROM bang_dich_vu WHERE ma_chuyen_khoa_dich_vu = ?',
            'SELECT COUNT(*) as count FROM bang_phong_kham WHERE ma_chuyen_khoa_phong_kham = ?',
            // ❌ XÓA: bang_lich_lam_viec
            'SELECT COUNT(*) as count FROM bang_bac_si_chuyen_khoa WHERE ma_chuyen_khoa = ?', // ✅ Thêm
            'SELECT COUNT(*) as count FROM bang_lich_hen WHERE ma_chuyen_khoa = ?'
        ];

        const specialtyIdBinary = UUIDUtil.toBinary(specialtyId);

        for (const query of queries) {
            const [rows] = await db.execute(query, [specialtyIdBinary]);
            if (rows[0].count > 0) {
                return true;
            }
        }

        return false;
    }
}

module.exports = SpecialtyModel;