const Joi = require('joi');

class MedicalRecordValidator {
    /**
     * Validate tạo hồ sơ bệnh án
     */
    static create() {
        return Joi.object({
            ma_benh_nhan: Joi.string()
                .guid()
                .required()
                .messages({
                    'string.guid': 'Mã bệnh nhân không hợp lệ',
                    'any.required': 'Mã bệnh nhân là bắt buộc'
                }),

            ma_bac_si: Joi.string()
                .guid()
                .required()
                .messages({
                    'string.guid': 'Mã bác sĩ không hợp lệ',
                    'any.required': 'Mã bác sĩ là bắt buộc'
                }),

            ma_chuyen_khoa: Joi.string()
                .guid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã chuyên khoa không hợp lệ'
                }),

            // Sinh hiệu
            chieu_cao: Joi.number()
                .min(0)
                .max(300)
                .allow(null)
                .messages({
                    'number.min': 'Chiều cao phải lớn hơn 0',
                    'number.max': 'Chiều cao không hợp lệ'
                }),

            can_nang: Joi.number()
                .min(0)
                .max(500)
                .allow(null)
                .messages({
                    'number.min': 'Cân nặng phải lớn hơn 0',
                    'number.max': 'Cân nặng không hợp lệ'
                }),

            huyet_ap: Joi.number()
                .min(0)
                .max(300)
                .allow(null)
                .messages({
                    'number.min': 'Huyết áp phải lớn hơn 0',
                    'number.max': 'Huyết áp không hợp lệ'
                }),

            nhiet_do: Joi.number()
                .min(30)
                .max(45)
                .allow(null)
                .messages({
                    'number.min': 'Nhiệt độ không hợp lệ',
                    'number.max': 'Nhiệt độ không hợp lệ'
                }),

            nhip_tim: Joi.number()
                .min(0)
                .max(300)
                .allow(null)
                .messages({
                    'number.min': 'Nhịp tim phải lớn hơn 0',
                    'number.max': 'Nhịp tim không hợp lệ'
                }),

            // Thông tin khám
            trieu_chung: Joi.string()
                .max(5000)
                .allow(null, '')
                .messages({
                    'string.max': 'Triệu chứng không được quá 5000 ký tự'
                }),

            chuan_doan: Joi.string()
                .required()
                .max(5000)
                .messages({
                    'string.empty': 'Chẩn đoán không được để trống',
                    'string.max': 'Chẩn đoán không được quá 5000 ký tự',
                    'any.required': 'Chẩn đoán là bắt buộc'
                }),

            phuong_phap_dieu_tri: Joi.string()
                .max(5000)
                .allow(null, '')
                .messages({
                    'string.max': 'Phương pháp điều trị không được quá 5000 ký tự'
                })
        });
    }

    /**
     * Validate cập nhật hồ sơ
     */
    static update() {
        return Joi.object({
            chieu_cao: Joi.number().min(0).max(300).allow(null),
            can_nang: Joi.number().min(0).max(500).allow(null),
            huyet_ap: Joi.number().min(0).max(300).allow(null),
            nhiet_do: Joi.number().min(30).max(45).allow(null),
            nhip_tim: Joi.number().min(0).max(300).allow(null),
            trieu_chung: Joi.string().max(5000).allow(null, ''),
            chuan_doan: Joi.string().max(5000).allow(null, ''),
            phuong_phap_dieu_tri: Joi.string().max(5000).allow(null, '')
        }).min(1).messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        });
    }
}

module.exports = MedicalRecordValidator;