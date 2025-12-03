const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const specialtyRoutes = require('./specialty.routes');
const medicineRoutes = require('./medicine.routes');
const serviceRoutes = require('./service.routes');
const roomRoutes = require('./room.routes');

// Route mặc định
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Clinic Management API v1.0',
        version: '1.0.0',
        endpoints: {
            auth: '/api/v1/auth',
            specialties: '/api/v1/specialties',
            medicines: '/api/v1/medicines',
            services: '/api/v1/services',
            rooms: '/api/v1/rooms',
            users: '/api/v1/users',
            doctors: '/api/v1/doctors',
            patients: '/api/v1/patients',
            appointments: '/api/v1/appointments'
        }
    });
});

// Routes
router.use('/auth', authRoutes);
router.use('/specialties', specialtyRoutes);
router.use('/medicines', medicineRoutes);
router.use('/services', serviceRoutes);
router.use('/rooms', roomRoutes);

module.exports = router;