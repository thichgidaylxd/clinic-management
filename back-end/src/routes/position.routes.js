const express = require('express');
const router = express.Router();

const PositionController = require('../controllers/position.controller');
const PositionValidator = require('../validators/position.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

/**
 * @swagger
 * /positions:
 *   get:
 *     summary: Lấy danh sách chức vụ
 *     tags: [Positions]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: Trạng thái (0-Không hoạt động, 1-Hoạt động)
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/',
    PositionController.getAll
);

/**
 * @swagger
 * /positions/{id}:
 *   get:
 *     summary: Lấy thông tin chức vụ theo ID
 *     tags: [Positions]
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
 *         description: Không tìm thấy chức vụ
 */
router.get(
    '/:id',
    PositionController.getById
);

/**
 * @swagger
 * /positions:
 *   post:
 *     summary: Tạo chức vụ mới (Chỉ Admin)
 *     tags: [Positions]
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
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(PositionValidator.create()),
    PositionController.create
);

/**
 * @swagger
 * /positions/{id}:
 *   put:
 *     summary: Cập nhật chức vụ (Chỉ Admin)
 *     tags: [Positions]
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
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(PositionValidator.update()),
    PositionController.update
);

/**
 * @swagger
 * /positions/{id}:
 *   delete:
 *     summary: Xóa chức vụ (Chỉ Admin)
 *     tags: [Positions]
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
 *       400:
 *         description: Chức vụ đang được sử dụng
 */
router.delete(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    PositionController.delete
);

module.exports = router;