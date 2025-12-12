const express = require('express');
const router = express.Router();

const ReceptionistController = require('../controllers/receptionist.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

// Middleware: Chỉ Receptionist & Admin
const receptionistAuth = [
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize([CONSTANTS.ROLES.RECEPTIONIST, CONSTANTS.ROLES.ADMIN])
];

/**
 * @swagger
 * tags:
 *   name: Receptionist
 *   description: Quản lý lễ tân
 */

// ===================== DASHBOARD =====================

/**
 * @swagger
 * /receptionist/dashboard/stats:
 *   get:
 *     summary: Lấy thống kê dashboard (Lễ tân)
 *     tags: [Receptionist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.get(
    '/dashboard/stats',
    ...receptionistAuth,
    ReceptionistController.getDashboardStats
);

// ===================== APPOINTMENTS =====================

/**
 * @swagger
 * /receptionist/appointments/today:
 *   get:
 *     summary: Lấy lịch hẹn hôm nay (Lễ tân)
 *     tags: [Receptionist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lọc theo bác sĩ
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: Lọc theo trạng thái (0-6)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm bệnh nhân
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/appointments/today',
    ...receptionistAuth,
    ReceptionistController.getTodayAppointments
);

/**
 * @swagger
 * /receptionist/appointments/{id}/confirm:
 *   put:
 *     summary: Xác nhận lịch hẹn (Lễ tân)
 *     tags: [Receptionist]
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
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xác nhận thành công
 */
router.put(
    '/appointments/:id/confirm',
    ...receptionistAuth,
    ReceptionistController.confirmAppointment
);

/**
 * @swagger
 * /receptionist/appointments/{id}/check-in:
 *   put:
 *     summary: Check-in bệnh nhân (Lễ tân)
 *     tags: [Receptionist]
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
 *         description: Check-in thành công
 */
router.put(
    '/appointments/:id/check-in',
    ...receptionistAuth,
    ReceptionistController.checkInAppointment
);

/**
 * @swagger
 * /receptionist/appointments/{id}/no-show:
 *   put:
 *     summary: Đánh dấu không đến (Lễ tân)
 *     tags: [Receptionist]
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
 *         description: Cập nhật thành công
 */
router.put(
    '/appointments/:id/no-show',
    ...receptionistAuth,
    ReceptionistController.markNoShow
);

/**
 * @swagger
 * /receptionist/appointments/{id}/note:
 *   put:
 *     summary: Cập nhật ghi chú lịch hẹn (Lễ tân)
 *     tags: [Receptionist]
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
 *               - note
 *             properties:
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put(
    '/appointments/:id/note',
    ...receptionistAuth,
    ReceptionistController.updateNote
);

// ===================== QUEUE MANAGEMENT =====================

/**
 * @swagger
 * /receptionist/queue/{doctorId}:
 *   get:
 *     summary: Lấy hàng đợi của bác sĩ (Lễ tân)
 *     tags: [Receptionist]
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
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày (mặc định hôm nay)
 *     responses:
 *       200:
 *         description: Lấy hàng đợi thành công
 */
router.get(
    '/queue/:doctorId',
    ...receptionistAuth,
    ReceptionistController.getQueue
);

/**
 * @swagger
 * /receptionist/queue/{doctorId}/next:
 *   get:
 *     summary: Lấy bệnh nhân tiếp theo (Lễ tân)
 *     tags: [Receptionist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 */
router.get(
    '/queue/:doctorId/next',
    ...receptionistAuth,
    ReceptionistController.getNextAppointment
);

// ===================== PATIENT MANAGEMENT =====================

/**
 * @swagger
 * /receptionist/patients/walk-in:
 *   post:
 *     summary: Tạo bệnh nhân walk-in (Lễ tân)
 *     tags: [Receptionist]
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
 *               - ho_benh_nhan
 *               - so_dien_thoai_benh_nhan
 *               - ngay_sinh_benh_nhan
 *               - gioi_tinh_benh_nhan
 *             properties:
 *               ten_benh_nhan:
 *                 type: string
 *               ho_benh_nhan:
 *                 type: string
 *               so_dien_thoai_benh_nhan:
 *                 type: string
 *               email_benh_nhan:
 *                 type: string
 *               ngay_sinh_benh_nhan:
 *                 type: string
 *                 format: date
 *               gioi_tinh_benh_nhan:
 *                 type: integer
 *               dia_chi_benh_nhan:
 *                 type: string
 *               create_account:
 *                 type: boolean
 *               mat_khau_nguoi_dung:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo bệnh nhân thành công
 */
router.post(
    '/patients/walk-in',
    ...receptionistAuth,
    ReceptionistController.createWalkInPatient
);

/**
 * @swagger
 * /receptionist/patients/search:
 *   get:
 *     summary: Tìm kiếm bệnh nhân (Lễ tân)
 *     tags: [Receptionist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Tìm kiếm thành công
 */
router.get(
    '/patients/search',
    ...receptionistAuth,
    ReceptionistController.searchPatients
);

module.exports = router;