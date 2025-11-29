class ResponseUtil {
    static success(res, data = null, message = 'Thành công', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    static error(res, message = 'Có lỗi xảy ra', statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString()
        });
    }

    static validationError(res, errors) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors,
            timestamp: new Date().toISOString()
        });
    }

    static unauthorized(res, message = 'Không có quyền truy cập') {
        return res.status(401).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }

    static forbidden(res, message = 'Bạn không có quyền thực hiện hành động này') {
        return res.status(403).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }

    static notFound(res, message = 'Không tìm thấy dữ liệu') {
        return res.status(404).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = ResponseUtil;