/**
 * Entity: BacSiChuyenKhoa
 * Table: bang_bac_si_chuyen_khoa
 */
class BacSiChuyenKhoaEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK, FK */
        this._ma_bac_si = data.ma_bac_si ?? null;

        /** @type {Buffer} binary(16) | PK, FK */
        this._ma_chuyen_khoa = data.ma_chuyen_khoa ?? null;

        /** @type {Date} DATETIME */
        this._ngay_tao = data.ngay_tao ?? null;
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

    /** @returns {Date} */
    get ngay_tao() {
        return this._ngay_tao;
    }
    set ngay_tao(value) {
        this._ngay_tao = value;
    }
}

module.exports = BacSiChuyenKhoaEntity;