const Joi = require('joi');

class WorkScheduleValidator {
    // Validate tạo lịch làm việc
    static create() {
        return Joi.object({
            ma_bac_si_lich_lam_viec: Joi.string()
                .uuid()
                .required()
                .messages({
                    'string.guid': 'Mã bác sĩ không hợp lệ',
                    'any.required': 'Mã bác sĩ là bắt buộc'
                }),

            ngay_lich_lam_viec: Joi.date()
                .required()
                .custom((value, helpers) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // reset về 00:00
                    if (value < today) {
                        return helpers.error('date.min');
                    }
                    return value;
                })
                .messages({
                    'date.base': 'Ngày làm việc không hợp lệ',
                    'date.min': 'Ngày làm việc phải từ hôm nay trở đi',
                    'any.required': 'Ngày làm việc là bắt buộc'
                }),

            thoi_gian_bat_dau_lich_lam_viec: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .required()
                .messages({
                    'string.pattern.base': 'Thời gian bắt đầu không hợp lệ (HH:mm)',
                    'any.required': 'Thời gian bắt đầu là bắt buộc'
                }),

            thoi_gian_ket_thuc_lich_lam_viec: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .required()
                .messages({
                    'string.pattern.base': 'Thời gian kết thúc không hợp lệ (HH:mm)',
                    'any.required': 'Thời gian kết thúc là bắt buộc'
                }),

            trang_thai_lich_lam_viec: Joi.number()
                .valid(0, 1)
                .default(1)
                .messages({
                    'any.only': 'Trạng thái không hợp lệ (0: Không hoạt động, 1: Hoạt động)'
                })
        }).custom((value, helpers) => {
            // Validate thời gian kết thúc > thời gian bắt đầu
            const start = value.thoi_gian_bat_dau_lich_lam_viec;
            const end = value.thoi_gian_ket_thuc_lich_lam_viec;

            if (start && end && start >= end) {
                return helpers.error('custom.timeRange', {
                    message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu'
                });
            }

            return value;
        });
    }

    // Validate cập nhật lịch làm việc
    static update() {
        return Joi.object({

            ngay_lich_lam_viec: Joi.date()
                .required()
                .custom((value, helpers) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // reset về 00:00
                    if (value < today) {
                        return helpers.error('date.min');
                    }
                    return value;
                })
                .messages({
                    'date.base': 'Ngày làm việc không hợp lệ',
                    'date.min': 'Ngày làm việc phải từ hôm nay trở đi',
                    'any.required': 'Ngày làm việc là bắt buộc'
                }),

            thoi_gian_bat_dau_lich_lam_viec: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .messages({
                    'string.pattern.base': 'Thời gian bắt đầu không hợp lệ (HH:mm)'
                }),

            thoi_gian_ket_thuc_lich_lam_viec: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .messages({
                    'string.pattern.base': 'Thời gian kết thúc không hợp lệ (HH:mm)'
                }),

            trang_thai_lich_lam_viec: Joi.number()
                .valid(0, 1)
                .messages({
                    'any.only': 'Trạng thái không hợp lệ (0: Không hoạt động, 1: Hoạt động)'
                })
        }).min(1).messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        }).custom((value, helpers) => {
            // Validate thời gian kết thúc > thời gian bắt đầu (nếu có cả 2)
            const start = value.thoi_gian_bat_dau_lich_lam_viec;
            const end = value.thoi_gian_ket_thuc_lich_lam_viec;

            if (start && end && start >= end) {
                return helpers.error('custom.timeRange', {
                    message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu'
                });
            }

            return value;
        });
    }

    // Validate query params
    static query() {
        return Joi.object({
            page: Joi.number()
                .integer()
                .min(1)
                .default(1),

            limit: Joi.number()
                .integer()
                .min(1)
                .max(100)
                .default(10),

            doctorId: Joi.string()
                .uuid()
                .allow(null, ''),

            roomId: Joi.string()
                .uuid()
                .allow(null, ''),

            fromDate: Joi.date()
                .allow(null, ''),

            toDate: Joi.date()
                .allow(null, '')
                .when('fromDate', {
                    is: Joi.exist(),
                    then: Joi.date().min(Joi.ref('fromDate')).messages({
                        'date.min': 'Ngày kết thúc phải sau ngày bắt đầu'
                    })
                }),

            status: Joi.number()
                .valid(0, 1)
                .allow(null)
        });
    }

    // Validate query stats
    static queryStats() {
        return Joi.object({
            fromDate: Joi.date()
                .required()
                .messages({
                    'any.required': 'Ngày bắt đầu là bắt buộc'
                }),

            toDate: Joi.date()
                .required()
                .min(Joi.ref('fromDate'))
                .messages({
                    'any.required': 'Ngày kết thúc là bắt buộc',
                    'date.min': 'Ngày kết thúc phải sau ngày bắt đầu'
                })
        });
    }
}

module.exports = WorkScheduleValidator;