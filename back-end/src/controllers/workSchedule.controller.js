const WorkScheduleService = require('../services/workSchedule.service');
const ResponseUtil = require('../utils/response.util');

class WorkScheduleController {
    // Tạo lịch làm việc
    static async create(req, res, next) {
        try {
            const schedule = await WorkScheduleService.create(req.body);

            return ResponseUtil.success(
                res,
                schedule,
                'Tạo lịch làm việc thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy danh sách lịch làm việc
    static async getAll(req, res, next) {
        try {
            const { page, limit, doctorId, specialtyId, roomId, fromDate, toDate, status } = req.query;

            const filters = {
                doctorId,
                specialtyId,
                roomId,
                fromDate,
                toDate,
                status
            };

            const result = await WorkScheduleService.getAll(page, limit, filters);

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách lịch làm việc thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin lịch làm việc theo ID
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const schedule = await WorkScheduleService.getById(id);

            return ResponseUtil.success(
                res,
                schedule,
                'Lấy thông tin lịch làm việc thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật lịch làm việc
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const schedule = await WorkScheduleService.update(id, req.body);

            return ResponseUtil.success(
                res,
                schedule,
                'Cập nhật lịch làm việc thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Xóa lịch làm việc
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await WorkScheduleService.delete(id);

            return ResponseUtil.success(
                res,
                null,
                'Xóa lịch làm việc thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy lịch làm việc của bác sĩ theo ngày
    static async getDoctorScheduleByDate(req, res, next) {
        try {
            const { doctorId } = req.params;
            const { date } = req.query;

            if (!date) {
                return ResponseUtil.error(res, 'Ngày là bắt buộc', 400);
            }

            const schedules = await WorkScheduleService.getDoctorScheduleByDate(doctorId, date);

            return ResponseUtil.success(
                res,
                schedules,
                'Lấy lịch làm việc của bác sĩ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy lịch làm việc của bác sĩ trong khoảng thời gian
    static async getDoctorScheduleByRange(req, res, next) {
        try {
            const { doctorId } = req.params;
            const { fromDate, toDate } = req.query;

            if (!fromDate || !toDate) {
                return ResponseUtil.error(res, 'Ngày bắt đầu và ngày kết thúc là bắt buộc', 400);
            }

            const schedules = await WorkScheduleService.getDoctorScheduleByRange(doctorId, fromDate, toDate);

            return ResponseUtil.success(
                res,
                schedules,
                'Lấy lịch làm việc của bác sĩ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Thống kê lịch làm việc theo bác sĩ
    static async getStatsByDoctor(req, res, next) {
        try {
            const { fromDate, toDate } = req.query;

            if (!fromDate || !toDate) {
                return ResponseUtil.error(res, 'Ngày bắt đầu và ngày kết thúc là bắt buộc', 400);
            }

            const stats = await WorkScheduleService.getStatsByDoctor(fromDate, toDate);

            return ResponseUtil.success(
                res,
                stats,
                'Lấy thống kê lịch làm việc thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = WorkScheduleController;