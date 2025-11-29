const app = require('./src/app');
const { ENV } = require('./src/config/env');

const PORT = ENV.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên port ${PORT}`);
    console.log(`📍 Môi trường: ${ENV.NODE_ENV}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
});

// Xử lý graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM nhận được, đóng server...');
    server.close(() => {
        console.log('💤 Server đã đóng');
        process.exit(0);
    });
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Lỗi không được xử lý:', err);
    server.close(() => process.exit(1));
});