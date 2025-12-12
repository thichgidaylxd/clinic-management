const Joi = require('joi');

class AppointmentValidator {

    // Validate đặt lịch (guest - khách vãng lai)
    static createGuest() {
        return Joi.object({

            // ======================
            // 1. Thông tin bệnh nhân
            // ======================
            ten_benh_nhan: Joi.string()
                .required()
                .max(100)
                .messages({
                    'string.empty': 'Tên bệnh nhân không được để trống',
                    'string.max': 'Tên bệnh nhân không được quá 100 ký tự',
                    'any.required': 'Tên bệnh nhân là bắt buộc'
                }),

            so_dien_thoai_benh_nhan: Joi.string()
                .pattern(/^[0-9]{10}$/)
                .required()
                .messages({
                    'string.pattern.base': 'Số điện thoại phải có 10 chữ số',
                    'any.required': 'Số điện thoại là bắt buộc'
                }),

            gioi_tinh_benh_nhan: Joi.number()
                .valid(0, 1, 2)
                .allow(null)
                .messages({
                    'any.only': 'Giới tính không hợp lệ (0: Nữ, 1: Nam, 2: Khác)'
                }),

            // ======================
            // 2. Mã API (UUID)
            // ======================
            ma_bac_si: Joi.string()
                .guid()
                .required()
                .messages({
                    'string.guid': 'Mã bác sĩ không hợp lệ',
                    'any.required': 'Mã bác sĩ là bắt buộc'
                }),

            ma_chuyen_khoa: Joi.string()
                .guid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã chuyên khoa không hợp lệ'
                }),

            ma_dich_vu_lich_hen: Joi.string()
                .guid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã dịch vụ không hợp lệ'
                }),

            ly_do_kham_lich_hen: Joi.string()
                .required()
                .max(500)
                .messages({
                    'string.empty': 'Lý do khám không được để trống',
                    'string.max': 'Lý do khám không được quá 500 ký tự',
                    'any.required': 'Lý do khám là bắt buộc'
                }),

            // ======================
            // 3. Thời gian lịch hẹn
            // ======================
            ngay_hen: Joi.date()
                .required()
                .min(new Date().toISOString().split('T')[0])
                .messages({
                    'date.base': 'Ngày khám không hợp lệ',
                    'date.min': 'Ngày khám phải từ hôm nay trở đi',
                    'any.required': 'Ngày khám là bắt buộc'
                }),

            // đồng bộ với DB → gio_bat_dau
            thoi_gian_bat_dau: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .required()
                .messages({
                    'string.pattern.base': 'Thời gian bắt đầu không hợp lệ (HH:mm)',
                    'any.required': 'Thời gian bắt đầu là bắt buộc'
                }),

            // đồng bộ với DB → gio_ket_thuc
            thoi_gian_ket_thuc: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .required()
                .messages({
                    'string.pattern.base': 'Thời gian kết thúc không hợp lệ (HH:mm)',
                    'any.required': 'Thời gian kết thúc là bắt buộc'
                })

        }).custom((value, helpers) => {
            if (value.thoi_gian_bat_dau >= value.thoi_gian_ket_thuc) {
                return helpers.error('custom.timeRange', {
                    message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu'
                });
            }
            return value;
        });
    }

    // ==========================================================
    //   ĐẶT LỊCH CHO USER ĐÃ ĐĂNG NHẬP
    // ==========================================================
    static createAuthenticated() {
        return Joi.object({

            ma_bac_si: Joi.string()
                .guid()
                .required()
                .messages({
                    'string.guid': 'Mã bác sĩ không hợp lệ',
                    'any.required': 'Mã bác sĩ là bắt buộc'
                }),

            ma_chuyen_khoa: Joi.string()
                .guid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã chuyên khoa không hợp lệ'
                }),

            ma_dich_vu_lich_hen: Joi.string()
                .guid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã dịch vụ không hợp lệ'
                }),

            ly_do_kham_lich_hen: Joi.string()
                .required()
                .max(500)
                .messages({
                    'string.empty': 'Lý do khám không được để trống',
                    'string.max': 'Lý do khám không được quá 500 ký tự',
                    'any.required': 'Lý do khám là bắt buộc'
                }),

            // đồng bộ tên biến → dùng chung "ngay_hen"
            ngay_hen: Joi.date()
                .required()
                .min(new Date().toISOString().split('T')[0])
                .messages({
                    'date.base': 'Ngày khám không hợp lệ',
                    'date.min': 'Ngày khám phải từ hôm nay trở đi',
                    'any.required': 'Ngày khám là bắt buộc'
                }),

            thoi_gian_bat_dau: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .required(),

            thoi_gian_ket_thuc: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .required()

        }).custom((value, helpers) => {
            if (value.thoi_gian_bat_dau >= value.thoi_gian_ket_thuc) {
                return helpers.error('custom.timeRange', {
                    message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu'
                });
            }
            return value;
        });
    }

    // ==========================================================
    // UPDATE
    // ==========================================================
    static update() {
        return Joi.object({
            ma_phong_kham: Joi.string()
                .guid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã phòng khám không hợp lệ'
                }),

            trang_thai_lich_hen: Joi.number()
                .valid(0, 1, 2, 3, 4)
                .messages({
                    'any.only': 'Trạng thái không hợp lệ (0-PENDING, 1-CONFIRMED, 2-CHECKED_IN, 3-COMPLETED, 4-CANCELLED)'
                }),

            ly_do_huy_lich_hen: Joi.string()
                .max(500)
                .allow(null, '')
                .messages({
                    'string.max': 'Lý do hủy không được quá 500 ký tự'
                })
        }).min(1).messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        });
    }

    // ==========================================================
    // QUERY LIST
    // ==========================================================
    static query() {
        return Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),

            doctorId: Joi.string().guid().allow(null, ''),
            patientId: Joi.string().guid().allow(null, ''),
            specialtyId: Joi.string().guid().allow(null, ''),

            status: Joi.number().valid(0, 1, 2, 3, 4).allow(null),

            fromDate: Joi.date().allow(null, ''),
            toDate: Joi.date()
                .allow(null, '')
                .when('fromDate', {
                    is: Joi.exist(),
                    then: Joi.date().min(Joi.ref('fromDate')).messages({
                        'date.min': 'Ngày kết thúc phải sau ngày bắt đầu'
                    })
                }),

            search: Joi.string().allow('')
        });
    }

    // ==========================================================
    // Query available slots
    // ==========================================================
    static queryAvailableSlots() {
        return Joi.object({
            doctorId: Joi.string()
                .guid()
                .required()
                .messages({
                    'string.guid': 'Mã bác sĩ không hợp lệ',
                    'any.required': 'Mã bác sĩ là bắt buộc'
                }),

            date: Joi.date()
                .required()
                .min(new Date().toISOString().split('T')[0])
                .messages({
                    'date.base': 'Ngày không hợp lệ',
                    'date.min': 'Ngày phải từ hôm nay trở đi',
                    'any.required': 'Ngày là bắt buộc'
                }),

            slotDuration: Joi.number()
                .integer()
                .valid(15, 30, 45, 60)
                .default(30)
                .messages({
                    'any.only': 'Thời lượng slot phải là 15, 30, 45 hoặc 60 phút'
                })
        });
    }

    // ==========================================================
    // CHECK AVAILABILITY
    // ==========================================================
    static checkAvailability() {
        return Joi.object({
            doctorId: Joi.string()
                .guid()
                .required(),

            date: Joi.date()
                .required()
                .min('now'),

            startTime: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .required(),

            endTime: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .required()

        }).custom((value, helpers) => {
            if (value.startTime >= value.endTime) {
                return helpers.error('custom.timeRange', {
                    message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu'
                });
            }
            return value;
        });
    }

    // ==========================================================
    // CANCEL APPOINTMENT
    // ==========================================================
    static cancel() {
        return Joi.object({
            ly_do_huy_lich_hen: Joi.string()
                .required()
                .max(500)
                .messages({
                    'string.empty': 'Lý do hủy không được để trống',
                    'string.max': 'Lý do hủy không được quá 500 ký tự',
                    'any.required': 'Lý do hủy là bắt buộc'
                })
        });
    }
}

module.exports = AppointmentValidator;
