const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');

// Route mặc định
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Clinic Management API v1.0',
        version: '1.0.0',
        endpoints: {
            auth: '/api/v1/auth',
            users: '/api/v1/users',
            doctors: '/api/v1/doctors',
            patients: '/api/v1/patients',
            appointments: '/api/v1/appointments'
        }
    });
});

// Auth routes
router.use('/auth', authRoutes);

module.exports = router;