const express = require('express');
const router = express.Router();

const AppointmentController = require('../controllers/appointment.controller');
const AppointmentValidator = require('../validators/appointment.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

// Validate query params
const validateQuery = (req, res, next) => {
    const { error, value } = AppointmentValidator.query().validate(req.query);
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

const validateAvailableSlotsQuery = (req, res, next) => {
    const { error, value } = AppointmentValidator.queryAvailableSlots().validate(req.query);
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
 * /appointments/available-slots:
 *   get:
 *     summary: Lấy danh sách khung giờ khả dụng (Public)
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Mã bác sĩ
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày khám (YYYY-MM-DD)
 *       - in: query
 *         name: slotDuration
 *         schema:
 *           type: integer
 *           enum: [15, 30, 45, 60]
 *           default: 30
 *         description: Thời lượng mỗi slot (phút)
 *     responses:
 *       200:
 *         description: Lấy danh sách khung giờ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     doctorInfo:
 *                       type: object
 *                     workSchedules:
 *                       type: array
 *                     availableSlots:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           start:
 *                             type: string
 *                           end:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [available, booked]
 *                     summary:
 *                       type: object
 */
router.get(
    '/available-slots',
    validateAvailableSlotsQuery,
    AppointmentController.getAvailableSlots
);

/**
 * @swagger
 * /appointments/check-availability:
 *   post:
 *     summary: Kiểm tra khung giờ có khả dụng không (Public)
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - date
 *               - startTime
 *               - endTime
 *             properties:
 *               doctorId:
 *                 type: string
 *                 format: uuid
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *                 example: "09:30"
 *     responses:
 *       200:
 *         description: Kiểm tra thành công
 */
router.post(
    '/check-availability',
    validate(AppointmentValidator.checkAvailability()),
    AppointmentController.checkAvailability
);

/**
 * @swagger
 * /appointments/guest:
 *   post:
 *     summary: Đặt lịch khám (Khách vãng lai - không cần đăng nhập)
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_benh_nhan
 *               - so_dien_thoai_benh_nhan
 *               - ma_bac_si
 *               - ly_do_kham_lich_hen
 *               - ngay
 *               - thoi_gian_bat_dau
 *               - thoi_gian_ket_thuc
 *             properties:
 *               ten_benh_nhan:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               so_dien_thoai_benh_nhan:
 *                 type: string
 *                 pattern: '^[0-9]{10}$'
 *                 example: "0123456789"
 *               gioi_tinh_benh_nhan:
 *                 type: integer
 *                 enum: [0, 1, 2]
 *               ma_bac_si:
 *                 type: string
 *                 format: uuid
 *               ma_chuyen_khoa:
 *                 type: string
 *                 format: uuid
 *               ma_dich_vu_lich_hen:
 *                 type: string
 *                 format: uuid
 *               ly_do_kham_lich_hen:
 *                 type: string
 *                 example: Đau đầu, sốt nhẹ
 *               ngay:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-10"
 *               thoi_gian_bat_dau:
 *                 type: string
 *                 example: "09:00"
 *               thoi_gian_ket_thuc:
 *                 type: string
 *                 example: "09:30"
 *     responses:
 *       201:
 *         description: Đặt lịch thành công
 */
router.post(
    '/guest',
    validate(AppointmentValidator.createGuest()),
    AppointmentController.createGuest
);

/**
 * @swagger
 * /appointments/my:
 *   get:
 *     summary: Lấy danh sách lịch hẹn của tôi (Bệnh nhân)
 *     tags: [Appointments]
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
 *         name: status
 *         schema:
 *           type: integer
 *           enum: [0, 1, 2, 3, 4]
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/my',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.PATIENT),
    validateQuery,
    AppointmentController.getMyAppointments
);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Lấy danh sách tất cả lịch hẹn (Admin, Lễ tân, Bác sĩ)
 *     tags: [Appointments]
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
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: specialtyId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *           enum: [0, 1, 2, 3, 4]
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.DOCTOR),
    validateQuery,
    AppointmentController.getAll
);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Lấy chi tiết lịch hẹn
 *     tags: [Appointments]
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
    AppointmentController.getById
);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Đặt lịch khám (Bệnh nhân đã đăng nhập hoặc Lễ tân đặt hộ)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ma_bac_si
 *               - ly_do_kham_lich_hen
 *               - ngay
 *               - thoi_gian_bat_dau
 *               - thoi_gian_ket_thuc
 *             properties:
 *               ma_bac_si:
 *                 type: string
 *                 format: uuid
 *               ma_chuyen_khoa:
 *                 type: string
 *                 format: uuid
 *               ma_dich_vu_lich_hen:
 *                 type: string
 *                 format: uuid
 *               ly_do_kham_lich_hen:
 *                 type: string
 *               ngay:
 *                 type: string
 *                 format: date
 *               thoi_gian_bat_dau:
 *                 type: string
 *               thoi_gian_ket_thuc:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đặt lịch thành công
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.PATIENT, CONSTANTS.ROLES.RECEPTIONIST),
    validate(AppointmentValidator.createAuthenticated()),
    AppointmentController.createAuthenticated
);

/**
 * @swagger
 * /appointments/{id}/confirm:
 *   put:
 *     summary: Xác nhận lịch hẹn (Lễ tân)
 *     tags: [Appointments]
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
 *         description: Xác nhận thành công
 */
router.put(
    '/:id/confirm',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.ADMIN),
    AppointmentController.confirm
);

/**
 * @swagger
 * /appointments/{id}/checkin:
 *   put:
 *     summary: Check-in bệnh nhân (Lễ tân)
 *     tags: [Appointments]
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ma_phong_kham:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Check-in thành công
 */
router.put(
    '/:id/checkin',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.ADMIN),
    AppointmentController.checkIn
);

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   put:
 *     summary: Hủy lịch hẹn (Bệnh nhân, Lễ tân, Admin)
 *     tags: [Appointments]
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
 *             required:
 *               - ly_do_huy_lich_hen
 *             properties:
 *               ly_do_huy_lich_hen:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hủy lịch thành công
 */
router.put(
    '/:id/cancel',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.PATIENT, CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.ADMIN),
    validate(AppointmentValidator.cancel()),
    AppointmentController.cancel
);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Xóa lịch hẹn (Chỉ Admin)
 *     tags: [Appointments]
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
    AppointmentController.delete
);
// Thêm vào file appointment.routes.js (sau các routes cũ, trước module.exports)

