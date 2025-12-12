const AppointmentModel = require('../models/appointment.model');
const DoctorModel = require('../models/doctor.model');
const PatientModel = require('../models/patient.model');
const UserModel = require('../models/user.model');
const RoleModel = require('../models/role.model');
const bcrypt = require('bcrypt');
const CONSTANTS = require('../config/constants');

class ReceptionistService {
    // Dashboard stats
    static async getDashboardStats() {
        const stats = await AppointmentModel.getDashboardStats();
        return stats;
    }

    // Lấy lịch hẹn hôm nay
    static async getTodayAppointments(filters) {
        const appointments = await AppointmentModel.getTodayAppointments(filters);
        return appointments;
    }

    // Xác nhận lịch hẹn
    static async confirmAppointment(appointmentId, note) {
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new Error('Không tìm thấy lịch hẹn');
        }

        if (appointment.trang_thai_lich_hen !== CONSTANTS.APPOINTMENT_STATUS.PENDING) {
            throw new Error('Chỉ có thể xác nhận lịch hẹn đang chờ');
        }

        const confirmed = await AppointmentModel.confirm(appointmentId, note);
        if (!confirmed) {
            throw new Error('Xác nhận lịch hẹn thất bại');
        }

        return await AppointmentModel.findById(appointmentId);
    }

    // Check-in bệnh nhân
    static async checkInAppointment(appointmentId) {
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new Error('Không tìm thấy lịch hẹn');
        }

        if (![CONSTANTS.APPOINTMENT_STATUS.PENDING, CONSTANTS.APPOINTMENT_STATUS.CONFIRMED].includes(appointment.trang_thai_lich_hen)) {
            throw new Error('Chỉ có thể check-in lịch hẹn đã xác nhận');
        }

        const checkedIn = await AppointmentModel.checkIn(appointmentId);
        if (!checkedIn) {
            throw new Error('Check-in thất bại');
        }

        return await AppointmentModel.findById(appointmentId);
    }

    // Đánh dấu không đến
    static async markNoShow(appointmentId) {
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new Error('Không tìm thấy lịch hẹn');
        }

        const marked = await AppointmentModel.markNoShow(appointmentId);
        if (!marked) {
            throw new Error('Cập nhật thất bại');
        }

        return await AppointmentModel.findById(appointmentId);
    }

    // Cập nhật ghi chú
    static async updateAppointmentNote(appointmentId, note) {
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new Error('Không tìm thấy lịch hẹn');
        }

        const updated = await AppointmentModel.updateNote(appointmentId, note);
        if (!updated) {
            throw new Error('Cập nhật ghi chú thất bại');
        }

        return await AppointmentModel.findById(appointmentId);
    }

    // Lấy hàng đợi theo bác sĩ
    static async getQueueByDoctor(doctorId, date) {
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            throw new Error('Không tìm thấy bác sĩ');
        }

        const queue = await AppointmentModel.getQueueByDoctor(doctorId, date);
        return queue;
    }

    // Lấy lịch hẹn tiếp theo
    static async getNextAppointment(doctorId) {
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            throw new Error('Không tìm thấy bác sĩ');
        }

        const next = await AppointmentModel.getNextAppointment(doctorId);
        return next;
    }

    // Tạo bệnh nhân walk-in
    static async createWalkInPatient(patientData) {
        const {
            ten_benh_nhan,
            ho_benh_nhan,
            so_dien_thoai_benh_nhan,
            email_benh_nhan,
            ngay_sinh_benh_nhan,
            gioi_tinh_benh_nhan,
            dia_chi_benh_nhan,
            create_account = false,
            mat_khau_nguoi_dung
        } = patientData;

        // Kiểm tra trùng SĐT
        const existingPhone = await PatientModel.findByPhone(so_dien_thoai_benh_nhan);
        if (existingPhone) {
            throw new Error('Số điện thoại đã được đăng ký');
        }

        let userId = null;

        // Nếu tạo tài khoản
        if (create_account) {
            if (!email_benh_nhan) {
                throw new Error('Email là bắt buộc để tạo tài khoản');
            }

            if (!mat_khau_nguoi_dung) {
                throw new Error('Mật khẩu là bắt buộc để tạo tài khoản');
            }

            // Kiểm tra email trùng
            const existingEmail = await UserModel.findByEmail(email_benh_nhan);
            if (existingEmail) {
                throw new Error('Email đã tồn tại');
            }

            // Tạo username từ phone
            const ten_dang_nhap = `patient_${so_dien_thoai_benh_nhan}`;
            const existingUsername = await UserModel.findByUsername(ten_dang_nhap);
            if (existingUsername) {
                throw new Error('Tài khoản đã tồn tại');
            }

            // Lấy role Bệnh nhân
            const patientRole = await RoleModel.findByName(CONSTANTS.ROLES.PATIENT);
            if (!patientRole) {
                throw new Error('Vai trò Bệnh nhân không tồn tại');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(mat_khau_nguoi_dung, 10);

            // Tạo User
            userId = await UserModel.create({
                ten_nguoi_dung,
                ho_nguoi_dung,
                ten_dang_nhap_nguoi_dung: ten_dang_nhap,
                email_nguoi_dung: email_benh_nhan,
                so_dien_thoai_nguoi_dung: so_dien_thoai_benh_nhan,
                mat_khau_nguoi_dung: hashedPassword,
                gioi_tinh_nguoi_dung: gioi_tinh_benh_nhan,
                ma_vai_tro: patientRole.ma_vai_tro
            });
        }

        // Tạo Patient
        const patientId = await PatientModel.create({
            ma_nguoi_dung_benh_nhan: userId,
            ten_benh_nhan,
            ho_benh_nhan,
            so_dien_thoai_benh_nhan,
            email_benh_nhan,
            ngay_sinh_benh_nhan,
            gioi_tinh_benh_nhan,
            dia_chi_benh_nhan
        });

        return await PatientModel.findById(patientId);
    }

    // Tìm kiếm bệnh nhân
    static async searchPatients(search) {
        const patients = await PatientModel.search(search);
        return patients;
    }
}

module.exports = ReceptionistService;