const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const swaggerSpec = require('./config/swagger');
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
    windowMs: 15 * 60 * 1000,
    max: 100,
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

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Clinic Management API Documentation'
}));

// Swagger JSON
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

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