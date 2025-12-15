const PrescriptionService = require('../services/prescription.service');
const ResponseUtil = require('../utils/response.util');

class PrescriptionController {
    /**
     * @desc    Kê đơn thuốc (Hồ sơ + Thuốc + Hoàn thành)
     * @route   POST /api/v1/prescriptions
     * @access  Doctor only
     */
    static async create(req, res, next) {
        try {
            const result = await PrescriptionService.createPrescription(req.body);

            return ResponseUtil.success(
                res,
                result,
                'Kê đơn thuốc thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Kê đơn thuốc (Chỉ thuốc, không lưu hồ sơ)
     * @route   POST /api/v1/prescriptions/medicine-only
     * @access  Doctor only
     */
    static async createMedicineOnly(req, res, next) {
        try {
            const result = await PrescriptionService.createPrescriptionOnly(req.body);

            return ResponseUtil.success(
                res,
                result,
                'Kê đơn thuốc thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Lấy chi tiết hóa đơn
     * @route   GET /api/v1/prescriptions/invoice/:invoiceId
     * @access  Private
     */
    static async getInvoice(req, res, next) {
        try {
            const { invoiceId } = req.params;
            const invoice = await PrescriptionService.getInvoiceDetails(invoiceId);

            return ResponseUtil.success(
                res,
                invoice,
                'Lấy thông tin hóa đơn thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Thanh toán hóa đơn
     * @route   PUT /api/v1/prescriptions/invoice/:invoiceId/payment
     * @access  Receptionist, Admin
     */
    static async payInvoice(req, res, next) {
        try {
            const { invoiceId } = req.params;
            const invoice = await PrescriptionService.payInvoice(invoiceId, req.body);

            return ResponseUtil.success(
                res,
                invoice,
                'Thanh toán hóa đơn thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Kiểm tra tồn kho thuốc
     * @route   POST /api/v1/prescriptions/check-stock
     * @access  Doctor
     */
    static async checkStock(req, res, next) {
        try {
            const { medicines } = req.body;
            const result = await PrescriptionService.checkStock(medicines);

            return ResponseUtil.success(
                res,
                result,
                'Kiểm tra tồn kho thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PrescriptionController;