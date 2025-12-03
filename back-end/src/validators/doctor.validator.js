const Joi = require('joi');

class DoctorValidator {
    // Validate tạo chức vụ
    static createPosition() {
        return Joi.object({
            ten_chuc_vu: Joi.string()
                .required()
                .max(100)
                .messages({
                    'string.empty': 'Tên chức vụ không được để trống',
                    'string.max': 'Tên chức vụ không được quá 100 ký tự',
                    'any.required': 'Tên chức vụ là bắt buộc'
                }),

            dang_hoat_dong_chuc_vu: Joi.number()
                .valid(0, 1)
                .default(1)
                .messages({
                    'any.only': 'Trạng thái không hợp lệ (0: Không hoạt động, 1: Hoạt động)'
                })
        });
    }

    // Validate cập nhật chức vụ
    static updatePosition() {
        return Joi.object({
            ten_chuc_vu: Joi.string()
                .max(100)
                .messages({
                    'string.max': 'Tên chức vụ không được quá 100 ký tự'
                }),

            dang_hoat_dong_chuc_vu: Joi.number()
                .valid(0, 1)
                .messages({
                    'any.only': 'Trạng thái không hợp lệ (0: Không hoạt động, 1: Hoạt động)'
                })
        }).min(1).messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        });
    }

    // Validate tạo bác sĩ
    static createDoctor() {
        return Joi.object({
            ma_nguoi_dung_bac_si: Joi.string()
                .uuid()
                .required()
                .messages({
                    'string.guid': 'Mã người dùng không hợp lệ',
                    'any.required': 'Mã người dùng là bắt buộc'
                }),

            ma_chuc_vu_bac_si: Joi.string()
                .uuid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã chức vụ không hợp lệ'
                }),

            bang_cap_bac_si: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Bằng cấp phải là chuỗi base64'
                }),

            so_nam_kinh_nghiem_bac_si: Joi.number()
                .integer()
                .min(0)
                .default(0)
                .messages({
                    'number.base': 'Số năm kinh nghiệm phải là số',
                    'number.integer': 'Số năm kinh nghiệm phải là số nguyên',
                    'number.min': 'Số năm kinh nghiệm phải lớn hơn hoặc bằng 0'
                }),

            dang_hoat_dong_bac_si: Joi.number()
                .valid(0, 1)
                .default(1)
                .messages({
                    'any.only': 'Trạng thái không hợp lệ (0: Không hoạt động, 1: Hoạt động)'
                })
        });
    }

    // Validate cập nhật bác sĩ
    static updateDoctor() {
        return Joi.object({
            ma_chuc_vu_bac_si: Joi.string()
                .uuid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã chức vụ không hợp lệ'
                }),

            bang_cap_bac_si: Joi.string()
                .allow('', null)
                .messages({
                    'string.base': 'Bằng cấp phải là chuỗi base64'
                }),

            so_nam_kinh_nghiem_bac_si: Joi.number()
                .integer()
                .min(0)
                .messages({
                    'number.base': 'Số năm kinh nghiệm phải là số',
                    'number.integer': 'Số năm kinh nghiệm phải là số nguyên',
                    'number.min': 'Số năm kinh nghiệm phải lớn hơn hoặc bằng 0'
                }),

            dang_hoat_dong_bac_si: Joi.number()
                .valid(0, 1)
                .messages({
                    'any.only': 'Trạng thái không hợp lệ (0: Không hoạt động, 1: Hoạt động)'
                })
        }).min(1).messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        });
    }

    // Validate query params
    static queryDoctors() {
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

            status: Joi.number()
                .valid(0, 1)
                .allow(null),

            positionId: Joi.string()
                .uuid()
                .allow(null, '')
        });
    }

    // Validate query ratings
    static queryRatings() {
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
}

module.exports = DoctorValidator;