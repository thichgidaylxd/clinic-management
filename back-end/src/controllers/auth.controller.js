const AuthService = require('../services/auth.service');
const ResponseUtil = require('../utils/response.util');

class AuthController {
    // Đăng ký
    static async register(req, res, next) {
        try {
            const result = await AuthService.register(req.body);

            return ResponseUtil.success(
                res,
                result,
                'Đăng ký tài khoản thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // Đăng nhập
    static async login(req, res, next) {
        try {
            const result = await AuthService.login(req.body);

            return ResponseUtil.success(
                res,
                result,
                'Đăng nhập thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Refresh token
    static async refreshToken(req, res, next) {
        try {
            const { refresh_token } = req.body;
            const result = await AuthService.refreshToken(refresh_token);

            return ResponseUtil.success(
                res,
                result,
                'Làm mới token thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin user hiện tại
    static async getCurrentUser(req, res, next) {
        try {
            const user = await AuthService.getCurrentUser(req.user.ma_nguoi_dung);

            return ResponseUtil.success(
                res,
                user,
                'Lấy thông tin người dùng thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Đăng xuất
    static async logout(req, res, next) {
        try {
            // Trong thực tế, bạn có thể lưu token vào blacklist
            // Ở đây chỉ trả về success
            return ResponseUtil.success(
                res,
                null,
                'Đăng xuất thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;