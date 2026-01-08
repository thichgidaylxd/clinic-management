/**
 * Entity: Thuoc
 * Table: bang_thuoc
 */
class ThuocEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_thuoc = data.ma_thuoc ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_nguoi_tao_thuoc = data.ma_nguoi_tao_thuoc ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_nguoi_cap_nhat_thuoc = data.ma_nguoi_cap_nhat_thuoc ?? null;

        /** @type {string} VARCHAR(100) */
        this._ten_thuoc = data.ten_thuoc ?? null;

        /** @type {string} VARCHAR(255) */
        this._thanh_phan_thuoc = data.thanh_phan_thuoc ?? null;

        /** @type {number} DECIMAL(15,5) */
        this._don_gia_thuoc = data.don_gia_thuoc ?? null;

        /** @type {string} TEXT */
        this._huong_dan_su_dung_thuoc = data.huong_dan_su_dung_thuoc ?? null;

        /** @type {string} VARCHAR(50) */
        this._don_vi_tinh = data.don_vi_tinh ?? null;

        /** @type {number} INT */
        this._so_luong_thuoc_ton_thuoc = data.so_luong_thuoc_ton_thuoc ?? 0;

        /** @type {Date} DATE */
        this._han_su_dung_thuoc = data.han_su_dung_thuoc ?? null;

        /** @type {Buffer} MEDIUMBLOB */
        this._giay_to_kiem_dinh_thuoc = data.giay_to_kiem_dinh_thuoc ?? null;

        /** @type {number} TINYINT */
        this._trang_thai_thuoc = data.trang_thai_thuoc ?? 1;

        /** @type {Date} DATETIME */
        this._ngay_tao_thuoc = data.ngay_tao_thuoc ?? null;

        /** @type {Date} DATETIME */
        this._ngay_cap_nhat_thuoc = data.ngay_cap_nhat_thuoc ?? null;
    }

    /** @returns {Buffer} */
    get ma_thuoc() {
        return this._ma_thuoc;
    }
    set ma_thuoc(value) {
        this._ma_thuoc = value;
    }

    /** @returns {Buffer} */
    get ma_nguoi_tao_thuoc() {
        return this._ma_nguoi_tao_thuoc;
    }
    set ma_nguoi_tao_thuoc(value) {
        this._ma_nguoi_tao_thuoc = value;
    }

    /** @returns {Buffer} */
    get ma_nguoi_cap_nhat_thuoc() {
        return this._ma_nguoi_cap_nhat_thuoc;
    }
    set ma_nguoi_cap_nhat_thuoc(value) {
        this._ma_nguoi_cap_nhat_thuoc = value;
    }

    /** @returns {string} */
    get ten_thuoc() {
        return this._ten_thuoc;
    }
    set ten_thuoc(value) {
        this._ten_thuoc = value;
    }

    /** @returns {string} */
    get thanh_phan_thuoc() {
        return this._thanh_phan_thuoc;
    }
    set thanh_phan_thuoc(value) {
        this._thanh_phan_thuoc = value;
    }

    /** @returns {number} */
    get don_gia_thuoc() {
        return this._don_gia_thuoc;
    }
    set don_gia_thuoc(value) {
        this._don_gia_thuoc = value;
    }

    /** @returns {string} */
    get huong_dan_su_dung_thuoc() {
        return this._huong_dan_su_dung_thuoc;
    }
    set huong_dan_su_dung_thuoc(value) {
        this._huong_dan_su_dung_thuoc = value;
    }

    /** @returns {string} */
    get don_vi_tinh() {
        return this._don_vi_tinh;
    }
    set don_vi_tinh(value) {
        this._don_vi_tinh = value;
    }

    /** @returns {number} */
    get so_luong_thuoc_ton_thuoc() {
        return this._so_luong_thuoc_ton_thuoc;
    }
    set so_luong_thuoc_ton_thuoc(value) {
        this._so_luong_thuoc_ton_thuoc = value;
    }

    /** @returns {Date} */
    get han_su_dung_thuoc() {
        return this._han_su_dung_thuoc;
    }
    set han_su_dung_thuoc(value) {
        this._han_su_dung_thuoc = value;
    }

    /** @returns {Buffer} */
    get giay_to_kiem_dinh_thuoc() {
        return this._giay_to_kiem_dinh_thuoc;
    }
    set giay_to_kiem_dinh_thuoc(value) {
        this._giay_to_kiem_dinh_thuoc = value;
    }

    /** @returns {number} */
    get trang_thai_thuoc() {
        return this._trang_thai_thuoc;
    }
    set trang_thai_thuoc(value) {
        this._trang_thai_thuoc = value;
    }

    /** @returns {Date} */
    get ngay_tao_thuoc() {
        return this._ngay_tao_thuoc;
    }
    set ngay_tao_thuoc(value) {
        this._ngay_tao_thuoc = value;
    }

    /** @returns {Date} */
    get ngay_cap_nhat_thuoc() {
        return this._ngay_cap_nhat_thuoc;
    }
    set ngay_cap_nhat_thuoc(value) {
        this._ngay_cap_nhat_thuoc = value;
    }
}

module.exports = ThuocEntity;