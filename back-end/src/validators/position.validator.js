const Joi = require('joi');

class PositionValidator {
    // Validate tạo chức vụ
    static create() {
        return Joi.object({
            ten_chuc_vu: Joi.string()
                .trim()
                .min(2)
                .max(100)
                .required()
                .messages({
                    'string.empty': 'Tên chức vụ không được để trống',
                    'string.min': 'Tên chức vụ phải có ít nhất 2 ký tự',
                    'string.max': 'Tên chức vụ không được vượt quá 100 ký tự',
                    'any.required': 'Tên chức vụ là bắt buộc'
                }),
            dang_hoat_dong_chuc_vu: Joi.number()
                .integer()
                .valid(0, 1)
                .default(1)
                .messages({
                    'number.base': 'Trạng thái phải là số',
                    'any.only': 'Trạng thái phải là 0 hoặc 1'
                })
        });
    }

    // Validate cập nhật chức vụ
    static update() {
        return Joi.object({
            ten_chuc_vu: Joi.string()
                .trim()
                .min(2)
                .max(100)
                .messages({
                    'string.min': 'Tên chức vụ phải có ít nhất 2 ký tự',
                    'string.max': 'Tên chức vụ không được vượt quá 100 ký tự'
                }),
            dang_hoat_dong_chuc_vu: Joi.number()
                .integer()
                .valid(0, 1)
                .messages({
                    'number.base': 'Trạng thái phải là số',
                    'any.only': 'Trạng thái phải là 0 hoặc 1'
                })
        }).min(1).messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        });
    }
}

module.exports = PositionValidator;