const DoctorReviewService = require('../services/doctorReview.service');

class DoctorReviewController {

    // POST /api/v1/reviews
    static async create(req, res) {
        try {
            const userId = req.user.ma_nguoi_dung; // từ middleware auth

            await DoctorReviewService.createReview(userId, req.body);

            res.json({
                success: true,
                message: 'Đánh giá bác sĩ thành công'
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }


    // GET /api/v1/reviews/doctor/:doctorId
    static async getByDoctor(req, res) {
        try {
            const data = await DoctorReviewService.getDoctorReviews(
                req.params.doctorId
            );

            res.json({
                success: true,
                data
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    // GET /api/v1/reviews/doctor/:doctorId/stats
    static async getStats(req, res) {
        try {
            const stats = await DoctorReviewService.getDoctorRatingStats(
                req.params.doctorId
            );

            res.json({
                success: true,
                data: stats
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
}

module.exports = DoctorReviewController;
