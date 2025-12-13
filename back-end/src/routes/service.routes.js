const express = require('express');
const router = express.Router();

const ServiceController = require('../controllers/service.controller');
const ServiceValidator = require('../validators/service.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

// Validate query params middleware
const validateQuery = (req, res, next) => {
    const { error, value } = ServiceValidator.query().validate(req.query);
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
// GET /api/services?specialtyId={id}
router.get(
    '/',
    ServiceController.getBySpecialty  // Hoặc getAll nếu đã có
);
/**
 * @swagger
 * /services:
 *   get:
 *     summary: Lấy danh sách dịch vụ
 *     tags: [Services]
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
 *         description: Tìm kiếm theo tên dịch vụ
 *       - in: query
 *         name: specialtyId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lọc theo chuyên khoa
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/',
    validateQuery,
    ServiceController.getAll
);

/**
 * @swagger
 * /services/stats/by-specialty:
 *   get:
 *     summary: Thống kê dịch vụ theo chuyên khoa (Chỉ Admin)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 */
router.get(
    '/stats/by-specialty',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    ServiceController.getStatsBySpecialty
);

/**
 * @swagger
 * /services/popular:
 *   get:
 *     summary: Lấy danh sách dịch vụ phổ biến nhất
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng dịch vụ trả về
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/popular',
    ServiceController.getMostPopular
);

/**
 * @swagger
 * /services/specialty/{specialtyId}:
 *   get:
 *     summary: Lấy dịch vụ theo chuyên khoa
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: specialtyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID chuyên khoa
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/specialty/:specialtyId',
    ServiceController.getBySpecialty
);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Lấy thông tin dịch vụ theo ID
 *     tags: [Services]
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
    ServiceController.getById
);

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Tạo dịch vụ mới (Chỉ Admin)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_dich_vu
 *               - don_gia_dich_vu
 *             properties:
 *               ten_dich_vu:
 *                 type: string
 *                 example: Khám tổng quát
 *               mo_ta_dich_vu:
 *                 type: string
 *                 example: Khám sức khỏe tổng quát, bao gồm các xét nghiệm cơ bản
 *               don_gia_dich_vu:
 *                 type: number
 *                 example: 500000
 *               ma_chuyen_khoa_dich_vu:
 *                 type: string
 *                 format: uuid
 *                 description: ID chuyên khoa (tùy chọn)
 *     responses:
 *       201:
 *         description: Tạo dịch vụ thành công
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(ServiceValidator.create()),
    ServiceController.create
);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Cập nhật dịch vụ (Chỉ Admin)
 *     tags: [Services]
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
 *               ten_dich_vu:
 *                 type: string
 *               mo_ta_dich_vu:
 *                 type: string
 *               don_gia_dich_vu:
 *                 type: number
 *               ma_chuyen_khoa_dich_vu:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(ServiceValidator.update()),
    ServiceController.update
);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Xóa dịch vụ (Chỉ Admin)
 *     tags: [Services]
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
    ServiceController.delete
);

module.exports = router;