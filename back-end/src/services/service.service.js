const ServiceModel = require('../models/service.model');
const SpecialtyModel = require('../models/specialty.model');

class ServiceService {
    // Tạo dịch vụ mới
    static async create(serviceData) {
        const { ten_dich_vu, ma_chuyen_khoa_dich_vu } = serviceData;

        // Kiểm tra tên đã tồn tại
        const exists = await ServiceModel.existsByName(ten_dich_vu);
        if (exists) {
            throw new Error('Tên dịch vụ đã tồn tại');
        }

        // Kiểm tra chuyên khoa có tồn tại (nếu có)
        if (ma_chuyen_khoa_dich_vu) {
            const specialty = await SpecialtyModel.findById(ma_chuyen_khoa_dich_vu);
            if (!specialty) {
                throw new Error('Chuyên khoa không tồn tại');
            }
        }

        const serviceId = await ServiceModel.create(serviceData);
        const service = await ServiceModel.findById(serviceId);

        return service;
    }

    // Lấy danh sách dịch vụ
    static async getAll(page, limit, search, specialtyId) {
        // Nếu có specialtyId, kiểm tra xem chuyên khoa có tồn tại không
        if (specialtyId) {
            const specialty = await SpecialtyModel.findById(specialtyId);
            if (!specialty) {
                throw new Error('Chuyên khoa không tồn tại');
            }
        }

        return await ServiceModel.findAll(page, limit, search, specialtyId);
    }

    // Lấy thông tin dịch vụ theo ID
    static async getById(serviceId) {
        const service = await ServiceModel.findById(serviceId);

        if (!service) {
            throw new Error('Không tìm thấy dịch vụ');
        }

        return service;
    }

    // Lấy dịch vụ theo chuyên khoa
    static async getBySpecialty(specialtyId) {
        // Kiểm tra chuyên khoa có tồn tại
        const specialty = await SpecialtyModel.findById(specialtyId);
        if (!specialty) {
            throw new Error('Chuyên khoa không tồn tại');
        }

        return await ServiceModel.findBySpecialty(specialtyId);
    }

    // Cập nhật dịch vụ
    static async update(serviceId, updateData) {
        // Kiểm tra dịch vụ có tồn tại
        const service = await ServiceModel.findById(serviceId);
        if (!service) {
            throw new Error('Không tìm thấy dịch vụ');
        }

        // Kiểm tra tên mới có trùng không
        if (updateData.ten_dich_vu) {
            const exists = await ServiceModel.existsByName(
                updateData.ten_dich_vu,
                serviceId
            );
            if (exists) {
                throw new Error('Tên dịch vụ đã tồn tại');
            }
        }

        // Kiểm tra chuyên khoa có tồn tại (nếu có)
        if (updateData.ma_chuyen_khoa_dich_vu) {
            const specialty = await SpecialtyModel.findById(updateData.ma_chuyen_khoa_dich_vu);
            if (!specialty) {
                throw new Error('Chuyên khoa không tồn tại');
            }
        }

        const updated = await ServiceModel.update(serviceId, updateData);

        if (!updated) {
            throw new Error('Cập nhật dịch vụ thất bại');
        }

        return await this.getById(serviceId);
    }

    // Xóa dịch vụ
    static async delete(serviceId) {
        // Kiểm tra dịch vụ có tồn tại
        const service = await ServiceModel.findById(serviceId);
        if (!service) {
            throw new Error('Không tìm thấy dịch vụ');
        }

        // Kiểm tra dịch vụ có đang được sử dụng không
        const inUse = await ServiceModel.isInUse(serviceId);
        if (inUse) {
            throw new Error('Không thể xóa dịch vụ đang được sử dụng trong lịch hẹn');
        }

        const deleted = await ServiceModel.delete(serviceId);

        if (!deleted) {
            throw new Error('Xóa dịch vụ thất bại');
        }

        return true;
    }

    // Thống kê dịch vụ theo chuyên khoa
    static async getStatsBySpecialty() {
        return await ServiceModel.getStatsBySpecialty();
    }

    // Lấy dịch vụ phổ biến nhất
    static async getMostPopular(limit = 10) {
        return await ServiceModel.getMostPopular(limit);
    }
}

module.exports = ServiceService;