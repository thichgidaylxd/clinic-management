/**
 * Entity: HoSoBenhAn
 * Table: bang_ho_so_benh_an
 */
class HoSoBenhAnEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_ho_so_benh_an = data.ma_ho_so_benh_an ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_benh_nhan = data.ma_benh_nhan ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_bac_si = data.ma_bac_si ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_chuyen_khoa = data.ma_chuyen_khoa ?? null;

        /** @type {string} TEXT */
        this._trieu_chung = data.trieu_chung ?? null;

        /** @type {string} TEXT */
        this._chuan_doan = data.chuan_doan ?? null;

        /** @type {string} TEXT */
        this._phuong_phap_dieu_tri = data.phuong_phap_dieu_tri ?? null;

        /** @type {Date} DATETIME */
        this._ngay_tao_ho_so = data.ngay_tao_ho_so ?? null;

        /** @type {Date} DATETIME */
        this._ngay_cap_nhat_ho_so = data.ngay_cap_nhat_ho_so ?? null;
    }

    /** @returns {Buffer} */
    get ma_ho_so_benh_an() {
        return this._ma_ho_so_benh_an;
    }
    set ma_ho_so_benh_an(value) {
        this._ma_ho_so_benh_an = value;
    }

    /** @returns {Buffer} */
    get ma_benh_nhan() {
        return this._ma_benh_nhan;
    }
    set ma_benh_nhan(value) {
        this._ma_benh_nhan = value;
    }

    /** @returns {Buffer} */
    get ma_bac_si() {
        return this._ma_bac_si;
    }
    set ma_bac_si(value) {
        this._ma_bac_si = value;
    }

    /** @returns {Buffer} */
    get ma_chuyen_khoa() {
        return this._ma_chuyen_khoa;
    }
    set ma_chuyen_khoa(value) {
        this._ma_chuyen_khoa = value;
    }

    /** @returns {string} */
    get trieu_chung() {
        return this._trieu_chung;
    }
    set trieu_chung(value) {
        this._trieu_chung = value;
    }

    /** @returns {string} */
    get chuan_doan() {
        return this._chuan_doan;
    }
    set chuan_doan(value) {
        this._chuan_doan = value;
    }

    /** @returns {string} */
    get phuong_phap_dieu_tri() {
        return this._phuong_phap_dieu_tri;
    }
    set phuong_phap_dieu_tri(value) {
        this._phuong_phap_dieu_tri = value;
    }

    /** @returns {Date} */
    get ngay_tao_ho_so() {
        return this._ngay_tao_ho_so;
    }
    set ngay_tao_ho_so(value) {
        this._ngay_tao_ho_so = value;
    }

    /** @returns {Date} */
    get ngay_cap_nhat_ho_so() {
        return this._ngay_cap_nhat_ho_so;
    }
    set ngay_cap_nhat_ho_so(value) {
        this._ngay_cap_nhat_ho_so = value;
    }
}

module.exports = HoSoBenhAnEntity;
