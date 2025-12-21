const SpecialtyModel = require('../models/specialty.model');

class SpecialtyService {
    // Tạo chuyên khoa mới
    static async create(specialtyData) {
        const { ten_chuyen_khoa } = specialtyData;

        // Kiểm tra tên đã tồn tại
        const exists = await SpecialtyModel.existsByName(ten_chuyen_khoa);
        if (exists) {
            throw new Error('Tên chuyên khoa đã tồn tại');
        }



        const specialtyId = await SpecialtyModel.create(specialtyData);
        const specialty = await SpecialtyModel.findById(specialtyId);

        return specialty;
    }

    // Lấy danh sách chuyên khoa
    static async getAll(page, limit, search) {
        const result = await SpecialtyModel.findAll(page, limit, search);

        // Chuyển BLOB sang base64
        result.data = result.data.map(specialty => ({
            ...specialty
        }));

        return result;
    }

    // Lấy thông tin chuyên khoa theo ID
    static async getById(specialtyId) {
        const specialty = await SpecialtyModel.findById(specialtyId);

        if (!specialty) {
            throw new Error('Không tìm thấy chuyên khoa');
        }



        return specialty;
    }

    // Cập nhật chuyên khoa
    static async update(specialtyId, updateData) {
        // Kiểm tra chuyên khoa có tồn tại
        const specialty = await SpecialtyModel.findById(specialtyId);
        if (!specialty) {
            throw new Error('Không tìm thấy chuyên khoa');
        }

        // Kiểm tra tên mới có trùng không
        if (updateData.ten_chuyen_khoa) {
            const exists = await SpecialtyModel.existsByName(
                updateData.ten_chuyen_khoa,
                specialtyId
            );
            if (exists) {
                throw new Error('Tên chuyên khoa đã tồn tại');
            }
        }



        const updated = await SpecialtyModel.update(specialtyId, updateData);

        if (!updated) {
            throw new Error('Cập nhật chuyên khoa thất bại');
        }

        return await this.getById(specialtyId);
    }

    // Xóa chuyên khoa
    static async delete(specialtyId) {
        // Kiểm tra chuyên khoa có tồn tại
        const specialty = await SpecialtyModel.findById(specialtyId);
        if (!specialty) {
            throw new Error('Không tìm thấy chuyên khoa');
        }

        // Kiểm tra chuyên khoa có đang được sử dụng không
        const inUse = await SpecialtyModel.isInUse(specialtyId);
        if (inUse) {
            throw new Error('Không thể xóa chuyên khoa đang được sử dụng');
        }

        const deleted = await SpecialtyModel.delete(specialtyId);

        if (!deleted) {
            throw new Error('Xóa chuyên khoa thất bại');
        }

        return true;
    }
}

module.exports = SpecialtyService;