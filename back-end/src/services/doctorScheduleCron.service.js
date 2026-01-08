const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class DoctorScheduleCronService {

    /**
     * Sinh lịch làm việc cho 1 bác sĩ
     */
    static async generateForDoctor(doctorId, daysAhead = 14) {
        const today = new Date();

        for (let i = 0; i < daysAhead; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const jsDay = date.getDay(); // 0=CN
            if (jsDay === 0) continue; // bỏ CN

            const ngayLamViec = date.toISOString().split('T')[0];

            // 2 ca cố định
            const shifts = [
                { start: '08:00:00', end: '12:00:00' },
                { start: '13:30:00', end: '17:30:00' }
            ];

            for (const shift of shifts) {

                // ❗ tránh trùng
                const [exists] = await db.execute(
                    `
                    SELECT 1
                    FROM bang_lich_lam_viec
                    WHERE ma_bac_si_lich_lam_viec = UUID_TO_BIN(?)
                      AND ngay_lich_lam_viec = ?
                      AND thoi_gian_bat_dau_lich_lam_viec = ?
                    `,
                    [doctorId, ngayLamViec, shift.start]
                );

                if (exists.length > 0) continue;

                //  tạo lịch
                await db.execute(
                    `
                    INSERT INTO bang_lich_lam_viec
                    (
                        ma_lich_lam_viec,
                        ma_bac_si_lich_lam_viec,
                        ngay_lich_lam_viec,
                        thoi_gian_bat_dau_lich_lam_viec,
                        thoi_gian_ket_thuc_lich_lam_viec,
                        trang_thai_lich_lam_viec,
                        ngay_tao_lich_lam_viec
                    )
                    VALUES (
                        UUID_TO_BIN(?),
                        UUID_TO_BIN(?),
                        ?,
                        ?,
                        ?,
                        1,
                        NOW()
                    )
                    `,
                    [
                        uuidv4(),
                        doctorId,
                        ngayLamViec,
                        shift.start,
                        shift.end
                    ]
                );
            }
        }
    }

    /**
     * Sinh lịch cho toàn bộ bác sĩ
     */
    static async generateForAllDoctors(daysAhead = 14) {
        const [doctors] = await db.execute(
            `SELECT BIN_TO_UUID(ma_bac_si) AS ma_bac_si FROM bang_bac_si`
        );

        for (const d of doctors) {
            await this.generateForDoctor(d.ma_bac_si, daysAhead);
        }
    }
}

module.exports = DoctorScheduleCronService;
