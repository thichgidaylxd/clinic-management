const rateLimit = require('express-rate-limit');

// Rate limiter cho API endpoints
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 phút
    max: 100, // ✅ Tăng từ mặc định (thường là 10-20) lên 100 requests
    message: {
        success: false,
        message: 'Quá nhiều requests từ IP này, vui lòng thử lại sau 1 phút'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limit cho development
        return process.env.NODE_ENV === 'development';
    }
});

// Rate limiter nghiêm ngặt hơn cho auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // 5 requests
    message: {
        success: false,
        message: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 15 phút'
    }
});

module.exports = {
    apiLimiter,
    authLimiter
};