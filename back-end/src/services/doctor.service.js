const DoctorModel = require('../models/doctor.model');
const PositionModel = require('../models/position.model');
const UserModel = require('../models/user.model');
const RoleModel = require('../models/role.model');
const bcrypt = require('bcryptjs');
const CONSTANTS = require('../config/constants');
const DoctorSpecialtyModel = require('../models/doctorSpecialty.model');
const SpecialtyModel = require('../models/specialty.model');
const AppointmentModel = require('../models/appointment.model');

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
            chuyen_khoa_ids, // ✅ Array of specialty IDs
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

        // ✅ 5.5. Kiểm tra chuyên khoa (phải chọn ít nhất 1)
        if (!chuyen_khoa_ids || chuyen_khoa_ids.length === 0) {
            console.log('Chuyen khoa ids is empty:', doctorData);
            throw new Error('Phải chọn ít nhất 1 chuyên khoa');
        }

        // ✅ 5.6. Validate tất cả chuyên khoa tồn tại
        for (const specialtyId of chuyen_khoa_ids) {
            const specialty = await SpecialtyModel.findById(specialtyId);
            if (!specialty) {
                throw new Error(`Chuyên khoa ${specialtyId} không tồn tại`);
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
            ma_chuc_vu_bac_si: ma_chuc_vu_bac_si || null,
            so_nam_kinh_nghiem_bac_si: so_nam_kinh_nghiem_bac_si || null,
            bang_cap_bac_si: processedBangCap,
            dang_hoat_dong_bac_si: 1
        });

        console.log('✅ Created doctor:', doctorId);

        // ✅ 10. Thêm chuyên khoa cho bác sĩ
        await DoctorSpecialtyModel.addMultipleSpecialties(doctorId, chuyen_khoa_ids);
        console.log('✅ Added specialties:', chuyen_khoa_ids);

        // 11. Lấy thông tin đầy đủ
        const doctor = await this.getDoctorById(doctorId);

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
        if (updateData.ten_nguoi_dung !== undefined) {
            userUpdateData.ten_nguoi_dung = updateData.ten_nguoi_dung;
        }
        if (updateData.ho_nguoi_dung !== undefined) {
            userUpdateData.ho_nguoi_dung = updateData.ho_nguoi_dung;
        }
        if (updateData.email_nguoi_dung !== undefined) {
            userUpdateData.email_nguoi_dung = updateData.email_nguoi_dung;
        }
        if (updateData.so_dien_thoai_nguoi_dung !== undefined) {
            userUpdateData.so_dien_thoai_nguoi_dung = updateData.so_dien_thoai_nguoi_dung;
        }
        if (updateData.gioi_tinh_nguoi_dung !== undefined) {
            userUpdateData.gioi_tinh_nguoi_dung = updateData.gioi_tinh_nguoi_dung;
        }

        // ✅ Password update (nếu có)
        if (updateData.mat_khau_nguoi_dung) {
            const hashedPassword = await bcrypt.hash(updateData.mat_khau_nguoi_dung, 10);
            userUpdateData.mat_khau_nguoi_dung = hashedPassword;
        }

        // Doctor fields
        if (updateData.ma_chuc_vu_bac_si !== undefined) {
            doctorUpdateData.ma_chuc_vu_bac_si = updateData.ma_chuc_vu_bac_si;
        }
        if (updateData.so_nam_kinh_nghiem_bac_si !== undefined) {
            doctorUpdateData.so_nam_kinh_nghiem_bac_si = updateData.so_nam_kinh_nghiem_bac_si;
        }
        if (updateData.dang_hoat_dong_bac_si !== undefined) {
            doctorUpdateData.dang_hoat_dong_bac_si = updateData.dang_hoat_dong_bac_si;
        }

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

        // ✅ Cập nhật chuyên khoa (nếu có)
        if (updateData.chuyen_khoa_ids !== undefined) {
            // Validate chuyên khoa
            if (updateData.chuyen_khoa_ids.length === 0) {
                throw new Error('Phải chọn ít nhất 1 chuyên khoa');
            }

            // Validate tất cả chuyên khoa tồn tại
            for (const specialtyId of updateData.chuyen_khoa_ids) {
                const specialty = await SpecialtyModel.findById(specialtyId);
                if (!specialty) {
                    throw new Error(`Chuyên khoa ${specialtyId} không tồn tại`);
                }
            }

            // Cập nhật chuyên khoa
            await DoctorSpecialtyModel.updateDoctorSpecialties(
                doctorId,
                updateData.chuyen_khoa_ids
            );
            console.log('✅ Updated specialties:', updateData.chuyen_khoa_ids);
        }

        // Update User (nếu có)
        if (Object.keys(userUpdateData).length > 0) {
            await UserModel.update(doctor.ma_nguoi_dung_bac_si, userUpdateData);
            console.log('✅ Updated user');
        }

        // Update Doctor (nếu có)
        if (Object.keys(doctorUpdateData).length > 0) {
            await DoctorModel.update(doctorId, doctorUpdateData);
            console.log('✅ Updated doctor');
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



    // Lấy bác sĩ available theo ngày giờ
    // DoctorService.js
    static async getAvailableDoctors(date, startTime, endTime, specialtyId = null) {
        console.log('Getting available doctors for', date, startTime, endTime, specialtyId);

        const schedules = await DoctorModel.findByWorkSchedule(date, specialtyId);

        const startMin = this.toMinutes(startTime);
        const endMin = this.toMinutes(endTime);

        const doctorMap = new Map(); // key = ma_bac_si

        for (const ws of schedules) {
            const wsStart = this.toMinutes(ws.thoi_gian_bat_dau_lich_lam_viec);
            const wsEnd = this.toMinutes(ws.thoi_gian_ket_thuc_lich_lam_viec);

            // ❌ Slot không nằm trong ca → loại
            if (startMin < wsStart || endMin > wsEnd) {
                continue;
            }

            // ❌ Slot đã có lịch hẹn → loại
            const isAvailable = await AppointmentModel.isSlotAvailable(
                ws.ma_bac_si,
                date,
                startTime,
                endTime
            );

            if (!isAvailable) continue;

            // ✅ Gộp theo bác sĩ (1 bác sĩ chỉ xuất hiện 1 lần)
            if (!doctorMap.has(ws.ma_bac_si)) {
                doctorMap.set(ws.ma_bac_si, ws);
            }
        }

        return Array.from(doctorMap.values());
    }

    // helper
    static toMinutes(time) {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
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