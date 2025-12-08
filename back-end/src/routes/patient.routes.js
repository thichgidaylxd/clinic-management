const express = require('express');
const router = express.Router();

const PatientController = require('../controllers/patient.controller');
const PatientValidator = require('../validators/patient.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

// Validate query params middleware
const validateQuery = (req, res, next) => {
    const { error, value } = PatientValidator.query().validate(req.query);
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors
        });
    }
    req.query = value;
    next();
};

const validateHistoryQuery = (req, res, next) => {
    const { error, value } = PatientValidator.queryHistory().validate(req.query);
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors
        });
    }
    req.query = value;
    next();
};

const validateAppointmentsQuery = (req, res, next) => {
    const { error, value } = PatientValidator.queryAppointments().validate(req.query);
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors
        });
    }
    req.query = value;
    next();
};

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Lấy danh sách bệnh nhân (Admin, Lễ tân, Bác sĩ)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên hoặc số điện thoại
 *       - in: query
 *         name: gender
 *         schema:
 *           type: integer
 *           enum: [0, 1, 2]
 *         description: Lọc theo giới tính
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.DOCTOR),
    validateQuery,
    PatientController.getAll
);

/**
 * @swagger
 * /patients/stats/by-gender:
 *   get:
 *     summary: Thống kê bệnh nhân theo giới tính (Chỉ Admin)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 */
router.get(
    '/stats/by-gender',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    PatientController.getStatsByGender
);

/**
 * @swagger
 * /patients/recent:
 *   get:
 *     summary: Lấy danh sách bệnh nhân mới nhất (Admin, Lễ tân)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bệnh nhân trả về
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/recent',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST),
    PatientController.getRecentPatients
);

/**
 * @swagger
 * /patients/phone/{phone}:
 *   get:
 *     summary: Tìm bệnh nhân theo số điện thoại (Admin, Lễ tân)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: Số điện thoại (10 chữ số)
 *     responses:
 *       200:
 *         description: Tìm thấy bệnh nhân
 */
router.get(
    '/phone/:phone',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST),
    PatientController.findByPhone
);

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Lấy thông tin bệnh nhân theo ID (Admin, Lễ tân, Bác sĩ)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 */
router.get(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.DOCTOR),
    PatientController.getById
);

/**
 * @swagger
 * /patients/{id}/medical-history:
 *   get:
 *     summary: Lấy lịch sử khám bệnh của bệnh nhân (Admin, Lễ tân, Bác sĩ)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lấy lịch sử thành công
 */
router.get(
    '/:id/medical-history',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.DOCTOR),
    validateHistoryQuery,
    PatientController.getMedicalHistory
);

/**
 * @swagger
 * /patients/{id}/appointments:
 *   get:
 *     summary: Lấy lịch hẹn của bệnh nhân (Admin, Lễ tân, Bác sĩ)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *           enum: [0, 1, 2, 3, 4]
 *         description: Lọc theo trạng thái lịch hẹn
 *     responses:
 *       200:
 *         description: Lấy lịch hẹn thành công
 */
router.get(
    '/:id/appointments',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.DOCTOR),
    validateAppointmentsQuery,
    PatientController.getAppointments
);

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Tạo bệnh nhân mới (Admin, Lễ tân)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_benh_nhan
 *             properties:
 *               ten_benh_nhan:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               gioi_tinh_benh_nhan:
 *                 type: integer
 *                 enum: [0, 1, 2]
 *                 description: 0-Nữ, 1-Nam, 2-Khác
 *               so_dien_thoai_benh_nhan:
 *                 type: string
 *                 pattern: '^[0-9]{10}$'
 *                 example: "0123456789"
 *               chieu_cao_benh_nhan:
 *                 type: number
 *                 example: 170
 *               can_nang_benh_nhan:
 *                 type: number
 *                 example: 65
 *               hinh_anh_benh_nhan:
 *                 type: string
 *                 description: Hình ảnh dạng base64
 *     responses:
 *       201:
 *         description: Tạo bệnh nhân thành công
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST),
    validate(PatientValidator.create()),
    PatientController.create
);

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Cập nhật bệnh nhân (Admin, Lễ tân)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten_benh_nhan:
 *                 type: string
 *               gioi_tinh_benh_nhan:
 *                 type: integer
 *                 enum: [0, 1, 2]
 *               so_dien_thoai_benh_nhan:
 *                 type: string
 *                 pattern: '^[0-9]{10}$'
 *               chieu_cao_benh_nhan:
 *                 type: number
 *               can_nang_benh_nhan:
 *                 type: number
 *               hinh_anh_benh_nhan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST),
    validate(PatientValidator.update()),
    PatientController.update
);

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Xóa bệnh nhân (Chỉ Admin)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    PatientController.delete
);

module.exports = router;