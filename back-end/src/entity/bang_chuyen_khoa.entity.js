/**
 * Entity: ChuyenKhoa
 * Table: bang_chuyen_khoa
 */
class ChuyenKhoaEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_chuyen_khoa = data.ma_chuyen_khoa ?? null;

        /** @type {string} VARCHAR(100) */
        this._ten_chuyen_khoa = data.ten_chuyen_khoa ?? null;

        /** @type {string} TEXT */
        this._mo_ta_chuyen_khoa = data.mo_ta_chuyen_khoa ?? null;

        /** @type {Date} DATETIME */
        this._ngay_tao_chuyen_khoa = data.ngay_tao_chuyen_khoa ?? null;

        /** @type {Date} DATETIME */
        this._ngay_cap_nhat_chuyen_khoa = data.ngay_cap_nhat_chuyen_khoa ?? null;
    }

    /** @returns {Buffer} */
    get ma_chuyen_khoa() {
        return this._ma_chuyen_khoa;
    }
    set ma_chuyen_khoa(value) {
        this._ma_chuyen_khoa = value;
    }

    /** @returns {string} */
    get ten_chuyen_khoa() {
        return this._ten_chuyen_khoa;
    }
    set ten_chuyen_khoa(value) {
        this._ten_chuyen_khoa = value;
    }

    /** @returns {string} */
    get mo_ta_chuyen_khoa() {
        return this._mo_ta_chuyen_khoa;
    }
    set mo_ta_chuyen_khoa(value) {
        this._mo_ta_chuyen_khoa = value;
    }

    /** @returns {Date} */
    get ngay_tao_chuyen_khoa() {
        return this._ngay_tao_chuyen_khoa;
    }
    set ngay_tao_chuyen_khoa(value) {
        this._ngay_tao_chuyen_khoa = value;
    }

    /** @returns {Date} */
    get ngay_cap_nhat_chuyen_khoa() {
        return this._ngay_cap_nhat_chuyen_khoa;
    }
    set ngay_cap_nhat_chuyen_khoa(value) {
        this._ngay_cap_nhat_chuyen_khoa = value;
    }
}

module.exports = ChuyenKhoaEntity;