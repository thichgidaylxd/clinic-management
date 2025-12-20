const express = require('express');
const router = express.Router();

const PrescriptionController = require('../controllers/prescription.controller');
const PrescriptionValidator = require('../validators/prescription.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

/**
 * @swagger
 * /prescriptions:
 *   post:
 *     summary: Kê đơn thuốc (Hồ sơ + Thuốc + Hoàn thành) - Bác sĩ
 *     tags: [Prescriptions]
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.DOCTOR),
    validate(PrescriptionValidator.create()),
    PrescriptionController.create
);

/**
 * @swagger
 * /prescriptions/medicine-only:
 *   post:
 *     summary: Kê đơn thuốc (Chỉ thuốc, không hồ sơ) - Bác sĩ
 *     tags: [Prescriptions]
 */
router.post(
    '/medicine-only',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.DOCTOR),
    validate(PrescriptionValidator.createMedicineOnly()),
    PrescriptionController.createMedicineOnly
);

/**
 * @swagger
 * /prescriptions/check-stock:
 *   post:
 *     summary: Kiểm tra tồn kho thuốc trước khi kê đơn
 *     tags: [Prescriptions]
 */
router.post(
    '/check-stock',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.DOCTOR),
    validate(PrescriptionValidator.checkStock()),
    PrescriptionController.checkStock
);

/**
 * @swagger
 * /prescriptions/invoice/{invoiceId}:
 *   get:
 *     summary: Lấy chi tiết hóa đơn
 *     tags: [Prescriptions]
 */
router.get(
    '/invoice/:invoiceId',
    AuthMiddleware.authenticate,
    PrescriptionController.getInvoice
);

/**
 * @swagger
 * /prescriptions/invoice/{invoiceId}/payment:
 *   put:
 *     summary: Thanh toán hóa đơn (Lễ tân, Admin)
 *     tags: [Prescriptions]
 */
router.put(
    '/invoice/:invoiceId/payment',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.ADMIN),
    validate(PrescriptionValidator.payment()),
    PrescriptionController.payInvoice
);

module.exports = router;