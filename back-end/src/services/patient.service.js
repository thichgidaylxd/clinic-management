const PatientModel = require('../models/patient.model');

class PatientService {
    // Tạo bệnh nhân mới
    static async create(patientData) {
        const { so_dien_thoai_benh_nhan } = patientData;

        // Kiểm tra số điện thoại đã tồn tại
        if (so_dien_thoai_benh_nhan) {
            const exists = await PatientModel.existsByPhone(so_dien_thoai_benh_nhan);
            if (exists) {
                throw new Error('Số điện thoại đã được đăng ký cho bệnh nhân khác');
            }
        }


        const patientId = await PatientModel.create(patientData);
        const patient = await PatientModel.findById(patientId);


        return patient;
    }

    // Lấy danh sách bệnh nhân
    static async getAll(page, limit, search, gender) {
        const result = await PatientModel.findAll(page, limit, search, gender);

        result.data = result.data.map(patient => ({
            ...patient
        }));

        return result;
    }

    // Lấy bệnh nhân theo ID
    static async getById(patientId) {
        const patient = await PatientModel.findById(patientId);
        if (!patient) {
            throw new Error('Không tìm thấy bệnh nhân');
        }


        return patient;
    }

    // Tìm bệnh nhân theo số điện thoại
    static async findByPhone(phone) {
        const patient = await PatientModel.findByPhone(phone);
        if (!patient) {
            throw new Error('Không tìm thấy bệnh nhân với số điện thoại này');
        }
        return patient;
    }

    // Cập nhật bệnh nhân
    static async update(patientId, updateData) {
        const patient = await PatientModel.findById(patientId);
        if (!patient) {
            throw new Error('Không tìm thấy bệnh nhân');
        }

        if (updateData.so_dien_thoai_benh_nhan) {
            const exists = await PatientModel.existsByPhone(
                updateData.so_dien_thoai_benh_nhan,
                patientId
            );
            if (exists) {
                throw new Error('Số điện thoại đã được đăng ký cho bệnh nhân khác');
            }
        }

        const updated = await PatientModel.update(patientId, updateData);
        if (!updated) {
            throw new Error('Cập nhật bệnh nhân thất bại');
        }

        return await this.getById(patientId);
    }

    // Xóa bệnh nhân
    static async delete(patientId) {
        const patient = await PatientModel.findById(patientId);
        if (!patient) {
            throw new Error('Không tìm thấy bệnh nhân');
        }

        const inUse = await PatientModel.isInUse(patientId);
        if (inUse) {
            throw new Error('Không thể xóa bệnh nhân đã có lịch hẹn hoặc hồ sơ bệnh án');
        }

        const deleted = await PatientModel.delete(patientId);
        if (!deleted) {
            throw new Error('Xóa bệnh nhân thất bại');
        }

        return true;
    }

    // Lịch sử khám
    static async getMedicalHistory(patientId, page, limit) {
        const patient = await PatientModel.findById(patientId);
        if (!patient) {
            throw new Error('Không tìm thấy bệnh nhân');
        }

        return await PatientModel.getMedicalHistory(patientId, page, limit);
    }

    // Lịch hẹn
    static async getAppointments(patientId, page, limit, status) {
        const patient = await PatientModel.findById(patientId);
        if (!patient) {
            throw new Error('Không tìm thấy bệnh nhân');
        }

        return await PatientModel.getAppointments(patientId, page, limit, status);
    }

    // Thống kê
    static async getStatsByGender() {
        return await PatientModel.getStatsByGender();
    }

    static async getRecentPatients(limit = 10) {
        return await PatientModel.getRecentPatients(limit);
    }

    // Tìm hoặc tạo bệnh nhân (đặt lịch)
    static async findOrCreate(patientData) {
        const {
            ten_benh_nhan,
            ho_benh_nhan,
            so_dien_thoai_benh_nhan,
            email_benh_nhan,
            ngay_sinh_benh_nhan,
            gioi_tinh_benh_nhan,
            ma_nguoi_dung_benh_nhan
        } = patientData;

        let patient = await PatientModel.findByPhone(so_dien_thoai_benh_nhan);
        if (patient) return patient;

        const patientId = await PatientModel.create({
            ten_benh_nhan,
            ho_benh_nhan,
            so_dien_thoai_benh_nhan,
            email_benh_nhan,
            ngay_sinh_benh_nhan,
            gioi_tinh_benh_nhan,
            ma_nguoi_dung_benh_nhan
        });

        return await PatientModel.findById(patientId);
    }
}

module.exports = PatientService;
