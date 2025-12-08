const Joi = require('joi');

class PatientValidator {
    // Validate tạo bệnh nhân
    static create() {
        return Joi.object({
            ten_benh_nhan: Joi.string()
                .required()
                .max(100)
                .messages({
                    'string.empty': 'Tên bệnh nhân không được để trống',
                    'string.max': 'Tên bệnh nhân không được quá 100 ký tự',
                    'any.required': 'Tên bệnh nhân là bắt buộc'
                }),

            gioi_tinh_benh_nhan: Joi.number()
                .valid(0, 1, 2)
                .allow(null)
                .messages({
                    'any.only': 'Giới tính không hợp lệ (0: Nữ, 1: Nam, 2: Khác)'
                }),

            so_dien_thoai_benh_nhan: Joi.string()
                .pattern(/^[0-9]{10}$/)
                .allow('', null)
                .messages({
                    'string.pattern.base': 'Số điện thoại phải có 10 chữ số'
                }),

            chieu_cao_benh_nhan: Joi.number()
                .min(0)
                .max(300)
                .allow(null)
                .messages({
                    'number.base': 'Chiều cao phải là số',
                    'number.min': 'Chiều cao phải lớn hơn 0',
                    'number.max': 'Chiều cao không hợp lệ'
                }),

            can_nang_benh_nhan: Joi.number()
                .min(0)
                .max(500)
                .allow(null)
                .messages({
                    'number.base': 'Cân nặng phải là số',
                    'number.min': 'Cân nặng phải lớn hơn 0',
                    'number.max': 'Cân nặng không hợp lệ'
                }),

            hinh_anh_benh_nhan: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Hình ảnh phải là chuỗi base64'
                })
        });
    }

    // Validate cập nhật bệnh nhân
    static update() {
        return Joi.object({
            ten_benh_nhan: Joi.string()
                .max(100)
                .messages({
                    'string.max': 'Tên bệnh nhân không được quá 100 ký tự'
                }),

            gioi_tinh_benh_nhan: Joi.number()
                .valid(0, 1, 2)
                .allow(null)
                .messages({
                    'any.only': 'Giới tính không hợp lệ (0: Nữ, 1: Nam, 2: Khác)'
                }),

            so_dien_thoai_benh_nhan: Joi.string()
                .pattern(/^[0-9]{10}$/)
                .allow('', null)
                .messages({
                    'string.pattern.base': 'Số điện thoại phải có 10 chữ số'
                }),

            chieu_cao_benh_nhan: Joi.number()
                .min(0)
                .max(300)
                .allow(null)
                .messages({
                    'number.base': 'Chiều cao phải là số',
                    'number.min': 'Chiều cao phải lớn hơn 0',
                    'number.max': 'Chiều cao không hợp lệ'
                }),

            can_nang_benh_nhan: Joi.number()
                .min(0)
                .max(500)
                .allow(null)
                .messages({
                    'number.base': 'Cân nặng phải là số',
                    'number.min': 'Cân nặng phải lớn hơn 0',
                    'number.max': 'Cân nặng không hợp lệ'
                }),

            hinh_anh_benh_nhan: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Hình ảnh phải là chuỗi base64'
                })
        }).min(1).messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
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

            search: Joi.string()
                .allow(''),

            gender: Joi.number()
                .valid(0, 1, 2)
                .allow(null)
        });
    }

    // Validate query history
    static queryHistory() {
        return Joi.object({
            page: Joi.number()
                .integer()
                .min(1)
                .default(1),

            limit: Joi.number()
                .integer()
                .min(1)
                .max(100)
                .default(10)
        });
    }

    // Validate query appointments
    static queryAppointments() {
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

            status: Joi.number()
                .valid(0, 1, 2, 3, 4)
                .allow(null)
                .messages({
                    'any.only': 'Trạng thái không hợp lệ (0-4)'
                })
        });
    }
}

module.exports = PatientValidator;