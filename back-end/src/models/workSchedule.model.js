const pool = require('../config/database');
const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class WorkScheduleModel {
  // Tạo lịch làm việc
  // ✅ XÓA tất cả references đến ma_chuyen_khoa_lich_lam_viec

  // Trong method create
  static async create(scheduleData) {
    const {
      ma_bac_si_lich_lam_viec,
      ma_phong_kham_lich_lam_viec, // ✅ Có field này
      ngay_lich_lam_viec,
      thoi_gian_bat_dau_lich_lam_viec,
      thoi_gian_ket_thuc_lich_lam_viec,
      trang_thai_lich_lam_viec
    } = scheduleData;

    const ma_lich_lam_viec = UUIDUtil.generate();

    const query = `
        INSERT INTO bang_lich_lam_viec (
            ma_lich_lam_viec,
            ma_bac_si_lich_lam_viec,
            ma_phong_kham_lich_lam_viec,
            ngay_lich_lam_viec,
            thoi_gian_bat_dau_lich_lam_viec,
            thoi_gian_ket_thuc_lich_lam_viec,
            trang_thai_lich_lam_viec
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      UUIDUtil.toBinary(ma_lich_lam_viec),
      UUIDUtil.toBinary(ma_bac_si_lich_lam_viec),
      ma_phong_kham_lich_lam_viec ? UUIDUtil.toBinary(ma_phong_kham_lich_lam_viec) : null, // ✅ Thêm
      ngay_lich_lam_viec,
      thoi_gian_bat_dau_lich_lam_viec,
      thoi_gian_ket_thuc_lich_lam_viec,
      trang_thai_lich_lam_viec !== undefined ? trang_thai_lich_lam_viec : 1
    ]);

    return ma_lich_lam_viec;
  }

  /**
 * Lấy lịch làm việc của bác sĩ theo userId (nguoi_dung)
 */
  static async getByDoctor(doctorId, fromDate, toDate) {
    let sql = `
        SELECT
            BIN_TO_UUID(ls.ma_lich_lam_viec) AS ma_lich_lam_viec,
            ls.ngay_lich_lam_viec,
            ls.thoi_gian_bat_dau_lich_lam_viec,
            ls.thoi_gian_ket_thuc_lich_lam_viec,
            ls.trang_thai_lich_lam_viec,
            pk.ten_phong_kham
        FROM bang_lich_lam_viec ls
        INNER JOIN bang_phong_kham pk 
            ON ls.ma_phong_kham_lich_lam_viec = pk.ma_phong_kham
        WHERE ls.ma_bac_si_lich_lam_viec = UUID_TO_BIN(?)
    `;

    const params = [doctorId];

    if (fromDate) {
      sql += ` AND ls.ngay_lich_lam_viec >= ?`;
      params.push(fromDate);
    }

    if (toDate) {
      sql += ` AND ls.ngay_lich_lam_viec <= ?`;
      params.push(toDate);
    }

    sql += ` ORDER BY ls.ngay_lich_lam_viec, ls.thoi_gian_bat_dau_lich_lam_viec`;

    const [rows] = await pool.execute(sql, params);
    return rows;
  }


  // Trong method findAll - XÓA JOIN với bang_chuyen_khoa
  static async findAll(page = 1, limit = 10, filters = {}) {
    const pageInt = parseInt(page) || 1;
    const limitInt = parseInt(limit) || 10;
    const offset = (pageInt - 1) * limitInt;

    const {
      doctorId,
      // ❌ XÓA: specialtyId,
      roomId,
      fromDate,
      toDate,
      status
    } = filters;

    let query = `
SELECT 
    BIN_TO_UUID(llv.ma_lich_lam_viec) AS ma_lich_lam_viec,
    BIN_TO_UUID(llv.ma_phong_kham_lich_lam_viec) AS ma_phong_kham_lich_lam_viec,
    BIN_TO_UUID(llv.ma_bac_si_lich_lam_viec) AS ma_bac_si_lich_lam_viec,
    llv.ngay_lich_lam_viec,
    llv.thoi_gian_bat_dau_lich_lam_viec,
    llv.thoi_gian_ket_thuc_lich_lam_viec,
    llv.trang_thai_lich_lam_viec,
    llv.ngay_tao_lich_lam_viec,
    llv.ngay_cap_nhat_lich_lam_viec,
    nd.ten_nguoi_dung,
    nd.ho_nguoi_dung,
    ck.ten_chuyen_khoa,
    pk.ten_phong_kham,
    pk.so_phong_kham
FROM bang_lich_lam_viec llv
INNER JOIN bang_bac_si bs 
    ON llv.ma_bac_si_lich_lam_viec = bs.ma_bac_si
INNER JOIN bang_nguoi_dung nd 
    ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
LEFT JOIN bang_bac_si_chuyen_khoa bsck 
    ON bs.ma_bac_si = bsck.ma_bac_si
LEFT JOIN bang_chuyen_khoa ck 
    ON bsck.ma_chuyen_khoa = ck.ma_chuyen_khoa
LEFT JOIN bang_phong_kham pk 
    ON llv.ma_phong_kham_lich_lam_viec = pk.ma_phong_kham

    `;

    const params = [];
    const conditions = [];

    if (doctorId) {
      conditions.push('llv.ma_bac_si_lich_lam_viec = ?');
      params.push(UUIDUtil.toBinary(doctorId));
    }

    // ❌ XÓA specialtyId filter
    // if (specialtyId) {
    //     conditions.push('llv.ma_chuyen_khoa_lich_lam_viec = ?');
    //     params.push(UUIDUtil.toBinary(specialtyId));
    // }

    if (roomId) {
      conditions.push('llv.ma_phong_kham_lich_lam_viec = ?');
      params.push(UUIDUtil.toBinary(roomId));
    }

    if (fromDate) {
      const fromDateStr = fromDate instanceof Date
        ? fromDate.toISOString().split('T')[0]
        : fromDate;
      conditions.push('llv.ngay_lich_lam_viec >= ?');
      params.push(fromDateStr);
    }

    if (toDate) {
      const toDateStr = toDate instanceof Date
        ? toDate.toISOString().split('T')[0]
        : toDate;
      conditions.push('llv.ngay_lich_lam_viec <= ?');
      params.push(toDateStr);
    }

    if (status !== null && status !== undefined) {
      conditions.push('llv.trang_thai_lich_lam_viec = ?');
      params.push(parseInt(status));
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY llv.ngay_lich_lam_viec DESC, llv.thoi_gian_bat_dau_lich_lam_viec ASC LIMIT ${offset}, ${limitInt}`;

    console.log('📋 Query:', query);
    console.log('📋 Params:', params);

    const [rows] = await db.execute(query, params);

    console.log(`✅ Found ${rows.length} schedules`);

    // Count query cũng xóa specialtyId
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM bang_lich_lam_viec llv
    `;

    const countParams = [];
    const countConditions = [];

    if (doctorId) {
      countConditions.push('llv.ma_bac_si_lich_lam_viec = ?');
      countParams.push(UUIDUtil.toBinary(doctorId));
    }

    // ❌ XÓA specialtyId

    if (roomId) {
      countConditions.push('llv.ma_phong_kham_lich_lam_viec = ?');
      countParams.push(UUIDUtil.toBinary(roomId));
    }

    if (fromDate) {
      const fromDateStr = fromDate instanceof Date
        ? fromDate.toISOString().split('T')[0]
        : fromDate;
      countConditions.push('llv.ngay_lich_lam_viec >= ?');
      countParams.push(fromDateStr);
    }

    if (toDate) {
      const toDateStr = toDate instanceof Date
        ? toDate.toISOString().split('T')[0]
        : toDate;
      countConditions.push('llv.ngay_lich_lam_viec <= ?');
      countParams.push(toDateStr);
    }

    if (status !== null && status !== undefined) {
      countConditions.push('llv.trang_thai_lich_lam_viec = ?');
      countParams.push(parseInt(status));
    }

    if (countConditions.length > 0) {
      countQuery += ' WHERE ' + countConditions.join(' AND ');
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

  // Trong method update - XÓA ma_chuyen_khoa_lich_lam_viec
  static async update(scheduleId, updateData) {
    const {
      ma_phong_kham_lich_lam_viec,
      // ❌ XÓA: ma_chuyen_khoa_lich_lam_viec,
      ngay_lich_lam_viec,
      thoi_gian_bat_dau_lich_lam_viec,
      thoi_gian_ket_thuc_lich_lam_viec,
      trang_thai_lich_lam_viec
    } = updateData;

    const fields = [];
    const values = [];

    if (ma_phong_kham_lich_lam_viec !== undefined) {
      fields.push('ma_phong_kham_lich_lam_viec = ?');
      values.push(ma_phong_kham_lich_lam_viec ? UUIDUtil.toBinary(ma_phong_kham_lich_lam_viec) : null);
    }

    // ❌ XÓA ma_chuyen_khoa_lich_lam_viec

    if (ngay_lich_lam_viec !== undefined) {
      fields.push('ngay_lich_lam_viec = ?');
      values.push(ngay_lich_lam_viec);
    }

    if (thoi_gian_bat_dau_lich_lam_viec !== undefined) {
      fields.push('thoi_gian_bat_dau_lich_lam_viec = ?');
      values.push(thoi_gian_bat_dau_lich_lam_viec);
    }

    if (thoi_gian_ket_thuc_lich_lam_viec !== undefined) {
      fields.push('thoi_gian_ket_thuc_lich_lam_viec = ?');
      values.push(thoi_gian_ket_thuc_lich_lam_viec);
    }

    if (trang_thai_lich_lam_viec !== undefined) {
      fields.push('trang_thai_lich_lam_viec = ?');
      values.push(parseInt(trang_thai_lich_lam_viec));
    }

    if (fields.length === 0) {
      throw new Error('Không có dữ liệu để cập nhật');
    }

    values.push(UUIDUtil.toBinary(scheduleId));

    const query = `
      UPDATE bang_lich_lam_viec 
      SET ${fields.join(', ')}
      WHERE ma_lich_lam_viec = ?
    `;

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
  }

  // Tìm lịch làm việc theo ID
  static async findById(scheduleId) {
    const query = `
      SELECT 
        BIN_TO_UUID(llv.ma_lich_lam_viec) as ma_lich_lam_viec,
        BIN_TO_UUID(llv.ma_phong_kham_lich_lam_viec) as ma_phong_kham_lich_lam_viec,
        BIN_TO_UUID(llv.ma_bac_si_lich_lam_viec) as ma_bac_si_lich_lam_viec,
        -- ❌ XÓA: ma_chuyen_khoa_lich_lam_viec
        llv.ngay_lich_lam_viec,
        llv.thoi_gian_bat_dau_lich_lam_viec,
        llv.thoi_gian_ket_thuc_lich_lam_viec,
        llv.trang_thai_lich_lam_viec,
        llv.ngay_tao_lich_lam_viec,
        llv.ngay_cap_nhat_lich_lam_viec,
        nd.ten_nguoi_dung,
        nd.ho_nguoi_dung,
        nd.email_nguoi_dung,
        -- ✅ Lấy chuyên khoa từ bác sĩ
        GROUP_CONCAT(DISTINCT ck.ten_chuyen_khoa SEPARATOR ', ') as ten_chuyen_khoa,
        pk.ten_phong_kham,
        pk.so_phong_kham
      FROM bang_lich_lam_viec llv
      INNER JOIN bang_bac_si bs ON llv.ma_bac_si_lich_lam_viec = bs.ma_bac_si
      INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
      LEFT JOIN bang_bac_si_chuyen_khoa bsck ON bs.ma_bac_si = bsck.ma_bac_si
      LEFT JOIN bang_chuyen_khoa ck ON bsck.ma_chuyen_khoa = ck.ma_chuyen_khoa
      LEFT JOIN bang_phong_kham pk ON llv.ma_phong_kham_lich_lam_viec = pk.ma_phong_kham
      WHERE llv.ma_lich_lam_viec = ?
      GROUP BY llv.ma_lich_lam_viec
    `;

    const [rows] = await db.execute(query, [UUIDUtil.toBinary(scheduleId)]);
    return rows[0] || null;
  }

  // Xóa lịch làm việc
  static async delete(scheduleId) {
    const query = 'DELETE FROM bang_lich_lam_viec WHERE ma_lich_lam_viec = ?';
    const [result] = await db.execute(query, [UUIDUtil.toBinary(scheduleId)]);
    return result.affectedRows > 0;
  }

  // Kiểm tra trùng lịch (bác sĩ đã có lịch vào thời gian này chưa)
  static async hasConflict(doctorId, date, startTime, endTime, excludeId = null) {
    let query = `
      SELECT COUNT(*) as count 
      FROM bang_lich_lam_viec
      WHERE ma_bac_si_lich_lam_viec = ?
        AND ngay_lich_lam_viec = ?
        AND trang_thai_lich_lam_viec = 1
        AND (
          (thoi_gian_bat_dau_lich_lam_viec < ? AND thoi_gian_ket_thuc_lich_lam_viec > ?)
          OR (thoi_gian_bat_dau_lich_lam_viec < ? AND thoi_gian_ket_thuc_lich_lam_viec > ?)
          OR (thoi_gian_bat_dau_lich_lam_viec >= ? AND thoi_gian_ket_thuc_lich_lam_viec <= ?)
        )
    `;

    const params = [
      UUIDUtil.toBinary(doctorId),
      date,
      endTime, startTime,    // Check if new schedule overlaps existing start
      endTime, startTime,    // Check if new schedule overlaps existing end
      startTime, endTime     // Check if new schedule contains existing schedule
    ];

    if (excludeId) {
      query += ' AND ma_lich_lam_viec != ?';
      params.push(UUIDUtil.toBinary(excludeId));
    }

    const [rows] = await db.execute(query, params);
    return rows[0].count > 0;
  }

  // Kiểm tra phòng có đang được sử dụng không
  static async isRoomOccupied(roomId, date, startTime, endTime, excludeId = null) {
    let query = `
      SELECT COUNT(*) as count 
      FROM bang_lich_lam_viec
      WHERE ma_phong_kham_lich_lam_viec = ?
        AND ngay_lich_lam_viec = ?
        AND trang_thai_lich_lam_viec = 1
        AND (
          (thoi_gian_bat_dau_lich_lam_viec < ? AND thoi_gian_ket_thuc_lich_lam_viec > ?)
          OR (thoi_gian_bat_dau_lich_lam_viec < ? AND thoi_gian_ket_thuc_lich_lam_viec > ?)
          OR (thoi_gian_bat_dau_lich_lam_viec >= ? AND thoi_gian_ket_thuc_lich_lam_viec <= ?)
        )
    `;

    const params = [
      UUIDUtil.toBinary(roomId),
      date,
      endTime, startTime,
      endTime, startTime,
      startTime, endTime
    ];

    if (excludeId) {
      query += ' AND ma_lich_lam_viec != ?';
      params.push(UUIDUtil.toBinary(excludeId));
    }

    const [rows] = await db.execute(query, params);
    return rows[0].count > 0;
  }

  // Lấy lịch làm việc của bác sĩ theo ngày
  static async getDoctorScheduleByDate(doctorId, date) {
    const query = `
      SELECT 
        BIN_TO_UUID(llv.ma_lich_lam_viec) as ma_lich_lam_viec,
        llv.thoi_gian_bat_dau_lich_lam_viec,
        llv.thoi_gian_ket_thuc_lich_lam_viec,
        llv.trang_thai_lich_lam_viec,
        -- ✅ Lấy chuyên khoa từ bác sĩ
        GROUP_CONCAT(DISTINCT ck.ten_chuyen_khoa SEPARATOR ', ') as ten_chuyen_khoa,
        pk.ten_phong_kham,
        pk.so_phong_kham
      FROM bang_lich_lam_viec llv
      INNER JOIN bang_bac_si bs ON llv.ma_bac_si_lich_lam_viec = bs.ma_bac_si
      LEFT JOIN bang_bac_si_chuyen_khoa bsck ON bs.ma_bac_si = bsck.ma_bac_si
      LEFT JOIN bang_chuyen_khoa ck ON bsck.ma_chuyen_khoa = ck.ma_chuyen_khoa
      LEFT JOIN bang_phong_kham pk ON llv.ma_phong_kham_lich_lam_viec = pk.ma_phong_kham
      WHERE llv.ma_bac_si_lich_lam_viec = ?
        AND llv.ngay_lich_lam_viec = ?
      GROUP BY llv.ma_lich_lam_viec
      ORDER BY llv.thoi_gian_bat_dau_lich_lam_viec ASC
    `;

    const [rows] = await db.execute(query, [
      UUIDUtil.toBinary(doctorId),
      date
    ]);
    return rows;
  }

  // Lấy lịch làm việc của bác sĩ trong khoảng thời gian
  static async getDoctorScheduleByRange(doctorId, fromDate, toDate) {
    const query = `
      SELECT 
        BIN_TO_UUID(llv.ma_lich_lam_viec) as ma_lich_lam_viec,
        llv.ngay_lich_lam_viec,
        llv.thoi_gian_bat_dau_lich_lam_viec,
        llv.thoi_gian_ket_thuc_lich_lam_viec,
        llv.trang_thai_lich_lam_viec,
        -- ✅ Lấy chuyên khoa từ bác sĩ
        GROUP_CONCAT(DISTINCT ck.ten_chuyen_khoa SEPARATOR ', ') as ten_chuyen_khoa,
        pk.ten_phong_kham,
        pk.so_phong_kham
      FROM bang_lich_lam_viec llv
      INNER JOIN bang_bac_si bs ON llv.ma_bac_si_lich_lam_viec = bs.ma_bac_si
      LEFT JOIN bang_bac_si_chuyen_khoa bsck ON bs.ma_bac_si = bsck.ma_bac_si
      LEFT JOIN bang_chuyen_khoa ck ON bsck.ma_chuyen_khoa = ck.ma_chuyen_khoa
      LEFT JOIN bang_phong_kham pk ON llv.ma_phong_kham_lich_lam_viec = pk.ma_phong_kham
      WHERE llv.ma_bac_si_lich_lam_viec = ?
        AND llv.ngay_lich_lam_viec BETWEEN ? AND ?
      GROUP BY llv.ma_lich_lam_viec
      ORDER BY llv.ngay_lich_lam_viec ASC, llv.thoi_gian_bat_dau_lich_lam_viec ASC
    `;

    const [rows] = await db.execute(query, [
      UUIDUtil.toBinary(doctorId),
      fromDate,
      toDate
    ]);
    return rows;
  }
  // Thống kê lịch làm việc theo bác sĩ
  static async getStatsByDoctor(fromDate, toDate) {
    const query = `
      SELECT 
        BIN_TO_UUID(bs.ma_bac_si) as ma_bac_si,
        nd.ten_nguoi_dung,
        nd.ho_nguoi_dung,
        COUNT(llv.ma_lich_lam_viec) as tong_ca_lam,
        SUM(CASE WHEN llv.trang_thai_lich_lam_viec = 1 THEN 1 ELSE 0 END) as ca_hoat_dong,
        SUM(CASE WHEN llv.trang_thai_lich_lam_viec = 0 THEN 1 ELSE 0 END) as ca_huy,
        SUM(
          TIME_TO_SEC(TIMEDIFF(
            llv.thoi_gian_ket_thuc_lich_lam_viec,
            llv.thoi_gian_bat_dau_lich_lam_viec
          )) / 3600
        ) as tong_gio_lam
      FROM bang_bac_si bs
      INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
      LEFT JOIN bang_lich_lam_viec llv ON bs.ma_bac_si = llv.ma_bac_si_lich_lam_viec
        AND llv.ngay_lich_lam_viec BETWEEN ? AND ?
      GROUP BY bs.ma_bac_si, nd.ten_nguoi_dung, nd.ho_nguoi_dung
      ORDER BY tong_ca_lam DESC
    `;

    const [rows] = await db.execute(query, [fromDate, toDate]);
    return rows;
  }
}

module.exports = WorkScheduleModel;