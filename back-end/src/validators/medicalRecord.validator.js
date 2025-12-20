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
            trieu_chung: Joi.string().max(5000).allow(null, ''),
            chuan_doan: Joi.string().max(5000).allow(null, ''),
            phuong_phap_dieu_tri: Joi.string().max(5000).allow(null, '')
        }).min(1).messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        });
    }
}

module.exports = MedicalRecordValidator;