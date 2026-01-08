
const AppointmentModel = require('../models/appointment.model');
const MedicalRecordModel = require('../models/medicalRecordModel');
const PrescriptionModel = require('../models/prescriptionModel');
class PrescriptionService {


    // kê đơn thuốc
    static async createPrescription(data) {
        const {
            ma_lich_hen,
            ma_bac_si,

            trieu_chung,
            chuan_doan,
            phuong_phap_dieu_tri,

            medicines,
            ghi_chu_hoa_don,
            chi_phi_phat_sinh //  THÊM
        } = data;

        console.log('Creating prescription with data:', data);


        // ===== VALIDATE =====
        if (!ma_lich_hen || !ma_bac_si) {
            throw new Error('Thiếu thông tin bắt buộc');
        }

        if (!chuan_doan?.trim()) {
            throw new Error('Chẩn đoán không được để trống');
        }

        if (!Array.isArray(medicines) || medicines.length === 0) {
            throw new Error('Phải chọn ít nhất 1 loại thuốc');
        }

        // ===== LẤY LỊCH HẸN =====
        const appointment = await AppointmentModel.findById(ma_lich_hen);
        if (!appointment) {
            throw new Error('Không tìm thấy lịch hẹn');
        }

        if (appointment.trang_thai_lich_hen === 4) {
            throw new Error('Lịch hẹn đã hoàn thành');
        }

        // ===== KIỂM TRA TỒN KHO =====
        const stockCheck = await PrescriptionModel.checkMedicineStock(medicines);
        const unavailable = stockCheck.filter(m => !m.available);

        if (unavailable.length > 0) {
            throw new Error(
                unavailable.map(m => `${m.ten_thuoc}: ${m.reason}`).join(', ')
            );
        }


        // ===== 1. TẠO HỒ SƠ BỆNH ÁN =====
        const ma_ho_so_benh_an = await MedicalRecordModel.create({
            ma_benh_nhan: appointment.ma_benh_nhan,
            ma_bac_si,
            ma_chuyen_khoa: appointment.ma_chuyen_khoa,
            trieu_chung,
            chuan_doan,
            phuong_phap_dieu_tri
        });

        // ===== 2. TẠO HÓA ĐƠN + THUỐC =====
        const ma_hoa_don = await PrescriptionModel.create({
            ma_benh_nhan: appointment.ma_benh_nhan,
            ma_chuyen_khoa: appointment.ma_chuyen_khoa,

            //  user bệnh nhân (nullable)
            ma_nguoi_dung_hoa_don: appointment.ma_nguoi_tao_lich_hen || null,

            ten_dich_vu: appointment.ten_dich_vu || null,
            gia_dich_vu: appointment.gia_dich_vu_lich_hen || 0,
            chi_phi_phat_sinh: Number(chi_phi_phat_sinh || 0), //  SỬA

            medicines,
            ghi_chu_hoa_don
        });

        // ===== 3. HOÀN THÀNH LỊCH HẸN =====
        await AppointmentModel.update(ma_lich_hen, {
            trang_thai_lich_hen: 4,
            thoi_gian_hoan_thanh: new Date()
        });

        return {
            ma_ho_so_benh_an,
            ma_hoa_don
        };
    }

    /**
     * Kê đơn thuốc (KHÔNG lưu hồ sơ bệnh án)
     */
    static async createPrescriptionOnly(data) {
        const {
            ma_lich_hen,
            ma_bac_si,
            medicines,
            ghi_chu_hoa_don
        } = data;

        // Validate
        if (!ma_lich_hen || !ma_bac_si) {
            throw new Error('Thiếu thông tin bắt buộc');
        }

        if (!medicines || medicines.length === 0) {
            throw new Error('Phải có ít nhất 1 loại thuốc');
        }

        // Get appointment
        const appointment = await AppointmentModel.findById(ma_lich_hen);
        if (!appointment) {
            throw new Error('Không tìm thấy lịch hẹn');
        }

        // Check medicines stock
        const stockCheck = await PrescriptionModel.checkMedicineStock(medicines);
        const unavailable = stockCheck.filter(m => !m.available);

        if (unavailable.length > 0) {
            const errors = unavailable.map(m => `${m.ten_thuoc}: ${m.reason}`).join(', ');
            throw new Error(`Không thể kê đơn: ${errors}`);
        }

        // Create prescription
        const prescriptionData = {
            ma_benh_nhan: appointment.ma_benh_nhan,
            ma_chuyen_khoa: appointment.ma_chuyen_khoa,
            ma_nguoi_dung_hoa_don: ma_bac_si,

            ten_dich_vu: appointment.ten_dich_vu || null,
            gia_dich_vu: appointment.gia_dich_vu_lich_hen || 0,
            chi_phi_phat_sinh: 0,

            medicines,
            ghi_chu_hoa_don
        };


        const ma_hoa_don = await PrescriptionModel.create(prescriptionData);

        // Complete appointment
        await AppointmentModel.update(ma_lich_hen, {
            trang_thai_lich_hen: 4,
            thoi_gian_hoan_thanh: new Date()
        });

        // Get invoice details
        const invoice = await PrescriptionModel.getInvoiceDetails(ma_hoa_don);

        return {
            ma_hoa_don,
            invoice
        };
    }

    /**
     * Lấy chi tiết hóa đơn
     */
    static async getInvoiceDetails(invoiceId) {
        const invoice = await PrescriptionModel.getInvoiceDetails(invoiceId);

        if (!invoice) {
            throw new Error('Không tìm thấy hóa đơn');
        }

        return invoice;
    }

    /**
     * Thanh toán hóa đơn
     */
    static async payInvoice(invoiceId, paymentData) {
        const invoice = await PrescriptionModel.getInvoiceDetails(invoiceId);

        if (!invoice) {
            throw new Error('Không tìm thấy hóa đơn');
        }

        if (invoice.trang_thai_hoa_don === 1) {
            throw new Error('Hóa đơn đã được thanh toán');
        }

        const updated = await PrescriptionModel.updatePaymentStatus(invoiceId, paymentData);

        if (!updated) {
            throw new Error('Thanh toán thất bại');
        }

        // Get updated invoice
        return await PrescriptionModel.getInvoiceDetails(invoiceId);
    }

    /**
     * Check stock thuốc
     */
    static async checkStock(medicines) {
        if (!medicines || medicines.length === 0) {
            throw new Error('Danh sách thuốc trống');
        }

        return await PrescriptionModel.checkMedicineStock(medicines);
    }
}

module.exports = PrescriptionService;