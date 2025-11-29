const ResponseUtil = require('../utils/response.util');

const errorMiddleware = (err, req, res, next) => {
    console.error('❌ Lỗi:', err);

    // Lỗi validation
    if (err.name === 'ValidationError') {
        return ResponseUtil.validationError(res, err.details);
    }

    // Lỗi JWT
    if (err.name === 'JsonWebTokenError') {
        return ResponseUtil.unauthorized(res, 'Token không hợp lệ');
    }

    if (err.name === 'TokenExpiredError') {
        return ResponseUtil.unauthorized(res, 'Token đã hết hạn');
    }

    // Lỗi database
    if (err.code === 'ER_DUP_ENTRY') {
        return ResponseUtil.error(res, 'Dữ liệu đã tồn tại', 409);
    }

    // Lỗi mặc định
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Có lỗi xảy ra trên máy chủ';

    return ResponseUtil.error(res, message, statusCode);
};

module.exports = errorMiddleware;