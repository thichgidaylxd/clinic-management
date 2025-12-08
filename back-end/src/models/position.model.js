const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class PositionModel {
    // Tạo chức vụ mới
    static async create(positionData) {
        const { ten_chuc_vu, dang_hoat_dong_chuc_vu } = positionData;

        const ma_chuc_vu = UUIDUtil.generate();

        const query = `
      INSERT INTO bang_chuc_vu (
        ma_chuc_vu,
        ten_chuc_vu,
        dang_hoat_dong_chuc_vu
      ) VALUES (?, ?, ?)
    `;

        await db.execute(query, [
            UUIDUtil.toBinary(ma_chuc_vu),
            ten_chuc_vu,
            dang_hoat_dong_chuc_vu !== undefined ? dang_hoat_dong_chuc_vu : 1
        ]);

        return ma_chuc_vu;
    }

    // Lấy tất cả chức vụ
    static async findAll(status = null) {
        let query = `
      SELECT 
        BIN_TO_UUID(ma_chuc_vu) as ma_chuc_vu,
        ten_chuc_vu,
        dang_hoat_dong_chuc_vu,
        ngay_tao_chuc_vu,
        ngay_cap_nhat_chuc_vu
      FROM bang_chuc_vu
    `;

        const params = [];

        if (status !== null && status !== undefined) {
            query += ' WHERE dang_hoat_dong_chuc_vu = ?';
            params.push(parseInt(status));
        }

        query += ' ORDER BY ten_chuc_vu ASC';

        const [rows] = await db.execute(query, params);
        return rows;
    }

    // Tìm chức vụ theo ID
    static async findById(positionId) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_chuc_vu) as ma_chuc_vu,
        ten_chuc_vu,
        dang_hoat_dong_chuc_vu,
        ngay_tao_chuc_vu,
        ngay_cap_nhat_chuc_vu
      FROM bang_chuc_vu
      WHERE ma_chuc_vu = ?
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(positionId)]);
        return rows[0] || null;
    }

    // Tìm theo tên
    static async findByName(name) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_chuc_vu) as ma_chuc_vu,
        ten_chuc_vu
      FROM bang_chuc_vu
      WHERE ten_chuc_vu = ?
    `;

        const [rows] = await db.execute(query, [name]);
        return rows[0] || null;
    }

    // Cập nhật chức vụ
    static async update(positionId, updateData) {
        const { ten_chuc_vu, dang_hoat_dong_chuc_vu } = updateData;

        const fields = [];
        const values = [];

        if (ten_chuc_vu !== undefined) {
            fields.push('ten_chuc_vu = ?');
            values.push(ten_chuc_vu);
        }

        if (dang_hoat_dong_chuc_vu !== undefined) {
            fields.push('dang_hoat_dong_chuc_vu = ?');
            values.push(dang_hoat_dong_chuc_vu);
        }

        if (fields.length === 0) {
            throw new Error('Không có dữ liệu để cập nhật');
        }

        values.push(UUIDUtil.toBinary(positionId));

        const query = `
      UPDATE bang_chuc_vu 
      SET ${fields.join(', ')}
      WHERE ma_chuc_vu = ?
    `;

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    // Xóa chức vụ
    static async delete(positionId) {
        const query = 'DELETE FROM bang_chuc_vu WHERE ma_chuc_vu = ?';
        const [result] = await db.execute(query, [UUIDUtil.toBinary(positionId)]);
        return result.affectedRows > 0;
    }

    // Kiểm tra tên đã tồn tại
    static async existsByName(name, excludeId = null) {
        let query = 'SELECT COUNT(*) as count FROM bang_chuc_vu WHERE ten_chuc_vu = ?';
        const params = [name];

        if (excludeId) {
            query += ' AND ma_chuc_vu != ?';
            params.push(UUIDUtil.toBinary(excludeId));
        }

        const [rows] = await db.execute(query, params);
        return rows[0].count > 0;
    }

    // Kiểm tra chức vụ có đang được sử dụng không
    static async isInUse(positionId) {
        const query = 'SELECT COUNT(*) as count FROM bang_bac_si WHERE ma_chuc_vu_bac_si = ?';
        const [rows] = await db.execute(query, [UUIDUtil.toBinary(positionId)]);
        return rows[0].count > 0;
    }
}

module.exports = PositionModel;