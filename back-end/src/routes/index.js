const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const specialtyRoutes = require('./specialty.routes');
const medicineRoutes = require('./medicine.routes');
const serviceRoutes = require('./service.routes');
const roomRoutes = require('./room.routes');
const doctorRoutes = require('./doctor.routes');
const positionRoutes = require('./position.routes');
const workScheduleRoutes = require('./workSchedule.routes');
const patientRoutes = require('./patient.routes');
const appointmentRoutes = require('./appointment.routes');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');
const receptionistRoutes = require('./receptionist.routes');
const prescriptionRoutes = require('./prescription.routes');
const invoiceRoutes = require('./invoice.routes');
const medicalRecordRoutes = require('./medicalRecord.routes');
const DoctorReviewRoutes = require('./doctorReview.routes');
const RevenueRoutes = require('./revenue.routes'); //  THỐNG KÊ DOANH THU

// ==========================
// ROUTE MẶC ĐỊNH
// ==========================
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
            positions: '/api/v1/positions',
            workSchedules: '/api/v1/work-schedules',
            patients: '/api/v1/patients',
            appointments: '/api/v1/appointments',
            users: '/api/v1/users',
            roles: '/api/v1/roles',
            receptionists: '/api/v1/receptionists',
            prescriptions: '/api/v1/prescriptions',
            invoices: '/api/v1/invoices',
            medicalRecords: '/api/v1/medical-records',
            reviews: '/api/v1/reviews',
            revenue: '/api/v1/revenue' //  THÊM
        }
    });
});

// ==========================
// ROUTES
// ==========================
router.use('/auth', authRoutes);
router.use('/specialties', specialtyRoutes);
router.use('/medicines', medicineRoutes);
router.use('/services', serviceRoutes);
router.use('/rooms', roomRoutes);
router.use('/doctors', doctorRoutes);
router.use('/positions', positionRoutes);
router.use('/work-schedules', workScheduleRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/receptionist', receptionistRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/reviews', DoctorReviewRoutes);

//  ROUTE DOANH THU
router.use('/revenue', RevenueRoutes);

module.exports = router;
