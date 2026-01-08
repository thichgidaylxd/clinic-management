/**
 * Entity: HoaDon
 * Table: bang_hoa_don
 */
class HoaDonEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_hoa_don = data.ma_hoa_don ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_chuyen_khoa_hoa_don = data.ma_chuyen_khoa_hoa_don ?? null;

        /** @type {string} VARCHAR(150) */
        this._ten_dich_vu_hoa_don = data.ten_dich_vu_hoa_don ?? null;

        /** @type {number} DECIMAL(15,5) */
        this._gia_dich_vu_hoa_don = data.gia_dich_vu_hoa_don ?? 0.00000;

        /** @type {number} DECIMAL(15,5) */
        this._chi_phi_phat_sinh_hoa_don = data.chi_phi_phat_sinh_hoa_don ?? 0.00000;

        /** @type {Buffer} binary(16) | FK */
        this._ma_benh_nhan_hoa_don = data.ma_benh_nhan_hoa_don ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_nguoi_dung_hoa_don = data.ma_nguoi_dung_hoa_don ?? null;

        /** @type {number} DECIMAL(15,5) */
        this._tong_thanh_tien_hoa_don = data.tong_thanh_tien_hoa_don ?? 0.00000;

        /** @type {number} TINYINT */
        this._trang_thai_hoa_don = data.trang_thai_hoa_don ?? 0;

        /** @type {string} TEXT */
        this._ghi_chu_hoa_don = data.ghi_chu_hoa_don ?? null;

        /** @type {Date} DATETIME */
        this._ngay_tra_tien_hoa_don = data.ngay_tra_tien_hoa_don ?? null;

        /** @type {Date} DATETIME */
        this._ngay_tao_hoa_don = data.ngay_tao_hoa_don ?? null;
    }

    get ma_hoa_don() { return this._ma_hoa_don; }
    set ma_hoa_don(v) { this._ma_hoa_don = v; }

    get ma_chuyen_khoa_hoa_don() { return this._ma_chuyen_khoa_hoa_don; }
    set ma_chuyen_khoa_hoa_don(v) { this._ma_chuyen_khoa_hoa_don = v; }

    get ten_dich_vu_hoa_don() { return this._ten_dich_vu_hoa_don; }
    set ten_dich_vu_hoa_don(v) { this._ten_dich_vu_hoa_don = v; }

    get gia_dich_vu_hoa_don() { return this._gia_dich_vu_hoa_don; }
    set gia_dich_vu_hoa_don(v) { this._gia_dich_vu_hoa_don = v; }

    get chi_phi_phat_sinh_hoa_don() { return this._chi_phi_phat_sinh_hoa_don; }
    set chi_phi_phat_sinh_hoa_don(v) { this._chi_phi_phat_sinh_hoa_don = v; }

    get ma_benh_nhan_hoa_don() { return this._ma_benh_nhan_hoa_don; }
    set ma_benh_nhan_hoa_don(v) { this._ma_benh_nhan_hoa_don = v; }

    get ma_nguoi_dung_hoa_don() { return this._ma_nguoi_dung_hoa_don; }
    set ma_nguoi_dung_hoa_don(v) { this._ma_nguoi_dung_hoa_don = v; }

    get tong_thanh_tien_hoa_don() { return this._tong_thanh_tien_hoa_don; }
    set tong_thanh_tien_hoa_don(v) { this._tong_thanh_tien_hoa_don = v; }

    get trang_thai_hoa_don() { return this._trang_thai_hoa_don; }
    set trang_thai_hoa_don(v) { this._trang_thai_hoa_don = v; }

    get ghi_chu_hoa_don() { return this._ghi_chu_hoa_don; }
    set ghi_chu_hoa_don(v) { this._ghi_chu_hoa_don = v; }

    get ngay_tra_tien_hoa_don() { return this._ngay_tra_tien_hoa_don; }
    set ngay_tra_tien_hoa_don(v) { this._ngay_tra_tien_hoa_don = v; }

    get ngay_tao_hoa_don() { return this._ngay_tao_hoa_don; }
    set ngay_tao_hoa_don(v) { this._ngay_tao_hoa_don = v; }
}

module.exports = HoaDonEntity;
