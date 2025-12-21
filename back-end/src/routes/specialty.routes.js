const express = require('express');
const router = express.Router();

const SpecialtyController = require('../controllers/specialty.controller');
const SpecialtyValidator = require('../validators/specialty.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

// Validate query params middleware
const validateQuery = (req, res, next) => {
    const { error, value } = SpecialtyValidator.query().validate(req.query);
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
 * /specialties:
 *   get:
 *     summary: Lấy danh sách chuyên khoa
 *     tags: [Specialties]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên chuyên khoa
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/',
    validateQuery,
    SpecialtyController.getAll
);

/**
 * @swagger
 * /specialties/{id}:
 *   get:
 *     summary: Lấy thông tin chuyên khoa theo ID
 *     tags: [Specialties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID chuyên khoa
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *       404:
 *         description: Không tìm thấy chuyên khoa
 */
router.get(
    '/:id',
    SpecialtyController.getById
);

/**
 * @swagger
 * /specialties:
 *   post:
 *     summary: Tạo chuyên khoa mới (Chỉ Admin)
 *     tags: [Specialties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_chuyen_khoa
 *             properties:
 *               ten_chuyen_khoa:
 *                 type: string
 *                 example: Nội khoa
 *               mo_ta_chuyen_khoa:
 *                 type: string
 *                 example: Chuyên khoa điều trị các bệnh nội khoa
 *     responses:
 *       201:
 *         description: Tạo chuyên khoa thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(SpecialtyValidator.create()),
    SpecialtyController.create
);

/**
 * @swagger
 * /specialties/{id}:
 *   put:
 *     summary: Cập nhật chuyên khoa (Chỉ Admin)
 *     tags: [Specialties]
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
 *               ten_chuyen_khoa:
 *                 type: string
 *               mo_ta_chuyen_khoa:
 *                 type: string

 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy
 */
router.put(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(SpecialtyValidator.update()),
    SpecialtyController.update
);

/**
 * @swagger
 * /specialties/{id}:
 *   delete:
 *     summary: Xóa chuyên khoa (Chỉ Admin)
 *     tags: [Specialties]
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
 *       404:
 *         description: Không tìm thấy
 */
router.delete(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    SpecialtyController.delete
);


router.get(
    '/by-name',
    SpecialtyController.getByName
);

module.exports = router;