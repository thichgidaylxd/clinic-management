const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class DoctorReviewModel {

    // ===============================
    // TẠO ĐÁNH GIÁ
    // ===============================
    static async create({
        reviewId,
        doctorId,
        userId,
        appointmentId,
        rating,
        content
    }) {
        return db.execute(
            `
        INSERT INTO bang_danh_gia_bac_si (
            ma_danh_gia,
            ma_bac_si_danh_gia,
            ma_nguoi_dung_danh_gia,
            ma_lich_hen_danh_gia,
            so_sao_danh_gia,
            noi_dung_danh_gia
        )
        VALUES (
            UUID_TO_BIN(?),
            UUID_TO_BIN(?),
            UUID_TO_BIN(?),
            UUID_TO_BIN(?),
            ?,
            ?
        )
        `,
            [
                reviewId,
                doctorId,
                userId,
                appointmentId,
                rating,
                content
            ]
        );
    }

    // ===============================
    // KIỂM TRA ĐÃ ĐÁNH GIÁ CHƯA
    // ===============================
    static async existsByAppointment(appointmentId) {
        const [rows] = await db.execute(
            `
            SELECT 1
            FROM bang_danh_gia_bac_si
            WHERE ma_lich_hen_danh_gia = UUID_TO_BIN(?)
            LIMIT 1
            `,
            [appointmentId]
        );
        return rows.length > 0;
    }

    // ===============================
    // LẤY ĐÁNH GIÁ THEO BÁC SĨ
    // ===============================
    static async findByDoctor(doctorId) {
        const [rows] = await db.execute(
            `
            SELECT
                BIN_TO_UUID(dg.ma_danh_gia) AS ma_danh_gia,
                dg.so_sao_danh_gia,
                dg.noi_dung_danh_gia,
                dg.ngay_tao_danh_gia,
                nd.ten_nguoi_dung,
                nd.ho_nguoi_dung
            FROM bang_danh_gia_bac_si dg
            INNER JOIN bang_nguoi_dung nd
                ON dg.ma_nguoi_dung_danh_gia = nd.ma_nguoi_dung
            WHERE dg.ma_bac_si_danh_gia = UUID_TO_BIN(?)
              AND dg.trang_thai_danh_gia = 1
            ORDER BY dg.ngay_tao_danh_gia DESC
            `,
            [doctorId]
        );
        return rows;
    }

    // ===============================
    // ĐIỂM TRUNG BÌNH BÁC SĨ
    // ===============================
    static async getAverageRating(doctorId) {
        const [[row]] = await db.execute(
            `
            SELECT 
                ROUND(AVG(so_sao_danh_gia), 1) AS diem_trung_binh,
                COUNT(*) AS tong_danh_gia
            FROM bang_danh_gia_bac_si
            WHERE ma_bac_si_danh_gia = UUID_TO_BIN(?)
              AND trang_thai_danh_gia = 1
            `,
            [doctorId]
        );

        return row;
    }
}

module.exports = DoctorReviewModel;
