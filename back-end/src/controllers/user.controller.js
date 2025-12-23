const UserService = require('../services/user.service');
const ResponseUtil = require('../utils/response.util');

class UserController {
    // Lấy danh sách người dùng
    static async getAll(req, res, next) {
        try {
            const { page, limit, search, roleId } = req.query;

            const result = await UserService.getAll(page, limit, search, roleId);

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách người dùng thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin người dùng theo ID
    static async getById(req, res, next) {
        try {
            const { id } = req.params;

            const user = await UserService.getById(id);

            return ResponseUtil.success(
                res,
                user,
                'Lấy thông tin người dùng thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Tạo người dùng mới
    static async create(req, res, next) {
        try {
            const user = await UserService.createUser(req.body);

            return ResponseUtil.success(
                res,
                user,
                'Tạo người dùng thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật người dùng
    static async update(req, res, next) {
        try {
            const { id } = req.params;

            const user = await UserService.updateUser(id, req.body);

            return ResponseUtil.success(
                res,
                user,
                'Cập nhật người dùng thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Xóa người dùng
    static async delete(req, res, next) {
        try {
            const { id } = req.params;

            await UserService.deleteUser(id);

            return ResponseUtil.success(
                res,
                null,
                'Xóa người dùng thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Đổi mật khẩu
    static async changePassword(req, res, next) {
        try {
            const { id } = req.params;
            const { mat_khau_cu, mat_khau_moi } = req.body;

            await UserService.changePassword(id, mat_khau_cu, mat_khau_moi);

            return ResponseUtil.success(
                res,
                null,
                'Đổi mật khẩu thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Người dùng tự đổi mật khẩu
    static async changeMyPassword(req, res, next) {
        try {
            const userId = req.user.ma_nguoi_dung; // lấy từ JWT
            const { mat_khau_cu, mat_khau_moi } = req.body;

            await UserService.changePassword(userId, mat_khau_cu, mat_khau_moi);

            return ResponseUtil.success(
                res,
                null,
                'Đổi mật khẩu thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    static async resetPasswordByAdmin(req, res, next) {
        try {
            const { id } = req.params;
            const { mat_khau_moi } = req.body;

            await UserService.resetPasswordByAdmin(id, mat_khau_moi);

            return ResponseUtil.success(
                res,
                null,
                'Reset mật khẩu thành công'
            );
        } catch (error) {
            next(error);
        }
    }


}

module.exports = UserController;