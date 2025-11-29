const ResponseUtil = require('../utils/response.util');

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Hiển thị tất cả lỗi
            stripUnknown: true // Loại bỏ các field không được định nghĩa
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return ResponseUtil.validationError(res, errors);
        }

        // Gán value đã được validate vào req.body
        req.body = value;
        next();
    };
};

module.exports = validate;