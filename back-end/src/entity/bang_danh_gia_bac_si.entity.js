/**
 * Entity: DanhGiaBacSi
 * Table: bang_danh_gia_bac_si
 */
class DanhGiaBacSiEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_danh_gia = data.ma_danh_gia ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_bac_si = data.ma_bac_si_danh_gia ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_nguoi_dung = data.ma_nguoi_dung_danh_gia ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_lich_hen = data.ma_lich_hen_danh_gia ?? null;

        /** @type {string} TEXT */
        this._noi_dung_danh_gia = data.noi_dung_danh_gia ?? null;

        /** @type {number} INT */
        this._so_sao_danh_gia = data.so_sao_danh_gia ?? null;

        /** @type {number} TINYINT */
        this._trang_thai_danh_gia = data.trang_thai_danh_gia ?? 1;

        /** @type {Date} DATETIME */
        this._ngay_tao_danh_gia = data.ngay_tao_danh_gia ?? null;

        /** @type {Date} DATETIME */
        this._ngay_cap_nhat_danh_gia = data.ngay_cap_nhat_danh_gia ?? null;
    }

    get ma_danh_gia() { return this._ma_danh_gia; }
    set ma_danh_gia(v) { this._ma_danh_gia = v; }

    get ma_bac_si() { return this._ma_bac_si; }
    set ma_bac_si(v) { this._ma_bac_si = v; }

    get ma_nguoi_dung() { return this._ma_nguoi_dung; }
    set ma_nguoi_dung(v) { this._ma_nguoi_dung = v; }

    get ma_lich_hen() { return this._ma_lich_hen; }
    set ma_lich_hen(v) { this._ma_lich_hen = v; }

    get noi_dung_danh_gia() { return this._noi_dung_danh_gia; }
    set noi_dung_danh_gia(v) { this._noi_dung_danh_gia = v; }

    get so_sao_danh_gia() { return this._so_sao_danh_gia; }
    set so_sao_danh_gia(v) { this._so_sao_danh_gia = v; }

    get trang_thai_danh_gia() { return this._trang_thai_danh_gia; }
    set trang_thai_danh_gia(v) { this._trang_thai_danh_gia = v; }

    get ngay_tao_danh_gia() { return this._ngay_tao_danh_gia; }
    set ngay_tao_danh_gia(v) { this._ngay_tao_danh_gia = v; }

    get ngay_cap_nhat_danh_gia() { return this._ngay_cap_nhat_danh_gia; }
    set ngay_cap_nhat_danh_gia(v) { this._ngay_cap_nhat_danh_gia = v; }
}

module.exports = DanhGiaBacSiEntity;
