const Joi = require('joi');

class ServiceValidator {
    // Validate tạo dịch vụ
    static create() {
        return Joi.object({
            ten_dich_vu: Joi.string()
                .required()
                .max(100)
                .messages({
                    'string.empty': 'Tên dịch vụ không được để trống',
                    'string.max': 'Tên dịch vụ không được quá 100 ký tự',
                    'any.required': 'Tên dịch vụ là bắt buộc'
                }),

            mo_ta_dich_vu: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Mô tả dịch vụ phải là chuỗi'
                }),

            don_gia_dich_vu: Joi.number()
                .required()
                .min(0)
                .messages({
                    'number.base': 'Đơn giá phải là số',
                    'number.min': 'Đơn giá phải lớn hơn hoặc bằng 0',
                    'any.required': 'Đơn giá là bắt buộc'
                }),

            ma_chuyen_khoa_dich_vu: Joi.string()
                .uuid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã chuyên khoa không hợp lệ'
                })
        });
    }

    // Validate cập nhật dịch vụ
    static update() {
        return Joi.object({
            ten_dich_vu: Joi.string()
                .max(100)
                .messages({
                    'string.max': 'Tên dịch vụ không được quá 100 ký tự'
                }),

            mo_ta_dich_vu: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Mô tả dịch vụ phải là chuỗi'
                }),

            don_gia_dich_vu: Joi.number()
                .min(0)
                .messages({
                    'number.base': 'Đơn giá phải là số',
                    'number.min': 'Đơn giá phải lớn hơn hoặc bằng 0'
                }),

            ma_chuyen_khoa_dich_vu: Joi.string()
                .uuid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã chuyên khoa không hợp lệ'
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
                }),

            specialtyId: Joi.string()
                .uuid()
                .allow(null, '')
                .messages({
                    'string.guid': 'Mã chuyên khoa không hợp lệ'
                })
        });
    }
}

module.exports = ServiceValidator;