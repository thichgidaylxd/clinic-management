const Joi = require('joi');

class AuthValidator {
    // Validate đăng ký
    static register() {
        return Joi.object({
            ten_nguoi_dung: Joi.string().required().max(100).messages({
                'string.empty': 'Tên không được để trống',
                'string.max': 'Tên không được quá 100 ký tự',
                'any.required': 'Tên là bắt buộc'
            }),

            ho_nguoi_dung: Joi.string().allow('').max(50).messages({
                'string.max': 'Họ không được quá 50 ký tự'
            }),

            ten_dang_nhap_nguoi_dung: Joi.string()
                .alphanum()
                .min(3)
                .max(20)
                .required()
                .messages({
                    'string.empty': 'Tên đăng nhập không được để trống',
                    'string.alphanum': 'Tên đăng nhập chỉ chứa chữ và số',
                    'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
                    'string.max': 'Tên đăng nhập không được quá 20 ký tự',
                    'any.required': 'Tên đăng nhập là bắt buộc'
                }),

            mat_khau_nguoi_dung: Joi.string()
                .min(6)
                .required()
                .messages({
                    'string.empty': 'Mật khẩu không được để trống',
                    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
                    'any.required': 'Mật khẩu là bắt buộc'
                }),

            email_nguoi_dung: Joi.string()
                .email()
                .max(50)
                .messages({
                    'string.email': 'Email không hợp lệ',
                    'string.max': 'Email không được quá 50 ký tự'
                }),

            so_dien_thoai_nguoi_dung: Joi.string()
                .pattern(/^[0-9]{10}$/)
                .messages({
                    'string.pattern.base': 'Số điện thoại phải có 10 chữ số'
                }),

            gioi_tinh_nguoi_dung: Joi.number()
                .valid(0, 1, 2)
                .messages({
                    'any.only': 'Giới tính không hợp lệ (0: Nữ, 1: Nam, 2: Khác)'
                }),

            dia_chi_nguoi_dung: Joi.string().allow(''),

            ma_vai_tro: Joi.string().uuid().messages({
                'string.guid': 'Mã vai trò không hợp lệ'
            })
        });
    }

    // Validate đăng nhập
    static login() {
        return Joi.object({
            ten_dang_nhap_nguoi_dung: Joi.string().required().messages({
                'string.empty': 'Tên đăng nhập không được để trống',
                'any.required': 'Tên đăng nhập là bắt buộc'
            }),

            mat_khau_nguoi_dung: Joi.string().required().messages({
                'string.empty': 'Mật khẩu không được để trống',
                'any.required': 'Mật khẩu là bắt buộc'
            })
        });
    }

    // Validate refresh token
    static refreshToken() {
        return Joi.object({
            refresh_token: Joi.string().required().messages({
                'string.empty': 'Refresh token không được để trống',
                'any.required': 'Refresh token là bắt buộc'
            })
        });
    }
}

module.exports = AuthValidator;