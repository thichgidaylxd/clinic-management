const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class InvoiceModel {

    // ==============================
    // LẤY DANH SÁCH HÓA ĐƠN
    // ==============================
    static async findAll({ page = 1, limit = 100, status }) {
        const offset = (page - 1) * limit;
        let where = '';
        const params = [];

        if (status !== undefined) {
            where = 'WHERE hd.trang_thai_hoa_don = ?';
            params.push(status);
        }

        const [rows] = await db.execute(
            `
            SELECT 
                BIN_TO_UUID(hd.ma_hoa_don) as ma_hoa_don,
                BIN_TO_UUID(hd.ma_benh_nhan_hoa_don) as ma_benh_nhan,
                bn.ten_benh_nhan,
                bn.ho_benh_nhan,
                hd.tong_thanh_tien_hoa_don,
                hd.trang_thai_hoa_don,
                hd.ngay_tao_hoa_don
            FROM bang_hoa_don hd
            INNER JOIN bang_benh_nhan bn 
                ON hd.ma_benh_nhan_hoa_don = bn.ma_benh_nhan
            ${where}
            ORDER BY hd.ngay_tao_hoa_don DESC
            LIMIT ${offset}, ${limit}
            `,
            params
        );

        return rows;
    }

    // ==============================
    // CHI TIẾT HÓA ĐƠN
    // ==============================

    static async findById(invoiceId) {
        const [invoice] = await db.execute(
            `
            SELECT 
            BIN_TO_UUID(hd.ma_hoa_don) as ma_hoa_don,
            BIN_TO_UUID(hd.ma_benh_nhan_hoa_don) as ma_benh_nhan,
            BIN_TO_UUID(hd.ma_nguoi_dung_hoa_don) as ma_nguoi_dung,

            -- bệnh nhân
            bn.ho_benh_nhan,
            bn.ten_benh_nhan,
            bn.so_dien_thoai_benh_nhan,

            -- dịch vụ
            hd.ten_dich_vu_hoa_don,
            hd.gia_dich_vu_hoa_don,
            hd.chi_phi_phat_sinh_hoa_don,

            hd.tong_thanh_tien_hoa_don,
            hd.trang_thai_hoa_don,
            hd.ghi_chu_hoa_don,
            hd.ngay_tao_hoa_don
        FROM bang_hoa_don hd
        INNER JOIN bang_benh_nhan bn
            ON hd.ma_benh_nhan_hoa_don = bn.ma_benh_nhan
        WHERE hd.ma_hoa_don = UUID_TO_BIN(?)

        `,
            [invoiceId]
        );

        if (!invoice.length) return null;

        const [medicines] = await db.execute(
            `
        SELECT 
            BIN_TO_UUID(thd.ma_thuoc) as ma_thuoc,
            t.ten_thuoc,
            thd.so_luong_thuoc_hoa_don,
            t.don_gia_thuoc,
            (t.don_gia_thuoc * thd.so_luong_thuoc_hoa_don) as thanh_tien,
            thd.ghi_chu_thuoc
        FROM bang_thuoc_hoa_don thd
        INNER JOIN bang_thuoc t 
            ON thd.ma_thuoc = t.ma_thuoc
        WHERE thd.ma_hoa_don = UUID_TO_BIN(?)
        `,
            [invoiceId]
        );

        return {
            ...invoice[0],
            medicines
        };
    }

    // ==============================
    // THANH TOÁN
    // ==============================
    static async pay(invoiceId) {
        const [result] = await db.execute(
            `
            UPDATE bang_hoa_don
            SET trang_thai_hoa_don = 1
            WHERE ma_hoa_don = UUID_TO_BIN(?)
              AND trang_thai_hoa_don = 0
            `,
            [invoiceId]
        );

        return result.affectedRows > 0;
    }

    // ==============================
    // HÓA ĐƠN CỦA BỆNH NHÂN (MY INVOICES)
    // ==============================
    static async findByPatientId(patientId) {
        const [rows] = await db.execute(
            `
        SELECT
            BIN_TO_UUID(hd.ma_hoa_don) AS ma_hoa_don,
            hd.tong_thanh_tien_hoa_don,
            hd.trang_thai_hoa_don,
            hd.ngay_tao_hoa_don
        FROM bang_hoa_don hd
        WHERE hd.ma_benh_nhan_hoa_don = UUID_TO_BIN(?)
        ORDER BY hd.ngay_tao_hoa_don DESC
        `,
            [patientId]
        );

        return rows;
    }

    // models/patient.model.js
    static async findByUserId(userId) {
        const [rows] = await db.execute(
            `
        SELECT BIN_TO_UUID(ma_benh_nhan) AS ma_benh_nhan
        FROM bang_benh_nhan
        WHERE ma_nguoi_dung_benh_nhan = UUID_TO_BIN(?)
        `,
            [userId]
        );

        return rows[0] || null;
    }



}

module.exports = InvoiceModel;
