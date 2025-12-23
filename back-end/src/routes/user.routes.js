const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');
const UserValidator = require('../validators/user.validator');

const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

// ===== USERS ROUTES =====

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng trong hệ thống
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách người dùng (Chỉ Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    UserController.getAll
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID (Chỉ Admin)
 *     tags: [Users]
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
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    UserController.getById
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo người dùng mới (Chỉ Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email hoặc tên đăng nhập đã tồn tại
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(UserValidator.create()),
    UserController.create
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Cập nhật người dùng (Chỉ Admin)
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.put(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(UserValidator.update()),
    UserController.update
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa người dùng (Chỉ Admin)
 *     tags: [Users]
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
 *         description: Không tìm thấy người dùng
 */
router.delete(
    '/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    UserController.delete
);


/**
 * @swagger
 * /users/me/password:
 *   put:
 *     summary: Người dùng tự đổi mật khẩu
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserChangePassword'
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       400:
 *         description: Mật khẩu cũ không đúng
 */
router.put(
    '/me/password',
    AuthMiddleware.authenticate,
    validate(UserValidator.changePassword()),
    UserController.changeMyPassword
);

/**
 * @swagger
 * /users/{id}/password:
 *   put:
 *     summary: Đổi mật khẩu người dùng (Chỉ Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserChangePassword'
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.put(
    '/:id/password',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(UserValidator.changePassword()),
    UserController.changePassword
);

/**
 * @swagger
 * /users/{id}/reset-password:
 *   put:
 *     summary: Admin reset mật khẩu người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.put(
    '/:id/reset-password',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    validate(UserValidator.resetPassword()),
    UserController.resetPasswordByAdmin
);

module.exports = router;
