const express = require('express');
const router = express.Router();

const DoctorController = require('../controllers/doctor.controller');
const DoctorValidator = require('../validators/doctor.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

// Validate query params middleware
const validateQuery = (req, res, next) => {
    const { error, value } = DoctorValidator.query().validate(req.query);
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

// ===== BÁC SĨ ROUTES =====
/**
 * @swagger
 * /doctors/available:
 *   get:
 *     summary: Lấy danh sách bác sĩ còn trống lịch
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày cần kiểm tra lịch (YYYY-MM-DD)
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           example: "09:00"
 *         description: Thời gian bắt đầu
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           example: "10:00"
 *         description: Thời gian kết thúc
 *       - in: query
 *         name: specialtyId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lọc theo chuyên khoa (tùy chọn)
 *     responses:
 *       200:
 *         description: Lấy danh sách bác sĩ có lịch trống thành công
 *       400:
 *         description: Thiếu hoặc sai tham số đầu vào
 */
router.get(
    '/available',
    DoctorController.getAvailableDoctors
);
/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Lấy danh sách bác sĩ
 *     tags: [Doctors]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *       - in: query
 *         name: positionId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/',
    validateQuery,
    DoctorController.getAllDoctors
);

/**
 * @swagger
 * /doctors/top-rated:
 *   get:
 *     summary: Lấy danh sách bác sĩ được đánh giá cao nhất
 *     tags: [Doctors]
 *     parameters:
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
    '/top-rated',
    DoctorController.getTopRatedDoctors
);

/**
 * @swagger
 * /doctors/stats/by-position:
 *   get:
 *     summary: Thống kê bác sĩ theo chức vụ
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 */
router.get(
    '/stats/by-position',
    DoctorController.getStatsByPosition
);

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Lấy thông tin bác sĩ theo ID
 *     tags: [Doctors]
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
 *       404:
 *         description: Không tìm thấy bác sĩ
 */
router.get(
    '/:id',
    DoctorController.getDoctorById
);

/**
 * @swagger
 * /doctors/{id}/ratings:
 *   get:
 *     summary: Lấy đánh giá của bác sĩ
 *     tags: [Doctors]
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
 *         description: Lấy đánh giá thành công
 */
router.get(
    '/:id/ratings',
    DoctorController.getDoctorRatings
);

/**
 * @swagger
 * /doctors/{id}/ratings/stats:
 *   get:
 *     summary: Lấy thống kê đánh giá của bác sĩ
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 */
router.get(
    '/:id/ratings/stats',
    DoctorController.getDoctorRatingStats
);

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Tạo bác sĩ mới (Chỉ Admin)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ma_nguoi_dung_bac_si
 *             properties:
 *               ma_nguoi_dung_bac_si:
 *                 type: string
 *                 format: uuid
 *               ma_chuyen_khoa_bac_si:
 *                 type: string
 *                 format: uuid
 *               ma_chuc_vu_bac_si:
 *                 type: string
 *                 format: uuid
 *               so_nam_kinh_nghiem_bac_si:
 *                 type: integer
 *                 description: Base64 encoded image
 *     responses:
 *       201:
 *         description: Tạo bác sĩ thành công
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(DoctorValidator.create()),
    DoctorController.createDoctor
);

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     summary: Cập nhật bác sĩ (Chỉ Admin)
 *     tags: [Doctors]
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
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(DoctorValidator.update()),
    DoctorController.updateDoctor
);

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: Xóa bác sĩ (Chỉ Admin)
 *     tags: [Doctors]
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
    DoctorController.deleteDoctor
);





module.exports = router;