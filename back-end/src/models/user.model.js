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
        trang_thai_nguoi_dung
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

    await db.execute(query, [
      UUIDUtil.toBinary(ma_nguoi_dung),
      UUIDUtil.toBinary(ma_vai_tro),
      ten_nguoi_dung,
      ho_nguoi_dung || null,
      ten_dang_nhap_nguoi_dung,
      mat_khau_nguoi_dung,
      email_nguoi_dung || null,
      so_dien_thoai_nguoi_dung || null,
      gioi_tinh_nguoi_dung || null
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

  //  Tìm người dùng theo số điện thoại
  static async findByPhone(phone) {
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
        nd.trang_thai_nguoi_dung,
        nd.ngay_tao_nguoi_dung,
        vt.ten_vai_tro
      FROM bang_nguoi_dung nd
      INNER JOIN bang_vai_tro vt ON nd.ma_vai_tro = vt.ma_vai_tro
      WHERE nd.so_dien_thoai_nguoi_dung = ?
    `;

    const [rows] = await db.execute(query, [phone]);
    return rows[0] || null;
  }

  static async findByIdWithPassword(userId) {
    const query = `
    SELECT 
      BIN_TO_UUID(nd.ma_nguoi_dung) as ma_nguoi_dung,
      nd.mat_khau_nguoi_dung
    FROM bang_nguoi_dung nd
    WHERE nd.ma_nguoi_dung = ?
  `;

    const [rows] = await db.execute(query, [UUIDUtil.toBinary(userId)]);
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

  //  Kiểm tra số điện thoại đã tồn tại
  static async existsByPhone(phone) {
    if (!phone) return false;
    const query = 'SELECT COUNT(*) as count FROM bang_nguoi_dung WHERE so_dien_thoai_nguoi_dung = ?';
    const [rows] = await db.execute(query, [phone]);
    return rows[0].count > 0;
  }




  //  CẬP NHẬT người dùng
  static async update(userId, updateData) {
    const {
      ten_nguoi_dung,
      ho_nguoi_dung,
      email_nguoi_dung,
      so_dien_thoai_nguoi_dung,
      gioi_tinh_nguoi_dung,
      mat_khau_nguoi_dung, //  THÊM: Để đổi password
      ma_vai_tro,          //  THÊM: Để đổi vai trò
      trang_thai_nguoi_dung
    } = updateData;

    const fields = [];
    const values = [];

    if (ten_nguoi_dung !== undefined) {
      fields.push('ten_nguoi_dung = ?');
      values.push(ten_nguoi_dung);
    }

    if (ho_nguoi_dung !== undefined) {
      fields.push('ho_nguoi_dung = ?');
      values.push(ho_nguoi_dung);
    }

    if (email_nguoi_dung !== undefined) {
      fields.push('email_nguoi_dung = ?');
      values.push(email_nguoi_dung);
    }

    if (so_dien_thoai_nguoi_dung !== undefined) {
      fields.push('so_dien_thoai_nguoi_dung = ?');
      values.push(so_dien_thoai_nguoi_dung);
    }

    if (gioi_tinh_nguoi_dung !== undefined) {
      fields.push('gioi_tinh_nguoi_dung = ?');
      values.push(gioi_tinh_nguoi_dung);
    }


    //  THÊM: Password update
    if (mat_khau_nguoi_dung !== undefined) {
      fields.push('mat_khau_nguoi_dung = ?');
      values.push(mat_khau_nguoi_dung);
    }

    //  THÊM: Role update
    if (ma_vai_tro !== undefined) {
      fields.push('ma_vai_tro = ?');
      values.push(UUIDUtil.toBinary(ma_vai_tro));
    }

    if (trang_thai_nguoi_dung !== undefined) {
      fields.push('trang_thai_nguoi_dung = ?');
      values.push(trang_thai_nguoi_dung);
    }

    if (fields.length === 0) {
      throw new Error('Không có dữ liệu để cập nhật');
    }

    values.push(UUIDUtil.toBinary(userId));

    const query = `
        UPDATE bang_nguoi_dung 
        SET ${fields.join(', ')}
        WHERE ma_nguoi_dung = ?
    `;

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
  }
  //  Xóa người dùng
  static async delete(userId) {
    const query = 'DELETE FROM bang_nguoi_dung WHERE ma_nguoi_dung = ?';
    const [result] = await db.execute(query, [UUIDUtil.toBinary(userId)]);
    return result.affectedRows > 0;
  }

  //  Lấy tất cả người dùng (với phân trang)
  static async findAll(page = 1, limit = 10, roleId = null) {
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        BIN_TO_UUID(nd.ma_nguoi_dung) as ma_nguoi_dung,
        BIN_TO_UUID(nd.ma_vai_tro) as ma_vai_tro,
        nd.ten_nguoi_dung,
        nd.ho_nguoi_dung,
        nd.ten_dang_nhap_nguoi_dung,
        nd.email_nguoi_dung,
        nd.so_dien_thoai_nguoi_dung,
        nd.gioi_tinh_nguoi_dung,
        nd.trang_thai_nguoi_dung,
        nd.ngay_tao_nguoi_dung,
        vt.ten_vai_tro
      FROM bang_nguoi_dung nd
      INNER JOIN bang_vai_tro vt ON nd.ma_vai_tro = vt.ma_vai_tro
    `;

    const params = [];

    if (roleId) {
      query += ' WHERE nd.ma_vai_tro = ?';
      params.push(UUIDUtil.toBinary(roleId));
    }

    query += ' ORDER BY nd.ngay_tao_nguoi_dung DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(query, params);

    // Count total
    let countQuery = 'SELECT COUNT(*) as total FROM bang_nguoi_dung';
    const countParams = [];

    if (roleId) {
      countQuery += ' WHERE ma_vai_tro = ?';
      countParams.push(UUIDUtil.toBinary(roleId));
    }

    const [countRows] = await db.execute(countQuery, countParams);
    const total = countRows[0].total;

    return {
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = UserModel;