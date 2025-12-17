const PositionService = require('../services/position.service');
const ResponseUtil = require('../utils/response.util');

class PositionController {
    // Tạo chức vụ
    static async create(req, res, next) {
        try {
            const position = await PositionService.createPosition(req.body);

            return ResponseUtil.success(
                res,
                position,
                'Tạo chức vụ thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy tất cả chức vụ
    static async getAll(req, res, next) {
        try {
            const { status } = req.query;
            const positions = await PositionService.getAllPositions(status);

            return ResponseUtil.success(
                res,
                positions,
                'Lấy danh sách chức vụ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy chức vụ theo ID
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const position = await PositionService.getPositionById(id);

            return ResponseUtil.success(
                res,
                position,
                'Lấy thông tin chức vụ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật chức vụ
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const position = await PositionService.updatePosition(id, req.body);

            return ResponseUtil.success(
                res,
                position,
                'Cập nhật chức vụ thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Xóa chức vụ
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await PositionService.deletePosition(id);

            return ResponseUtil.success(
                res,
                null,
                'Xóa chức vụ thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PositionController;