/**
 * @swagger
 * /appointments/dashboard/receptionist:
 *   get:
 *     summary: Dashboard Lễ tân (lịch hẹn hôm nay, chờ xác nhận)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy dashboard thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     today:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         appointments:
 *                           type: array
 *                         stats:
 *                           type: object
 *                     pending:
 *                       type: array
 */
router.get(
    '/dashboard/receptionist',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.ADMIN),
    AppointmentController.getReceptionistDashboard
);

/**
 * @swagger
 * /appointments/dashboard/doctor:
 *   get:
 *     summary: Dashboard Bác sĩ (lịch hẹn hôm nay, bệnh nhân chờ khám)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy dashboard thành công
 */
router.get(
    '/dashboard/doctor',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.DOCTOR),
    AppointmentController.getDoctorDashboard
);

/**
 * @swagger
 * /appointments/today:
 *   get:
 *     summary: Lấy lịch hẹn hôm nay (Lễ tân tất cả, Bác sĩ của mình)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/today',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.DOCTOR, CONSTANTS.ROLES.ADMIN),
    AppointmentController.getTodayAppointments
);

/**
 * @swagger
 * /appointments/pending:
 *   get:
 *     summary: Lấy lịch hẹn chờ xác nhận (Lễ tân)
 *     tags: [Appointments]
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
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/pending',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.ADMIN),
    AppointmentController.getPendingAppointments
);

/**
 * @swagger
 * /appointments/checked-in:
 *   get:
 *     summary: Lấy lịch hẹn đã check-in (Bác sĩ - sẵn sàng khám)
 *     tags: [Appointments]
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
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/checked-in',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.DOCTOR),
    AppointmentController.getCheckedInAppointments
);

/**
 * @swagger
 * /appointments/stats/by-status:
 *   get:
 *     summary: Thống kê lịch hẹn theo trạng thái (Admin, Lễ tân)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 */
router.get(
    '/stats/by-status',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.RECEPTIONIST),
    AppointmentController.getStatsByStatus
);

/**
 * @swagger
 * /appointments/doctor/by-date:
 *   get:
 *     summary: Lấy lịch hẹn của bác sĩ theo ngày (Bác sĩ)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày cần xem (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/doctor/by-date',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.DOCTOR),
    AppointmentController.getDoctorAppointmentsByDate
);

/**
 * @swagger
 * /appointments/{id}/complete:
 *   put:
 *     summary: Hoàn thành lịch hẹn (Bác sĩ sau khi khám xong)
 *     tags: [Appointments]
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
 *         description: Hoàn thành thành công
 */
router.put(
    '/:id/complete',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.DOCTOR),
    AppointmentController.complete
);


module.exports = router;