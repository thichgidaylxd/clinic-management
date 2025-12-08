const DoctorModel = require('../models/doctor.model');
const PositionModel = require('../models/position.model');
const UserModel = require('../models/user.model');
const CONSTANTS = require('../config/constants');

class DoctorService {
    // ===== CHỨC VỤ =====

    // Tạo chức vụ
    static async createPosition(positionData) {
        const { ten_chuc_vu } = positionData;

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

        const inUse = await PositionModel.isInUse(positionId);
        if (inUse) {
            throw new Error('Không thể xóa chức vụ đang được sử dụng');
        }

        const deleted = await PositionModel.delete(positionId);
        if (!deleted) {
            throw new Error('Xóa chức vụ thất bại');
        }

        return true;
    }

    // ===== BÁC SĨ =====

    // Tạo bác sĩ
    static async createDoctor(doctorData) {
        const { ma_nguoi_dung_bac_si, ma_chuc_vu_bac_si } = doctorData;

        // Kiểm tra user có tồn tại
        const user = await UserModel.findById(ma_nguoi_dung_bac_si);
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }

        // Kiểm tra user đã là bác sĩ chưa
        const exists = await DoctorModel.existsByUserId(ma_nguoi_dung_bac_si);
        if (exists) {
            throw new Error('Người dùng này đã là bác sĩ');
        }

        // Kiểm tra role phải là Bác sĩ
        if (user.ten_vai_tro !== CONSTANTS.ROLES.DOCTOR) {
            throw new Error('Người dùng phải có vai trò Bác sĩ');
        }

        // Kiểm tra chức vụ có tồn tại (nếu có)
        if (ma_chuc_vu_bac_si) {
            const position = await PositionModel.findById(ma_chuc_vu_bac_si);
            if (!position) {
                throw new Error('Chức vụ không tồn tại');
            }
        }

        // Xử lý bằng cấp base64 nếu có
        if (doctorData.bang_cap_bac_si) {
            const base64Data = doctorData.bang_cap_bac_si.replace(/^data:.*?;base64,/, '');
            doctorData.bang_cap_bac_si = Buffer.from(base64Data, 'base64');
        }

        const doctorId = await DoctorModel.create(doctorData);
        const doctor = await DoctorModel.findById(doctorId);

        // Chuyển BLOB sang base64
        if (doctor.bang_cap_bac_si) {
            doctor.bang_cap_bac_si = doctor.bang_cap_bac_si.toString('base64');
        }

        return doctor;
    }

    // Lấy danh sách bác sĩ
    static async getAllDoctors(page, limit, search, status, positionId) {
        // Kiểm tra chức vụ nếu có
        if (positionId) {
            const position = await PositionModel.findById(positionId);
            if (!position) {
                throw new Error('Chức vụ không tồn tại');
            }
        }

        const result = await DoctorModel.findAll(page, limit, search, status, positionId);

        // Chuyển BLOB sang base64
        result.data = result.data.map(doctor => ({
            ...doctor,
            bang_cap_bac_si: doctor.bang_cap_bac_si
                ? doctor.bang_cap_bac_si.toString('base64')
                : null
        }));

        return result;
    }

    // Lấy thông tin bác sĩ theo ID
    static async getDoctorById(doctorId) {
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            throw new Error('Không tìm thấy bác sĩ');
        }

        // Chuyển BLOB sang base64
        if (doctor.bang_cap_bac_si) {
            doctor.bang_cap_bac_si = doctor.bang_cap_bac_si.toString('base64');
        }

        return doctor;
    }

    // Cập nhật bác sĩ
    static async updateDoctor(doctorId, updateData) {
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            throw new Error('Không tìm thấy bác sĩ');
        }

        // Kiểm tra chức vụ có tồn tại (nếu có)
        if (updateData.ma_chuc_vu_bac_si) {
            const position = await PositionModel.findById(updateData.ma_chuc_vu_bac_si);
            if (!position) {
                throw new Error('Chức vụ không tồn tại');
            }
        }

        // Xử lý bằng cấp base64 nếu có
        if (updateData.bang_cap_bac_si) {
            const base64Data = updateData.bang_cap_bac_si.replace(/^data:.*?;base64,/, '');
            updateData.bang_cap_bac_si = Buffer.from(base64Data, 'base64');
        }

        const updated = await DoctorModel.update(doctorId, updateData);
        if (!updated) {
            throw new Error('Cập nhật bác sĩ thất bại');
        }

        return await this.getDoctorById(doctorId);
    }

    // Xóa bác sĩ
    static async deleteDoctor(doctorId) {
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            throw new Error('Không tìm thấy bác sĩ');
        }

        const inUse = await DoctorModel.isInUse(doctorId);
        if (inUse) {
            throw new Error('Không thể xóa bác sĩ đang có lịch làm việc hoặc lịch hẹn');
        }

        const deleted = await DoctorModel.delete(doctorId);
        if (!deleted) {
            throw new Error('Xóa bác sĩ thất bại');
        }

        return true;
    }

    // Lấy đánh giá của bác sĩ
    static async getDoctorRatings(doctorId, page, limit) {
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            throw new Error('Không tìm thấy bác sĩ');
        }

        return await DoctorModel.getRatings(doctorId, page, limit);
    }

    // Lấy thống kê đánh giá
    static async getDoctorRatingStats(doctorId) {
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            throw new Error('Không tìm thấy bác sĩ');
        }

        return await DoctorModel.getRatingStats(doctorId);
    }

    // Lấy bác sĩ có đánh giá cao nhất
    static async getTopRatedDoctors(limit = 10) {
        return await DoctorModel.getTopRated(limit);
    }

    // Thống kê bác sĩ theo chức vụ
    static async getStatsByPosition() {
        return await DoctorModel.getStatsByPosition();
    }
}

module.exports = DoctorService;