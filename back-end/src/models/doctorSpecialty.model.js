const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class DoctorSpecialtyModel {
    // Thêm chuyên khoa cho bác sĩ
    static async addSpecialty(doctorId, specialtyId) {
        const query = `
            INSERT INTO bang_bac_si_chuyen_khoa (ma_bac_si, ma_chuyen_khoa)
            VALUES (?, ?)
        `;

        await db.execute(query, [
            UUIDUtil.toBinary(doctorId),
            UUIDUtil.toBinary(specialtyId)
        ]);

        return true;
    }

    // Thêm nhiều chuyên khoa cho bác sĩ
    static async addMultipleSpecialties(doctorId, specialtyIds) {
        if (!specialtyIds || specialtyIds.length === 0) return true;

        //  FIX: Dùng vòng lặp thay vì VALUES bulk insert
        for (const specialtyId of specialtyIds) {
            const query = `
            INSERT INTO bang_bac_si_chuyen_khoa (ma_bac_si, ma_chuyen_khoa)
            VALUES (?, ?)
        `;

            await db.execute(query, [
                UUIDUtil.toBinary(doctorId),
                UUIDUtil.toBinary(specialtyId)
            ]);
        }

        return true;
    }

    // Xóa chuyên khoa của bác sĩ
    static async removeSpecialty(doctorId, specialtyId) {
        const query = `
            DELETE FROM bang_bac_si_chuyen_khoa
            WHERE ma_bac_si = ? AND ma_chuyen_khoa = ?
        `;

        const [result] = await db.execute(query, [
            UUIDUtil.toBinary(doctorId),
            UUIDUtil.toBinary(specialtyId)
        ]);

        return result.affectedRows > 0;
    }

    // Xóa tất cả chuyên khoa của bác sĩ
    static async removeAllSpecialties(doctorId) {
        const query = `
            DELETE FROM bang_bac_si_chuyen_khoa
            WHERE ma_bac_si = ?
        `;

        await db.execute(query, [UUIDUtil.toBinary(doctorId)]);
        return true;
    }

    // Lấy danh sách chuyên khoa của bác sĩ
    static async getDoctorSpecialties(doctorId) {
        const query = `
            SELECT 
                BIN_TO_UUID(bsck.ma_chuyen_khoa) as ma_chuyen_khoa,
                ck.ten_chuyen_khoa,
                ck.mo_ta_chuyen_khoa,
                bsck.ngay_tao
            FROM bang_bac_si_chuyen_khoa bsck
            INNER JOIN bang_chuyen_khoa ck ON bsck.ma_chuyen_khoa = ck.ma_chuyen_khoa
            WHERE bsck.ma_bac_si = ?
            ORDER BY bsck.ngay_tao ASC
        `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(doctorId)]);
        return rows;
    }

    // Kiểm tra bác sĩ có chuyên khoa này không
    static async hasSpecialty(doctorId, specialtyId) {
        const query = `
            SELECT COUNT(*) as count
            FROM bang_bac_si_chuyen_khoa
            WHERE ma_bac_si = ? AND ma_chuyen_khoa = ?
        `;

        const [rows] = await db.execute(query, [
            UUIDUtil.toBinary(doctorId),
            UUIDUtil.toBinary(specialtyId)
        ]);

        return rows[0].count > 0;
    }

    // Cập nhật danh sách chuyên khoa của bác sĩ
    static async updateDoctorSpecialties(doctorId, specialtyIds) {
        // Xóa tất cả chuyên khoa cũ
        await this.removeAllSpecialties(doctorId);

        // Thêm chuyên khoa mới
        if (specialtyIds && specialtyIds.length > 0) {
            await this.addMultipleSpecialties(doctorId, specialtyIds);
        }

        return true;
    }
}

module.exports = DoctorSpecialtyModel;