const ReceptionistService = require('../services/receptionist.service');
const ResponseUtil = require('../utils/response.util');

class ReceptionistController {
    // Dashboard stats
    static async getDashboardStats(req, res, next) {
        try {
            const stats = await ReceptionistService.getDashboardStats();
            return ResponseUtil.success(res, stats, 'Lấy thống kê thành công');
        } catch (error) {
            next(error);
        }
    }

    // Lấy lịch hẹn hôm nay
    static async getTodayAppointments(req, res, next) {
        try {
            const { doctorId, status, search } = req.query;
            const filters = { doctorId, status, search };

            const appointments = await ReceptionistService.getTodayAppointmentsWithFilter(filters);
            return ResponseUtil.success(res, appointments, 'Lấy danh sách thành công');
        } catch (error) {
            next(error);
        }
    }

    // Xác nhận lịch hẹn
    static async confirmAppointment(req, res, next) {
        try {
            const { id } = req.params;
            const { note } = req.body;

            // 👇 người xác nhận (lễ tân / admin)
            const maNguoiXacNhan = req.user.ma_nguoi_dung;

            const appointment = await ReceptionistService.confirmAppointment(
                id,
                note,
                maNguoiXacNhan
            );

            return ResponseUtil.success(res, appointment, 'Xác nhận lịch hẹn thành công');
        } catch (error) {
            next(error);
        }
    }


    // Check-in
    static async checkInAppointment(req, res, next) {
        try {
            const { id } = req.params;

            const appointment = await ReceptionistService.checkInAppointment(id);
            return ResponseUtil.success(res, appointment, 'Check-in thành công');
        } catch (error) {
            next(error);
        }
    }

    // Đánh dấu không đến
    static async markNoShow(req, res, next) {
        try {
            const { id } = req.params;

            const appointment = await ReceptionistService.markNoShow(id);
            return ResponseUtil.success(res, appointment, 'Cập nhật thành công');
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật ghi chú
    static async updateNote(req, res, next) {
        try {
            const { id } = req.params;
            const note = req.body.ghi_chu_lich_hen;
            const appointment = await ReceptionistService.updateAppointmentNote(id, note);
            return ResponseUtil.success(res, appointment, 'Cập nhật ghi chú thành công');
        } catch (error) {
            next(error);
        }
    }

    // Lấy hàng đợi
    static async getQueue(req, res, next) {
        try {
            const { doctorId } = req.params;
            const { date } = req.query;

            const queue = await ReceptionistService.getQueueByDoctor(doctorId, date);
            return ResponseUtil.success(res, queue, 'Lấy hàng đợi thành công');
        } catch (error) {
            next(error);
        }
    }

    // Lấy lịch hẹn tiếp theo
    static async getNextAppointment(req, res, next) {
        try {
            const { doctorId } = req.params;

            const next = await ReceptionistService.getNextAppointment(doctorId);
            return ResponseUtil.success(res, next, 'Lấy lịch hẹn tiếp theo thành công');
        } catch (error) {
            next(error);
        }
    }

    // Tạo bệnh nhân walk-in
    static async createWalkInPatient(req, res, next) {
        try {
            const patient = await ReceptionistService.createWalkInPatient(req.body);
            return ResponseUtil.created(res, patient, 'Tạo hồ sơ bệnh nhân thành công');
        } catch (error) {
            next(error);
        }
    }

    // Tìm kiếm bệnh nhân
    static async searchPatients(req, res, next) {
        try {
            const { search } = req.query;
            const patients = await ReceptionistService.searchPatients(search);
            return ResponseUtil.success(res, patients, 'Tìm kiếm thành công');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ReceptionistController;