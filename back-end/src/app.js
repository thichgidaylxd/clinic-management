const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const { ENV } = require('./config/env');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Giới hạn 100 requests
    message: 'Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút'
});
app.use('/api/', limiter);

// Body Parser Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (ENV.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server đang hoạt động bình thường',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/v1', routes);

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Không tìm thấy route này'
    });
});

// Error Handler
app.use(errorMiddleware);

module.exports = app;