const Joi = require('joi');

class UserValidator {
    static create() {
        return Joi.object({
            ten_nguoi_dung: Joi.string().required().messages({
                'string.empty': 'Tên không được để trống',
                'any.required': 'Tên là bắt buộc'
            }),
            ho_nguoi_dung: Joi.string().required().messages({
                'string.empty': 'Họ không được để trống',
                'any.required': 'Họ là bắt buộc'
            }),
            ten_dang_nhap_nguoi_dung: Joi.string().required().messages({
                'string.empty': 'Tên đăng nhập không được để trống',
                'any.required': 'Tên đăng nhập là bắt buộc'
            }),
            email_nguoi_dung: Joi.string().email().required().messages({
                'string.email': 'Email không hợp lệ',
                'any.required': 'Email là bắt buộc'
            }),
            so_dien_thoai_nguoi_dung: Joi.string()
                .pattern(/^\d{10}$/)
                .required()
                .messages({
                    'string.pattern.base': 'Số điện thoại phải có 10 chữ số',
                    'any.required': 'Số điện thoại là bắt buộc'
                }),
            mat_khau_nguoi_dung: Joi.string().min(6).required().messages({
                'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
                'any.required': 'Mật khẩu là bắt buộc'
            }),
            gioi_tinh_nguoi_dung: Joi.number().valid(0, 1, 2).default(0),
            ma_vai_tro: Joi.string().required().messages({
                'string.empty': 'Vai trò không được để trống',
                'any.required': 'Vai trò là bắt buộc'
            }),
            trang_thai_nguoi_dung: Joi.number().valid(0, 1).default(1)
        });
    }

    static update() {
        return Joi.object({
            ten_nguoi_dung: Joi.string(),
            ho_nguoi_dung: Joi.string(),
            email_nguoi_dung: Joi.string().email(),
            so_dien_thoai_nguoi_dung: Joi.string().pattern(/^\d{10}$/),
            gioi_tinh_nguoi_dung: Joi.number().valid(0, 1, 2),
            ma_vai_tro: Joi.string(),
            trang_thai_nguoi_dung: Joi.number().valid(0, 1)
        }).min(1);
    }

    static changePassword() {
        return Joi.object({
            mat_khau_cu: Joi.string().required().messages({
                'string.empty': 'Mật khẩu cũ không được để trống',
                'any.required': 'Mật khẩu cũ là bắt buộc'
            }),
            mat_khau_moi: Joi.string().min(6).required().messages({
                'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
                'any.required': 'Mật khẩu mới là bắt buộc'
            })
        });
    }
}

module.exports = UserValidator;