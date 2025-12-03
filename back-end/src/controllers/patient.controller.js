const PatientService = require('../services/patient.service');
const ResponseUtil = require('../utils/response.util');

class PatientController {
    // Tạo bệnh nhân mới
    static async create(req, res, next) {
        try {
            const patient = await PatientService.create(req.body);

            return ResponseUtil.success(
                res,
                patient,
                'Tạo bệnh nhân thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy danh sách bệnh nhân
    static async getAll(req, res, next) {
        try {
            const { page, limit, search, gender } = req.query;
            const result = await PatientService.getAll(page, limit, search, gender);

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách bệnh nhân thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin bệnh nhân theo ID
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const patient = await PatientService.getById(id);

            return ResponseUtil.success(
                res,
                patient,
                'Lấy thông tin bệnh nhân thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Tìm bệnh nhân theo số điện thoại
    static async findByPhone(req, res, next) {
        try {
            const { phone } = req.params;
            const patient = await PatientService.findByPhone(phone);

            return ResponseUtil.success(
                res,
                patient,
                'Tìm bệnh nhân thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật bệnh nhân
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const patient = await PatientService.update(id, req.body);

            return ResponseUtil.success(
                res,
                patient,
                'Cập nhật bệnh nhân thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Xóa bệnh nhân
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await PatientService.delete(id);

            return ResponseUtil.success(
                res,
                null,
                'Xóa bệnh nhân thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy lịch sử khám bệnh
    static async getMedicalHistory(req, res, next) {
        try {
            const { id } = req.params;
            const { page, limit } = req.query;
            const result = await PatientService.getMedicalHistory(id, page, limit);

            return ResponseUtil.success(
                res,
                result,
                'Lấy lịch sử khám bệnh thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy lịch hẹn của bệnh nhân
    static async getAppointments(req, res, next) {
        try {
            const { id } = req.params;
            const { page, limit, status } = req.query;
            const result = await PatientService.getAppointments(id, page, limit, status);

            return ResponseUtil.success(
                res,
                result,
                'Lấy lịch hẹn của bệnh nhân thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Thống kê bệnh nhân theo giới tính
    static async getStatsByGender(req, res, next) {
        try {
            const stats = await PatientService.getStatsByGender();

            return ResponseUtil.success(
                res,
                stats,
                'Lấy thống kê bệnh nhân theo giới tính thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy bệnh nhân mới nhất
    static async getRecentPatients(req, res, next) {
        try {
            const { limit } = req.query;
            const patients = await PatientService.getRecentPatients(limit);

            return ResponseUtil.success(
                res,
                patients,
                'Lấy danh sách bệnh nhân mới nhất thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PatientController;