const express = require('express');
const router = express.Router();
const DoctorReviewController = require('../controllers/doctorReview.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post(
    '/',
    authMiddleware.authenticate,
    DoctorReviewController.create
);

router.get(
    '/doctor/:doctorId',
    DoctorReviewController.getByDoctor
);

router.get(
    '/doctor/:doctorId/stats',
    DoctorReviewController.getStats
);

module.exports = router;
