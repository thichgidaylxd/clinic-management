const MedicineService = require('../services/medicine.service');
const ResponseUtil = require('../utils/response.util');

class MedicineController {
    // Tạo thuốc mới
    static async create(req, res, next) {
        try {
            const userId = req.user.ma_nguoi_dung;
            const medicine = await MedicineService.create(req.body, userId);

            return ResponseUtil.success(
                res,
                medicine,
                'Tạo thuốc thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy danh sách thuốc
    static async getAll(req, res, next) {
        try {
            const { page, limit, search, status } = req.query;
            const result = await MedicineService.getAll(page, limit, search, status);

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách thuốc thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin thuốc theo ID
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const medicine = await MedicineService.getById(id);

            return ResponseUtil.success(
                res,
                medicine,
                'Lấy thông tin thuốc thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật thuốc
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.ma_nguoi_dung;
            const medicine = await MedicineService.update(id, req.body, userId);

            return ResponseUtil.success(
                res,
                medicine,
                'Cập nhật thuốc thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Xóa thuốc
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await MedicineService.delete(id);

            return ResponseUtil.success(
                res,
                result,
                result.message
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy thuốc sắp hết hạn
    static async getExpiringSoon(req, res, next) {
        try {
            const { days } = req.query;
            const medicines = await MedicineService.getExpiringSoon(days);

            return ResponseUtil.success(
                res,
                medicines,
                'Lấy danh sách thuốc sắp hết hạn thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy thuốc sắp hết kho
    static async getLowStock(req, res, next) {
        try {
            const { threshold } = req.query;
            const medicines = await MedicineService.getLowStock(threshold);

            return ResponseUtil.success(
                res,
                medicines,
                'Lấy danh sách thuốc sắp hết kho thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật tồn kho
    static async updateStock(req, res, next) {
        try {
            const { id } = req.params;
            const { quantity, type } = req.body;
            const medicine = await MedicineService.updateStock(id, quantity, type);

            return ResponseUtil.success(
                res,
                medicine,
                'Cập nhật tồn kho thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = MedicineController;