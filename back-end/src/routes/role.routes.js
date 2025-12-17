const express = require('express');
const router = express.Router();

const RoleModel = require('../models/role.model');
const ResponseUtil = require('../utils/response.util');
const AuthMiddleware = require('../middlewares/auth.middleware');
const CONSTANTS = require('../config/constants');

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Quản lý vai trò trong hệ thống
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Lấy danh sách vai trò (Chỉ Admin)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
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
 *                   example: Lấy danh sách vai trò thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ma_vai_tro:
 *                         type: string
 *                         format: uuid
 *                       ten_vai_tro:
 *                         type: string
 *                       trang_thai_vai_tro:
 *                         type: integer
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.get(
    '/',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize(CONSTANTS.ROLES.ADMIN),
    async (req, res, next) => {
        try {
            const roles = await RoleModel.findAll();
            return ResponseUtil.success(res, roles, 'Lấy danh sách vai trò thành công');
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;