/**
 * Entity: DichVu
 * Table: bang_dich_vu
 */
class DichVuEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_dich_vu = data.ma_dich_vu ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_chuyen_khoa_dich_vu = data.ma_chuyen_khoa_dich_vu ?? null;

        /** @type {string} VARCHAR(100) */
        this._ten_dich_vu = data.ten_dich_vu ?? null;

        /** @type {string} TEXT */
        this._mo_ta_dich_vu = data.mo_ta_dich_vu ?? null;

        /** @type {number} DECIMAL(12,2) */
        this._don_gia_dich_vu = data.don_gia_dich_vu ?? null;

        /** @type {Date} DATETIME */
        this._ngay_tao_dich_vu = data.ngay_tao_dich_vu ?? null;

        /** @type {Date} DATETIME */
        this._ngay_cap_nhat_dich_vu = data.ngay_cap_nhat_dich_vu ?? null;
    }

    /** @returns {Buffer} */
    get ma_dich_vu() {
        return this._ma_dich_vu;
    }
    set ma_dich_vu(value) {
        this._ma_dich_vu = value;
    }

    /** @returns {Buffer} */
    get ma_chuyen_khoa_dich_vu() {
        return this._ma_chuyen_khoa_dich_vu;
    }
    set ma_chuyen_khoa_dich_vu(value) {
        this._ma_chuyen_khoa_dich_vu = value;
    }

    /** @returns {string} */
    get ten_dich_vu() {
        return this._ten_dich_vu;
    }
    set ten_dich_vu(value) {
        this._ten_dich_vu = value;
    }

    /** @returns {string} */
    get mo_ta_dich_vu() {
        return this._mo_ta_dich_vu;
    }
    set mo_ta_dich_vu(value) {
        this._mo_ta_dich_vu = value;
    }

    /** @returns {number} */
    get don_gia_dich_vu() {
        return this._don_gia_dich_vu;
    }
    set don_gia_dich_vu(value) {
        this._don_gia_dich_vu = value;
    }

    /** @returns {Date} */
    get ngay_tao_dich_vu() {
        return this._ngay_tao_dich_vu;
    }
    set ngay_tao_dich_vu(value) {
        this._ngay_tao_dich_vu = value;
    }

    /** @returns {Date} */
    get ngay_cap_nhat_dich_vu() {
        return this._ngay_cap_nhat_dich_vu;
    }
    set ngay_cap_nhat_dich_vu(value) {
        this._ngay_cap_nhat_dich_vu = value;
    }
}

module.exports = DichVuEntity;