//Hồ sơ bệnh án

const MedicalRecordModel = require('../models/medicalRecordModel');
const db = require('../config/database'); // ← THÊM DÒNG NÀY
class MedicalRecordService {
    /**
     * Tạo hồ sơ bệnh án mới
     */
    static async create(data) {
        const {
            ma_benh_nhan,
            ma_bac_si,
            ma_chuyen_khoa,
            trieu_chung,
            chuan_doan,
            phuong_phap_dieu_tri
        } = data;

        // Validate required fields
        if (!ma_benh_nhan || !ma_bac_si) {
            throw new Error('Thiếu thông tin bắt buộc');
        }

        if (!chuan_doan || !chuan_doan.trim()) {
            throw new Error('Chẩn đoán không được để trống');
        }

        // Create record
        const recordData = {
            ma_benh_nhan,
            ma_bac_si,
            ma_chuyen_khoa,
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
            throw new Error('Không tìm thấy hồ sơ bệnh án');
        }

        return record;
    }
    /**
         * Lấy ma_bac_si từ ma_nguoi_dung
         * @param {string} ma_nguoi_dung
         * @returns {string} ma_bac_si (UUID string)
         */
    static async getDoctorIdByUserId(ma_nguoi_dung) {
        if (!ma_nguoi_dung) {
            throw new ApiError(401, 'Không có thông tin người dùng');
        }

        const query = `
            SELECT BIN_TO_UUID(ma_bac_si) as ma_bac_si 
            FROM bang_bac_si 
            WHERE ma_nguoi_dung_bac_si = UUID_TO_BIN(?)
            LIMIT 1
        `;

        const [rows] = await db.execute(query, [ma_nguoi_dung]);

        if (!rows[0]?.ma_bac_si) {
            throw new ApiError(404, 'Không tìm thấy thông tin bác sĩ');
        }

        return rows[0].ma_bac_si;
    }

    /**
     * Lấy danh sách hồ sơ của bác sĩ hiện tại
     */
    static async getAllForDoctor(ma_nguoi_dung, { page = 1, limit = 10, search = '', specialty = 'all' } = {}) {
        // Bước 1: Lấy ma_bac_si từ ma_nguoi_dung (business logic ở đây)
        const doctorId = await this.getDoctorIdByUserId(ma_nguoi_dung);

        // Bước 2: Gọi model để lấy hồ sơ
        return await MedicalRecordModel.getAllForDoctor(doctorId, {
            page: parseInt(page),
            limit: parseInt(limit),
            search,
            specialty
        });
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
            throw new Error('Không tìm thấy hồ sơ bệnh án');
        }

        // Update
        const updated = await MedicalRecordModel.update(recordId, updateData);

        if (!updated) {
            throw new Error(500, 'Cập nhật thất bại');
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
            throw new Error('Không tìm thấy hồ sơ bệnh án');
        }

        const deleted = await MedicalRecordModel.delete(recordId);

        if (!deleted) {
            throw new Error(500, 'Xóa thất bại');
        }

        return true;
    }
}

module.exports = MedicalRecordService;