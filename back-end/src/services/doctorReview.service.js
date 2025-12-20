const DoctorReviewModel = require('../models/doctorReview.model');
const AppointmentModel = require('../models/appointment.model');
const { v4: uuidv4 } = require('uuid');

class DoctorReviewService {

    static async createReview(userId, data) {
        const {
            appointmentId,
            doctorId,
            rating,
            content
        } = data;

        if (!appointmentId || !doctorId || !rating) {
            throw new Error('Thiếu dữ liệu đánh giá');
        }

        // 1️⃣ Lấy lịch hẹn
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new Error('Lịch hẹn không tồn tại');
        }

        console.log(appointment.ma_nguoi_tao_lich_hen, userId);
        // 2️⃣ Đúng bệnh nhân
        if (appointment.ma_nguoi_tao_lich_hen !== userId) {
            throw new Error('Bạn không có quyền đánh giá lịch hẹn này');
        }

        // 3️⃣ Đã hoàn thành
        if (appointment.trang_thai_lich_hen !== 4) {
            throw new Error('Chỉ được đánh giá sau khi hoàn thành khám');
        }

        // 4️⃣ Không đánh giá trùng
        const exists = await DoctorReviewModel.existsByAppointment(appointmentId);
        if (exists) {
            throw new Error('Lịch hẹn này đã được đánh giá');
        }

        // 5️⃣ Tạo đánh giá
        return DoctorReviewModel.create({
            reviewId: uuidv4(),
            doctorId,
            userId,
            appointmentId,
            rating,
            content: content || null
        });
    }



    static async getDoctorReviews(doctorId) {
        return DoctorReviewModel.findByDoctor(doctorId);
    }

    static async getDoctorRatingStats(doctorId) {
        return DoctorReviewModel.getAverageRating(doctorId);
    }
}

module.exports = DoctorReviewService;
