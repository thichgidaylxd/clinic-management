const express = require('express');
const router = express.Router();

const MedicineController = require('../controllers/medicine.controller');
const MedicineValidator = require('../validators/medicine.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

// Validate query params middleware
const validateQuery = (req, res, next) => {
    const { error, value } = MedicineValidator.query().validate(req.query);
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
 * /medicines:
 *   get:
 *     summary: Lấy danh sách thuốc
 *     tags: [Medicines]
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
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/',
    validateQuery,
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    MedicineController.getAll,
);

/**
 * @swagger
 * /medicines/expiring-soon:
 *   get:
 *     summary: Lấy danh sách thuốc sắp hết hạn
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Số ngày sắp hết hạn
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/expiring-soon',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    MedicineController.getExpiringSoon
);

/**
 * @swagger
 * /medicines/low-stock:
 *   get:
 *     summary: Lấy danh sách thuốc sắp hết kho
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Ngưỡng số lượng tồn kho
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/low-stock',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    MedicineController.getLowStock
);

/**
 * @swagger
 * /medicines/{id}:
 *   get:
 *     summary: Lấy thông tin thuốc theo ID
 *     tags: [Medicines]
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
    MedicineController.getById
);

/**
 * @swagger
 * /medicines:
 *   post:
 *     summary: Tạo thuốc mới (Chỉ Admin)
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_thuoc
 *               - don_gia_thuoc
 *             properties:
 *               ten_thuoc:
 *                 type: string
 *                 example: Paracetamol 500mg
 *               don_gia_thuoc:
 *                 type: number
 *                 example: 5000
 *               huong_dan_su_dung_thuoc:
 *                 type: string
 *                 example: Uống 1 viên mỗi 6 giờ
 *               don_vi_tinh:
 *                 type: string
 *                 example: Viên
 *               so_luong_thuoc_ton_thuoc:
 *                 type: integer
 *                 example: 100
 *               han_su_dung_thuoc:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-31
 *               giay_to_kiem_dinh_thuoc:
 *                 type: string
 *                 description: Base64 string
 *     responses:
 *       201:
 *         description: Tạo thuốc thành công
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(MedicineValidator.create()),
    MedicineController.create
);

/**
 * @swagger
 * /medicines/{id}:
 *   put:
 *     summary: Cập nhật thuốc (Chỉ Admin)
 *     tags: [Medicines]
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
 *               ten_thuoc:
 *                 type: string
 *               don_gia_thuoc:
 *                 type: number
 *               huong_dan_su_dung_thuoc:
 *                 type: string
 *               don_vi_tinh:
 *                 type: string
 *               so_luong_thuoc_ton_thuoc:
 *                 type: integer
 *               han_su_dung_thuoc:
 *                 type: string
 *                 format: date
 *               giay_to_kiem_dinh_thuoc:
 *                 type: string
 *               trang_thai_thuoc:
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
    validate(MedicineValidator.update()),
    MedicineController.update
);

/**
 * @swagger
 * /medicines/{id}/stock:
 *   patch:
 *     summary: Cập nhật tồn kho (Chỉ Admin)
 *     tags: [Medicines]
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
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 50
 *               type:
 *                 type: string
 *                 enum: [add, subtract]
 *                 default: add
 *     responses:
 *       200:
 *         description: Cập nhật tồn kho thành công
 */
router.patch(
    '/:id/stock',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(MedicineValidator.updateStock()),
    MedicineController.updateStock
);

/**
 * @swagger
 * /medicines/{id}:
 *   delete:
 *     summary: Xóa thuốc (Chỉ Admin)
 *     tags: [Medicines]
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
    MedicineController.delete
);

module.exports = router;