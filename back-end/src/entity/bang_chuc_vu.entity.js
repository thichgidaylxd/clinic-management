/**
 * Entity: NguoiDung
 * Table: bang_nguoi_dung
 */
class NguoiDungEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_nguoi_dung = data.ma_nguoi_dung ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_vai_tro = data.ma_vai_tro ?? null;

        /** @type {string} VARCHAR(100) */
        this._ten_nguoi_dung = data.ten_nguoi_dung ?? null;

        /** @type {string} VARCHAR(50) */
        this._ho_nguoi_dung = data.ho_nguoi_dung ?? null;

        /** @type {string} VARCHAR(20) */
        this._ten_dang_nhap_nguoi_dung = data.ten_dang_nhap_nguoi_dung ?? null;

        /** @type {string} VARCHAR(255) */
        this._mat_khau_nguoi_dung = data.mat_khau_nguoi_dung ?? null;

        /** @type {string} VARCHAR(10) */
        this._so_dien_thoai_nguoi_dung = data.so_dien_thoai_nguoi_dung ?? null;

        /** @type {string} VARCHAR(50) */
        this._email_nguoi_dung = data.email_nguoi_dung ?? null;

        /** @type {number} TINYINT */
        this._gioi_tinh_nguoi_dung = data.gioi_tinh_nguoi_dung ?? null;

        /** @type {number} TINYINT */
        this._trang_thai_nguoi_dung = data.trang_thai_nguoi_dung ?? 1;

        /** @type {Date} DATETIME */
        this._ngay_tao_nguoi_dung = data.ngay_tao_nguoi_dung ?? null;

        /** @type {Date} DATETIME */
        this._ngay_cap_nhat_nguoi_dung = data.ngay_cap_nhat_nguoi_dung ?? null;
    }

    /** @returns {Buffer} */
    get ma_nguoi_dung() {
        return this._ma_nguoi_dung;
    }
    set ma_nguoi_dung(value) {
        this._ma_nguoi_dung = value;
    }

    /** @returns {Buffer} */
    get ma_vai_tro() {
        return this._ma_vai_tro;
    }
    set ma_vai_tro(value) {
        this._ma_vai_tro = value;
    }

    /** @returns {string} */
    get ten_nguoi_dung() {
        return this._ten_nguoi_dung;
    }
    set ten_nguoi_dung(value) {
        this._ten_nguoi_dung = value;
    }

    /** @returns {string} */
    get ho_nguoi_dung() {
        return this._ho_nguoi_dung;
    }
    set ho_nguoi_dung(value) {
        this._ho_nguoi_dung = value;
    }

    /** @returns {string} */
    get ten_dang_nhap_nguoi_dung() {
        return this._ten_dang_nhap_nguoi_dung;
    }
    set ten_dang_nhap_nguoi_dung(value) {
        this._ten_dang_nhap_nguoi_dung = value;
    }

    /** @returns {string} */
    get mat_khau_nguoi_dung() {
        return this._mat_khau_nguoi_dung;
    }
    set mat_khau_nguoi_dung(value) {
        this._mat_khau_nguoi_dung = value;
    }

    /** @returns {string} */
    get so_dien_thoai_nguoi_dung() {
        return this._so_dien_thoai_nguoi_dung;
    }
    set so_dien_thoai_nguoi_dung(value) {
        this._so_dien_thoai_nguoi_dung = value;
    }

    /** @returns {string} */
    get email_nguoi_dung() {
        return this._email_nguoi_dung;
    }
    set email_nguoi_dung(value) {
        this._email_nguoi_dung = value;
    }

    /** @returns {number} */
    get gioi_tinh_nguoi_dung() {
        return this._gioi_tinh_nguoi_dung;
    }
    set gioi_tinh_nguoi_dung(value) {
        this._gioi_tinh_nguoi_dung = value;
    }

    /** @returns {number} */
    get trang_thai_nguoi_dung() {
        return this._trang_thai_nguoi_dung;
    }
    set trang_thai_nguoi_dung(value) {
        this._trang_thai_nguoi_dung = value;
    }

    /** @returns {Date} */
    get ngay_tao_nguoi_dung() {
        return this._ngay_tao_nguoi_dung;
    }
    set ngay_tao_nguoi_dung(value) {
        this._ngay_tao_nguoi_dung = value;
    }

    /** @returns {Date} */
    get ngay_cap_nhat_nguoi_dung() {
        return this._ngay_cap_nhat_nguoi_dung;
    }
    set ngay_cap_nhat_nguoi_dung(value) {
        this._ngay_cap_nhat_nguoi_dung = value;
    }
}

module.exports = NguoiDungEntity;
