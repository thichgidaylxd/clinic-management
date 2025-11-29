const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class UserModel {
    // Tạo người dùng mới
    static async create(userData) {
        const {
            ma_vai_tro,
            ten_nguoi_dung,
            ho_nguoi_dung,
            ten_dang_nhap_nguoi_dung,
            mat_khau_nguoi_dung,
            email_nguoi_dung,
            so_dien_thoai_nguoi_dung,
            gioi_tinh_nguoi_dung,
            dia_chi_nguoi_dung
        } = userData;

        const ma_nguoi_dung = UUIDUtil.generate();

        const query = `
      INSERT INTO bang_nguoi_dung (
        ma_nguoi_dung,
        ma_vai_tro,
        ten_nguoi_dung,
        ho_nguoi_dung,
        ten_dang_nhap_nguoi_dung,
        mat_khau_nguoi_dung,
        email_nguoi_dung,
        so_dien_thoai_nguoi_dung,
        gioi_tinh_nguoi_dung,
        dia_chi_nguoi_dung,
        trang_thai_nguoi_dung
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

        const [result] = await db.execute(query, [
            UUIDUtil.toBinary(ma_nguoi_dung),
            UUIDUtil.toBinary(ma_vai_tro),
            ten_nguoi_dung,
            ho_nguoi_dung || null,
            ten_dang_nhap_nguoi_dung,
            mat_khau_nguoi_dung,
            email_nguoi_dung || null,
            so_dien_thoai_nguoi_dung || null,
            gioi_tinh_nguoi_dung || null,
            dia_chi_nguoi_dung || null
        ]);

        return ma_nguoi_dung;
    }

    // Tìm người dùng theo username
    static async findByUsername(username) {
        const query = `
      SELECT 
        BIN_TO_UUID(nd.ma_nguoi_dung) as ma_nguoi_dung,
        BIN_TO_UUID(nd.ma_vai_tro) as ma_vai_tro,
        nd.ten_nguoi_dung,
        nd.ho_nguoi_dung,
        nd.ten_dang_nhap_nguoi_dung,
        nd.mat_khau_nguoi_dung,
        nd.email_nguoi_dung,
        nd.so_dien_thoai_nguoi_dung,
        nd.gioi_tinh_nguoi_dung,
        nd.dia_chi_nguoi_dung,
        nd.trang_thai_nguoi_dung,
        nd.ngay_tao_nguoi_dung,
        vt.ten_vai_tro
      FROM bang_nguoi_dung nd
      INNER JOIN bang_vai_tro vt ON nd.ma_vai_tro = vt.ma_vai_tro
      WHERE nd.ten_dang_nhap_nguoi_dung = ?
    `;

        const [rows] = await db.execute(query, [username]);
        return rows[0] || null;
    }

    // Tìm người dùng theo email
    static async findByEmail(email) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_nguoi_dung) as ma_nguoi_dung,
        ten_dang_nhap_nguoi_dung,
        email_nguoi_dung
      FROM bang_nguoi_dung
      WHERE email_nguoi_dung = ?
    `;

        const [rows] = await db.execute(query, [email]);
        return rows[0] || null;
    }

    // Tìm người dùng theo ID
    static async findById(userId) {
        const query = `
      SELECT 
        BIN_TO_UUID(nd.ma_nguoi_dung) as ma_nguoi_dung,
        BIN_TO_UUID(nd.ma_vai_tro) as ma_vai_tro,
        nd.ten_nguoi_dung,
        nd.ho_nguoi_dung,
        nd.ten_dang_nhap_nguoi_dung,
        nd.email_nguoi_dung,
        nd.so_dien_thoai_nguoi_dung,
        nd.gioi_tinh_nguoi_dung,
        nd.dia_chi_nguoi_dung,
        nd.trang_thai_nguoi_dung,
        nd.ngay_tao_nguoi_dung,
        vt.ten_vai_tro
      FROM bang_nguoi_dung nd
      INNER JOIN bang_vai_tro vt ON nd.ma_vai_tro = vt.ma_vai_tro
      WHERE nd.ma_nguoi_dung = ?
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(userId)]);
        return rows[0] || null;
    }

    // Kiểm tra username đã tồn tại
    static async existsByUsername(username) {
        const query = 'SELECT COUNT(*) as count FROM bang_nguoi_dung WHERE ten_dang_nhap_nguoi_dung = ?';
        const [rows] = await db.execute(query, [username]);
        return rows[0].count > 0;
    }

    // Kiểm tra email đã tồn tại
    static async existsByEmail(email) {
        if (!email) return false;
        const query = 'SELECT COUNT(*) as count FROM bang_nguoi_dung WHERE email_nguoi_dung = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0].count > 0;
    }
}

module.exports = UserModel;