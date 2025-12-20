const InvoiceModel = require('../models/invoice.model');

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


}

module.exports = InvoiceService;
