const DoctorModel = require('../models/doctor.model');
const SpecialtyModel = require('../models/specialty.model');
const ServiceModel = require('../models/service.model');
const PatientService = require('./patient.service');
const AppointmentModel = require('../models/appointment.model');

class ReceptionistAppointmentService {
    static async create(data, receptionistId) {
        const {
            so_dien_thoai_benh_nhan,
            ho_benh_nhan,
            ten_benh_nhan,
            ma_bac_si,
            ma_chuyen_khoa,
            ma_dich_vu_lich_hen,
            ngay_hen,
            gio_bat_dau,
            gio_ket_thuc,
            ly_do_kham_lich_hen,
            check_in_ngay
        } = data;

        // 1. Kiểm tra bác sĩ
        const doctor = await DoctorModel.findById(ma_bac_si);
        if (!doctor) throw new Error('Bác sĩ không tồn tại');

        // 2. Kiểm tra chuyên khoa
        if (ma_chuyen_khoa) {
            const specialty = await SpecialtyModel.findById(ma_chuyen_khoa);
            if (!specialty) throw new Error('Chuyên khoa không tồn tại');
        }

        // 3. Kiểm tra dịch vụ
        let serviceFee = 0;
        if (ma_dich_vu_lich_hen) {
            const service = await ServiceModel.findById(ma_dich_vu_lich_hen);
            if (!service) throw new Error('Dịch vụ không tồn tại');
            serviceFee = parseFloat(service.don_gia_dich_vu);
        }

        // 4. Kiểm tra slot
        const isAvailable = await AppointmentModel.isSlotAvailable(
            ma_bac_si,
            ngay_hen,
            gio_bat_dau,
            gio_ket_thuc
        );
        if (!isAvailable) {
            throw new Error('Khung giờ này đã có người đặt');
        }

        // 5. Tìm hoặc tạo bệnh nhân
        const patient = await PatientService.findOrCreate({
            so_dien_thoai_benh_nhan,
            ho_benh_nhan,
            ten_benh_nhan
        });

        // 6. Xác định trạng thái
        let trangThai = 1; // đã xác nhận
        let thoiGianCheckIn = null;

        if (check_in_ngay) {
            trangThai = 2;
            thoiGianCheckIn = new Date();
        }

        // 7. Tạo lịch hẹn
        const appointmentId = await AppointmentModel.create({
            ma_nguoi_tao_lich_hen: null,
            ma_nguoi_xac_nhan: receptionistId,
            ma_bac_si,
            ma_benh_nhan: patient.ma_benh_nhan,
            ma_chuyen_khoa,
            ma_dich_vu_lich_hen,
            trang_thai_lich_hen: trangThai,
            thoi_gian_xac_nhan: new Date(),
            thoi_gian_check_in: thoiGianCheckIn,
            ly_do_kham_lich_hen: ly_do_kham_lich_hen || 'Đặt tại quầy',
            ghi_chu_lich_hen: 'Đặt tại quầy',
            gia_dich_vu_lich_hen: serviceFee,
            tong_gia_lich_hen: serviceFee,
            ngay_hen,
            gio_bat_dau,
            gio_ket_thuc
        });

        return await AppointmentModel.findById(appointmentId);
    }
}

module.exports = ReceptionistAppointmentService;
