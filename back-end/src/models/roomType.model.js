const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class RoomTypeModel {
    // Tạo loại phòng khám mới
    static async create(roomTypeData) {
        const { ten_loai_phong_kham, mo_ta_loai_phong_kham } = roomTypeData;

        const ma_loai_phong_kham = UUIDUtil.generate();

        const query = `
      INSERT INTO bang_loai_phong_kham (
        ma_loai_phong_kham,
        ten_loai_phong_kham,
        mo_ta_loai_phong_kham
      ) VALUES (?, ?, ?)
    `;

        await db.execute(query, [
            UUIDUtil.toBinary(ma_loai_phong_kham),
            ten_loai_phong_kham,
            mo_ta_loai_phong_kham || null
        ]);

        return ma_loai_phong_kham;
    }

    // Lấy tất cả loại phòng khám
    static async findAll() {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_loai_phong_kham) as ma_loai_phong_kham,
        ten_loai_phong_kham,
        mo_ta_loai_phong_kham,
        ngay_tao_loai_phong_kham,
        ngay_cap_nhat_loai_phong_kham
      FROM bang_loai_phong_kham
      ORDER BY ten_loai_phong_kham ASC
    `;

        const [rows] = await db.execute(query);
        return rows;
    }

    // Tìm loại phòng khám theo ID
    static async findById(roomTypeId) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_loai_phong_kham) as ma_loai_phong_kham,
        ten_loai_phong_kham,
        mo_ta_loai_phong_kham,
        ngay_tao_loai_phong_kham,
        ngay_cap_nhat_loai_phong_kham
      FROM bang_loai_phong_kham
      WHERE ma_loai_phong_kham = ?
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(roomTypeId)]);
        return rows[0] || null;
    }

    // Tìm theo tên
    static async findByName(name) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_loai_phong_kham) as ma_loai_phong_kham,
        ten_loai_phong_kham
      FROM bang_loai_phong_kham
      WHERE ten_loai_phong_kham = ?
    `;

        const [rows] = await db.execute(query, [name]);
        return rows[0] || null;
    }

    // Cập nhật loại phòng khám
    static async update(roomTypeId, updateData) {
        const { ten_loai_phong_kham, mo_ta_loai_phong_kham } = updateData;

        const fields = [];
        const values = [];

        if (ten_loai_phong_kham !== undefined) {
            fields.push('ten_loai_phong_kham = ?');
            values.push(ten_loai_phong_kham);
        }

        if (mo_ta_loai_phong_kham !== undefined) {
            fields.push('mo_ta_loai_phong_kham = ?');
            values.push(mo_ta_loai_phong_kham);
        }

        if (fields.length === 0) {
            throw new Error('Không có dữ liệu để cập nhật');
        }

        values.push(UUIDUtil.toBinary(roomTypeId));

        const query = `
      UPDATE bang_loai_phong_kham 
      SET ${fields.join(', ')}
      WHERE ma_loai_phong_kham = ?
    `;

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    // Xóa loại phòng khám
    static async delete(roomTypeId) {
        const query = 'DELETE FROM bang_loai_phong_kham WHERE ma_loai_phong_kham = ?';
        const [result] = await db.execute(query, [UUIDUtil.toBinary(roomTypeId)]);
        return result.affectedRows > 0;
    }

    // Kiểm tra tên đã tồn tại
    static async existsByName(name, excludeId = null) {
        let query = 'SELECT COUNT(*) as count FROM bang_loai_phong_kham WHERE ten_loai_phong_kham = ?';
        const params = [name];

        if (excludeId) {
            query += ' AND ma_loai_phong_kham != ?';
            params.push(UUIDUtil.toBinary(excludeId));
        }

        const [rows] = await db.execute(query, params);
        return rows[0].count > 0;
    }

    // Kiểm tra loại phòng có đang được sử dụng không
    static async isInUse(roomTypeId) {
        const query = 'SELECT COUNT(*) as count FROM bang_phong_kham WHERE ma_loai_phong_kham = ?';
        const [rows] = await db.execute(query, [UUIDUtil.toBinary(roomTypeId)]);
        return rows[0].count > 0;
    }
}

module.exports = RoomTypeModel;