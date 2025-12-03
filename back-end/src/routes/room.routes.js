const express = require('express');
const router = express.Router();

const RoomController = require('../controllers/room.controller');
const RoomValidator = require('../validators/room.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

// Validate query params middleware
const validateQueryRooms = (req, res, next) => {
    const { error, value } = RoomValidator.queryRooms().validate(req.query);
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

// ===== LOẠI PHÒNG KHÁM =====

/**
 * @swagger
 * /rooms/types:
 *   get:
 *     summary: Lấy danh sách loại phòng khám
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/types',
    RoomController.getAllRoomTypes
);

/**
 * @swagger
 * /rooms/types/{id}:
 *   get:
 *     summary: Lấy thông tin loại phòng khám theo ID
 *     tags: [Rooms]
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
    '/types/:id',
    RoomController.getRoomTypeById
);

/**
 * @swagger
 * /rooms/types:
 *   post:
 *     summary: Tạo loại phòng khám mới (Chỉ Admin)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_loai_phong_kham
 *             properties:
 *               ten_loai_phong_kham:
 *                 type: string
 *                 example: Phòng khám bệnh
 *               mo_ta_loai_phong_kham:
 *                 type: string
 *                 example: Phòng dùng để khám bệnh cho bệnh nhân
 *     responses:
 *       201:
 *         description: Tạo loại phòng khám thành công
 */
router.post(
    '/types',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(RoomValidator.createRoomType()),
    RoomController.createRoomType
);

/**
 * @swagger
 * /rooms/types/{id}:
 *   put:
 *     summary: Cập nhật loại phòng khám (Chỉ Admin)
 *     tags: [Rooms]
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
 *               ten_loai_phong_kham:
 *                 type: string
 *               mo_ta_loai_phong_kham:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put(
    '/types/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(RoomValidator.updateRoomType()),
    RoomController.updateRoomType
);

/**
 * @swagger
 * /rooms/types/{id}:
 *   delete:
 *     summary: Xóa loại phòng khám (Chỉ Admin)
 *     tags: [Rooms]
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
    '/types/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    RoomController.deleteRoomType
);

// ===== PHÒNG KHÁM =====

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Lấy danh sách phòng khám
 *     tags: [Rooms]
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
 *         description: Tìm kiếm theo tên hoặc số phòng
 *       - in: query
 *         name: specialtyId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lọc theo chuyên khoa
 *       - in: query
 *         name: roomTypeId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lọc theo loại phòng
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
    validateQueryRooms,
    RoomController.getAllRooms
);

/**
 * @swagger
 * /rooms/available:
 *   get:
 *     summary: Lấy danh sách phòng khám có sẵn
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: specialtyId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: roomTypeId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/available',
    RoomController.getAvailableRooms
);

/**
 * @swagger
 * /rooms/stats/by-specialty:
 *   get:
 *     summary: Thống kê phòng khám theo chuyên khoa (Chỉ Admin)
 *     tags: [Rooms]
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
    RoomController.getStatsBySpecialty
);

/**
 * @swagger
 * /rooms/stats/by-type:
 *   get:
 *     summary: Thống kê phòng khám theo loại (Chỉ Admin)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 */
router.get(
    '/stats/by-type',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    RoomController.getStatsByRoomType
);

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Lấy thông tin phòng khám theo ID
 *     tags: [Rooms]
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
    RoomController.getRoomById
);

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Tạo phòng khám mới (Chỉ Admin)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_phong_kham
 *             properties:
 *               ten_phong_kham:
 *                 type: string
 *                 example: Phòng khám tổng quát 1
 *               so_phong_kham:
 *                 type: integer
 *                 example: 101
 *               ma_chuyen_khoa_phong_kham:
 *                 type: string
 *                 format: uuid
 *                 description: ID chuyên khoa (tùy chọn)
 *               ma_loai_phong_kham:
 *                 type: string
 *                 format: uuid
 *                 description: ID loại phòng (tùy chọn)
 *               trang_thai_phong_kham:
 *                 type: integer
 *                 enum: [0, 1]
 *                 default: 1
 *                 description: 0-Không hoạt động, 1-Hoạt động
 *     responses:
 *       201:
 *         description: Tạo phòng khám thành công
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(RoomValidator.createRoom()),
    RoomController.createRoom
);

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Cập nhật phòng khám (Chỉ Admin)
 *     tags: [Rooms]
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
 *               ten_phong_kham:
 *                 type: string
 *               so_phong_kham:
 *                 type: integer
 *               ma_chuyen_khoa_phong_kham:
 *                 type: string
 *                 format: uuid
 *               ma_loai_phong_kham:
 *                 type: string
 *                 format: uuid
 *               trang_thai_phong_kham:
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
    validate(RoomValidator.updateRoom()),
    RoomController.updateRoom
);

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Xóa phòng khám (Chỉ Admin)
 *     tags: [Rooms]
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
    RoomController.deleteRoom
);

module.exports = router;