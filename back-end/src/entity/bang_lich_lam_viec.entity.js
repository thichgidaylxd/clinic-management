/**
 * Entity: LichLamViec
 * Table: bang_lich_lam_viec
 */
class LichLamViecEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_lich_lam_viec = data.ma_lich_lam_viec ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_bac_si_lich_lam_viec = data.ma_bac_si_lich_lam_viec ?? null;

        /** @type {Date} DATE */
        this._ngay_lich_lam_viec = data.ngay_lich_lam_viec ?? null;

        /** @type {string} TIME */
        this._thoi_gian_bat_dau_lich_lam_viec = data.thoi_gian_bat_dau_lich_lam_viec ?? null;

        /** @type {string} TIME */
        this._thoi_gian_ket_thuc_lich_lam_viec = data.thoi_gian_ket_thuc_lich_lam_viec ?? null;

        /** @type {number} TINYINT */
        this._trang_thai_lich_lam_viec = data.trang_thai_lich_lam_viec ?? 1;

        /** @type {Date} DATETIME */
        this._ngay_tao_lich_lam_viec = data.ngay_tao_lich_lam_viec ?? null;

        /** @type {Date} DATETIME */
        this._ngay_cap_nhat_lich_lam_viec = data.ngay_cap_nhat_lich_lam_viec ?? null;
    }

    /** @returns {Buffer} */
    get ma_lich_lam_viec() {
        return this._ma_lich_lam_viec;
    }
    set ma_lich_lam_viec(value) {
        this._ma_lich_lam_viec = value;
    }

    /** @returns {Buffer} */
    get ma_bac_si_lich_lam_viec() {
        return this._ma_bac_si_lich_lam_viec;
    }
    set ma_bac_si_lich_lam_viec(value) {
        this._ma_bac_si_lich_lam_viec = value;
    }

    /** @returns {Date} */
    get ngay_lich_lam_viec() {
        return this._ngay_lich_lam_viec;
    }
    set ngay_lich_lam_viec(value) {
        this._ngay_lich_lam_viec = value;
    }

    /** @returns {string} */
    get thoi_gian_bat_dau_lich_lam_viec() {
        return this._thoi_gian_bat_dau_lich_lam_viec;
    }
    set thoi_gian_bat_dau_lich_lam_viec(value) {
        this._thoi_gian_bat_dau_lich_lam_viec = value;
    }

    /** @returns {string} */
    get thoi_gian_ket_thuc_lich_lam_viec() {
        return this._thoi_gian_ket_thuc_lich_lam_viec;
    }
    set thoi_gian_ket_thuc_lich_lam_viec(value) {
        this._thoi_gian_ket_thuc_lich_lam_viec = value;
    }

    /** @returns {number} */
    get trang_thai_lich_lam_viec() {
        return this._trang_thai_lich_lam_viec;
    }
    set trang_thai_lich_lam_viec(value) {
        this._trang_thai_lich_lam_viec = value;
    }

    /** @returns {Date} */
    get ngay_tao_lich_lam_viec() {
        return this._ngay_tao_lich_lam_viec;
    }
    set ngay_tao_lich_lam_viec(value) {
        this._ngay_tao_lich_lam_viec = value;
    }

    /** @returns {Date} */
    get ngay_cap_nhat_lich_lam_viec() {
        return this._ngay_cap_nhat_lich_lam_viec;
    }
    set ngay_cap_nhat_lich_lam_viec(value) {
        this._ngay_cap_nhat_lich_lam_viec = value;
    }
}

module.exports = LichLamViecEntity;