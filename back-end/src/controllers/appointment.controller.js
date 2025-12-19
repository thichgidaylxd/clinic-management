const AppointmentService = require('../services/appointment.service');
const ResponseUtil = require('../utils/response.util');

class AppointmentController {
    // Đặt lịch (khách vãng lai)
    static async createGuest(req, res, next) {
        try {
            const appointment = await AppointmentService.createGuest(req.body);

            return ResponseUtil.success(
                res,
                appointment,
                'Đặt lịch khám thành công. Vui lòng chờ xác nhận từ phòng khám.',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // Đặt lịch (bệnh nhân đã đăng nhập)
    static async createAuthenticated(req, res, next) {
        try {
            const userId = req.user.ma_nguoi_dung;
            const appointment = await AppointmentService.createAuthenticated(req.body, userId);

            return ResponseUtil.success(
                res,
                appointment,
                'Đặt lịch khám thành công. Vui lòng chờ xác nhận từ phòng khám.',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy available slots
    static async getAvailableSlots(req, res, next) {
        try {
            const { doctorId, date, slotDuration } = req.query;

            const result = await AppointmentService.getAvailableSlots(
                doctorId,
                date,
                parseInt(slotDuration) || 30
            );

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách khung giờ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Check availability
    static async checkAvailability(req, res, next) {
        try {
            const { doctorId, date, startTime, endTime } = req.body;

            const result = await AppointmentService.checkAvailability(
                doctorId,
                date,
                startTime,
                endTime
            );

            return ResponseUtil.success(
                res,
                result,
                result.message
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy danh sách lịch hẹn (Lễ tân, Admin)
    static async getAll(req, res, next) {
        try {
            const {
                page,
                limit,
                doctorId,
                patientId,
                specialtyId,
                status,
                fromDate,
                toDate,
                search
            } = req.query;

            const filters = {
                doctorId,
                patientId,
                specialtyId,
                status,
                fromDate,
                toDate,
                search
            };

            const result = await AppointmentService.getAll(page, limit, filters);

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách lịch hẹn thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy chi tiết lịch hẹn
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const appointment = await AppointmentService.getById(id);

            return ResponseUtil.success(
                res,
                appointment,
                'Lấy thông tin lịch hẹn thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy lịch hẹn của tôi (Bệnh nhân)
    static async getMyAppointments(req, res, next) {
        try {
            const userId = req.user.ma_nguoi_dung;
            const { page, limit, status } = req.query;

            const result = await AppointmentService.getMyAppointments(
                userId,
                page,
                limit,
                status
            );

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách lịch hẹn của bạn thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Xác nhận lịch hẹn (Lễ tân)
    static async confirm(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.ma_nguoi_dung;

            const appointment = await AppointmentService.confirm(id, userId);

            return ResponseUtil.success(
                res,
                appointment,
                'Xác nhận lịch hẹn thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Check-in (Lễ tân)
    static async checkIn(req, res, next) {
        try {
            const { id } = req.params;
            const { ma_phong_kham } = req.body;

            const appointment = await AppointmentService.checkIn(id, ma_phong_kham);

            return ResponseUtil.success(
                res,
                appointment,
                'Check-in thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Hủy lịch hẹn
    static async cancel(req, res, next) {
        try {
            const { id } = req.params;
            const { ly_do_huy_lich_hen } = req.body;
            const userId = req.user ? req.user.ma_nguoi_dung : null;

            const appointment = await AppointmentService.cancel(id, ly_do_huy_lich_hen, userId);

            return ResponseUtil.success(
                res,
                appointment,
                'Hủy lịch hẹn thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Xóa lịch hẹn (Admin only)
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await AppointmentService.delete(id);

            return ResponseUtil.success(
                res,
                null,
                'Xóa lịch hẹn thành công'
            );
        } catch (error) {
            next(error);
        }
    }// Dashboard Lễ tân
    static async getReceptionistDashboard(req, res, next) {
        try {
            const dashboard = await AppointmentService.getReceptionistDashboard();

            return ResponseUtil.success(
                res,
                dashboard,
                'Lấy thông tin dashboard thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Dashboard Bác sĩ
    static async getDoctorDashboard(req, res, next) {
        try {
            const userId = req.user.ma_nguoi_dung;
            const dashboard = await AppointmentService.getDoctorDashboard(userId);

            return ResponseUtil.success(
                res,
                dashboard,
                'Lấy thông tin dashboard thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy lịch hẹn hôm nay
    static async getTodayAppointments(req, res, next) {
        try {
            const userId = req.user.ma_nguoi_dung;
            const role = req.user.ten_vai_tro;
            const appointments = await AppointmentService.getTodayAppointments(userId, role);

            return ResponseUtil.success(
                res,
                appointments,
                'Lấy danh sách lịch hẹn hôm nay thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy lịch hẹn chờ xác nhận
    static async getPendingAppointments(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await AppointmentService.getPendingAppointments(page, limit);

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách lịch hẹn chờ xác nhận thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy lịch hẹn đã check-in (cho Bác sĩ)
    static async getCheckedInAppointments(req, res, next) {
        try {
            const userId = req.user.ma_nguoi_dung;
            const { page, limit } = req.query;

            const result = await AppointmentService.getCheckedInAppointments(userId, page, limit);

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách bệnh nhân đã check-in thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Thống kê lịch hẹn
    static async getStatsByStatus(req, res, next) {
        try {
            const { fromDate, toDate, doctorId } = req.query;
            const stats = await AppointmentService.getStatsByStatus(fromDate, toDate, doctorId);

            return ResponseUtil.success(
                res,
                stats,
                'Lấy thống kê lịch hẹn thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Hoàn thành lịch hẹn
    static async complete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.ma_nguoi_dung;

            const appointment = await AppointmentService.complete(id, userId);

            return ResponseUtil.success(
                res,
                appointment,
                'Hoàn thành lịch hẹn thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AppointmentController;