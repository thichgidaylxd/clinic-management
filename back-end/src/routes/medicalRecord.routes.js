const express = require('express');
const router = express.Router();

const MedicalRecordController = require('../controllers/medicalRecord.controller');
const MedicalRecordValidator = require('../validators/medicalRecord.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

/**
 * @swagger
 * /medical-records:
 *   post:
 *     summary: Tạo hồ sơ bệnh án (Bác sĩ)
 *     tags: [Medical Records]
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.DOCTOR),
    validate(MedicalRecordValidator.create()),
    MedicalRecordController.create
);
// Lấy danh sách hồ sơ của bác sĩ hiện tại (trang MedicalRecords.jsx)
router.get('/', AuthMiddleware.authenticate, AuthMiddleware.authorize(CONSTANTS.ROLES.DOCTOR), MedicalRecordController.getAllForDoctor);

/**
 * @swagger
 * /medical-records/{id}:
 *   get:
 *     summary: Lấy hồ sơ bệnh án theo ID
 *     tags: [Medical Records]
 */
router.get(
    '/:id',
    AuthMiddleware.authenticate,
    MedicalRecordController.getById
);

/**
 * @swagger
 * /medical-records/patient/{patientId}:
 *   get:
 *     summary: Lấy danh sách hồ sơ bệnh án theo bệnh nhân
 *     tags: [Medical Records]
 */
router.get(
    '/patient/:patientId',
    AuthMiddleware.authenticate,
    MedicalRecordController.getByPatient
);

/**
 * @swagger
 * /medical-records/{id}:
 *   put:
 *     summary: Cập nhật hồ sơ bệnh án (Bác sĩ)
 *     tags: [Medical Records]
 */
router.put(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.DOCTOR),
    validate(MedicalRecordValidator.update()),
    MedicalRecordController.update
);

/**
 * @swagger
 * /medical-records/{id}:
 *   delete:
 *     summary: Xóa hồ sơ bệnh án (Admin)
 *     tags: [Medical Records]
 */
router.delete(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    MedicalRecordController.delete
);

module.exports = router;