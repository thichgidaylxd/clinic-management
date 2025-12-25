const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class WorkScheduleModel {

  // ===============================
  // CREATE
  // ===============================
  static async create(data) {
    const {
      ma_bac_si_lich_lam_viec,
      ngay_lich_lam_viec,
      thoi_gian_bat_dau_lich_lam_viec,
      thoi_gian_ket_thuc_lich_lam_viec,
      trang_thai_lich_lam_viec = 1
    } = data;

    const ma_lich_lam_viec = UUIDUtil.generate();

    const sql = `
      INSERT INTO bang_lich_lam_viec (
        ma_lich_lam_viec,
        ma_bac_si_lich_lam_viec,
        ngay_lich_lam_viec,
        thoi_gian_bat_dau_lich_lam_viec,
        thoi_gian_ket_thuc_lich_lam_viec,
        trang_thai_lich_lam_viec
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.execute(sql, [
      UUIDUtil.toBinary(ma_lich_lam_viec),
      UUIDUtil.toBinary(ma_bac_si_lich_lam_viec),
      ngay_lich_lam_viec,
      thoi_gian_bat_dau_lich_lam_viec,
      thoi_gian_ket_thuc_lich_lam_viec,
      trang_thai_lich_lam_viec
    ]);

    return ma_lich_lam_viec;
  }

  // ===============================
  // FIND ALL (ADMIN)
  // ===============================
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    let sql = `
      SELECT
        BIN_TO_UUID(llv.ma_lich_lam_viec) AS ma_lich_lam_viec,
        BIN_TO_UUID(llv.ma_bac_si_lich_lam_viec) AS ma_bac_si_lich_lam_viec,
        llv.ngay_lich_lam_viec,
        llv.thoi_gian_bat_dau_lich_lam_viec,
        llv.thoi_gian_ket_thuc_lich_lam_viec,
        llv.trang_thai_lich_lam_viec,
        llv.ngay_tao_lich_lam_viec,
        llv.ngay_cap_nhat_lich_lam_viec,
        nd.ho_nguoi_dung,
        nd.ten_nguoi_dung,
        GROUP_CONCAT(DISTINCT ck.ten_chuyen_khoa SEPARATOR ', ') AS ten_chuyen_khoa
      FROM bang_lich_lam_viec llv
      INNER JOIN bang_bac_si bs 
        ON llv.ma_bac_si_lich_lam_viec = bs.ma_bac_si
      INNER JOIN bang_nguoi_dung nd 
        ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
      LEFT JOIN bang_bac_si_chuyen_khoa bsck 
        ON bs.ma_bac_si = bsck.ma_bac_si
      LEFT JOIN bang_chuyen_khoa ck 
        ON bsck.ma_chuyen_khoa = ck.ma_chuyen_khoa
    `;

    if (filters.doctorId) {
      conditions.push('llv.ma_bac_si_lich_lam_viec = ?');
      params.push(UUIDUtil.toBinary(filters.doctorId));
    }

    if (filters.fromDate) {
      const fromDateOnly = new Date(filters.fromDate).toISOString().split("T")[0];
      conditions.push("DATE(llv.ngay_lich_lam_viec) >= ?");
      params.push(fromDateOnly);
    }

    if (filters.toDate) {
      const toDateOnly = new Date(filters.toDate).toISOString().split("T")[0];
      conditions.push("DATE(llv.ngay_lich_lam_viec) <= ?");
      params.push(toDateOnly);
    }


    if (filters.status !== undefined && filters.status !== null) {
      conditions.push('llv.trang_thai_lich_lam_viec = ?');
      params.push(Number(filters.status));
    }

    if (conditions.length) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += `
      GROUP BY llv.ma_lich_lam_viec
      ORDER BY llv.ngay_lich_lam_viec DESC, llv.thoi_gian_bat_dau_lich_lam_viec ASC
      LIMIT ${offset}, ${limit}
    `;

    const [rows] = await db.execute(sql, params);

    // COUNT
    let countSql = `SELECT COUNT(*) AS total FROM bang_lich_lam_viec llv`;
    if (conditions.length) {
      countSql += ' WHERE ' + conditions.join(' AND ');
    }

    const [count] = await db.execute(countSql, params);

    return {
      data: rows,
      pagination: {
        total: count[0].total,
        page,
        limit,
        totalPages: Math.ceil(count[0].total / limit)
      }
    };
  }

  // ===============================
  // FIND BY ID
  // ===============================
  static async findById(scheduleId) {
    const sql = `
      SELECT
        BIN_TO_UUID(llv.ma_lich_lam_viec) AS ma_lich_lam_viec,
        BIN_TO_UUID(llv.ma_bac_si_lich_lam_viec) AS ma_bac_si_lich_lam_viec,
        llv.ngay_lich_lam_viec,
        llv.thoi_gian_bat_dau_lich_lam_viec,
        llv.thoi_gian_ket_thuc_lich_lam_viec,
        llv.trang_thai_lich_lam_viec,
        nd.ho_nguoi_dung,
        nd.ten_nguoi_dung,
        nd.email_nguoi_dung,
        GROUP_CONCAT(DISTINCT ck.ten_chuyen_khoa SEPARATOR ', ') AS ten_chuyen_khoa
      FROM bang_lich_lam_viec llv
      INNER JOIN bang_bac_si bs ON llv.ma_bac_si_lich_lam_viec = bs.ma_bac_si
      INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
      LEFT JOIN bang_bac_si_chuyen_khoa bsck ON bs.ma_bac_si = bsck.ma_bac_si
      LEFT JOIN bang_chuyen_khoa ck ON bsck.ma_chuyen_khoa = ck.ma_chuyen_khoa
      WHERE llv.ma_lich_lam_viec = ?
      GROUP BY llv.ma_lich_lam_viec
    `;

    const [rows] = await db.execute(sql, [UUIDUtil.toBinary(scheduleId)]);
    return rows[0] || null;
  }

  // ===============================
  // UPDATE
  // ===============================
  static async update(scheduleId, data) {
    const fields = [];
    const values = [];

    for (const key of [
      'ngay_lich_lam_viec',
      'thoi_gian_bat_dau_lich_lam_viec',
      'thoi_gian_ket_thuc_lich_lam_viec',
      'trang_thai_lich_lam_viec'
    ]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (!fields.length) throw new Error('Không có dữ liệu cập nhật');

    values.push(UUIDUtil.toBinary(scheduleId));

    const sql = `
      UPDATE bang_lich_lam_viec
      SET ${fields.join(', ')}
      WHERE ma_lich_lam_viec = ?
    `;

    const [result] = await db.execute(sql, values);
    return result.affectedRows > 0;
  }

  // ===============================
  // DELETE
  // ===============================
  static async delete(scheduleId) {
    const [result] = await db.execute(
      'DELETE FROM bang_lich_lam_viec WHERE ma_lich_lam_viec = ?',
      [UUIDUtil.toBinary(scheduleId)]
    );
    return result.affectedRows > 0;
  }

  // ===============================
  // CHECK CONFLICT
  // ===============================
  static async hasConflict(doctorId, date, start, end, excludeId = null) {
    let sql = `
      SELECT COUNT(*) AS count
      FROM bang_lich_lam_viec
      WHERE ma_bac_si_lich_lam_viec = ?
        AND ngay_lich_lam_viec = ?
        AND trang_thai_lich_lam_viec = 1
        AND (
          (thoi_gian_bat_dau_lich_lam_viec < ? AND thoi_gian_ket_thuc_lich_lam_viec > ?)
          OR (thoi_gian_bat_dau_lich_lam_viec >= ? AND thoi_gian_ket_thuc_lich_lam_viec <= ?)
        )
    `;

    const params = [
      UUIDUtil.toBinary(doctorId),
      date,
      end, start,
      start, end
    ];

    if (excludeId) {
      sql += ' AND ma_lich_lam_viec != ?';
      params.push(UUIDUtil.toBinary(excludeId));
    }

    const [rows] = await db.execute(sql, params);
    return rows[0].count > 0;
  }
  // ===============================
  // GET BY DOCTOR (MY SCHEDULE)
  // ===============================
  static async getByDoctor(doctorId, fromDate = null, toDate = null) {
    const conditions = [];
    const params = [];

    let sql = `
    SELECT
      BIN_TO_UUID(llv.ma_lich_lam_viec) AS ma_lich_lam_viec,
      llv.ngay_lich_lam_viec,
      llv.thoi_gian_bat_dau_lich_lam_viec,
      llv.thoi_gian_ket_thuc_lich_lam_viec,
      llv.trang_thai_lich_lam_viec
    FROM bang_lich_lam_viec llv
    WHERE llv.ma_bac_si_lich_lam_viec = ?
  `;

    params.push(UUIDUtil.toBinary(doctorId));

    if (fromDate) {
      conditions.push('llv.ngay_lich_lam_viec >= ?');
      params.push(fromDate);
    }

    if (toDate) {
      conditions.push('llv.ngay_lich_lam_viec <= ?');
      params.push(toDate);
    }

    if (conditions.length) {
      sql += ' AND ' + conditions.join(' AND ');
    }

    sql += `
    ORDER BY llv.ngay_lich_lam_viec ASC,
             llv.thoi_gian_bat_dau_lich_lam_viec ASC
  `;

    const [rows] = await db.execute(sql, params);
    return rows;
  }

}

module.exports = WorkScheduleModel;
