const jwt = require('jsonwebtoken');
const { ENV } = require('../config/env');

class JWTUtil {
    // Tạo access token
    static generateAccessToken(payload) {
        return jwt.sign(payload, ENV.JWT_SECRET, {
            expiresIn: ENV.JWT_EXPIRE
        });
    }

    // Tạo refresh token
    static generateRefreshToken(payload) {
        return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
            expiresIn: ENV.JWT_REFRESH_EXPIRE
        });
    }

    // Verify access token
    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, ENV.JWT_SECRET);
        } catch (error) {
            throw new Error('Token không hợp lệ hoặc đã hết hạn');
        }
    }

    // Verify refresh token
    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
        } catch (error) {
            throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
        }
    }

    // Decode token mà không verify
    static decode(token) {
        return jwt.decode(token);
    }
}

module.exports = JWTUtil;