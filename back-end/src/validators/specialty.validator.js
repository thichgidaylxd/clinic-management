const Joi = require('joi');

class SpecialtyValidator {
    // Validate tạo chuyên khoa
    static create() {
        return Joi.object({
            ten_chuyen_khoa: Joi.string()
                .required()
                .max(100)
                .messages({
                    'string.empty': 'Tên chuyên khoa không được để trống',
                    'string.max': 'Tên chuyên khoa không được quá 100 ký tự',
                    'any.required': 'Tên chuyên khoa là bắt buộc'
                }),

            mo_ta_chuyen_khoa: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Mô tả chuyên khoa phải là chuỗi'
                }),


        });
    }

    // Validate cập nhật chuyên khoa
    static update() {
        return Joi.object({
            ten_chuyen_khoa: Joi.string()
                .max(100)
                .messages({
                    'string.max': 'Tên chuyên khoa không được quá 100 ký tự'
                }),

            mo_ta_chuyen_khoa: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Mô tả chuyên khoa phải là chuỗi'
                }),


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
                .default(1)
                .messages({
                    'number.base': 'Số trang phải là số',
                    'number.min': 'Số trang phải lớn hơn 0'
                }),

            limit: Joi.number()
                .integer()
                .min(1)
                .max(100)
                .default(10)
                .messages({
                    'number.base': 'Giới hạn phải là số',
                    'number.min': 'Giới hạn phải lớn hơn 0',
                    'number.max': 'Giới hạn không được quá 100'
                }),

            search: Joi.string()
                .allow('')
                .messages({
                    'string.base': 'Từ khóa tìm kiếm phải là chuỗi'
                })
        });
    }
}

module.exports = SpecialtyValidator;