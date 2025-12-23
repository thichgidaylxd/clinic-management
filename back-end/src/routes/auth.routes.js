const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const AuthValidator = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_nguoi_dung
 *               - ten_dang_nhap_nguoi_dung
 *               - mat_khau_nguoi_dung
 *             properties:
 *               ten_nguoi_dung:
 *                 type: string
 *                 description: Tên đầy đủ của người dùng
 *                 example: Nguyễn Văn A
 *               ho_nguoi_dung:
 *                 type: string
 *                 description: Họ của người dùng
 *                 example: Nguyễn
 *               ten_dang_nhap_nguoi_dung:
 *                 type: string
 *                 description: Tên đăng nhập (3-20 ký tự, chỉ chữ và số)
 *                 example: nguyenvana
 *               mat_khau_nguoi_dung:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu (tối thiểu 6 ký tự)
 *                 example: "123456"
 *               email_nguoi_dung:
 *                 type: string
 *                 format: email
 *                 description: Email của người dùng
 *                 example: nguyenvana@email.com
 *               so_dien_thoai_nguoi_dung:
 *                 type: string
 *                 description: Số điện thoại (10 chữ số)
 *                 example: "0123456789"
 *               gioi_tinh_nguoi_dung:
 *                 type: integer
 *                 enum: [0, 1, 2]
 *                 description: 0-Nữ, 1-Nam, 2-Khác
 *                 example: 1
 *               ma_vai_tro:
 *                 type: string
 *                 format: uuid
 *                 description: ID vai trò (không bắt buộc, mặc định là Bệnh nhân)
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đăng ký tài khoản thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Tên đăng nhập hoặc email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    '/register',
    validate(AuthValidator.register()),
    AuthController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten_dang_nhap_nguoi_dung
 *               - mat_khau_nguoi_dung
 *             properties:
 *               ten_dang_nhap_nguoi_dung:
 *                 type: string
 *                 description: Tên đăng nhập
 *                 example: nguyenvana
 *               mat_khau_nguoi_dung:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đăng nhập thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token để sử dụng cho các request tiếp theo
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token để làm mới access token
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Tên đăng nhập hoặc mật khẩu không đúng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Tên đăng nhập hoặc mật khẩu không đúng
 *               timestamp: "2024-01-01T00:00:00.000Z"
 */
router.post(
    '/login',
    validate(AuthValidator.login()),
    AuthController.login
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Làm mới access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: Refresh token nhận được khi đăng nhập
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Làm mới token thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Làm mới token thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: Access token mới
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Refresh token không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    '/refresh-token',
    validate(AuthValidator.refreshToken()),
    AuthController.refreshToken
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lấy thông tin người dùng thành công
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
    '/me',
    AuthMiddleware.authenticate,
    AuthController.getCurrentUser
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất khỏi hệ thống
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đăng xuất thành công
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
    '/logout',
    AuthMiddleware.authenticate,
    AuthController.logout
);

module.exports = router;