const PatientModel = require('../models/patient.model');

class PatientService {
    // Tạo bệnh nhân mới
    static async create(patientData) {
        const { so_dien_thoai_benh_nhan } = patientData;

        // Kiểm tra số điện thoại đã tồn tại (nếu có)
        if (so_dien_thoai_benh_nhan) {
            const exists = await PatientModel.existsByPhone(so_dien_thoai_benh_nhan);
            if (exists) {
                throw new Error('Số điện thoại đã được đăng ký cho bệnh nhân khác');
            }
        }

        // Xử lý hình ảnh base64 nếu có
        if (patientData.hinh_anh_benh_nhan) {
            const base64Data = patientData.hinh_anh_benh_nhan.replace(/^data:.*?;base64,/, '');
            patientData.hinh_anh_benh_nhan = Buffer.from(base64Data, 'base64');
        }

        const patientId = await PatientModel.create(patientData);
        const patient = await PatientModel.findById(patientId);

        // Chuyển BLOB sang base64
        if (patient.hinh_anh_benh_nhan) {
            patient.hinh_anh_benh_nhan = patient.hinh_anh_benh_nhan.toString('base64');
        }

        // Tính BMI nếu có chiều cao và cân nặng
        if (patient.chieu_cao_benh_nhan && patient.can_nang_benh_nhan) {
            patient.bmi_info = PatientModel.calculateBMI(
                patient.chieu_cao_benh_nhan,
                patient.can_nang_benh_nhan
            );
        }

        return patient;
    }

    // Lấy danh sách bệnh nhân
    static async getAll(page, limit, search, gender) {
        const result = await PatientModel.findAll(page, limit, search, gender);

        // Chuyển BLOB sang base64 và tính BMI
        result.data = result.data.map(patient => {
            const patientData = {
                ...patient,
                hinh_anh_benh_nhan: patient.hinh_anh_benh_nhan
                    ? patient.hinh_anh_benh_nhan.toString('base64')
                    : null
            };

            // Tính BMI
            if (patient.chieu_cao_benh_nhan && patient.can_nang_benh_nhan) {
                patientData.bmi_info = PatientModel.calculateBMI(
                    patient.chieu_cao_benh_nhan,
                    patient.can_nang_benh_nhan
                );
            }

            return patientData;
        });

        return result;
    }

    // Lấy thông tin bệnh nhân theo ID
    static async getById(patientId) {
        const patient = await PatientModel.findById(patientId);
        if (!patient) {
            throw new Error('Không tìm thấy bệnh nhân');
        }

        // Chuyển BLOB sang base64
        if (patient.hinh_anh_benh_nhan) {
            patient.hinh_anh_benh_nhan = patient.hinh_anh_benh_nhan.toString('base64');
        }

        // Tính BMI
        if (patient.chieu_cao_benh_nhan && patient.can_nang_benh_nhan) {
            patient.bmi_info = PatientModel.calculateBMI(
                patient.chieu_cao_benh_nhan,
                patient.can_nang_benh_nhan
            );
        }

        return patient;
    }

    // Tìm bệnh nhân theo số điện thoại
    static async findByPhone(phone) {
        const patient = await PatientModel.findByPhone(phone);
        if (!patient) {
            throw new Error('Không tìm thấy bệnh nhân với số điện thoại này');
        }

        // Tính BMI
        if (patient.chieu_cao_benh_nhan && patient.can_nang_benh_nhan) {
            patient.bmi_info = PatientModel.calculateBMI(
                patient.chieu_cao_benh_nhan,
                patient.can_nang_benh_nhan
            );
        }

        return patient;
    }

    // Cập nhật bệnh nhân
    static async update(patientId, updateData) {
        const patient = await PatientModel.findById(patientId);
        if (!patient) {
            throw new Error('Không tìm thấy bệnh nhân');
        }

        // Kiểm tra số điện thoại mới có trùng không
        if (updateData.so_dien_thoai_benh_nhan) {
            const exists = await PatientModel.existsByPhone(
                updateData.so_dien_thoai_benh_nhan,
                patientId
            );
            if (exists) {
                throw new Error('Số điện thoại đã được đăng ký cho bệnh nhân khác');
            }
        }

        // Xử lý hình ảnh base64 nếu có
        if (updateData.hinh_anh_benh_nhan) {
            const base64Data = updateData.hinh_anh_benh_nhan.replace(/^data:.*?;base64,/, '');
            updateData.hinh_anh_benh_nhan = Buffer.from(base64Data, 'base64');
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

        // Kiểm tra bệnh nhân có đang được sử dụng không
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

    // Lấy lịch sử khám bệnh
    static async getMedicalHistory(patientId, page, limit) {
        const patient = await PatientModel.findById(patientId);
        if (!patient) {
            throw new Error('Không tìm thấy bệnh nhân');
        }

        return await PatientModel.getMedicalHistory(patientId, page, limit);
    }

    // Lấy lịch hẹn của bệnh nhân
    static async getAppointments(patientId, page, limit, status) {
        const patient = await PatientModel.findById(patientId);
        if (!patient) {
            throw new Error('Không tìm thấy bệnh nhân');
        }

        return await PatientModel.getAppointments(patientId, page, limit, status);
    }

    // Thống kê bệnh nhân theo giới tính
    static async getStatsByGender() {
        return await PatientModel.getStatsByGender();
    }

    // Lấy bệnh nhân mới nhất
    static async getRecentPatients(limit = 10) {
        return await PatientModel.getRecentPatients(limit);
    }

    // Tạo hoặc lấy bệnh nhân theo SĐT (cho chức năng đặt lịch)
    static async findOrCreate(patientData) {
        const { so_dien_thoai_benh_nhan } = patientData;

        if (!so_dien_thoai_benh_nhan) {
            throw new Error('Số điện thoại là bắt buộc');
        }

        // Tìm theo SĐT
        let patient = await PatientModel.findByPhone(so_dien_thoai_benh_nhan);

        // Nếu chưa có → Tạo mới
        if (!patient) {
            const patientId = await PatientModel.create({
                ten_benh_nhan: patientData.ten_benh_nhan,
                so_dien_thoai_benh_nhan: patientData.so_dien_thoai_benh_nhan,
                gioi_tinh_benh_nhan: patientData.gioi_tinh_benh_nhan || null
                // Không tạo: chieu_cao, can_nang, hinh_anh (sẽ bổ sung sau)
            });
            patient = await PatientModel.findById(patientId);
        }

        return patient;
    }
}

module.exports = PatientService;