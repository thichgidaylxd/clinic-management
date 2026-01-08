/**
 * Entity: PhongKham
 * Table: bang_phong_kham
 */
class PhongKhamEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_phong_kham = data.ma_phong_kham ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_chuyen_khoa_phong_kham = data.ma_chuyen_khoa_phong_kham ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_loai_phong_kham = data.ma_loai_phong_kham ?? null;

        /** @type {number} INT */
        this._so_phong_kham = data.so_phong_kham ?? null;

        /** @type {string} VARCHAR(100) */
        this._ten_phong_kham = data.ten_phong_kham ?? null;

        /** @type {number} TINYINT */
        this._trang_thai_phong_kham = data.trang_thai_phong_kham ?? 1;

        /** @type {Date} DATETIME */
        this._ngay_tao_phong_kham = data.ngay_tao_phong_kham ?? null;

        /** @type {Date} DATETIME */
        this._ngay_cap_nhat_phong_kham = data.ngay_cap_nhat_phong_kham ?? null;
    }

    /** @returns {Buffer} */
    get ma_phong_kham() {
        return this._ma_phong_kham;
    }
    set ma_phong_kham(value) {
        this._ma_phong_kham = value;
    }

    /** @returns {Buffer} */
    get ma_chuyen_khoa_phong_kham() {
        return this._ma_chuyen_khoa_phong_kham;
    }
    set ma_chuyen_khoa_phong_kham(value) {
        this._ma_chuyen_khoa_phong_kham = value;
    }

    /** @returns {Buffer} */
    get ma_loai_phong_kham() {
        return this._ma_loai_phong_kham;
    }
    set ma_loai_phong_kham(value) {
        this._ma_loai_phong_kham = value;
    }

    /** @returns {number} */
    get so_phong_kham() {
        return this._so_phong_kham;
    }
    set so_phong_kham(value) {
        this._so_phong_kham = value;
    }

    /** @returns {string} */
    get ten_phong_kham() {
        return this._ten_phong_kham;
    }
    set ten_phong_kham(value) {
        this._ten_phong_kham = value;
    }

    /** @returns {number} */
    get trang_thai_phong_kham() {
        return this._trang_thai_phong_kham;
    }
    set trang_thai_phong_kham(value) {
        this._trang_thai_phong_kham = value;
    }

    /** @returns {Date} */
    get ngay_tao_phong_kham() {
        return this._ngay_tao_phong_kham;
    }
    set ngay_tao_phong_kham(value) {
        this._ngay_tao_phong_kham = value;
    }

    /** @returns {Date} */
    get ngay_cap_nhat_phong_kham() {
        return this._ngay_cap_nhat_phong_kham;
    }
    set ngay_cap_nhat_phong_kham(value) {
        this._ngay_cap_nhat_phong_kham = value;
    }
}

module.exports = PhongKhamEntity;
