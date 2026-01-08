/**
 * Entity: LoaiPhongKham
 * Table: bang_loai_phong_kham
 */
class LoaiPhongKhamEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_loai_phong_kham = data.ma_loai_phong_kham ?? null;

        /** @type {string} VARCHAR(100) */
        this._ten_loai_phong_kham = data.ten_loai_phong_kham ?? null;

        /** @type {string} TEXT */
        this._mo_ta_loai_phong_kham = data.mo_ta_loai_phong_kham ?? null;

        /** @type {Date} DATETIME */
        this._ngay_tao_loai_phong_kham = data.ngay_tao_loai_phong_kham ?? null;

        /** @type {Date} DATETIME */
        this._ngay_cap_nhat_loai_phong_kham = data.ngay_cap_nhat_loai_phong_kham ?? null;
    }

    /** @returns {Buffer} */
    get ma_loai_phong_kham() {
        return this._ma_loai_phong_kham;
    }
    set ma_loai_phong_kham(value) {
        this._ma_loai_phong_kham = value;
    }

    /** @returns {string} */
    get ten_loai_phong_kham() {
        return this._ten_loai_phong_kham;
    }
    set ten_loai_phong_kham(value) {
        this._ten_loai_phong_kham = value;
    }

    /** @returns {string} */
    get mo_ta_loai_phong_kham() {
        return this._mo_ta_loai_phong_kham;
    }
    set mo_ta_loai_phong_kham(value) {
        this._mo_ta_loai_phong_kham = value;
    }

    /** @returns {Date} */
    get ngay_tao_loai_phong_kham() {
        return this._ngay_tao_loai_phong_kham;
    }
    set ngay_tao_loai_phong_kham(value) {
        this._ngay_tao_loai_phong_kham = value;
    }

    /** @returns {Date} */
    get ngay_cap_nhat_loai_phong_kham() {
        return this._ngay_cap_nhat_loai_phong_kham;
    }
    set ngay_cap_nhat_loai_phong_kham(value) {
        this._ngay_cap_nhat_loai_phong_kham = value;
    }
}

module.exports = LoaiPhongKhamEntity;