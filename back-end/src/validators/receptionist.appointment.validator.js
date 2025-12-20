const Joi = require('joi');

class ReceptionistAppointmentValidator {
    static create() {
        return Joi.object({
            so_dien_thoai_benh_nhan: Joi.string()
                .pattern(/^[0-9]{10}$/)
                .required(),

            ho_benh_nhan: Joi.string().max(50).allow(null, ''),
            ten_benh_nhan: Joi.string().max(100).required(),

            ma_bac_si: Joi.string().guid().required(),
            ma_chuyen_khoa: Joi.string().guid().allow(null),
            ma_dich_vu_lich_hen: Joi.string().guid().allow(null),

            ngay_hen: Joi.string()
                .pattern(/^\d{4}-\d{2}-\d{2}$/)
                .required(),

            gio_bat_dau: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .required(),

            gio_ket_thuc: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .required(),

            ly_do_kham_lich_hen: Joi.string().max(500).allow(null, ''),
            check_in_ngay: Joi.boolean().default(false)
        }).custom((value, helpers) => {
            if (value.gio_bat_dau >= value.gio_ket_thuc) {
                return helpers.message('Giờ kết thúc phải lớn hơn giờ bắt đầu');
            }
            return value;
        });
    }
}

module.exports = ReceptionistAppointmentValidator;
