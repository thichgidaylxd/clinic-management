const InvoiceService = require('../services/invoice.service');
const ResponseUtil = require('../utils/response.util');
const generateInvoicePDF = require('../utils/invoice-pdf.util');
class InvoiceController {

    // ==============================
    // DANH SÁCH HÓA ĐƠN
    // ==============================
    static async getAll(req, res, next) {
        try {
            const data = await InvoiceService.getAll(req.query);
            return ResponseUtil.success(res, data, 'Lấy danh sách hóa đơn');
        } catch (err) {
            next(err);
        }
    }

    // ==============================
    // CHI TIẾT
    // ==============================
    static async getDetail(req, res, next) {
        try {
            const { invoiceId } = req.params;
            const data = await InvoiceService.getDetail(invoiceId);
            return ResponseUtil.success(res, data, 'Chi tiết hóa đơn');
        } catch (err) {
            next(err);
        }
    }

    // ==============================
    // THANH TOÁN
    // ==============================
    static async pay(req, res, next) {
        try {
            const { invoiceId } = req.params;
            await InvoiceService.payInvoice(invoiceId);
            return ResponseUtil.success(res, null, 'Thanh toán thành công');
        } catch (err) {
            next(err);
        }
    }


    // ==============================
    // IN HÓA ĐƠN
    // ==============================
    static async print(req, res, next) {
        try {
            const { invoiceId } = req.params;
            const invoice = await InvoiceService.getDetail(invoiceId);

            generateInvoicePDF(invoice, res);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = InvoiceController;
