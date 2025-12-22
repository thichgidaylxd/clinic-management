const Joi = require('joi');

class PrescriptionValidator {
    /**
     * Validate kê đơn thuốc (đầy đủ với hồ sơ)
     */
    static create() {
        return Joi.object({
            ma_lich_hen: Joi.string()
                .guid()
                .required()
                .messages({
                    'string.guid': 'Mã lịch hẹn không hợp lệ',
                    'any.required': 'Mã lịch hẹn là bắt buộc'
                }),

            ma_bac_si: Joi.string()
                .guid()
                .required()
                .messages({
                    'string.guid': 'Mã bác sĩ không hợp lệ',
                    'any.required': 'Mã bác sĩ là bắt buộc'
                }),


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
                }),

            // Medicines
            medicines: Joi.array()
                .items(
                    Joi.object({
                        ma_thuoc: Joi.string()
                            .guid()
                            .required()
                            .messages({
                                'string.guid': 'Mã thuốc không hợp lệ',
                                'any.required': 'Mã thuốc là bắt buộc'
                            }),

                        so_luong: Joi.number()
                            .integer()
                            .min(1)
                            .required()
                            .messages({
                                'number.base': 'Số lượng phải là số',
                                'number.integer': 'Số lượng phải là số nguyên',
                                'number.min': 'Số lượng phải lớn hơn 0',
                                'any.required': 'Số lượng là bắt buộc'
                            }),

                        ghi_chu: Joi.string()
                            .max(1000)
                            .allow(null, '')
                            .messages({
                                'string.max': 'Ghi chú không được quá 1000 ký tự'
                            })
                    })
                )
                .min(1)
                .required()
                .messages({
                    'array.min': 'Phải có ít nhất 1 loại thuốc',
                    'any.required': 'Danh sách thuốc là bắt buộc'
                }),

            ghi_chu_hoa_don: Joi.string()
                .max(1000)
                .allow(null, '')
                .messages({
                    'string.max': 'Ghi chú hóa đơn không được quá 1000 ký tự'
                }),
            chi_phi_phat_sinh: Joi.number()
                .min(0)
                .default(0)
                .messages({
                    'number.base': 'Chi phí phát sinh phải là số',
                    'number.min': 'Chi phí phát sinh không được âm'
                }),

        });
    }

    /**
     * Validate kê đơn thuốc (chỉ thuốc, không hồ sơ)
     */
    static createMedicineOnly() {
        return Joi.object({
            ma_lich_hen: Joi.string()
                .guid()
                .required()
                .messages({
                    'string.guid': 'Mã lịch hẹn không hợp lệ',
                    'any.required': 'Mã lịch hẹn là bắt buộc'
                }),

            ma_bac_si: Joi.string()
                .guid()
                .required()
                .messages({
                    'string.guid': 'Mã bác sĩ không hợp lệ',
                    'any.required': 'Mã bác sĩ là bắt buộc'
                }),

            medicines: Joi.array()
                .items(
                    Joi.object({
                        ma_thuoc: Joi.string().guid().required(),
                        so_luong: Joi.number().integer().min(1).required(),
                        ghi_chu: Joi.string().max(1000).allow(null, '')
                    })
                )
                .min(1)
                .required()
                .messages({
                    'array.min': 'Phải có ít nhất 1 loại thuốc',
                    'any.required': 'Danh sách thuốc là bắt buộc'
                }),

            ghi_chu_hoa_don: Joi.string()
                .max(1000)
                .allow(null, '')
        });
    }

    /**
     * Validate thanh toán
     */
    static payment() {
        return Joi.object({
            ma_phuong_thuc_thanh_toan: Joi.string()
                .guid()
                .allow(null)
                .messages({
                    'string.guid': 'Mã phương thức thanh toán không hợp lệ'
                })
        });
    }

    /**
     * Validate check stock
     */
    static checkStock() {
        return Joi.object({
            medicines: Joi.array()
                .items(
                    Joi.object({
                        ma_thuoc: Joi.string().guid().required(),
                        so_luong: Joi.number().integer().min(1).required()
                    })
                )
                .min(1)
                .required()
                .messages({
                    'array.min': 'Phải có ít nhất 1 loại thuốc',
                    'any.required': 'Danh sách thuốc là bắt buộc'
                })
        });
    }
}

module.exports = PrescriptionValidator;