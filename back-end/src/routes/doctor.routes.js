const express = require('express');
const router = express.Router();

const DoctorController = require('../controllers/doctor.controller');
const DoctorValidator = require('../validators/doctor.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

// Validate query params middleware
const validateQueryDoctors = (req, res, next) => {
    const { error, value } = DoctorValidator.queryDoctors().validate(req.query);
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

const validateQueryRatings = (req, res, next) => {
    const { error, value } = DoctorValidator.queryRatings().validate(req.query);
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

// ===== CHỨC VỤ =====

/**
 * @swagger
 * /doctors/positions:
 *   get:
 *     summary: Lấy danh sách chức vụ
 *     tags: [Doctors]
 *     parameters:
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
    '/positions',
    DoctorController.getAllPositions
);

/**
 * @swagger
 * /doctors/positions/{id}:
 *   get:
 *     summary: Lấy thông tin chức vụ theo ID
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
 */
router.get(
    '/positions/:id',
    DoctorController.getPositionById
);

/**
 * @swagger
 * /doctors/positions:
 *   post:
 *     summary: Tạo chức vụ mới (Chỉ Admin)
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
 *               - ten_chuc_vu
 *             properties:
 *               ten_chuc_vu:
 *                 type: string
 *                 example: Bác sĩ
 *               dang_hoat_dong_chuc_vu:
 *                 type: integer
 *                 enum: [0, 1]
 *                 default: 1
 *     responses:
 *       201:
 *         description: Tạo chức vụ thành công
 */
router.post(
    '/positions',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(DoctorValidator.createPosition()),
    DoctorController.createPosition
);

/**
 * @swagger
 * /doctors/positions/{id}:
 *   put:
 *     summary: Cập nhật chức vụ (Chỉ Admin)
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten_chuc_vu:
 *                 type: string
 *               dang_hoat_dong_chuc_vu:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put(
    '/positions/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(DoctorValidator.updatePosition()),
    DoctorController.updatePosition
);

/**
 * @swagger
 * /doctors/positions/{id}:
 *   delete:
 *     summary: Xóa chức vụ (Chỉ Admin)
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
    '/positions/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    DoctorController.deletePosition
);

// ===== BÁC SĨ =====

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
 *         description: Tìm kiếm theo tên, email
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: positionId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lọc theo chức vụ
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/',
    validateQueryDoctors,
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
 *         description: Số lượng bác sĩ trả về
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
 *     summary: Thống kê bác sĩ theo chức vụ (Chỉ Admin)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 */
router.get(
    '/stats/by-position',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
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
    validateQueryRatings,
    DoctorController.getDoctorRatings
);

/**
 * @swagger
 * /doctors/{id}/rating-stats:
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
    '/:id/rating-stats',
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
 *                 description: ID người dùng (phải có role Bác sĩ)
 *               ma_chuc_vu_bac_si:
 *                 type: string
 *                 format: uuid
 *                 description: ID chức vụ (tùy chọn)
 *               bang_cap_bac_si:
 *                 type: string
 *                 description: Bằng cấp dạng base64
 *               so_nam_kinh_nghiem_bac_si:
 *                 type: integer
 *                 default: 0
 *                 example: 5
 *               dang_hoat_dong_bac_si:
 *                 type: integer
 *                 enum: [0, 1]
 *                 default: 1
 *     responses:
 *       201:
 *         description: Tạo bác sĩ thành công
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(DoctorValidator.createDoctor()),
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ma_chuc_vu_bac_si:
 *                 type: string
 *                 format: uuid
 *               bang_cap_bac_si:
 *                 type: string
 *               so_nam_kinh_nghiem_bac_si:
 *                 type: integer
 *               dang_hoat_dong_bac_si:
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
    validate(DoctorValidator.updateDoctor()),
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