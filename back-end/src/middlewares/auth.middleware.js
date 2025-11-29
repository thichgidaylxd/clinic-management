const JWTUtil = require('../utils/jwt.util');
const ResponseUtil = require('../utils/response.util');

class AuthMiddleware {
    // Verify JWT token
    static authenticate(req, res, next) {
        try {
            // Lấy token từ header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return ResponseUtil.unauthorized(res, 'Vui lòng đăng nhập để tiếp tục');
            }

            const token = authHeader.substring(7); // Bỏ "Bearer "

            // Verify token
            const decoded = JWTUtil.verifyAccessToken(token);

            // Gán thông tin user vào request
            req.user = decoded;

            next();
        } catch (error) {
            return ResponseUtil.unauthorized(res, error.message);
        }
    }

    // Kiểm tra vai trò
    static authorize(...roles) {
        return (req, res, next) => {
            if (!req.user) {
                return ResponseUtil.unauthorized(res, 'Vui lòng đăng nhập để tiếp tục');
            }

            if (!roles.includes(req.user.ten_vai_tro)) {
                return ResponseUtil.forbidden(res, 'Bạn không có quyền truy cập chức năng này');
            }

            next();
        };
    }
}

module.exports = AuthMiddleware;