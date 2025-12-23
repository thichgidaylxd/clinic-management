const WorkScheduleModel = require('../models/workSchedule.model');
const DoctorModel = require('../models/doctor.model');
const RoomModel = require('../models/room.model');
const SpecialtyModel = require('../models/specialty.model');

class WorkScheduleService {
    // Tạo lịch làm việc
    static async create(scheduleData) {
        const {
            ma_bac_si_lich_lam_viec,
            ngay_lich_lam_viec,
            thoi_gian_bat_dau_lich_lam_viec,
            thoi_gian_ket_thuc_lich_lam_viec
        } = scheduleData;

        // Kiểm tra bác sĩ có tồn tại
        const doctor = await DoctorModel.findById(ma_bac_si_lich_lam_viec);
        if (!doctor) {
            throw new Error('Bác sĩ không tồn tại');
        }

        // ❌ XÓA: Validate chuyên khoa

        // Kiểm tra bác sĩ có trùng lịch không
        const hasConflict = await WorkScheduleModel.hasConflict(
            ma_bac_si_lich_lam_viec,
            ngay_lich_lam_viec,
            thoi_gian_bat_dau_lich_lam_viec,
            thoi_gian_ket_thuc_lich_lam_viec
        );

        if (hasConflict) {
            throw new Error('Bác sĩ đã có lịch làm việc trùng với khung giờ này');
        }

        const scheduleId = await WorkScheduleModel.create(scheduleData);
        return await WorkScheduleModel.findById(scheduleId);
    }

    // Lấy danh sách lịch làm việc
    static async getAll(page, limit, filters) {
        // Kiểm tra bác sĩ
        console.log("dsfsd", filters)
        if (filters.doctorId) {
            const doctor = await DoctorModel.findById(filters.doctorId);
            if (!doctor) {
                throw new Error('Bác sĩ không tồn tại');
            }
        }


        // Kiểm tra phòng
        if (filters.roomId) {
            const room = await RoomModel.findById(filters.roomId);
            if (!room) {
                throw new Error('Phòng khám không tồn tại');
            }
        }

        return await WorkScheduleModel.findAll(page, limit, filters);

    }

    static async getMySchedule(user, query) {
        if (!user?.ma_nguoi_dung) {
            throw new Error('Không xác định được người dùng');
        }

        // 🔑 LẤY BÁC SĨ TỪ USER
        const doctor = await DoctorModel.findByUserId(user.ma_nguoi_dung);

        if (!doctor) {
            throw new Error('Người dùng không phải là bác sĩ');
        }

        const { fromDate, toDate } = query;

        return WorkScheduleModel.getByDoctor(
            doctor.ma_bac_si,
            fromDate || null,
            toDate || null
        );
    }

    // Lấy thông tin lịch làm việc theo ID
    static async getById(scheduleId) {
        const schedule = await WorkScheduleModel.findById(scheduleId);
        if (!schedule) {
            throw new Error('Không tìm thấy lịch làm việc');
        }
        return schedule;
    }

    // Cập nhật lịch làm việc
    static async update(scheduleId, updateData) {
        const schedule = await WorkScheduleModel.findById(scheduleId);
        if (!schedule) {
            throw new Error('Không tìm thấy lịch làm việc');
        }

        const {
            // ❌ XÓA: ma_phong_kham_lich_lam_viec
            // ❌ XÓA: ma_chuyen_khoa_lich_lam_viec
            ngay_lich_lam_viec,
            thoi_gian_bat_dau_lich_lam_viec,
            thoi_gian_ket_thuc_lich_lam_viec
        } = updateData;



        // ❌ XÓA: Validate chuyên khoa

        // Kiểm tra trùng lịch nếu có thay đổi thời gian
        if (ngay_lich_lam_viec || thoi_gian_bat_dau_lich_lam_viec || thoi_gian_ket_thuc_lich_lam_viec) {
            const hasConflict = await WorkScheduleModel.hasConflict(
                schedule.ma_bac_si_lich_lam_viec,
                ngay_lich_lam_viec || schedule.ngay_lich_lam_viec,
                thoi_gian_bat_dau_lich_lam_viec || schedule.thoi_gian_bat_dau_lich_lam_viec,
                thoi_gian_ket_thuc_lich_lam_viec || schedule.thoi_gian_ket_thuc_lich_lam_viec,
                scheduleId
            );

            if (hasConflict) {
                throw new Error('Bác sĩ đã có lịch làm việc trùng với khung giờ này');
            }
        }

        const updated = await WorkScheduleModel.update(scheduleId, updateData);
        if (!updated) {
            throw new Error('Cập nhật lịch làm việc thất bại');
        }

        return await WorkScheduleModel.findById(scheduleId);
    }



    // Xóa lịch làm việc
    static async delete(scheduleId) {
        const schedule = await WorkScheduleModel.findById(scheduleId);
        if (!schedule) {
            throw new Error('Không tìm thấy lịch làm việc');
        }

        // TODO: Kiểm tra có lịch hẹn nào trong lịch làm việc này không
        // Nếu có thì không cho xóa hoặc cascade delete

        const deleted = await WorkScheduleModel.delete(scheduleId);
        if (!deleted) {
            throw new Error('Xóa lịch làm việc thất bại');
        }

        return true;
    }

    // Lấy lịch làm việc của bác sĩ theo ngày
    static async getDoctorScheduleByDate(doctorId, date) {
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            throw new Error('Bác sĩ không tồn tại');
        }

        return await WorkScheduleModel.getDoctorScheduleByDate(doctorId, date);
    }

    // Lấy lịch làm việc của bác sĩ trong khoảng thời gian
    static async getDoctorScheduleByRange(doctorId, fromDate, toDate) {
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            throw new Error('Bác sĩ không tồn tại');
        }

        return await WorkScheduleModel.getDoctorScheduleByRange(doctorId, fromDate, toDate);
    }

    // Thống kê lịch làm việc theo bác sĩ
    static async getStatsByDoctor(fromDate, toDate) {
        return await WorkScheduleModel.getStatsByDoctor(fromDate, toDate);
    }
}

module.exports = WorkScheduleService;