const express = require('express');
const router = express.Router();

const InvoiceController = require('../controllers/invoice.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

router.use(AuthMiddleware.authenticate);


// ==============================
// HÓA ĐƠN CỦA TÔI (BỆNH NHÂN)
// ==============================
router.get(
    '/my',
    AuthMiddleware.authorize(CONSTANTS.ROLES.PATIENT),
    InvoiceController.getMyInvoices
);

// Admin / Lễ tân
router.get(
    '/',
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST),
    InvoiceController.getAll
);

router.get(
    '/:invoiceId',
    InvoiceController.getDetail
);

router.put(
    '/:invoiceId/pay',
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST),
    InvoiceController.pay
);

router.get(
    '/:invoiceId/print',
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST),
    InvoiceController.print
);

module.exports = router;
