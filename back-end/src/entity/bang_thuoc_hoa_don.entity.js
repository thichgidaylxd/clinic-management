/**
 * Entity: ThuocHoaDon
 * Table: bang_thuoc_hoa_don
 */
class ThuocHoaDonEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_thuoc_hoa_don = data.ma_thuoc_hoa_don ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_hoa_don = data.ma_hoa_don ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_thuoc = data.ma_thuoc ?? null;

        /** @type {number} INT */
        this._so_luong_thuoc_hoa_don = data.so_luong_thuoc_hoa_don ?? null;

        /** @type {string} TEXT */
        this._ghi_chu_thuoc = data.ghi_chu_thuoc ?? null;
    }

    get ma_thuoc_hoa_don() { return this._ma_thuoc_hoa_don; }
    set ma_thuoc_hoa_don(v) { this._ma_thuoc_hoa_don = v; }

    get ma_hoa_don() { return this._ma_hoa_don; }
    set ma_hoa_don(v) { this._ma_hoa_don = v; }

    get ma_thuoc() { return this._ma_thuoc; }
    set ma_thuoc(v) { this._ma_thuoc = v; }

    get so_luong_thuoc_hoa_don() { return this._so_luong_thuoc_hoa_don; }
    set so_luong_thuoc_hoa_don(v) { this._so_luong_thuoc_hoa_don = v; }

    get ghi_chu_thuoc() { return this._ghi_chu_thuoc; }
    set ghi_chu_thuoc(v) { this._ghi_chu_thuoc = v; }
}

module.exports = ThuocHoaDonEntity;
