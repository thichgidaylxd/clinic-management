const InvoiceModel = require('../models/invoice.model');
const PatientModel = require('../models/patient.model');

class InvoiceService {

    static async getAll(query) {
        return await InvoiceModel.findAll(query);
    }

    static async getDetail(invoiceId) {
        const invoice = await InvoiceModel.findById(invoiceId);
        if (!invoice) {
            throw new Error('Hóa đơn không tồn tại');
        }
        return invoice;
    }

    static async payInvoice(invoiceId) {
        const invoice = await InvoiceModel.findById(invoiceId);

        if (!invoice) {
            throw new Error('Hóa đơn không tồn tại');
        }

        if (invoice.trang_thai_hoa_don === 1) {
            throw new Error('Hóa đơn đã thanh toán, không thể thao tác');
        }

        await InvoiceModel.pay(invoiceId);
        return true;
    }
    // ==============================
    // HÓA ĐƠN CỦA TÔI
    // ==============================
    static async getMyInvoices(userId) {
        // 1. Lấy bệnh nhân theo user đăng nhập
        const patient = await PatientModel.findByUserId(userId);

        console.log(patient);
        if (!patient) {
            throw new Error('Không tìm thấy bệnh nhân');
        }

        // 2. Lấy danh sách hoá đơn
        const invoices = await InvoiceModel.findByPatientId(
            patient.ma_benh_nhan
        );

        console.log(invoices);

        return invoices;
    }

}

module.exports = InvoiceService;
