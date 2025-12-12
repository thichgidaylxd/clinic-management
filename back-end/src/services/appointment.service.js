const AppointmentModel = require('../models/appointment.model');
const PatientModel = require('../models/patient.model');
const PatientService = require('./patient.service');
const DoctorModel = require('../models/doctor.model');
const SpecialtyModel = require('../models/specialty.model');
const ServiceModel = require('../models/service.model');

class AppointmentService {
    // Đặt lịch (khách vãng lai)
    static async createGuest(appointmentData) {
        const {
            ten_benh_nhan,
            so_dien_thoai_benh_nhan,
            gioi_tinh_benh_nhan,
            ma_bac_si,
            ma_chuyen_khoa,
            ma_dich_vu_lich_hen,
            ly_do_kham_lich_hen,
            ngay,
            thoi_gian_bat_dau,
            thoi_gian_ket_thuc
        } = appointmentData;

        console.log('Creating guest appointment:', appointmentData); // Debug

        // 1. Kiểm tra bác sĩ có tồn tại
        const doctor = await DoctorModel.findById(ma_bac_si);
        if (!doctor) {
            throw new Error('Bác sĩ không tồn tại');
        }

        // 2. Kiểm tra chuyên khoa (nếu có)
        if (ma_chuyen_khoa) {
            const specialty = await SpecialtyModel.findById(ma_chuyen_khoa);
            if (!specialty) {
                throw new Error('Chuyên khoa không tồn tại');
            }
        }

        // 3. Kiểm tra dịch vụ (nếu có)
        let serviceFee = 0;
        if (ma_dich_vu_lich_hen) {
            const service = await ServiceModel.findById(ma_dich_vu_lich_hen);
            if (!service) {
                throw new Error('Dịch vụ không tồn tại');
            }
            serviceFee = parseFloat(service.don_gia_dich_vu);
        }

        // 4. Kiểm tra slot có available không
        const isAvailable = await AppointmentModel.isSlotAvailable(
            ma_bac_si,
            ngay,
            thoi_gian_bat_dau,
            thoi_gian_ket_thuc
        );

        if (!isAvailable) {
            throw new Error('Khung giờ này đã có người đặt, vui lòng chọn khung giờ khác');
        }

        // 5. Tìm hoặc tạo bệnh nhân
        const patient = await PatientService.findOrCreate({
            ten_benh_nhan,
            so_dien_thoai_benh_nhan,
            gioi_tinh_benh_nhan
        });

        console.log('Patient created/found:', patient.ma_benh_nhan); // Debug

        // 6. Tạo lịch hẹn
        const ma_lich_hen = await AppointmentModel.createAppointment({
            ma_nguoi_tao_lich_hen: null,
            ma_bac_si,
            ma_benh_nhan: patient.ma_benh_nhan,
            ma_chuyen_khoa,
            ma_dich_vu_lich_hen,
            trang_thai_lich_hen: 0,
            ly_do_kham_lich_hen,
            gia_dich_vu_lich_hen: serviceFee,
            tong_gia_lich_hen: serviceFee,
            ngay_hen: ngay,
            gio_bat_dau: thoi_gian_bat_dau,
            gio_ket_thuc: thoi_gian_ket_thuc
        });

        console.log('Appointment created:', appointmentId); // Debug

        // 7. Tạo thời gian chi tiết
        await AppointmentModel.createTimeSlot({
            ma_lich_hen: appointmentId,
            ngay,
            thoi_gian_bat_dau,
            thoi_gian_ket_thuc,
            so_thu_tu: 1,
            duoc_chap_nhan: 0
        });

        console.log('Time slot created'); // Debug

        return await AppointmentModel.findById(appointmentId);
    }

    // Đặt lịch (bệnh nhân đã đăng nhập)
    static async createAuthenticated(appointmentData, userId) {
        const {
            ma_bac_si,
            ma_chuyen_khoa,
            ma_dich_vu_lich_hen,
            ly_do_kham_lich_hen,
            ngay,
            thoi_gian_bat_dau,
            thoi_gian_ket_thuc
        } = appointmentData;

        // 1. Kiểm tra bác sĩ
        const doctor = await DoctorModel.findById(ma_bac_si);
        if (!doctor) {
            throw new Error('Bác sĩ không tồn tại');
        }

        // 2. Kiểm tra chuyên khoa
        if (ma_chuyen_khoa) {
            const specialty = await SpecialtyModel.findById(ma_chuyen_khoa);
            if (!specialty) {
                throw new Error('Chuyên khoa không tồn tại');
            }
        }

        // 3. Kiểm tra dịch vụ
        let serviceFee = 0;
        if (ma_dich_vu_lich_hen) {
            const service = await ServiceModel.findById(ma_dich_vu_lich_hen);
            if (!service) {
                throw new Error('Dịch vụ không tồn tại');
            }
            serviceFee = parseFloat(service.don_gia_dich_vu);
        }

        // 4. Kiểm tra slot
        const isAvailable = await AppointmentModel.isSlotAvailable(
            ma_bac_si,
            ngay,
            thoi_gian_bat_dau,
            thoi_gian_ket_thuc
        );

        if (!isAvailable) {
            throw new Error('Khung giờ này đã có người đặt, vui lòng chọn khung giờ khác');
        }

        // 5. Tìm bệnh nhân từ userId
        const UserModel = require('../models/user.model');
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User không tồn tại');
        }

