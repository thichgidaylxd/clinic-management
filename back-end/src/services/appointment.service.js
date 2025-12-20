
const PatientModel = require('../models/patient.model');
const PatientService = require('./patient.service');
const DoctorModel = require('../models/doctor.model');
const SpecialtyModel = require('../models/specialty.model');
const ServiceModel = require('../models/service.model');
const AppointmentModel = require('../models/appointment.model');

class AppointmentService {
    // Đặt lịch (bệnh nhân chưa đăng nhập)
    static async createGuest(appointmentData) {
        const {
            ten_benh_nhan,
            ho_benh_nhan,  // ✅ THÊM
            so_dien_thoai_benh_nhan,
            email_benh_nhan,  // ✅ THÊM
            ngay_sinh_benh_nhan,  // ✅ THÊM
            gioi_tinh_benh_nhan,
            ma_bac_si,
            ma_chuyen_khoa,
            ma_dich_vu_lich_hen,
            ly_do_kham_lich_hen,
            ngay_hen,  // ✅ ĐỔI TÊN (từ ngay)
            gio_bat_dau,  // ✅ ĐỔI TÊN (từ thoi_gian_bat_dau)
            gio_ket_thuc  // ✅ ĐỔI TÊN (từ thoi_gian_ket_thuc)
        } = appointmentData;

        console.log('Creating guest appointment:', appointmentData);

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
            ngay_hen,
            gio_bat_dau,
            gio_ket_thuc
        );

        if (!isAvailable) {
            throw new Error('Khung giờ này đã có người đặt, vui lòng chọn khung giờ khác');
        }

        // 5. Parse ho + ten nếu thiếu ho_benh_nhan
        let ho = ho_benh_nhan;
        let ten = ten_benh_nhan;

        if (!ho_benh_nhan && ten_benh_nhan) {
            const parts = ten_benh_nhan.trim().split(' ');
            if (parts.length > 1) {
                ten = parts.pop();
                ho = parts.join(' ');
            }
        }

        // 6. Tìm hoặc tạo bệnh nhân
        const patient = await PatientService.findOrCreate({
            ten_benh_nhan: ten,
            ho_benh_nhan: ho,
            so_dien_thoai_benh_nhan,
            email_benh_nhan,
            ngay_sinh_benh_nhan,
            gioi_tinh_benh_nhan
        });

        console.log('Patient created/found:', patient.ma_benh_nhan);

        // 7. Tạo lịch hẹn
        const appointmentId = await AppointmentModel.create({  // ✅ SỬA TÊN
            ma_nguoi_tao_lich_hen: null,
            ma_bac_si,
            ma_benh_nhan: patient.ma_benh_nhan,
            ma_chuyen_khoa,
            ma_dich_vu_lich_hen,
            trang_thai_lich_hen: 0,
            ly_do_kham_lich_hen,
            gia_dich_vu_lich_hen: serviceFee,
            tong_gia_lich_hen: serviceFee,
            ngay_hen,  // ✅ THÊM
            gio_bat_dau,  // ✅ THÊM
            gio_ket_thuc  // ✅ THÊM
        });

        console.log('Appointment created:', appointmentId);

        // ❌ XÓA: Không cần createTimeSlot nữa

