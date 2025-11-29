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

        // Xử lý hình ảnh base64 nếu có
        if (specialtyData.hinh_anh_chuyen_khoa) {
            // Chuyển base64 sang Buffer
            const base64Data = specialtyData.hinh_anh_chuyen_khoa.replace(/^data:image\/\w+;base64,/, '');
            specialtyData.hinh_anh_chuyen_khoa = Buffer.from(base64Data, 'base64');
        }

        const specialtyId = await SpecialtyModel.create(specialtyData);
        const specialty = await SpecialtyModel.findById(specialtyId);

        // Chuyển BLOB sang base64 để trả về
        if (specialty.hinh_anh_chuyen_khoa) {
            specialty.hinh_anh_chuyen_khoa = specialty.hinh_anh_chuyen_khoa.toString('base64');
        }

        return specialty;
    }

    // Lấy danh sách chuyên khoa
    static async getAll(page, limit, search) {
        const result = await SpecialtyModel.findAll(page, limit, search);

        // Chuyển BLOB sang base64
        result.data = result.data.map(specialty => ({
            ...specialty,
            hinh_anh_chuyen_khoa: specialty.hinh_anh_chuyen_khoa
                ? specialty.hinh_anh_chuyen_khoa.toString('base64')
                : null
        }));

        return result;
    }

    // Lấy thông tin chuyên khoa theo ID
    static async getById(specialtyId) {
        const specialty = await SpecialtyModel.findById(specialtyId);

        if (!specialty) {
            throw new Error('Không tìm thấy chuyên khoa');
        }

        // Chuyển BLOB sang base64
        if (specialty.hinh_anh_chuyen_khoa) {
            specialty.hinh_anh_chuyen_khoa = specialty.hinh_anh_chuyen_khoa.toString('base64');
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

        // Xử lý hình ảnh base64 nếu có
        if (updateData.hinh_anh_chuyen_khoa) {
            const base64Data = updateData.hinh_anh_chuyen_khoa.replace(/^data:image\/\w+;base64,/, '');
            updateData.hinh_anh_chuyen_khoa = Buffer.from(base64Data, 'base64');
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