const DoctorModel = require('../models/doctor.model');
const PositionModel = require('../models/position.model');
const UserModel = require('../models/user.model');
const RoleModel = require('../models/role.model');
const bcrypt = require('bcryptjs');
const CONSTANTS = require('../config/constants');

class DoctorService {
    // Tạo bác sĩ (tạo cả User + Doctor)
    static async createDoctor(doctorData) {
        const {
            // User fields
            ten_nguoi_dung,
            ho_nguoi_dung,
            ten_dang_nhap_nguoi_dung,
            email_nguoi_dung,
            so_dien_thoai_nguoi_dung,
            mat_khau_nguoi_dung,
            gioi_tinh_nguoi_dung,
            // Doctor fields
            ma_chuyen_khoa_bac_si,
            ma_chuc_vu_bac_si,
            so_nam_kinh_nghiem_bac_si,
            bang_cap_bac_si
        } = doctorData;

        // 1. Kiểm tra username đã tồn tại
        const existingUsername = await UserModel.findByUsername(ten_dang_nhap_nguoi_dung);
        if (existingUsername) {
            throw new Error('Tên đăng nhập đã tồn tại');
        }

        // 2. Kiểm tra email đã tồn tại
        const existingEmail = await UserModel.findByEmail(email_nguoi_dung);
        if (existingEmail) {
            throw new Error('Email đã tồn tại');
        }

        // 3. Kiểm tra số điện thoại đã tồn tại
        const existingPhone = await UserModel.findByPhone(so_dien_thoai_nguoi_dung);
        if (existingPhone) {
            throw new Error('Số điện thoại đã tồn tại');
        }

        // 4. Lấy role "Bác sĩ"
        const doctorRole = await RoleModel.findByName(CONSTANTS.ROLES.DOCTOR);
        if (!doctorRole) {
            throw new Error('Vai trò Bác sĩ không tồn tại trong hệ thống');
        }

        // 5. Kiểm tra chức vụ (nếu có)
        if (ma_chuc_vu_bac_si) {
            const position = await PositionModel.findById(ma_chuc_vu_bac_si);
            if (!position) {
                throw new Error('Chức vụ không tồn tại');
            }
        }

        // 6. Hash password
        const hashedPassword = await bcrypt.hash(mat_khau_nguoi_dung, 10);

        // 7. Tạo User
        const userId = await UserModel.create({
            ten_nguoi_dung,
            ho_nguoi_dung,
            ten_dang_nhap_nguoi_dung,
            email_nguoi_dung,
            so_dien_thoai_nguoi_dung,
            mat_khau_nguoi_dung: hashedPassword,
            gioi_tinh_nguoi_dung,
            ma_vai_tro: doctorRole.ma_vai_tro
        });

        console.log('✅ Created user:', userId);

        // 8. Xử lý bằng cấp base64 nếu có
        let processedBangCap = null;
        if (bang_cap_bac_si) {
            const base64Data = bang_cap_bac_si.replace(/^data:.*?;base64,/, '');
            processedBangCap = Buffer.from(base64Data, 'base64');
        }

        // 9. Tạo Doctor
        const doctorId = await DoctorModel.create({
            ma_nguoi_dung_bac_si: userId,
            ma_chuyen_khoa_bac_si: ma_chuyen_khoa_bac_si || null,
            ma_chuc_vu_bac_si: ma_chuc_vu_bac_si || null,
            so_nam_kinh_nghiem_bac_si: so_nam_kinh_nghiem_bac_si || null,
            bang_cap_bac_si: processedBangCap,
            dang_hoat_dong_bac_si: 1
        });

        console.log('✅ Created doctor:', doctorId);

        // 10. Lấy thông tin đầy đủ
        const doctor = await DoctorModel.findById(doctorId);

        // 11. Chuyển BLOB sang base64
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

        // Tách data User và Doctor
        const userUpdateData = {};
        const doctorUpdateData = {};

        // User fields
        if (updateData.ten_nguoi_dung !== undefined) userUpdateData.ten_nguoi_dung = updateData.ten_nguoi_dung;
        if (updateData.ho_nguoi_dung !== undefined) userUpdateData.ho_nguoi_dung = updateData.ho_nguoi_dung;
        if (updateData.email_nguoi_dung !== undefined) userUpdateData.email_nguoi_dung = updateData.email_nguoi_dung;
        if (updateData.so_dien_thoai_nguoi_dung !== undefined) userUpdateData.so_dien_thoai_nguoi_dung = updateData.so_dien_thoai_nguoi_dung;
        if (updateData.gioi_tinh_nguoi_dung !== undefined) userUpdateData.gioi_tinh_nguoi_dung = updateData.gioi_tinh_nguoi_dung;

        // Doctor fields
        if (updateData.ma_chuyen_khoa_bac_si !== undefined) doctorUpdateData.ma_chuyen_khoa_bac_si = updateData.ma_chuyen_khoa_bac_si;
        if (updateData.ma_chuc_vu_bac_si !== undefined) doctorUpdateData.ma_chuc_vu_bac_si = updateData.ma_chuc_vu_bac_si;
        if (updateData.so_nam_kinh_nghiem_bac_si !== undefined) doctorUpdateData.so_nam_kinh_nghiem_bac_si = updateData.so_nam_kinh_nghiem_bac_si;
        if (updateData.dang_hoat_dong_bac_si !== undefined) doctorUpdateData.dang_hoat_dong_bac_si = updateData.dang_hoat_dong_bac_si;

        // Xử lý bằng cấp base64
        if (updateData.bang_cap_bac_si) {
            const base64Data = updateData.bang_cap_bac_si.replace(/^data:.*?;base64,/, '');
            doctorUpdateData.bang_cap_bac_si = Buffer.from(base64Data, 'base64');
        }

        // Kiểm tra chức vụ
        if (doctorUpdateData.ma_chuc_vu_bac_si) {
            const position = await PositionModel.findById(doctorUpdateData.ma_chuc_vu_bac_si);
            if (!position) {
                throw new Error('Chức vụ không tồn tại');
            }
        }

        // Update User (nếu có)
        if (Object.keys(userUpdateData).length > 0) {
            await UserModel.update(doctor.ma_nguoi_dung_bac_si, userUpdateData);
        }

        // Update Doctor (nếu có)
        if (Object.keys(doctorUpdateData).length > 0) {
            await DoctorModel.update(doctorId, doctorUpdateData);
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

        // Xóa Doctor trước
        await DoctorModel.delete(doctorId);

        // Xóa User
        await UserModel.delete(doctor.ma_nguoi_dung_bac_si);

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