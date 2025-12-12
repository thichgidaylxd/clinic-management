const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const specialtyRoutes = require('./specialty.routes');
const medicineRoutes = require('./medicine.routes');
const serviceRoutes = require('./service.routes');
const roomRoutes = require('./room.routes');
const doctorRoutes = require('./doctor.routes');
const positionRoutes = require('./position.routes'); // ✅ Thêm
const workScheduleRoutes = require('./workSchedule.routes');
const patientRoutes = require('./patient.routes');
const appointmentRoutes = require('./appointment.routes');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');
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
            doctors: '/api/v1/doctors',
            positions: '/api/v1/positions', // ✅ Thêm
            workSchedules: '/api/v1/work-schedules',
            patients: '/api/v1/patients',
            appointments: '/api/v1/appointments',
            users: '/api/v1/users',
            roles: '/api/v1/roles'
        }
    });
});

// Routes
router.use('/auth', authRoutes);
router.use('/specialties', specialtyRoutes);
router.use('/medicines', medicineRoutes);
router.use('/services', serviceRoutes);
router.use('/rooms', roomRoutes);
router.use('/doctors', doctorRoutes);
router.use('/positions', positionRoutes); // ✅ Thêm
router.use('/work-schedules', workScheduleRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);

module.exports = router;
