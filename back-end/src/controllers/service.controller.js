const ServiceService = require('../services/service.service');
const ResponseUtil = require('../utils/response.util');

class ServiceController {
    // Tạo dịch vụ mới
    static async create(req, res, next) {
        try {
            const service = await ServiceService.create(req.body);

            return ResponseUtil.success(
                res,
                service,
                'Tạo dịch vụ thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy danh sách dịch vụ
    static async getAll(req, res, next) {
        try {
            const { page, limit, search, specialtyId } = req.query;
            const result = await ServiceService.getAll(page, limit, search, specialtyId);

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách dịch vụ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin dịch vụ theo ID
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const service = await ServiceService.getById(id);

            return ResponseUtil.success(
                res,
                service,
                'Lấy thông tin dịch vụ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy dịch vụ theo chuyên khoa
    static async getBySpecialty(req, res, next) {
        try {
            const { specialtyId } = req.params;
            const services = await ServiceService.getBySpecialty(specialtyId);

            return ResponseUtil.success(
                res,
                services,
                'Lấy danh sách dịch vụ theo chuyên khoa thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật dịch vụ
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const service = await ServiceService.update(id, req.body);

            return ResponseUtil.success(
                res,
                service,
                'Cập nhật dịch vụ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Xóa dịch vụ
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await ServiceService.delete(id);

            return ResponseUtil.success(
                res,
                null,
                'Xóa dịch vụ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Thống kê dịch vụ theo chuyên khoa
    static async getStatsBySpecialty(req, res, next) {
        try {
            const stats = await ServiceService.getStatsBySpecialty();

            return ResponseUtil.success(
                res,
                stats,
                'Lấy thống kê dịch vụ theo chuyên khoa thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy dịch vụ phổ biến nhất
    static async getMostPopular(req, res, next) {
        try {
            const { limit } = req.query;
            const services = await ServiceService.getMostPopular(limit);

            return ResponseUtil.success(
                res,
                services,
                'Lấy danh sách dịch vụ phổ biến thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ServiceController;