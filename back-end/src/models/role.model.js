const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class RoleModel {
    // Lấy tất cả vai trò
    static async findAll() {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_vai_tro) as ma_vai_tro,
        ten_vai_tro,
        trang_thai_vai_tro,
        ngay_tao_vai_tro
      FROM bang_vai_tro
      WHERE trang_thai_vai_tro = 1
      ORDER BY ten_vai_tro
    `;

        const [rows] = await db.execute(query);
        return rows;
    }

    // Tìm vai trò theo ID
    static async findById(roleId) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_vai_tro) as ma_vai_tro,
        ten_vai_tro,
        trang_thai_vai_tro
      FROM bang_vai_tro
      WHERE ma_vai_tro = ?
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(roleId)]);
        return rows[0] || null;
    }

    // Tìm vai trò theo tên
    static async findByName(roleName) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_vai_tro) as ma_vai_tro,
        ten_vai_tro,
        trang_thai_vai_tro
      FROM bang_vai_tro
      WHERE ten_vai_tro = ? AND trang_thai_vai_tro = 1
    `;

        const [rows] = await db.execute(query, [roleName]);
        return rows[0] || null;
    }
}

module.exports = RoleModel;