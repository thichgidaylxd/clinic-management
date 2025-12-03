const Joi = require('joi');

class RoomValidator {
    // Validate tạo loại phòng khám
    static createRoomType() {
        return Joi.object({
            ten_loai_phong_kham: Joi.string()
                .required()
                .max(100)
                .messages({
                    'string.empty': 'Tên loại phòng khám không được để trống',
                    'string.max': 'Tên loại phòng khám không được quá 100 ký tự',
                    'any.required': 'Tên loại phòng khám là bắt buộc'
                }),

            mo_ta_loai_phong_kham: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Mô tả loại phòng khám phải là chuỗi'
                })
        });
    }

    // Validate cập nhật loại phòng khám
    static updateRoomType() {
        return Joi.object({
            ten_loai_phong_kham: Joi.string()
                .max(100)
                .messages({
                    'string.max': 'Tên loại phòng khám không được quá 100 ký tự'
                }),

            mo_ta_loai_phong_kham: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Mô tả loại phòng khám phải là chuỗi'
                })
        }).min(1).messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        });
    }

    // Validate tạo phòng khám
    static createRoom() {
        return Joi.object({
            ten_phong_kham: Joi.string()
                .required()
                .max(100)
                .messages({
                    'string.empty': 'Tên phòng khám không được để trống',
                    'string.max': 'Tên phòng khám không được quá 100 ký tự',
                    'any.required': 'Tên phòng khám là bắt buộc'
                }),

            so_phong_kham: Joi.number()
                .integer()
                .allow(null)
                .messages({
                    'number.base': 'Số phòng phải là số',
                    'number.integer': 'Số phòng phải là số nguyên'
                }),

            ma_chuyen_khoa_phong_kham: Joi.string()
                .uuid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã chuyên khoa không hợp lệ'
                }),

            ma_loai_phong_kham: Joi.string()
                .uuid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã loại phòng không hợp lệ'
                }),

            trang_thai_phong_kham: Joi.number()
                .valid(0, 1)
                .default(1)
                .messages({
                    'any.only': 'Trạng thái không hợp lệ (0: Không hoạt động, 1: Hoạt động)'
                })
        });
    }

    // Validate cập nhật phòng khám
    static updateRoom() {
        return Joi.object({
            ten_phong_kham: Joi.string()
                .max(100)
                .messages({
                    'string.max': 'Tên phòng khám không được quá 100 ký tự'
                }),

            so_phong_kham: Joi.number()
                .integer()
                .allow(null)
                .messages({
                    'number.base': 'Số phòng phải là số',
                    'number.integer': 'Số phòng phải là số nguyên'
                }),

            ma_chuyen_khoa_phong_kham: Joi.string()
                .uuid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã chuyên khoa không hợp lệ'
                }),

            ma_loai_phong_kham: Joi.string()
                .uuid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã loại phòng không hợp lệ'
                }),

            trang_thai_phong_kham: Joi.number()
                .valid(0, 1)
                .messages({
                    'any.only': 'Trạng thái không hợp lệ (0: Không hoạt động, 1: Hoạt động)'
                })
        }).min(1).messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        });
    }

    // Validate query params
    static queryRooms() {
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

            specialtyId: Joi.string()
                .uuid()
                .allow(null, ''),

            roomTypeId: Joi.string()
                .uuid()
                .allow(null, ''),

            status: Joi.number()
                .valid(0, 1)
                .allow(null)
        });
    }
}

module.exports = RoomValidator;