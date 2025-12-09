const DoctorService = require('../services/doctor.service');
const ResponseUtil = require('../utils/response.util');

class DoctorController {
    // Tạo bác sĩ
    static async createDoctor(req, res, next) {
        try {
            const doctor = await DoctorService.createDoctor(req.body);

            return ResponseUtil.success(
                res,
                doctor,
                'Tạo bác sĩ thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy danh sách bác sĩ
    static async getAllDoctors(req, res, next) {
        try {
            const { page, limit, search, status, positionId } = req.query;
            const result = await DoctorService.getAllDoctors(
                page,
                limit,
                search,
                status,
                positionId
            );

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách bác sĩ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin bác sĩ theo ID
    static async getDoctorById(req, res, next) {
        try {
            const { id } = req.params;
            const doctor = await DoctorService.getDoctorById(id);

            return ResponseUtil.success(
                res,
                doctor,
                'Lấy thông tin bác sĩ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật bác sĩ
    static async updateDoctor(req, res, next) {
        try {
            const { id } = req.params;
            const doctor = await DoctorService.updateDoctor(id, req.body);

            return ResponseUtil.success(
                res,
                doctor,
                'Cập nhật bác sĩ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Xóa bác sĩ
    static async deleteDoctor(req, res, next) {
        try {
            const { id } = req.params;
            await DoctorService.deleteDoctor(id);

            return ResponseUtil.success(
                res,
                null,
                'Xóa bác sĩ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy đánh giá của bác sĩ
    static async getDoctorRatings(req, res, next) {
        try {
            const { id } = req.params;
            const { page, limit } = req.query;
            const result = await DoctorService.getDoctorRatings(id, page, limit);

            return ResponseUtil.success(
                res,
                result,
                'Lấy đánh giá bác sĩ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy thống kê đánh giá
    static async getDoctorRatingStats(req, res, next) {
        try {
            const { id } = req.params;
            const stats = await DoctorService.getDoctorRatingStats(id);

            return ResponseUtil.success(
                res,
                stats,
                'Lấy thống kê đánh giá thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy bác sĩ có đánh giá cao nhất
    static async getTopRatedDoctors(req, res, next) {
        try {
            const { limit } = req.query;
            const doctors = await DoctorService.getTopRatedDoctors(limit);

            return ResponseUtil.success(
                res,
                doctors,
                'Lấy danh sách bác sĩ được đánh giá cao thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Thống kê bác sĩ theo chức vụ
    static async getStatsByPosition(req, res, next) {
        try {
            const stats = await DoctorService.getStatsByPosition();

            return ResponseUtil.success(
                res,
                stats,
                'Lấy thống kê bác sĩ theo chức vụ thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DoctorController;