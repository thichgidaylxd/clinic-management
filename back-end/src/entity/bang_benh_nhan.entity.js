/**
 * Entity: BenhNhan
 * Table: bang_benh_nhan
 */
class BenhNhanEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_benh_nhan = data.ma_benh_nhan ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_nguoi_dung_benh_nhan = data.ma_nguoi_dung_benh_nhan ?? null;

        /** @type {string} VARCHAR(100) */
        this._ten_benh_nhan = data.ten_benh_nhan ?? null;

        /** @type {string} VARCHAR(50) */
        this._ho_benh_nhan = data.ho_benh_nhan ?? null;

        /** @type {number} TINYINT */
        this._gioi_tinh_benh_nhan = data.gioi_tinh_benh_nhan ?? null;

        /** @type {string} VARCHAR(10) */
        this._so_dien_thoai_benh_nhan = data.so_dien_thoai_benh_nhan ?? null;

        /** @type {string} VARCHAR(50) */
        this._email_benh_nhan = data.email_benh_nhan ?? null;

        /** @type {Date} DATE */
        this._ngay_sinh_benh_nhan = data.ngay_sinh_benh_nhan ?? null;

        /** @type {string} TEXT */
        this._dia_chi_benh_nhan = data.dia_chi_benh_nhan ?? null;
    }

    /** @returns {Buffer} */
    get ma_benh_nhan() {
        return this._ma_benh_nhan;
    }
    set ma_benh_nhan(value) {
        this._ma_benh_nhan = value;
    }

    /** @returns {Buffer} */
    get ma_nguoi_dung_benh_nhan() {
        return this._ma_nguoi_dung_benh_nhan;
    }
    set ma_nguoi_dung_benh_nhan(value) {
        this._ma_nguoi_dung_benh_nhan = value;
    }

    /** @returns {string} */
    get ten_benh_nhan() {
        return this._ten_benh_nhan;
    }
    set ten_benh_nhan(value) {
        this._ten_benh_nhan = value;
    }

    /** @returns {string} */
    get ho_benh_nhan() {
        return this._ho_benh_nhan;
    }
    set ho_benh_nhan(value) {
        this._ho_benh_nhan = value;
    }

    /** @returns {number} */
    get gioi_tinh_benh_nhan() {
        return this._gioi_tinh_benh_nhan;
    }
    set gioi_tinh_benh_nhan(value) {
        this._gioi_tinh_benh_nhan = value;
    }

    /** @returns {string} */
    get so_dien_thoai_benh_nhan() {
        return this._so_dien_thoai_benh_nhan;
    }
    set so_dien_thoai_benh_nhan(value) {
        this._so_dien_thoai_benh_nhan = value;
    }

    /** @returns {string} */
    get email_benh_nhan() {
        return this._email_benh_nhan;
    }
    set email_benh_nhan(value) {
        this._email_benh_nhan = value;
    }

    /** @returns {Date} */
    get ngay_sinh_benh_nhan() {
        return this._ngay_sinh_benh_nhan;
    }
    set ngay_sinh_benh_nhan(value) {
        this._ngay_sinh_benh_nhan = value;
    }

    /** @returns {string} */
    get dia_chi_benh_nhan() {
        return this._dia_chi_benh_nhan;
    }
    set dia_chi_benh_nhan(value) {
        this._dia_chi_benh_nhan = value;
    }
}

module.exports = BenhNhanEntity;