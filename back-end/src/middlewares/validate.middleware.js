const ResponseUtil = require('../utils/response.util');

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Lấy tất cả lỗi
            stripUnknown: true  // Bỏ các fields không có trong schema
        });

        if (error) {
            console.error('Validation error:', error.details); // ⭐ Debug

            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors
            });
        }

        // Gán validated data vào req.body
        req.body = value;
        next();
    };
};

module.exports = validate;