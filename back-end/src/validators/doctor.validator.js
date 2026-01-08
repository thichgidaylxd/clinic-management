const Joi = require('joi');

class DoctorValidator {
    // Validate query parameters
    static query() {
        return Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),
            search: Joi.string().trim().allow('', null),
            status: Joi.number().integer().valid(0, 1).allow(null),
            positionId: Joi.string().uuid().allow('', null)
        });
    }

    // Validate tạo bác sĩ (tạo cả User + Doctor)
    static create() {
        return Joi.object({
            // Thông tin User
            ten_nguoi_dung: Joi.string()
                .trim()
                .min(1)
                .max(50)
                .required()
                .messages({
                    'string.empty': 'Tên không được để trống',
                    'string.min': 'Tên phải có ít nhất 1 ký tự',
                    'string.max': 'Tên không được vượt quá 50 ký tự',
                    'any.required': 'Tên là bắt buộc'
                }),
            ho_nguoi_dung: Joi.string()
                .trim()
                .min(1)
                .max(50)
                .required()
                .messages({
                    'string.empty': 'Họ không được để trống',
                    'string.min': 'Họ phải có ít nhất 1 ký tự',
                    'string.max': 'Họ không được vượt quá 50 ký tự',
                    'any.required': 'Họ là bắt buộc'
                }),
            //  Doctor fields
            chuyen_khoa_ids: Joi.array()
                .items(Joi.string())
                .min(1)
                .required()
                .messages({
                    'array.min': 'Phải chọn ít nhất 1 chuyên khoa',
                    'any.required': 'Chuyên khoa là bắt buộc'
                }),
            ten_dang_nhap_nguoi_dung: Joi.string()
                .trim()
                .min(3)
                .max(50)
                .pattern(/^[a-zA-Z0-9_]+$/)
                .required()
                .messages({
                    'string.empty': 'Tên đăng nhập không được để trống',
                    'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
                    'string.max': 'Tên đăng nhập không được vượt quá 50 ký tự',
                    'string.pattern.base': 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới',
                    'any.required': 'Tên đăng nhập là bắt buộc'
                }),
            email_nguoi_dung: Joi.string()
                .trim()
                .email()
                .required()
                .messages({
                    'string.empty': 'Email không được để trống',
                    'string.email': 'Email không hợp lệ',
                    'any.required': 'Email là bắt buộc'
                }),
            so_dien_thoai_nguoi_dung: Joi.string()
                .trim()
                .pattern(/^[0-9]{10}$/)
                .required()
                .messages({
                    'string.empty': 'Số điện thoại không được để trống',
                    'string.pattern.base': 'Số điện thoại phải có 10 chữ số',
                    'any.required': 'Số điện thoại là bắt buộc'
                }),
            mat_khau_nguoi_dung: Joi.string()
                .min(6)
                .required()
                .messages({
                    'string.empty': 'Mật khẩu không được để trống',
                    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
                    'any.required': 'Mật khẩu là bắt buộc'
                }),
            gioi_tinh_nguoi_dung: Joi.number()
                .integer()
                .valid(0, 1, 2)
                .default(1)
                .messages({
                    'number.base': 'Giới tính phải là số',
                    'any.only': 'Giới tính phải là 0 (Nữ), 1 (Nam) hoặc 2 (Khác)'
                }),

            // Thông tin Bác sĩ
            ma_chuyen_khoa_bac_si: Joi.string()
                .uuid()
                .allow('', null)
                .messages({
                    'string.guid': 'ID chuyên khoa không hợp lệ'
                }),
            ma_chuc_vu_bac_si: Joi.string()
                .uuid()
                .allow('', null)
                .messages({
                    'string.guid': 'ID chức vụ không hợp lệ'
                }),
            so_nam_kinh_nghiem_bac_si: Joi.number()
                .integer()
                .min(0)
                .max(100)
                .allow(null)
                .messages({
                    'number.base': 'Số năm kinh nghiệm phải là số',
                    'number.min': 'Số năm kinh nghiệm phải lớn hơn hoặc bằng 0',
                    'number.max': 'Số năm kinh nghiệm không được vượt quá 100'
                }),

            dang_hoat_dong_bac_si: Joi.number()
                .integer()
                .valid(0, 1)
                .default(1)
                .messages({
                    'number.base': 'Trạng thái phải là số',
                    'any.only': 'Trạng thái phải là 0 hoặc 1'
                })
        });
    }

    // Validate cập nhật bác sĩ
    static update() {
        return Joi.object({
            // Có thể update thông tin User
            ten_nguoi_dung: Joi.string()
                .trim()
                .min(1)
                .max(50)
                .messages({
                    'string.min': 'Tên phải có ít nhất 1 ký tự',
                    'string.max': 'Tên không được vượt quá 50 ký tự'
                }),
            ho_nguoi_dung: Joi.string()
                .trim()
                .min(1)
                .max(50)
                .messages({
                    'string.min': 'Họ phải có ít nhất 1 ký tự',
                    'string.max': 'Họ không được vượt quá 50 ký tự'
                }),
            email_nguoi_dung: Joi.string()
                .trim()
                .email()
                .messages({
                    'string.email': 'Email không hợp lệ'
                }),
            so_dien_thoai_nguoi_dung: Joi.string()
                .trim()
                .pattern(/^[0-9]{10}$/)
                .messages({
                    'string.pattern.base': 'Số điện thoại phải có 10 chữ số'
                }),
            gioi_tinh_nguoi_dung: Joi.number()
                .integer()
                .valid(0, 1, 2)
                .messages({
                    'any.only': 'Giới tính phải là 0, 1 hoặc 2'
                }),

            // Thông tin Bác sĩ
            ma_chuyen_khoa_bac_si: Joi.string()
                .uuid()
                .allow('', null)
                .messages({
                    'string.guid': 'ID chuyên khoa không hợp lệ'
                }),
            ma_chuc_vu_bac_si: Joi.string()
                .uuid()
                .allow('', null)
                .messages({
                    'string.guid': 'ID chức vụ không hợp lệ'
                }),
            //  Doctor fields
            chuyen_khoa_ids: Joi.array()
                .items(Joi.string())
                .min(1)
                .required()
                .messages({
                    'array.min': 'Phải chọn ít nhất 1 chuyên khoa',
                    'any.required': 'Chuyên khoa là bắt buộc'
                }),
            so_nam_kinh_nghiem_bac_si: Joi.number()
                .integer()
                .min(0)
                .max(100)
                .allow(null)
                .messages({
                    'number.base': 'Số năm kinh nghiệm phải là số',
                    'number.min': 'Số năm kinh nghiệm phải lớn hơn hoặc bằng 0',
                    'number.max': 'Số năm kinh nghiệm không được vượt quá 100'
                }),
            dang_hoat_dong_bac_si: Joi.number()
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

module.exports = DoctorValidator;