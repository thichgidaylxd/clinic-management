const mysql = require('mysql2/promise');
const { ENV } = require('./env');

const pool = mysql.createPool({
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test kết nối
pool.getConnection()
    .then(connection => {
        console.log('✅ Kết nối database thành công!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối database:', err.message);
        process.exit(1);
    });

module.exports = pool;