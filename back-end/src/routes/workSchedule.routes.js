const express = require('express');
const router = express.Router();

const WorkScheduleController = require('../controllers/workSchedule.controller');
const WorkScheduleValidator = require('../validators/workSchedule.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

// Validate query params middleware
const validateQuery = (req, res, next) => {
    const { error, value } = WorkScheduleValidator.query().validate(req.query);
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

const validateStatsQuery = (req, res, next) => {
    const { error, value } = WorkScheduleValidator.queryStats().validate(req.query);
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
 * @route   GET /api/v1/work-schedules/my
 * @desc    Bác sĩ xem lịch làm việc của mình
 * @access  Doctor
 */
router.get(
    '/my',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.DOCTOR),
    WorkScheduleController.getMySchedule
);

/**
 * @swagger
 * /work-schedules:
 *   get:
 *     summary: Lấy danh sách lịch làm việc (Admin, Lễ tân)
 *     tags: [Work Schedules]
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
 *         name: doctorId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lọc theo bác sĩ
 *       - in: query
 *         name: specialtyId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lọc theo chuyên khoa
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lọc theo phòng khám
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Từ ngày (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Đến ngày (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST),
    validateQuery,
    WorkScheduleController.getAll
);

/**
 * @swagger
 * /work-schedules/stats/by-doctor:
 *   get:
 *     summary: Thống kê lịch làm việc theo bác sĩ (Chỉ Admin)
 *     tags: [Work Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Từ ngày (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Đến ngày (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 */
router.get(
    '/stats/by-doctor',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validateStatsQuery,
    WorkScheduleController.getStatsByDoctor
);

/**
 * @swagger
 * /work-schedules/doctor/{doctorId}/by-date:
 *   get:
 *     summary: Lấy lịch làm việc của bác sĩ theo ngày (Admin, Lễ tân, Bác sĩ)
 *     tags: [Work Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày cần xem (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lấy lịch làm việc thành công
 */
router.get(
    '/doctor/:doctorId/by-date',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.DOCTOR),
    WorkScheduleController.getDoctorScheduleByDate
);

/**
 * @swagger
 * /work-schedules/doctor/{doctorId}/by-range:
 *   get:
 *     summary: Lấy lịch làm việc của bác sĩ trong khoảng thời gian (Admin, Lễ tân, Bác sĩ)
 *     tags: [Work Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Từ ngày (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Đến ngày (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lấy lịch làm việc thành công
 */
router.get(
    '/doctor/:doctorId/by-range',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.DOCTOR),
    WorkScheduleController.getDoctorScheduleByRange
);

/**
 * @swagger
 * /work-schedules/{id}:
 *   get:
 *     summary: Lấy thông tin lịch làm việc theo ID (Admin, Lễ tân)
 *     tags: [Work Schedules]
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
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST),
    WorkScheduleController.getById
);

/**
 * @swagger
 * /work-schedules:
 *   post:
 *     summary: Tạo lịch làm việc mới (Chỉ Admin)
 *     tags: [Work Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ma_bac_si_lich_lam_viec
 *               - ngay_lich_lam_viec
 *               - thoi_gian_bat_dau_lich_lam_viec
 *               - thoi_gian_ket_thuc_lich_lam_viec
 *             properties:
 *               ma_bac_si_lich_lam_viec:
 *                 type: string
 *                 format: uuid
 *                 description: ID bác sĩ
 *               ma_phong_kham_lich_lam_viec:
 *                 type: string
 *                 format: uuid
 *                 description: ID phòng khám (tùy chọn)
 *               ma_chuyen_khoa_lich_lam_viec:
 *                 type: string
 *                 format: uuid
 *                 description: ID chuyên khoa (tùy chọn)
 *               ngay_lich_lam_viec:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-10"
 *               thoi_gian_bat_dau_lich_lam_viec:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *                 example: "08:00"
 *               thoi_gian_ket_thuc_lich_lam_viec:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *                 example: "12:00"
 *               trang_thai_lich_lam_viec:
 *                 type: integer
 *                 enum: [0, 1]
 *                 default: 1
 *     responses:
 *       201:
 *         description: Tạo lịch làm việc thành công
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(WorkScheduleValidator.create()),
    WorkScheduleController.create
);

/**
 * @swagger
 * /work-schedules/{id}:
 *   put:
 *     summary: Cập nhật lịch làm việc (Chỉ Admin)
 *     tags: [Work Schedules]
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
 *               ma_phong_kham_lich_lam_viec:
 *                 type: string
 *                 format: uuid
 *               ma_chuyen_khoa_lich_lam_viec:
 *                 type: string
 *                 format: uuid
 *               ngay_lich_lam_viec:
 *                 type: string
 *                 format: date
 *               thoi_gian_bat_dau_lich_lam_viec:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *               thoi_gian_ket_thuc_lich_lam_viec:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *               trang_thai_lich_lam_viec:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(WorkScheduleValidator.update()),
    WorkScheduleController.update
);

/**
 * @swagger
 * /work-schedules/{id}:
 *   delete:
 *     summary: Xóa lịch làm việc (Chỉ Admin)
 *     tags: [Work Schedules]
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
    WorkScheduleController.delete
);

module.exports = router;