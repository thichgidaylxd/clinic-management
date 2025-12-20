const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');


class MedicalRecordModel {
    /**
     * Tạo hồ sơ bệnh án mới
     */
    static async create(recordData) {
        const {
            ma_benh_nhan,
            ma_bac_si,
            ma_chuyen_khoa,
            trieu_chung,
            chuan_doan,
            phuong_phap_dieu_tri
        } = recordData;

        const ma_ho_so_benh_an = UUIDUtil.generate();

        const query = `
            INSERT INTO bang_ho_so_benh_an (
                ma_ho_so_benh_an,
                ma_benh_nhan,
                ma_bac_si,
                ma_chuyen_khoa,
                trieu_chung,
                chuan_doan,
                phuong_phap_dieu_tri,
                ngay_tao_ho_so,
                ngay_cap_nhat_ho_so
            ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;

        await db.execute(query, [
            UUIDUtil.toBinary(ma_ho_so_benh_an),
            UUIDUtil.toBinary(ma_benh_nhan),
            UUIDUtil.toBinary(ma_bac_si),
            ma_chuyen_khoa ? UUIDUtil.toBinary(ma_chuyen_khoa) : null,
            trieu_chung || null,
            chuan_doan || null,
            phuong_phap_dieu_tri || null
        ]);

        return ma_ho_so_benh_an;
    }

    /**
     * Lấy danh sách hồ sơ bệnh án của bác sĩ hiện tại (phân trang + tìm kiếm)
     * @param {string} doctorId - ma_bac_si của bác sĩ
     * @param {Object} options - { page, limit, search, specialty }
     */
    // src/models/medicalRecordModel.js

    static async getAllForDoctor(
        doctorId,
        { page = 1, limit = 10, search = '', specialty = 'all' } = {}
    ) {
        // ❗ ÉP KIỂU CHUẨN
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const offset = Number((pageNum - 1) * limitNum);

        if (
            !Number.isInteger(pageNum) ||
            !Number.isInteger(limitNum) ||
            pageNum < 1 ||
            limitNum <= 0
        ) {
            throw new Error('page/limit không hợp lệ');
        }

        if (!doctorId) {
            throw new Error('Thiếu doctorId');
        }

        const whereConditions = [];
        const params = [];

        // ✅ UUID_TO_BIN CHUẨN
        whereConditions.push('hsba.ma_bac_si = UUID_TO_BIN(?)');
        params.push(doctorId);

        if (search.trim()) {
            whereConditions.push(`
            (
                bn.ten_benh_nhan LIKE ?
                OR bn.ho_benh_nhan LIKE ?
                OR hsba.chuan_doan LIKE ?
            )
        `);
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (specialty && specialty !== 'all') {
            whereConditions.push('ck.ten_chuyen_khoa = ?');
            params.push(specialty);
        }

        const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

        const query = `
        SELECT 
            BIN_TO_UUID(hsba.ma_ho_so_benh_an) AS ma_ho_so_benh_an,
            BIN_TO_UUID(hsba.ma_benh_nhan) AS ma_benh_nhan,
            BIN_TO_UUID(hsba.ma_bac_si) AS ma_bac_si,
            BIN_TO_UUID(hsba.ma_chuyen_khoa) AS ma_chuyen_khoa,
            hsba.chuan_doan,
            hsba.ngay_tao_ho_so,
            bn.ho_benh_nhan,
            bn.ten_benh_nhan,
            ck.ten_chuyen_khoa
        FROM bang_ho_so_benh_an hsba
        INNER JOIN bang_benh_nhan bn 
            ON hsba.ma_benh_nhan = bn.ma_benh_nhan
        LEFT JOIN bang_chuyen_khoa ck 
            ON hsba.ma_chuyen_khoa = ck.ma_chuyen_khoa
        ${whereClause}
        ORDER BY hsba.ngay_tao_ho_so DESC
        LIMIT ${limitNum} OFFSET ${offset}
    `;

        // ⚠️ LIMIT/OFFSET đưa thẳng vào string → an toàn & không lỗi
        const [rows] = await db.query(query, params);

        const countQuery = `
        SELECT COUNT(*) AS total
        FROM bang_ho_so_benh_an hsba
        INNER JOIN bang_benh_nhan bn 
            ON hsba.ma_benh_nhan = bn.ma_benh_nhan
        LEFT JOIN bang_chuyen_khoa ck 
            ON hsba.ma_chuyen_khoa = ck.ma_chuyen_khoa
        ${whereClause}
    `;

        const [[count]] = await db.query(countQuery, params);

        return {
            data: rows,
            pagination: {
                total: count.total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(count.total / limitNum),
            },
        };
    }


    /**
     * Lấy hồ sơ bệnh án theo ID
     */
    static async findById(recordId) {
        const query = `
            SELECT 
                BIN_TO_UUID(hsba.ma_ho_so_benh_an) as ma_ho_so_benh_an,
                BIN_TO_UUID(hsba.ma_benh_nhan) as ma_benh_nhan,
                BIN_TO_UUID(hsba.ma_bac_si) as ma_bac_si,
                BIN_TO_UUID(hsba.ma_chuyen_khoa) as ma_chuyen_khoa,
                hsba.trieu_chung,
                hsba.chuan_doan,
                hsba.phuong_phap_dieu_tri,
                hsba.ngay_tao_ho_so,
                hsba.ngay_cap_nhat_ho_so,
                -- Patient info
                bn.ten_benh_nhan,
                bn.ho_benh_nhan,
                -- Doctor info
                nd.ten_nguoi_dung as ten_bac_si,
                nd.ho_nguoi_dung as ho_bac_si,
                -- Specialty
                ck.ten_chuyen_khoa
            FROM bang_ho_so_benh_an hsba
            INNER JOIN bang_benh_nhan bn ON hsba.ma_benh_nhan = bn.ma_benh_nhan
            INNER JOIN bang_bac_si bs ON hsba.ma_bac_si = bs.ma_bac_si
            INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
            LEFT JOIN bang_chuyen_khoa ck ON hsba.ma_chuyen_khoa = ck.ma_chuyen_khoa
            WHERE hsba.ma_ho_so_benh_an = UUID_TO_BIN(?)
        `;

        const [rows] = await db.execute(query, [recordId]);
        return rows[0] || null;
    }

    /**
     * Lấy hồ sơ bệnh án theo bệnh nhân
     */
    static async findByPatient(patientId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                BIN_TO_UUID(hsba.ma_ho_so_benh_an) as ma_ho_so_benh_an,
                BIN_TO_UUID(hsba.ma_bac_si) as ma_bac_si,
                BIN_TO_UUID(hsba.ma_chuyen_khoa) as ma_chuyen_khoa,
                hsba.chuan_doan,
                hsba.ngay_tao_ho_so,
                -- Doctor info
                nd.ten_nguoi_dung as ten_bac_si,
                nd.ho_nguoi_dung as ho_bac_si,
                -- Specialty
                ck.ten_chuyen_khoa
            FROM bang_ho_so_benh_an hsba
            INNER JOIN bang_bac_si bs ON hsba.ma_bac_si = bs.ma_bac_si
            INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
            LEFT JOIN bang_chuyen_khoa ck ON hsba.ma_chuyen_khoa = ck.ma_chuyen_khoa
            WHERE hsba.ma_benh_nhan = UUID_TO_BIN(?)
            ORDER BY hsba.ngay_tao_ho_so DESC
            LIMIT ? OFFSET ?
        `;

        const [rows] = await db.execute(query, [patientId, limit, offset]);

        // Count total
        const [countResult] = await db.execute(
            'SELECT COUNT(*) as total FROM bang_ho_so_benh_an WHERE ma_benh_nhan = UUID_TO_BIN(?)',
            [patientId]
        );

        return {
            data: rows,
            pagination: {
                total: countResult[0].total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(countResult[0].total / limit)
            }
        };
    }

    /**
     * Cập nhật hồ sơ bệnh án
     */
    static async update(recordId, updateData) {
        const fields = [];
        const values = [];

        const allowedFields = [
            'trieu_chung',
            'chuan_doan',
            'phuong_phap_dieu_tri'
        ];

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(updateData[field]);
            }
        }

        if (fields.length === 0) {
            throw new Error('Không có dữ liệu để cập nhật');
        }

        fields.push('ngay_cap_nhat_ho_so = CURRENT_TIMESTAMP');
        values.push(UUIDUtil.toBinary(recordId));

        const query = `
            UPDATE bang_ho_so_benh_an 
            SET ${fields.join(', ')}
            WHERE ma_ho_so_benh_an = ?
        `;

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    /**
     * Xóa hồ sơ bệnh án
     */
    static async delete(recordId) {
        const query = 'DELETE FROM bang_ho_so_benh_an WHERE ma_ho_so_benh_an = ?';
        const [result] = await db.execute(query, [UUIDUtil.toBinary(recordId)]);
        return result.affectedRows > 0;
    }
}

module.exports = MedicalRecordModel;