const PrescriptionModel = require('../models/prescription.model');
const AppointmentModel = require('../models/appointment.model');
const MedicalRecordModel = require('../models/medicalRecord.model');
const ApiError = require('../utils/ApiError');

class PrescriptionService {
    /**
     * Kê đơn thuốc hoàn chỉnh (Hồ sơ + Đơn thuốc + Hoàn thành lịch hẹn)
     */
    static async createPrescription(data) {
        const {
            ma_lich_hen,
            ma_bac_si,
            // Medical record data
            chieu_cao,
            can_nang,
            huyet_ap,
            nhiet_do,
            nhip_tim,
            trieu_chung,
            chuan_doan,
            phuong_phap_dieu_tri,
            // Medicines
            medicines, // [{ ma_thuoc, so_luong, ghi_chu }]
            ghi_chu_hoa_don
        } = data;

        // Validate
        if (!ma_lich_hen || !ma_bac_si) {
            throw new ApiError(400, 'Thiếu thông tin bắt buộc');
        }

        if (!chuan_doan || !chuan_doan.trim()) {
            throw new ApiError(400, 'Chẩn đoán không được để trống');
        }

        if (!medicines || medicines.length === 0) {
            throw new ApiError(400, 'Phải có ít nhất 1 loại thuốc');
        }

        // Get appointment
        const appointment = await AppointmentModel.findById(ma_lich_hen);
        if (!appointment) {
            throw new ApiError(404, 'Không tìm thấy lịch hẹn');
        }

        // Check appointment status
        if (appointment.trang_thai_lich_hen === 4) {
            throw new ApiError(400, 'Lịch hẹn đã hoàn thành');
        }

        // Check medicines stock
        const stockCheck = await PrescriptionModel.checkMedicineStock(medicines);
        const unavailable = stockCheck.filter(m => !m.available);

        if (unavailable.length > 0) {
            const errors = unavailable.map(m => `${m.ten_thuoc}: ${m.reason}`).join(', ');
            throw new ApiError(400, `Không thể kê đơn: ${errors}`);
        }

        // Step 1: Tạo hồ sơ bệnh án
        const recordData = {
            ma_benh_nhan: appointment.ma_benh_nhan,
            ma_bac_si,
            ma_chuyen_khoa: appointment.ma_chuyen_khoa,
            chieu_cao,
            can_nang,
            huyet_ap,
            nhiet_do,
            nhip_tim,
            trieu_chung,
            chuan_doan,
            phuong_phap_dieu_tri
        };

        const ma_ho_so_benh_an = await MedicalRecordModel.create(recordData);

        // Step 2: Tạo hóa đơn + Chi tiết thuốc
        const prescriptionData = {
            ma_benh_nhan: appointment.ma_benh_nhan,
            ma_chuyen_khoa: appointment.ma_chuyen_khoa,
            ma_nguoi_dung_hoa_don: ma_bac_si,
            gia_dich_vu: appointment.gia_dich_vu_lich_hen || 0,
            medicines,
            ghi_chu_hoa_don
        };

        const ma_hoa_don = await PrescriptionModel.create(prescriptionData);

        // Step 3: Hoàn thành lịch hẹn
        await AppointmentModel.update(ma_lich_hen, {
            trang_thai_lich_hen: 4, // COMPLETED
            thoi_gian_hoan_thanh: new Date()
        });

        // Get invoice details
        const invoice = await PrescriptionModel.getInvoiceDetails(ma_hoa_don);

        return {
            ma_ho_so_benh_an,
            ma_hoa_don,
            invoice
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
            throw new ApiError(400, 'Thiếu thông tin bắt buộc');
        }

        if (!medicines || medicines.length === 0) {
            throw new ApiError(400, 'Phải có ít nhất 1 loại thuốc');
        }

        // Get appointment
        const appointment = await AppointmentModel.findById(ma_lich_hen);
        if (!appointment) {
            throw new ApiError(404, 'Không tìm thấy lịch hẹn');
        }

        // Check medicines stock
        const stockCheck = await PrescriptionModel.checkMedicineStock(medicines);
        const unavailable = stockCheck.filter(m => !m.available);

        if (unavailable.length > 0) {
            const errors = unavailable.map(m => `${m.ten_thuoc}: ${m.reason}`).join(', ');
            throw new ApiError(400, `Không thể kê đơn: ${errors}`);
        }

        // Create prescription
        const prescriptionData = {
            ma_benh_nhan: appointment.ma_benh_nhan,
            ma_chuyen_khoa: appointment.ma_chuyen_khoa,
            ma_nguoi_dung_hoa_don: ma_bac_si,
            gia_dich_vu: appointment.gia_dich_vu_lich_hen || 0,
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
            throw new ApiError(404, 'Không tìm thấy hóa đơn');
        }

        return invoice;
    }

    /**
     * Thanh toán hóa đơn
     */
    static async payInvoice(invoiceId, paymentData) {
        const invoice = await PrescriptionModel.getInvoiceDetails(invoiceId);

        if (!invoice) {
            throw new ApiError(404, 'Không tìm thấy hóa đơn');
        }

        if (invoice.trang_thai_hoa_don === 1) {
            throw new ApiError(400, 'Hóa đơn đã được thanh toán');
        }

        const updated = await PrescriptionModel.updatePaymentStatus(invoiceId, paymentData);

        if (!updated) {
            throw new ApiError(500, 'Thanh toán thất bại');
        }

        // Get updated invoice
        return await PrescriptionModel.getInvoiceDetails(invoiceId);
    }

    /**
     * Check stock thuốc
     */
    static async checkStock(medicines) {
        if (!medicines || medicines.length === 0) {
            throw new ApiError(400, 'Danh sách thuốc trống');
        }

        return await PrescriptionModel.checkMedicineStock(medicines);
    }
}

module.exports = PrescriptionService;