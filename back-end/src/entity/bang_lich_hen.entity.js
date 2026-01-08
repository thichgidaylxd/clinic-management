/**
 * Entity: LichHen
 * Table: bang_lich_hen
 */
class LichHenEntity {
    constructor(data = {}) {
        /** @type {Buffer} binary(16) | PK */
        this._ma_lich_hen = data.ma_lich_hen ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_nguoi_tao_lich_hen = data.ma_nguoi_tao_lich_hen ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_bac_si = data.ma_bac_si ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_benh_nhan = data.ma_benh_nhan ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_chuyen_khoa = data.ma_chuyen_khoa ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_nguoi_xac_nhan = data.ma_nguoi_xac_nhan ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_phong_kham = data.ma_phong_kham ?? null;

        /** @type {Buffer} binary(16) | FK */
        this._ma_dich_vu_lich_hen = data.ma_dich_vu_lich_hen ?? null;

        /** @type {Date} DATE */
        this._ngay_hen = data.ngay_hen ?? null;

        /** @type {string} TIME */
        this._gio_bat_dau = data.gio_bat_dau ?? null;

        /** @type {string} TIME */
        this._gio_ket_thuc = data.gio_ket_thuc ?? null;

        /** @type {number} TINYINT */
        this._trang_thai_lich_hen = data.trang_thai_lich_hen ?? 0;

        /** @type {string} TEXT */
        this._ly_do_kham_lich_hen = data.ly_do_kham_lich_hen ?? null;

        /** @type {string} TEXT */
        this._ly_do_huy_lich_hen = data.ly_do_huy_lich_hen ?? null;

        /** @type {string} TEXT */
        this._ghi_chu_lich_hen = data.ghi_chu_lich_hen ?? null;

        /** @type {Date} DATETIME */
        this._thoi_gian_xac_nhan = data.thoi_gian_xac_nhan ?? null;

        /** @type {Date} DATETIME */
        this._thoi_gian_hoan_thanh = data.thoi_gian_hoan_thanh ?? null;

        /** @type {Date} DATETIME */
        this._thoi_gian_check_in = data.thoi_gian_check_in ?? null;

        /** @type {number} DECIMAL(12,2) */
        this._gia_dich_vu_lich_hen = data.gia_dich_vu_lich_hen ?? null;

        /** @type {number} DECIMAL(15,5) */
        this._tong_gia_lich_hen = data.tong_gia_lich_hen ?? null;

        /** @type {Date} DATETIME */
        this._ngay_tao_lich_hen = data.ngay_tao_lich_hen ?? null;

        /** @type {Date} DATETIME */
        this._ngay_cap_nhat_lich_hen = data.ngay_cap_nhat_lich_hen ?? null;
    }

    /** @returns {Buffer} */
    get ma_lich_hen() {
        return this._ma_lich_hen;
    }
    set ma_lich_hen(value) {
        this._ma_lich_hen = value;
    }

    /** @returns {Buffer} */
    get ma_nguoi_tao_lich_hen() {
        return this._ma_nguoi_tao_lich_hen;
    }
    set ma_nguoi_tao_lich_hen(value) {
        this._ma_nguoi_tao_lich_hen = value;
    }

    /** @returns {Buffer} */
    get ma_bac_si() {
        return this._ma_bac_si;
    }
    set ma_bac_si(value) {
        this._ma_bac_si = value;
    }

    /** @returns {Buffer} */
    get ma_benh_nhan() {
        return this._ma_benh_nhan;
    }
    set ma_benh_nhan(value) {
        this._ma_benh_nhan = value;
    }

    /** @returns {Buffer} */
    get ma_chuyen_khoa() {
        return this._ma_chuyen_khoa;
    }
    set ma_chuyen_khoa(value) {
        this._ma_chuyen_khoa = value;
    }

    /** @returns {Buffer} */
    get ma_nguoi_xac_nhan() {
        return this._ma_nguoi_xac_nhan;
    }
    set ma_nguoi_xac_nhan(value) {
        this._ma_nguoi_xac_nhan = value;
    }

    /** @returns {Buffer} */
    get ma_phong_kham() {
        return this._ma_phong_kham;
    }
    set ma_phong_kham(value) {
        this._ma_phong_kham = value;
    }

    /** @returns {Buffer} */
    get ma_dich_vu_lich_hen() {
        return this._ma_dich_vu_lich_hen;
    }
    set ma_dich_vu_lich_hen(value) {
        this._ma_dich_vu_lich_hen = value;
    }

    /** @returns {Date} */
    get ngay_hen() {
        return this._ngay_hen;
    }
    set ngay_hen(value) {
        this._ngay_hen = value;
    }

    /** @returns {string} */
    get gio_bat_dau() {
        return this._gio_bat_dau;
    }
    set gio_bat_dau(value) {
        this._gio_bat_dau = value;
    }

    /** @returns {string} */
    get gio_ket_thuc() {
        return this._gio_ket_thuc;
    }
    set gio_ket_thuc(value) {
        this._gio_ket_thuc = value;
    }

    /** @returns {number} */
    get trang_thai_lich_hen() {
        return this._trang_thai_lich_hen;
    }
    set trang_thai_lich_hen(value) {
        this._trang_thai_lich_hen = value;
    }

    /** @returns {string} */
    get ly_do_kham_lich_hen() {
        return this._ly_do_kham_lich_hen;
    }
    set ly_do_kham_lich_hen(value) {
        this._ly_do_kham_lich_hen = value;
    }

    /** @returns {string} */
    get ly_do_huy_lich_hen() {
        return this._ly_do_huy_lich_hen;
    }
    set ly_do_huy_lich_hen(value) {
        this._ly_do_huy_lich_hen = value;
    }

    /** @returns {string} */
    get ghi_chu_lich_hen() {
        return this._ghi_chu_lich_hen;
    }
    set ghi_chu_lich_hen(value) {
        this._ghi_chu_lich_hen = value;
    }

    /** @returns {Date} */
    get thoi_gian_xac_nhan() {
        return this._thoi_gian_xac_nhan;
    }
    set thoi_gian_xac_nhan(value) {
        this._thoi_gian_xac_nhan = value;
    }

    /** @returns {Date} */
    get thoi_gian_hoan_thanh() {
        return this._thoi_gian_hoan_thanh;
    }
    set thoi_gian_hoan_thanh(value) {
        this._thoi_gian_hoan_thanh = value;
    }

    /** @returns {Date} */
    get thoi_gian_check_in() {
        return this._thoi_gian_check_in;
    }
    set thoi_gian_check_in(value) {
        this._thoi_gian_check_in = value;
    }

    /** @returns {number} */
    get gia_dich_vu_lich_hen() {
        return this._gia_dich_vu_lich_hen;
    }
    set gia_dich_vu_lich_hen(value) {
        this._gia_dich_vu_lich_hen = value;
    }

    /** @returns {number} */
    get tong_gia_lich_hen() {
        return this._tong_gia_lich_hen;
    }
    set tong_gia_lich_hen(value) {
        this._tong_gia_lich_hen = value;
    }

    /** @returns {Date} */
    get ngay_tao_lich_hen() {
        return this._ngay_tao_lich_hen;
    }
    set ngay_tao_lich_hen(value) {
        this._ngay_tao_lich_hen = value;
    }

    /** @returns {Date} */
    get ngay_cap_nhat_lich_hen() {
        return this._ngay_cap_nhat_lich_hen;
    }
    set ngay_cap_nhat_lich_hen(value) {
        this._ngay_cap_nhat_lich_hen = value;
    }
}

module.exports = LichHenEntity;