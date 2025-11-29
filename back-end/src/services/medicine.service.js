const MedicineModel = require('../models/medicine.model');

class MedicineService {
    // Tạo thuốc mới
    static async create(medicineData, userId) {
        const { ten_thuoc } = medicineData;

        // Kiểm tra tên đã tồn tại
        const exists = await MedicineModel.existsByName(ten_thuoc);
        if (exists) {
            throw new Error('Tên thuốc đã tồn tại');
        }

        // Xử lý giấy tờ kiểm định base64 nếu có
        if (medicineData.giay_to_kiem_dinh_thuoc) {
            const base64Data = medicineData.giay_to_kiem_dinh_thuoc.replace(/^data:.*?;base64,/, '');
            medicineData.giay_to_kiem_dinh_thuoc = Buffer.from(base64Data, 'base64');
        }

        const medicineId = await MedicineModel.create(medicineData, userId);
        const medicine = await MedicineModel.findById(medicineId);

        // Chuyển BLOB sang base64 để trả về
        if (medicine.giay_to_kiem_dinh_thuoc) {
            medicine.giay_to_kiem_dinh_thuoc = medicine.giay_to_kiem_dinh_thuoc.toString('base64');
        }

        return medicine;
    }

    // Lấy danh sách thuốc
    static async getAll(page, limit, search, status) {
        const result = await MedicineModel.findAll(page, limit, search, status);

        // Chuyển BLOB sang base64
        result.data = result.data.map(medicine => ({
            ...medicine,
            giay_to_kiem_dinh_thuoc: medicine.giay_to_kiem_dinh_thuoc
                ? medicine.giay_to_kiem_dinh_thuoc.toString('base64')
                : null
        }));

        return result;
    }

    // Lấy thông tin thuốc theo ID
    static async getById(medicineId) {
        const medicine = await MedicineModel.findById(medicineId);

        if (!medicine) {
            throw new Error('Không tìm thấy thuốc');
        }

        // Chuyển BLOB sang base64
        if (medicine.giay_to_kiem_dinh_thuoc) {
            medicine.giay_to_kiem_dinh_thuoc = medicine.giay_to_kiem_dinh_thuoc.toString('base64');
        }

        return medicine;
    }

    // Cập nhật thuốc
    static async update(medicineId, updateData, userId) {
        // Kiểm tra thuốc có tồn tại
        const medicine = await MedicineModel.findById(medicineId);
        if (!medicine) {
            throw new Error('Không tìm thấy thuốc');
        }

        // Kiểm tra tên mới có trùng không
        if (updateData.ten_thuoc) {
            const exists = await MedicineModel.existsByName(
                updateData.ten_thuoc,
                medicineId
            );
            if (exists) {
                throw new Error('Tên thuốc đã tồn tại');
            }
        }

        // Xử lý giấy tờ kiểm định base64 nếu có
        if (updateData.giay_to_kiem_dinh_thuoc) {
            const base64Data = updateData.giay_to_kiem_dinh_thuoc.replace(/^data:.*?;base64,/, '');
            updateData.giay_to_kiem_dinh_thuoc = Buffer.from(base64Data, 'base64');
        }

        const updated = await MedicineModel.update(medicineId, updateData, userId);

        if (!updated) {
            throw new Error('Cập nhật thuốc thất bại');
        }

        return await this.getById(medicineId);
    }

    // Xóa thuốc (soft delete)
    static async delete(medicineId) {
        // Kiểm tra thuốc có tồn tại
        const medicine = await MedicineModel.findById(medicineId);
        if (!medicine) {
            throw new Error('Không tìm thấy thuốc');
        }

        // Kiểm tra thuốc có đang được sử dụng không
        const inUse = await MedicineModel.isInUse(medicineId);
        if (inUse) {
            // Nếu đang được sử dụng, chỉ soft delete
            const deleted = await MedicineModel.softDelete(medicineId);
            if (!deleted) {
                throw new Error('Xóa thuốc thất bại');
            }
            return { type: 'soft', message: 'Đã vô hiệu hóa thuốc' };
        }

        // Nếu không được sử dụng, xóa vĩnh viễn
        const deleted = await MedicineModel.delete(medicineId);
        if (!deleted) {
            throw new Error('Xóa thuốc thất bại');
        }

        return { type: 'hard', message: 'Đã xóa thuốc vĩnh viễn' };
    }

    // Lấy thuốc sắp hết hạn
    static async getExpiringSoon(days = 30) {
        return await MedicineModel.getExpiringSoon(days);
    }

    // Lấy thuốc sắp hết kho
    static async getLowStock(threshold = 10) {
        return await MedicineModel.getLowStock(threshold);
    }

    // Cập nhật tồn kho
    static async updateStock(medicineId, quantity, type) {
        const medicine = await MedicineModel.findById(medicineId);
        if (!medicine) {
            throw new Error('Không tìm thấy thuốc');
        }

        if (type === 'subtract' && medicine.so_luong_thuoc_ton_thuoc < quantity) {
            throw new Error('Số lượng tồn kho không đủ');
        }

        const updated = await MedicineModel.updateStock(medicineId, quantity, type);
        if (!updated) {
            throw new Error('Cập nhật tồn kho thất bại');
        }

        return await this.getById(medicineId);
    }
}

module.exports = MedicineService;