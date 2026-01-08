/**
 * Entity: VaiTro
 * Table: bang_vai_tro
 */
class VaiTroEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_vai_tro = data.ma_vai_tro ?? null;

        /** @type {string} VARCHAR(50) */
        this._ten_vai_tro = data.ten_vai_tro ?? null;

        /** @type {number} TINYINT */
        this._trang_thai_vai_tro = data.trang_thai_vai_tro ?? 1;

        /** @type {Date} DATETIME */
        this._ngay_tao_vai_tro = data.ngay_tao_vai_tro ?? null;

        /** @type {Date} DATETIME */
        this._ngay_cap_nhat_vai_tro = data.ngay_cap_nhat_vai_tro ?? null;
    }

    /** @returns {Buffer} */
    get ma_vai_tro() {
        return this._ma_vai_tro;
    }
    set ma_vai_tro(value) {
        this._ma_vai_tro = value;
    }

    /** @returns {string} */
    get ten_vai_tro() {
        return this._ten_vai_tro;
    }
    set ten_vai_tro(value) {
        this._ten_vai_tro = value;
    }

    /** @returns {number} */
    get trang_thai_vai_tro() {
        return this._trang_thai_vai_tro;
    }
    set trang_thai_vai_tro(value) {
        this._trang_thai_vai_tro = value;
    }

    /** @returns {Date} */
    get ngay_tao_vai_tro() {
        return this._ngay_tao_vai_tro;
    }
    set ngay_tao_vai_tro(value) {
        this._ngay_tao_vai_tro = value;
    }

    /** @returns {Date} */
    get ngay_cap_nhat_vai_tro() {
        return this._ngay_cap_nhat_vai_tro;
    }
    set ngay_cap_nhat_vai_tro(value) {
        this._ngay_cap_nhat_vai_tro = value;
    }
}

module.exports = VaiTroEntity;