        return await AppointmentModel.findById(appointmentId);
    }

    // Lấy danh sách lịch hẹn theo ngày
    static async getAppointmentsByDate(filters) {
        return await AppointmentModel.findByDate(filters);
    }


    // Đặt lịch (bệnh nhân đã đăng nhập)
    static async createAuthenticated(appointmentData, userId) {
        const {
            ma_bac_si,
            ma_chuyen_khoa,
            ma_dich_vu_lich_hen,
            ly_do_kham_lich_hen,
            ngay_hen,  // ✅ ĐỔI TÊN
            gio_bat_dau,  // ✅ ĐỔI TÊN
            gio_ket_thuc  // ✅ ĐỔI TÊN
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
            ngay_hen,
            gio_bat_dau,
            gio_ket_thuc
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

        // Parse ho + ten
        const parts = user.ten_nguoi_dung.trim().split(' ');
        const ten = parts.pop();
        const ho = parts.join(' ') || user.ho_nguoi_dung;

        // Tìm hoặc tạo bệnh nhân
        const patient = await PatientService.findOrCreate({
            ten_benh_nhan: ten,
            ho_benh_nhan: ho,
            so_dien_thoai_benh_nhan: user.so_dien_thoai_nguoi_dung,
            email_benh_nhan: user.email_nguoi_dung,
            gioi_tinh_benh_nhan: user.gioi_tinh_nguoi_dung,
            ma_nguoi_dung_benh_nhan: userId  // ✅ Link to user
        });

        // 6. Tạo lịch hẹn
        const appointmentId = await AppointmentModel.create({
            ma_nguoi_tao_lich_hen: userId,
            ma_bac_si,
            ma_benh_nhan: patient.ma_benh_nhan,
            ma_chuyen_khoa,
            ma_dich_vu_lich_hen,
            trang_thai_lich_hen: 0,
            ly_do_kham_lich_hen,
            gia_dich_vu_lich_hen: serviceFee,
            tong_gia_lich_hen: serviceFee,
            ngay_hen,  // ✅ THÊM
            gio_bat_dau,  // ✅ THÊM
            gio_ket_thuc  // ✅ THÊM
        });

        // ❌ XÓA: Không cần createTimeSlot nữa

        return await AppointmentModel.findById(appointmentId);
    }

    // Lấy available slots
    static async getAvailableSlots(doctorId, date, slotDuration = 30) {
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

    static SLOT_MINUTES = 30;

    static async getAvailableSlotsV2(date, specialtyId = null) {
        const schedules = await DoctorModel.findByWorkSchedule(date, specialtyId);
        if (schedules.length === 0) return [];

        const slotMap = new Map();

        for (const ws of schedules) {
            const startMin = this.toMinutes(ws.thoi_gian_bat_dau_lich_lam_viec);
            const endMin = this.toMinutes(ws.thoi_gian_ket_thuc_lich_lam_viec);

            for (let cur = startMin; cur + this.SLOT_MINUTES <= endMin; cur += this.SLOT_MINUTES) {
                const start = this.toTime(cur);
                const end = this.toTime(cur + this.SLOT_MINUTES);
                const key = `${start}-${end}`;

                if (!slotMap.has(key)) {
                    slotMap.set(key, {
                        start,
                        end,
                        doctorIds: []
                    });
                }

                slotMap.get(key).doctorIds.push(ws.ma_bac_si);
            }
        }

        const result = [];

        for (const slot of slotMap.values()) {
            let count = 0;

            for (const doctorId of slot.doctorIds) {
                const free = await AppointmentModel.isSlotAvailable(
                    doctorId,
                    date,
                    slot.start,
                    slot.end
                );
                if (free) count++;
            }

            if (count > 0) {
                result.push({
                    start: slot.start,
                    end: slot.end,
                    doctorCount: count
                });
            }
        }

        return result.sort((a, b) => a.start.localeCompare(b.start));
    }

    static toMinutes(time) {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    }

    static toTime(min) {
        const h = Math.floor(min / 60);
        const m = min % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
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

        let patient = await PatientModel.findByUserId(userId);  // ✅ SỬA: Dùng findByUserId thay vì findByPhone
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
        console.log('Confirming appointment:', appointmentId, 'by user:', userId);
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new Error('Không tìm thấy lịch hẹn');
        }

        if (appointment.trang_thai_lich_hen !== 0) {
            throw new Error('Chỉ có thể xác nhận lịch hẹn ở trạng thái PENDING');
        }

        const updated = await AppointmentModel.update(appointmentId, {
            trang_thai_lich_hen: 1,
            thoi_gian_xac_nhan: new Date(),
            ma_nguoi_xac_nhan: userId  // ✅ THÊM
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
            thoi_gian_check_in: new Date()  // ✅ SỬA: Dùng thoi_gian_check_in thay vì thoi_gian_vao_kham
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
            trang_thai_lich_hen: 5,  // ✅ SỬA: 5 = CANCELLED (không phải 4)
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

    // Dashboard cho bác sĩ
    static async getDoctorDashboard(userId) {
        // 1. Lấy bác sĩ từ user
        const doctor = await DoctorModel.findByUserId(userId);
        if (!doctor) {
            throw new Error('Không tìm thấy bác sĩ');
        }

        const doctorId = doctor.ma_bac_si;

        // 2. Ngày hôm nay
        const today = new Date().toISOString().split('T')[0];

        // 3. Lấy lịch hẹn hôm nay của bác sĩ
        const appointments = await AppointmentModel.findByDoctorAndDate(
            doctorId,
            today
        );

        // 4. Thống kê
        const totalToday = appointments.length;
        const checkedIn = appointments.filter(a => a.trang_thai_lich_hen === 2).length;
        const waiting = appointments.filter(a => a.trang_thai_lich_hen === 1).length;

        return {
            totalToday,
            checkedIn,
            waiting,
            appointments
        };
    }

    /**
         * Lấy lịch hẹn hôm nay
         * @param {String} userId - ID người dùng
         * @param {String} role - Vai trò (Bác sĩ, Lễ tân, Admin)
         */
    static async getTodayAppointments(userId, role) {
        try {
            // Call Model method
            const appointments = await AppointmentModel.getTodayAppointments(userId, role);

            return appointments;
        } catch (error) {
            console.error('Service - Get today appointments error:', error);
            throw error;
        }
    }
}

module.exports = AppointmentService;