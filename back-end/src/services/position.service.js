const PositionModel = require('../models/position.model');

class PositionService {
    // Tạo chức vụ
    static async createPosition(positionData) {
        const { ten_chuc_vu } = positionData;

        // Kiểm tra tên đã tồn tại
        const exists = await PositionModel.existsByName(ten_chuc_vu);
        if (exists) {
            throw new Error('Tên chức vụ đã tồn tại');
        }

        const positionId = await PositionModel.create(positionData);
        return await PositionModel.findById(positionId);
    }

    // Lấy tất cả chức vụ
    static async getAllPositions(status = null) {
        return await PositionModel.findAll(status);
    }

    // Lấy chức vụ theo ID
    static async getPositionById(positionId) {
        const position = await PositionModel.findById(positionId);
        if (!position) {
            throw new Error('Không tìm thấy chức vụ');
        }
        return position;
    }

    // Cập nhật chức vụ
    static async updatePosition(positionId, updateData) {
        const position = await PositionModel.findById(positionId);
        if (!position) {
            throw new Error('Không tìm thấy chức vụ');
        }

        // Kiểm tra tên trùng
        if (updateData.ten_chuc_vu) {
            const exists = await PositionModel.existsByName(
                updateData.ten_chuc_vu,
                positionId
            );
            if (exists) {
                throw new Error('Tên chức vụ đã tồn tại');
            }
        }

        const updated = await PositionModel.update(positionId, updateData);
        if (!updated) {
            throw new Error('Cập nhật chức vụ thất bại');
        }

        return await PositionModel.findById(positionId);
    }

    // Xóa chức vụ
    static async deletePosition(positionId) {
        const position = await PositionModel.findById(positionId);
        if (!position) {
            throw new Error('Không tìm thấy chức vụ');
        }

        // Kiểm tra chức vụ có đang được sử dụng không
        const inUse = await PositionModel.isInUse(positionId);
        if (inUse) {
            throw new Error('Không thể xóa chức vụ đang được sử dụng bởi bác sĩ');
        }

        const deleted = await PositionModel.delete(positionId);
        if (!deleted) {
            throw new Error('Xóa chức vụ thất bại');
        }

        return true;
    }
}

module.exports = PositionService;