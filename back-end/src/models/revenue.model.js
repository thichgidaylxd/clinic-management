const db = require('../config/database');

class RevenueModel {

  static async getRevenueSummary(fromDate, toDate) {
    const sql = `
      SELECT
        SUM(gia_dich_vu_hoa_don) AS serviceRevenue,
        SUM(chi_phi_phat_sinh_hoa_don) AS extraRevenue,
        SUM(tong_thanh_tien_hoa_don) AS totalRevenue
      FROM bang_hoa_don
      WHERE trang_thai_hoa_don = 1
        AND ngay_tra_tien_hoa_don BETWEEN ? AND ?
    `;

    const [[row]] = await db.execute(sql, [fromDate, toDate]);
    return row;
  }

  static async getRevenueByDate(fromDate, toDate) {
    const sql = `
      SELECT
        DATE(ngay_tra_tien_hoa_don) AS ngay,
        SUM(tong_thanh_tien_hoa_don) AS doanh_thu
      FROM bang_hoa_don
      WHERE trang_thai_hoa_don = 1
        AND ngay_tra_tien_hoa_don BETWEEN ? AND ?
      GROUP BY DATE(ngay_tra_tien_hoa_don)
      ORDER BY ngay ASC
    `;

    const [rows] = await db.execute(sql, [fromDate, toDate]);
    return rows;
  }
}

module.exports = RevenueModel;
