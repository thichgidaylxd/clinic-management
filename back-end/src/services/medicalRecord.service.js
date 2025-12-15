//Hồ sơ bệnh án

const MedicalRecordModel = require('../models/medicalRecord.model');
const ApiError = require('../utils/ApiError');

class MedicalRecordService {
    /**
     * Tạo hồ sơ bệnh án mới
     */
    static async create(data) {
        const {
            ma_benh_nhan,
            ma_bac_si,
            ma_chuyen_khoa,
            chieu_cao,
            can_nang,
            huyet_ap,
            nhiet_do,
            nhip_tim,
            trieu_chung,
            chuan_doan,
            phuong_phap_dieu_tri
        } = data;

        // Validate required fields
        if (!ma_benh_nhan || !ma_bac_si) {
            throw new ApiError(400, 'Thiếu thông tin bắt buộc');
        }

        if (!chuan_doan || !chuan_doan.trim()) {
            throw new ApiError(400, 'Chẩn đoán không được để trống');
        }

        // Create record
        const recordData = {
            ma_benh_nhan,
            ma_bac_si,
            ma_chuyen_khoa,
            chieu_cao,
            can_nang,
            huyet_ap,
            nhiet_do,
            nhip_tim,
            trieu_chung,
            chuan_doan,
            phuong_phap_dieu_tri
        };

        const ma_ho_so_benh_an = await MedicalRecordModel.create(recordData);

        // Get full details
        const record = await MedicalRecordModel.findById(ma_ho_so_benh_an);

        return record;
    }

    /**
     * Lấy hồ sơ bệnh án theo ID
     */
    static async getById(recordId) {
        const record = await MedicalRecordModel.findById(recordId);

        if (!record) {
            throw new ApiError(404, 'Không tìm thấy hồ sơ bệnh án');
        }

        return record;
    }

    /**
     * Lấy hồ sơ bệnh án theo bệnh nhân
     */
    static async getByPatient(patientId, page, limit) {
        return await MedicalRecordModel.findByPatient(patientId, page, limit);
    }

    /**
     * Cập nhật hồ sơ bệnh án
     */
    static async update(recordId, updateData) {
        // Check exists
        const record = await MedicalRecordModel.findById(recordId);
        if (!record) {
            throw new ApiError(404, 'Không tìm thấy hồ sơ bệnh án');
        }

        // Update
        const updated = await MedicalRecordModel.update(recordId, updateData);

        if (!updated) {
            throw new ApiError(500, 'Cập nhật thất bại');
        }

        // Get updated record
        return await MedicalRecordModel.findById(recordId);
    }

    /**
     * Xóa hồ sơ bệnh án
     */
    static async delete(recordId) {
        const record = await MedicalRecordModel.findById(recordId);
        if (!record) {
            throw new ApiError(404, 'Không tìm thấy hồ sơ bệnh án');
        }

        const deleted = await MedicalRecordModel.delete(recordId);

        if (!deleted) {
            throw new ApiError(500, 'Xóa thất bại');
        }

        return true;
    }
}

module.exports = MedicalRecordService;