        // Tìm hoặc tạo bệnh nhân
        const patient = await PatientService.findOrCreate({
            ten_benh_nhan: user.ten_nguoi_dung,
            so_dien_thoai_benh_nhan: user.so_dien_thoai_nguoi_dung,
            gioi_tinh_benh_nhan: user.gioi_tinh_nguoi_dung
        });

        // 6. Tạo lịch hẹn
        const appointmentId = await AppointmentModel.create({
            ma_nguoi_tao_lich_hen: userId,
            ma_bac_si,
            ma_benh_nhan: patient.ma_benh_nhan,
            ma_chuyen_khoa,
            ma_dich_vu_lich_hen,
            trang_thai_lich_hen: 0, // PENDING
            ly_do_kham_lich_hen,
            gia_dich_vu_lich_hen: serviceFee,
            tong_gia_lich_hen: serviceFee
        });

        // 7. Tạo thời gian chi tiết
        await AppointmentModel.createTimeSlot({
            ma_lich_hen: appointmentId,
            ngay,
            thoi_gian_bat_dau,
            thoi_gian_ket_thuc,
            so_thu_tu: 1,
            duoc_chap_nhan: 0
        });

        return await AppointmentModel.findById(appointmentId);
    }

    // Lấy available slots
    static async getAvailableSlots(doctorId, date, slotDuration = 30) {
        // Kiểm tra bác sĩ
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            throw new Error('Bác sĩ không tồn tại');
        }

        const result = await AppointmentModel.getAvailableSlots(doctorId, date, slotDuration);

        return {
            doctorInfo: {
                ma_bac_si: doctor.ma_bac_si,
                ten_nguoi_dung: doctor.ten_nguoi_dung,
                ho_nguoi_dung: doctor.ho_nguoi_dung
            },
            date,
            slotDuration,
            ...result,
            summary: {
                totalSlots: result.availableSlots.length,
                availableCount: result.availableSlots.filter(s => s.status === 'available').length,
                bookedCount: result.availableSlots.filter(s => s.status === 'booked').length
            }
        };
    }

    // Check availability
    static async checkAvailability(doctorId, date, startTime, endTime) {
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            throw new Error('Bác sĩ không tồn tại');
        }

        const isAvailable = await AppointmentModel.isSlotAvailable(
            doctorId,
            date,
            startTime,
            endTime
        );

        return {
            available: isAvailable,
            message: isAvailable
                ? 'Khung giờ này còn trống'
                : 'Khung giờ này đã có người đặt'
        };
    }

    // Lấy danh sách lịch hẹn
    static async getAll(page, limit, filters) {
        return await AppointmentModel.findAll(page, limit, filters);
    }

    // Lấy chi tiết lịch hẹn
    static async getById(appointmentId) {
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new Error('Không tìm thấy lịch hẹn');
        }
        return appointment;
    }

    // Lấy lịch hẹn của bệnh nhân (qua userId)
    static async getMyAppointments(userId, page, limit, status) {
        const UserModel = require('../models/user.model');
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User không tồn tại');
        }

        let patient = await PatientModel.findByPhone(user.so_dien_thoai_nguoi_dung);
        if (!patient) {
            return {
                data: [],
                pagination: {
                    total: 0,
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 10,
                    totalPages: 0
                }
            };
        }

        return await AppointmentModel.findByPatient(patient.ma_benh_nhan, page, limit, status);
    }

    // Xác nhận lịch hẹn (Lễ tân)
    static async confirm(appointmentId, userId) {
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new Error('Không tìm thấy lịch hẹn');
        }

        if (appointment.trang_thai_lich_hen !== 0) {
            throw new Error('Chỉ có thể xác nhận lịch hẹn ở trạng thái PENDING');
        }

        const updated = await AppointmentModel.update(appointmentId, {
            trang_thai_lich_hen: 1,
            thoi_gian_xac_nhan: new Date()
        });

        if (!updated) {
            throw new Error('Xác nhận lịch hẹn thất bại');
        }

        return await AppointmentModel.findById(appointmentId);
    }

    // Check-in (Lễ tân)
    static async checkIn(appointmentId, roomId = null) {
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new Error('Không tìm thấy lịch hẹn');
        }

        if (appointment.trang_thai_lich_hen !== 1) {
            throw new Error('Chỉ có thể check-in lịch hẹn đã xác nhận');
        }

        const updateData = {
            trang_thai_lich_hen: 2,
            thoi_gian_vao_kham: new Date()
        };

        if (roomId) {
            updateData.ma_phong_kham = roomId;
        }

        const updated = await AppointmentModel.update(appointmentId, updateData);
        if (!updated) {
            throw new Error('Check-in thất bại');
        }

        return await AppointmentModel.findById(appointmentId);
    }

    // Hủy lịch hẹn
    static async cancel(appointmentId, reason, userId = null) {
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new Error('Không tìm thấy lịch hẹn');
        }

        if (appointment.trang_thai_lich_hen >= 2) {
            throw new Error('Không thể hủy lịch hẹn đã check-in hoặc hoàn thành');
        }

        const updated = await AppointmentModel.update(appointmentId, {
            trang_thai_lich_hen: 4,
            ly_do_huy_lich_hen: reason
        });

        if (!updated) {
            throw new Error('Hủy lịch hẹn thất bại');
        }

        return await AppointmentModel.findById(appointmentId);
    }

    // Xóa lịch hẹn (Admin only)
    static async delete(appointmentId) {
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new Error('Không tìm thấy lịch hẹn');
        }

        const deleted = await AppointmentModel.delete(appointmentId);
        if (!deleted) {
            throw new Error('Xóa lịch hẹn thất bại');
        }

        return true;
    }
}

module.exports = AppointmentService;