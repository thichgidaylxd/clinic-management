const SpecialtyService = require('../services/specialty.service');
const SpecialtyModel = require('../models/specialty.model');
const ResponseUtil = require('../utils/response.util');

class SpecialtyController {
    // Tạo chuyên khoa mới
    static async create(req, res, next) {
        try {
            const specialty = await SpecialtyService.create(req.body);

            return ResponseUtil.success(
                res,
                specialty,
                'Tạo chuyên khoa thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy danh sách chuyên khoa
    static async getAll(req, res, next) {
        try {
            const { page, limit, search } = req.query;
            const result = await SpecialtyService.getAll(page, limit, search);

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách chuyên khoa thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin chuyên khoa theo ID
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const specialty = await SpecialtyService.getById(id);

            return ResponseUtil.success(
                res,
                specialty,
                'Lấy thông tin chuyên khoa thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // ⭐ Lấy chuyên khoa theo tên
    static async getByName(req, res, next) {
        try {
            const { name } = req.query;

            if (!name) {
                return ResponseUtil.error(res, 'Tên chuyên khoa là bắt buộc', 400);
            }

            const specialty = await SpecialtyModel.findByName(name);

            if (!specialty) {
                return ResponseUtil.error(res, 'Không tìm thấy chuyên khoa', 404);
            }

            return ResponseUtil.success(
                res,
                specialty,
                'Lấy thông tin chuyên khoa thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật chuyên khoa
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const specialty = await SpecialtyService.update(id, req.body);

            return ResponseUtil.success(
                res,
                specialty,
                'Cập nhật chuyên khoa thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Xóa chuyên khoa
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await SpecialtyService.delete(id);

            return ResponseUtil.success(
                res,
                null,
                'Xóa chuyên khoa thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SpecialtyController;