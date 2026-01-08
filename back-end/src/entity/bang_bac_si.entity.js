/**
 * Entity: BacSi
 * Table: bang_bac_si
 */
class BacSiEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_bac_si = data.ma_bac_si ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_nguoi_dung_bac_si = data.ma_nguoi_dung_bac_si ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_chuc_vu_bac_si = data.ma_chuc_vu_bac_si ?? null;

        /** @type {Buffer} BLOB */
        this._bang_cap_bac_si = data.bang_cap_bac_si ?? null;

        /** @type {number} TINYINT */
        this._so_nam_kinh_nghiem_bac_si = data.so_nam_kinh_nghiem_bac_si ?? 0;

        /** @type {number} TINYINT */
        this._dang_hoat_dong_bac_si = data.dang_hoat_dong_bac_si ?? 1;

        /** @type {Date} DATETIME */
        this._ngay_tao_bac_si = data.ngay_tao_bac_si ?? null;

        /** @type {Date} DATETIME */
        this._ngay_cap_nhat_bac_si = data.ngay_cap_nhat_bac_si ?? null;
    }

    /** @returns {Buffer} */
    get ma_bac_si() {
        return this._ma_bac_si;
    }
    set ma_bac_si(value) {
        this._ma_bac_si = value;
    }

    /** @returns {Buffer} */
    get ma_nguoi_dung_bac_si() {
        return this._ma_nguoi_dung_bac_si;
    }
    set ma_nguoi_dung_bac_si(value) {
        this._ma_nguoi_dung_bac_si = value;
    }

    /** @returns {Buffer} */
    get ma_chuc_vu_bac_si() {
        return this._ma_chuc_vu_bac_si;
    }
    set ma_chuc_vu_bac_si(value) {
        this._ma_chuc_vu_bac_si = value;
    }

    /** @returns {Buffer} */
    get bang_cap_bac_si() {
        return this._bang_cap_bac_si;
    }
    set bang_cap_bac_si(value) {
        this._bang_cap_bac_si = value;
    }

    /** @returns {number} */
    get so_nam_kinh_nghiem_bac_si() {
        return this._so_nam_kinh_nghiem_bac_si;
    }
    set so_nam_kinh_nghiem_bac_si(value) {
        this._so_nam_kinh_nghiem_bac_si = value;
    }

    /** @returns {number} */
    get dang_hoat_dong_bac_si() {
        return this._dang_hoat_dong_bac_si;
    }
    set dang_hoat_dong_bac_si(value) {
        this._dang_hoat_dong_bac_si = value;
    }

    /** @returns {Date} */
    get ngay_tao_bac_si() {
        return this._ngay_tao_bac_si;
    }
    set ngay_tao_bac_si(value) {
        this._ngay_tao_bac_si = value;
    }

    /** @returns {Date} */
    get ngay_cap_nhat_bac_si() {
        return this._ngay_cap_nhat_bac_si;
    }
    set ngay_cap_nhat_bac_si(value) {
        this._ngay_cap_nhat_bac_si = value;
    }
}

module.exports = BacSiEntity;