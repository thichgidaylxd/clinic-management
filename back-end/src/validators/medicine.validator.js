const Joi = require('joi');

class MedicineValidator {
    // Validate tạo thuốc
    static create() {
        return Joi.object({
            ten_thuoc: Joi.string()
                .required()
                .max(100)
                .messages({
                    'string.empty': 'Tên thuốc không được để trống',
                    'string.max': 'Tên thuốc không được quá 100 ký tự',
                    'any.required': 'Tên thuốc là bắt buộc'
                }),

            don_gia_thuoc: Joi.number()
                .required()
                .min(0)
                .messages({
                    'number.base': 'Đơn giá phải là số',
                    'number.min': 'Đơn giá phải lớn hơn hoặc bằng 0',
                    'any.required': 'Đơn giá là bắt buộc'
                }),

            huong_dan_su_dung_thuoc: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Hướng dẫn sử dụng phải là chuỗi'
                }),

            don_vi_tinh: Joi.string()
                .max(50)
                .allow('', null)
                .messages({
                    'string.max': 'Đơn vị tính không được quá 50 ký tự'
                }),

            so_luong_thuoc_ton_thuoc: Joi.number()
                .integer()
                .min(0)
                .default(0)
                .messages({
                    'number.base': 'Số lượng tồn phải là số',
                    'number.integer': 'Số lượng tồn phải là số nguyên',
                    'number.min': 'Số lượng tồn phải lớn hơn hoặc bằng 0'
                }),

            han_su_dung_thuoc: Joi.date()
                .allow(null)
                .messages({
                    'date.base': 'Hạn sử dụng phải là ngày hợp lệ'
                }),

            giay_to_kiem_dinh_thuoc: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Giấy tờ kiểm định phải là chuỗi base64'
                })
        });
    }

    // Validate cập nhật thuốc
    static update() {
        return Joi.object({
            ten_thuoc: Joi.string()
                .max(100)
                .messages({
                    'string.max': 'Tên thuốc không được quá 100 ký tự'
                }),

            don_gia_thuoc: Joi.number()
                .min(0)
                .messages({
                    'number.base': 'Đơn giá phải là số',
                    'number.min': 'Đơn giá phải lớn hơn hoặc bằng 0'
                }),

            huong_dan_su_dung_thuoc: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Hướng dẫn sử dụng phải là chuỗi'
                }),

            don_vi_tinh: Joi.string()
                .max(50)
                .allow('', null)
                .messages({
                    'string.max': 'Đơn vị tính không được quá 50 ký tự'
                }),

            so_luong_thuoc_ton_thuoc: Joi.number()
                .integer()
                .min(0)
                .messages({
                    'number.base': 'Số lượng tồn phải là số',
                    'number.integer': 'Số lượng tồn phải là số nguyên',
                    'number.min': 'Số lượng tồn phải lớn hơn hoặc bằng 0'
                }),

            han_su_dung_thuoc: Joi.date()
                .allow(null)
                .messages({
                    'date.base': 'Hạn sử dụng phải là ngày hợp lệ'
                }),

            giay_to_kiem_dinh_thuoc: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Giấy tờ kiểm định phải là chuỗi base64'
                }),

            trang_thai_thuoc: Joi.number()
                .valid(0, 1)
                .messages({
                    'any.only': 'Trạng thái không hợp lệ (0: Không hoạt động, 1: Hoạt động)'
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

            status: Joi.number()
                .valid(0, 1)
                .allow(null)
                .messages({
                    'any.only': 'Trạng thái không hợp lệ'
                })
        });
    }

    // Validate cập nhật tồn kho
    static updateStock() {
        return Joi.object({
            quantity: Joi.number()
                .integer()
                .min(1)
                .required()
                .messages({
                    'number.base': 'Số lượng phải là số',
                    'number.integer': 'Số lượng phải là số nguyên',
                    'number.min': 'Số lượng phải lớn hơn 0',
                    'any.required': 'Số lượng là bắt buộc'
                }),

            type: Joi.string()
                .valid('add', 'subtract')
                .default('add')
                .messages({
                    'any.only': 'Loại thao tác không hợp lệ (add hoặc subtract)'
                })
        });
    }
}

module.exports = MedicineValidator;