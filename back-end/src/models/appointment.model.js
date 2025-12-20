const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class AppointmentModel {
    // Tạo lịch hẹn
    static async create(appointmentData) {
        const {
            ma_nguoi_tao_lich_hen,
            ma_bac_si,
            ma_benh_nhan,
            ma_chuyen_khoa,
            ma_nguoi_xac_nhan,
            ma_phong_kham,
            ma_dich_vu_lich_hen,
            ma_lich_lam_viec,  // ✅ THÊM
            trang_thai_lich_hen,
            ly_do_kham_lich_hen,
            ly_do_huy_lich_hen,
            ghi_chu_lich_hen,  // ✅ THÊM
            ngay_hen,  // ✅ THÊM
            gio_bat_dau,  // ✅ THÊM
            gio_ket_thuc,  // ✅ THÊM
            thoi_gian_xac_nhan,
            thoi_gian_hoan_thanh,
            thoi_gian_vao_kham,
            gia_dich_vu_lich_hen,
            tong_gia_lich_hen
        } = appointmentData;

        const ma_lich_hen = UUIDUtil.generate();

        const query = `
        INSERT INTO bang_lich_hen (
            ma_lich_hen,
            ma_nguoi_tao_lich_hen,
            ma_bac_si,
            ma_benh_nhan,
            ma_chuyen_khoa,
            ma_nguoi_xac_nhan,
            ma_phong_kham,
            ma_dich_vu_lich_hen,
            ma_lich_lam_viec,
            ngay_hen,
            gio_bat_dau,
            gio_ket_thuc,
            trang_thai_lich_hen,
            ly_do_kham_lich_hen,
            ly_do_huy_lich_hen,
            ghi_chu_lich_hen,
            thoi_gian_xac_nhan,
            thoi_gian_hoan_thanh,
            thoi_gian_vao_kham,
            gia_dich_vu_lich_hen,
            tong_gia_lich_hen
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        await db.execute(query, [
            UUIDUtil.toBinary(ma_lich_hen),
            ma_nguoi_tao_lich_hen ? UUIDUtil.toBinary(ma_nguoi_tao_lich_hen) : null,
            UUIDUtil.toBinary(ma_bac_si),
            UUIDUtil.toBinary(ma_benh_nhan),
            ma_chuyen_khoa ? UUIDUtil.toBinary(ma_chuyen_khoa) : null,
            ma_nguoi_xac_nhan ? UUIDUtil.toBinary(ma_nguoi_xac_nhan) : null,
            ma_phong_kham ? UUIDUtil.toBinary(ma_phong_kham) : null,
            ma_dich_vu_lich_hen ? UUIDUtil.toBinary(ma_dich_vu_lich_hen) : null,
            ma_lich_lam_viec ? UUIDUtil.toBinary(ma_lich_lam_viec) : null,
            ngay_hen || null,
            gio_bat_dau || null,
            gio_ket_thuc || null,
            trang_thai_lich_hen !== undefined ? trang_thai_lich_hen : 0,
            ly_do_kham_lich_hen || null,
            ly_do_huy_lich_hen || null,
            ghi_chu_lich_hen || null,
            thoi_gian_xac_nhan || null,
            thoi_gian_hoan_thanh || null,
            thoi_gian_vao_kham || null,
            gia_dich_vu_lich_hen || null,
            tong_gia_lich_hen || null
        ]);

        return ma_lich_hen;
    }

    // Tạo thời gian chi tiết
    //     static async createTimeSlot(timeSlotData) {
    //         const {
    //             ma_lich_hen,
    //             ngay,
    //             thoi_gian_bat_dau,
    //             thoi_gian_ket_thuc,
    //             so_thu_tu = 1,
    //             duoc_chap_nhan = 0
    //         } = timeSlotData;

    //         const ma_thoi_gian_chi_tiet = UUIDUtil.generate();

    //         const query = `
    //     INSERT INTO bang_thoi_gian_chi_tiet (
    //       ma_thoi_gian_chi_tiet,
    //       ma_lich_hen,
    //       ngay,
    //       thoi_gian_bat_dau,
    //       thoi_gian_ket_thuc,
    //       so_thu_tu,
    //       duoc_chap_nhan
    //     ) VALUES (
    //       UUID_TO_BIN(?),
    //       UUID_TO_BIN(?),
    //       DATE(?),
    //       ?,
    //       ?,
    //       ?,
    //       ?
    //     )
    //   `;

    //         console.log('📝 Creating time slot:', {
    //             ma_thoi_gian_chi_tiet,
    //             ma_lich_hen,
    //             ngay,
    //             start: thoi_gian_bat_dau,
    //             end: thoi_gian_ket_thuc
    //         });

    //         await db.execute(query, [
    //             ma_thoi_gian_chi_tiet,
    //             ma_lich_hen,
    //             ngay,
    //             thoi_gian_bat_dau,
    //             thoi_gian_ket_thuc,
    //             so_thu_tu,
    //             duoc_chap_nhan
    //         ]);

    //         return ma_thoi_gian_chi_tiet;
    //     }
    // Lấy available slots

    // Lấy available slots
    static async getAvailableSlots(doctorId, date, slotDuration = 30) {
        // 1. Lấy lịch làm việc
        const workScheduleQuery = `
        SELECT 
            BIN_TO_UUID(ma_lich_lam_viec) as ma_lich_lam_viec,
            thoi_gian_bat_dau_lich_lam_viec,
            thoi_gian_ket_thuc_lich_lam_viec,
            BIN_TO_UUID(ma_phong_kham_lich_lam_viec) as ma_phong_kham
        FROM bang_lich_lam_viec
        WHERE ma_bac_si_lich_lam_viec = UUID_TO_BIN(?)
            AND ngay_lich_lam_viec = DATE(?)
            AND trang_thai_lich_lam_viec = 1
    `;

        const [workSchedules] = await db.execute(workScheduleQuery, [doctorId, date]);

        if (workSchedules.length === 0) {
            return {
                workSchedules: [],
                availableSlots: [],
                bookedSlots: []
            };
        }

        // 2. Lấy các slot đã đặt - ✅ ĐỔI QUERY
        const bookedSlotsQuery = `
        SELECT 
            lh.gio_bat_dau,
            lh.gio_ket_thuc,
            BIN_TO_UUID(lh.ma_lich_hen) as ma_lich_hen
        FROM bang_lich_hen lh
        WHERE lh.ma_bac_si = UUID_TO_BIN(?)
            AND lh.ngay_hen = DATE(?)
            AND lh.trang_thai_lich_hen IN (0, 1, 2)
    `;

        const [bookedSlots] = await db.execute(bookedSlotsQuery, [doctorId, date]);

        console.log('📅 Work schedules:', workSchedules.length);
        console.log('❌ Booked slots:', bookedSlots);

        // 3. Tính toán available slots
        const availableSlots = [];

        for (const schedule of workSchedules) {
            const startTime = schedule.thoi_gian_bat_dau_lich_lam_viec;
            const endTime = schedule.thoi_gian_ket_thuc_lich_lam_viec;

            // Chuyển thời gian thành phút
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);

            let currentMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;

            // Tạo các slot
            while (currentMinutes + slotDuration <= endMinutes) {
                const slotStartHour = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
                const slotStartMinute = (currentMinutes % 60).toString().padStart(2, '0');
                const slotStart = `${slotStartHour}:${slotStartMinute}`;

                const slotEndMinutes = currentMinutes + slotDuration;
                const slotEndHour = Math.floor(slotEndMinutes / 60).toString().padStart(2, '0');
                const slotEndMinute = (slotEndMinutes % 60).toString().padStart(2, '0');
                const slotEnd = `${slotEndHour}:${slotEndMinute}`;

                // Check overlap
                const isBooked = bookedSlots.some(booked => {
                    // ✅ ĐỔI: Dùng gio_bat_dau/gio_ket_thuc
                    const bookedStart = booked.gio_bat_dau.substring(0, 5);
                    const bookedEnd = booked.gio_ket_thuc.substring(0, 5);

                    const overlap = (
                        (slotStart >= bookedStart && slotStart < bookedEnd) ||
                        (slotEnd > bookedStart && slotEnd <= bookedEnd) ||
                        (slotStart <= bookedStart && slotEnd >= bookedEnd)
                    );

                    if (overlap) {
                        console.log(`❌ Overlap detected: ${slotStart}-${slotEnd} vs ${bookedStart}-${bookedEnd}`);
                    }

                    return overlap;
                });

                availableSlots.push({
                    start: slotStart,
                    end: slotEnd,
                    status: isBooked ? 'booked' : 'available',
                    room: schedule.ma_phong_kham
                });

                currentMinutes += slotDuration;
            }
        }

        return {
            workSchedules: workSchedules.map(ws => ({
                start: ws.thoi_gian_bat_dau_lich_lam_viec,
                end: ws.thoi_gian_ket_thuc_lich_lam_viec,
                room: ws.ma_phong_kham
            })),
            availableSlots,
            bookedSlots: bookedSlots.map(bs => ({
                start: bs.gio_bat_dau.substring(0, 5),
                end: bs.gio_ket_thuc.substring(0, 5)
            }))
        };
    }

    // Check slot có available không
    static async isSlotAvailable(doctorId, date, startTime, endTime) {
        const query = `
        SELECT COUNT(*) as count
        FROM bang_lich_hen lh
        WHERE lh.ma_bac_si = ?
            AND lh.ngay_hen = ?
            AND lh.trang_thai_lich_hen IN (0, 1, 2)
            AND (
                (lh.gio_bat_dau < ? AND lh.gio_ket_thuc > ?)
                OR (lh.gio_bat_dau < ? AND lh.gio_ket_thuc > ?)
                OR (lh.gio_bat_dau >= ? AND lh.gio_ket_thuc <= ?)
            )
    `;

        const [rows] = await db.execute(query, [
            UUIDUtil.toBinary(doctorId),
            date,
            endTime, startTime,
            endTime, startTime,
            startTime, endTime
        ]);

        return rows[0].count === 0;
    }

    // Lấy danh sách lịch hẹn
    static async findAll(page = 1, limit = 10, filters = {}) {
        const pageInt = parseInt(page) || 1;
        const limitInt = parseInt(limit) || 10;
        const offset = (pageInt - 1) * limitInt;

        const {
            doctorId,
            patientId,
            specialtyId,
            status,
            fromDate,
            toDate,
            search
        } = filters;

        let query = `
        SELECT 
            BIN_TO_UUID(lh.ma_lich_hen) as ma_lich_hen,
            BIN_TO_UUID(lh.ma_bac_si) as ma_bac_si,
            BIN_TO_UUID(lh.ma_benh_nhan) as ma_benh_nhan,
            lh.ngay_hen,
            lh.gio_bat_dau,
            lh.gio_ket_thuc,
            lh.trang_thai_lich_hen,
            lh.ly_do_kham_lich_hen,
            lh.ghi_chu_lich_hen,
            lh.thoi_gian_check_in,
            lh.ngay_tao_lich_hen,
            bn.ho_benh_nhan,
            bn.ten_benh_nhan,
            bn.so_dien_thoai_benh_nhan,
            nd.ho_nguoi_dung as ho_bac_si,
            nd.ten_nguoi_dung as ten_bac_si,
            ck.ten_chuyen_khoa
        FROM bang_lich_hen lh
        INNER JOIN bang_benh_nhan bn ON lh.ma_benh_nhan = bn.ma_benh_nhan
        INNER JOIN bang_bac_si bs ON lh.ma_bac_si = bs.ma_bac_si
        INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
        LEFT JOIN bang_chuyen_khoa ck ON lh.ma_chuyen_khoa = ck.ma_chuyen_khoa
    `;

        const params = [];
        const conditions = [];

        if (doctorId) {
            conditions.push('lh.ma_bac_si = ?');
            params.push(UUIDUtil.toBinary(doctorId));
        }

        if (patientId) {
            conditions.push('lh.ma_benh_nhan = ?');
            params.push(UUIDUtil.toBinary(patientId));
        }

        if (specialtyId) {
            conditions.push('lh.ma_chuyen_khoa = ?');
            params.push(UUIDUtil.toBinary(specialtyId));
        }

        if (status !== null && status !== undefined) {
            conditions.push('lh.trang_thai_lich_hen = ?');
            params.push(parseInt(status));
        }

        if (fromDate) {
            conditions.push('lh.ngay_hen >= ?');  // ✅ ĐỔI
            params.push(fromDate);
        }

        if (toDate) {
            conditions.push('lh.ngay_hen <= ?');  // ✅ ĐỔI
            params.push(toDate);
        }

        if (search) {
            conditions.push('(bn.ten_benh_nhan LIKE ? OR bn.ho_benh_nhan LIKE ? OR bn.so_dien_thoai_benh_nhan LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` ORDER BY lh.ngay_hen DESC, lh.gio_bat_dau DESC LIMIT ${limitInt} OFFSET ${offset}`;  // ✅ ĐỔI

        const [rows] = await db.execute(query, params);

        // Đếm tổng số
        let countQuery = `
        SELECT COUNT(*) as total 
        FROM bang_lich_hen lh
        INNER JOIN bang_benh_nhan bn ON lh.ma_benh_nhan = bn.ma_benh_nhan
    `;

        if (conditions.length > 0) {
            countQuery += ' WHERE ' + conditions.join(' AND ');
        }

        const [countResult] = await db.execute(countQuery, params);

        return {
            data: rows,
            pagination: {
                total: countResult[0].total,
                page: pageInt,
                limit: limitInt,
                totalPages: Math.ceil(countResult[0].total / limitInt)
            }
        };
    }

    static async findByDate({ date, doctorId, patientId, status }) {
        let query = `
        SELECT 
            BIN_TO_UUID(lh.ma_lich_hen) AS ma_lich_hen,
            lh.ngay_hen,
            lh.gio_bat_dau,
            lh.gio_ket_thuc,
            lh.trang_thai_lich_hen,

            -- ===== LÝ DO & GHI CHÚ =====
            lh.ly_do_kham_lich_hen AS ly_do_kham,
            lh.ghi_chu_lich_hen,

            -- ===== THỜI GIAN =====
            lh.thoi_gian_check_in,
            lh.thoi_gian_vao_kham,
            lh.thoi_gian_hoan_thanh,

            -- ===== BÁC SĨ =====
            BIN_TO_UUID(lh.ma_bac_si) AS ma_bac_si,
            nd.ho_nguoi_dung AS ho_bac_si,
            nd.ten_nguoi_dung AS ten_bac_si,

            -- ===== BỆNH NHÂN =====
            BIN_TO_UUID(lh.ma_benh_nhan) AS ma_benh_nhan,
            bn.ho_benh_nhan,
            bn.ten_benh_nhan,
            bn.so_dien_thoai_benh_nhan,

            -- ===== CHUYÊN KHOA =====
            ck.ten_chuyen_khoa,

            -- ===== PHÒNG KHÁM =====
            pk.ten_phong_kham,
            pk.so_phong_kham,

            -- ===== DỊCH VỤ =====
            BIN_TO_UUID(lh.ma_dich_vu_lich_hen) AS ma_dich_vu,
            dv.ten_dich_vu,
            lh.gia_dich_vu_lich_hen AS gia_dich_vu,
            lh.tong_gia_lich_hen

        FROM bang_lich_hen lh

        INNER JOIN bang_bac_si bs 
            ON lh.ma_bac_si = bs.ma_bac_si

        INNER JOIN bang_nguoi_dung nd 
            ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung

        INNER JOIN bang_benh_nhan bn 
            ON lh.ma_benh_nhan = bn.ma_benh_nhan

        LEFT JOIN bang_chuyen_khoa ck 
            ON lh.ma_chuyen_khoa = ck.ma_chuyen_khoa

        LEFT JOIN bang_phong_kham pk 
            ON lh.ma_phong_kham = pk.ma_phong_kham

        -- ✅ JOIN ĐÚNG DỊCH VỤ
        LEFT JOIN bang_dich_vu dv
            ON lh.ma_dich_vu_lich_hen = dv.ma_dich_vu

        WHERE lh.ngay_hen = ?
    `;

        const params = [date];
        const conditions = [];

        if (doctorId) {
            conditions.push('lh.ma_bac_si = ?');
            params.push(UUIDUtil.toBinary(doctorId));
        }

        if (patientId) {
            conditions.push('lh.ma_benh_nhan = ?');
            params.push(UUIDUtil.toBinary(patientId));
        }

        if (status !== null && status !== undefined && status !== '') {
            conditions.push('lh.trang_thai_lich_hen = ?');
            params.push(status);
        }

        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }

        query += ' ORDER BY lh.gio_bat_dau ASC';

        const [rows] = await db.execute(query, params);
        return rows;
    }



    // Tìm lịch hẹn theo ID
    static async findById(ma_lich_hen) {
        const query = `
        SELECT 
            BIN_TO_UUID(lh.ma_lich_hen) as ma_lich_hen,
            BIN_TO_UUID(lh.ma_nguoi_tao_lich_hen) as ma_nguoi_tao_lich_hen,
            BIN_TO_UUID(lh.ma_bac_si) as ma_bac_si,
            BIN_TO_UUID(lh.ma_benh_nhan) as ma_benh_nhan,
            BIN_TO_UUID(lh.ma_chuyen_khoa) as ma_chuyen_khoa,
            BIN_TO_UUID(lh.ma_phong_kham) as ma_phong_kham,
            BIN_TO_UUID(lh.ma_dich_vu_lich_hen) as ma_dich_vu_lich_hen,
            BIN_TO_UUID(lh.ma_lich_lam_viec) as ma_lich_lam_viec,  -- ✅ THÊM
            lh.trang_thai_lich_hen,
            lh.ly_do_kham_lich_hen,
            lh.ly_do_huy_lich_hen,
            lh.ghi_chu_lich_hen,  -- ✅ THÊM
            lh.ngay_hen,  -- ✅ THÊM (thay cho tg.ngay)
            lh.gio_bat_dau,  -- ✅ THÊM (thay cho tg.thoi_gian_bat_dau)
            lh.gio_ket_thuc,  -- ✅ THÊM (thay cho tg.thoi_gian_ket_thuc)
            lh.thoi_gian_check_in,  -- ✅ THÊM
            lh.ngay_tao_lich_hen,
            lh.ngay_cap_nhat_lich_hen,  -- ✅ THÊM
            lh.thoi_gian_xac_nhan,
            lh.thoi_gian_vao_kham,
            lh.thoi_gian_hoan_thanh,
            lh.gia_dich_vu_lich_hen,
            lh.tong_gia_lich_hen,
            -- Patient info
            bn.ten_benh_nhan,
            bn.ho_benh_nhan,  -- ✅ THÊM
            bn.so_dien_thoai_benh_nhan,
            bn.gioi_tinh_benh_nhan,
            bn.ngay_sinh_benh_nhan,  -- ✅ THÊM
            bn.dia_chi_benh_nhan,  -- ✅ THÊM (nếu có)
            -- Doctor info
            nd.ten_nguoi_dung as ten_bac_si,
            nd.ho_nguoi_dung as ho_bac_si,
            -- Specialty
            ck.ten_chuyen_khoa,
            -- Room
            pk.ten_phong_kham,
            pk.so_phong_kham,  -- ✅ THÊM
            -- Service
            dv.ten_dich_vu,
            dv.don_gia_dich_vu  -- ✅ THÊM
        FROM bang_lich_hen lh
        INNER JOIN bang_benh_nhan bn ON lh.ma_benh_nhan = bn.ma_benh_nhan
        INNER JOIN bang_bac_si bs ON lh.ma_bac_si = bs.ma_bac_si
        INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
        LEFT JOIN bang_chuyen_khoa ck ON lh.ma_chuyen_khoa = ck.ma_chuyen_khoa
        LEFT JOIN bang_phong_kham pk ON lh.ma_phong_kham = pk.ma_phong_kham
        LEFT JOIN bang_dich_vu dv ON lh.ma_dich_vu_lich_hen = dv.ma_dich_vu
        -- ❌ XÓA: LEFT JOIN bang_thoi_gian_chi_tiet tg ON lh.ma_lich_hen = tg.ma_lich_hen
        WHERE lh.ma_lich_hen = ?
    `;


        const [rows] = await db.execute(query, [UUIDUtil.toBinary(ma_lich_hen)]);

        return rows[0] || null;
    }

    // Cập nhật lịch hẹn
    static async update(appointmentId, updateData) {
        const fields = [];
        const values = [];

        const allowedFields = [
            'ma_phong_kham',
            'ma_nguoi_xac_nhan',  // ✅ THÊM
            'trang_thai_lich_hen',
            'ly_do_huy_lich_hen',
            'ghi_chu_lich_hen',  // ✅ THÊM
            'thoi_gian_xac_nhan',
            'thoi_gian_check_in',  // ✅ THÊM
            'thoi_gian_vao_kham',
            'thoi_gian_hoan_thanh'
        ];

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                if (field === 'ma_phong_kham' || field === 'ma_nguoi_xac_nhan') {
                    fields.push(`${field} = ?`);
                    values.push(updateData[field] ? UUIDUtil.toBinary(updateData[field]) : null);
                } else {
                    fields.push(`${field} = ?`);
                    values.push(updateData[field]);
                }
            }
        }

        if (fields.length === 0) {
            throw new Error('Không có dữ liệu để cập nhật');
        }

        values.push(UUIDUtil.toBinary(appointmentId));

        const query = `
        UPDATE bang_lich_hen 
        SET ${fields.join(', ')}
        WHERE ma_lich_hen = ?
    `;

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    // Xóa lịch hẹn
    static async delete(appointmentId) {
        // Xóa time slots trước (CASCADE sẽ tự động xóa)
        const query = 'DELETE FROM bang_lich_hen WHERE ma_lich_hen = ?';
        const [result] = await db.execute(query, [UUIDUtil.toBinary(appointmentId)]);
        return result.affectedRows > 0;
    }

    // Lấy lịch hẹn của bệnh nhân
    static async findByPatient(patientId, page = 1, limit = 10, status = null) {
        return this.findAll(page, limit, { patientId, status });
    }

    // Lấy lịch hẹn của bác sĩ
    static async findByDoctor(doctorId, page = 1, limit = 10, filters = {}) {
        return this.findAll(page, limit, { ...filters, doctorId });
    }
    // Lấy lịch hẹn hôm nay (cho dashboard)
    static async getTodayAppointments(userId = null, role = null) {
        const today = new Date().toISOString().split('T')[0];
        console.log(userId, role);
        let query = `
        SELECT 
            BIN_TO_UUID(lh.ma_lich_hen) as ma_lich_hen,
            BIN_TO_UUID(lh.ma_bac_si) as ma_bac_si,
            BIN_TO_UUID(lh.ma_benh_nhan) as ma_benh_nhan,
            BIN_TO_UUID(lh.ma_chuyen_khoa) as ma_chuyen_khoa,
            BIN_TO_UUID(lh.ma_phong_kham) as ma_phong_kham,
            BIN_TO_UUID(lh.ma_dich_vu_lich_hen) as ma_dich_vu,
            lh.ngay_hen,
            lh.gio_bat_dau,
            lh.gio_ket_thuc,
            lh.trang_thai_lich_hen,
            lh.ly_do_kham_lich_hen,
            lh.ghi_chu_lich_hen,
            lh.gia_dich_vu_lich_hen,
            lh.tong_gia_lich_hen,
            lh.thoi_gian_check_in,
            lh.thoi_gian_xac_nhan,
            lh.thoi_gian_hoan_thanh,
            lh.ngay_tao_lich_hen,
            -- Patient info
            bn.ten_benh_nhan,
            bn.ho_benh_nhan,
            bn.so_dien_thoai_benh_nhan,
            bn.gioi_tinh_benh_nhan,
            bn.ngay_sinh_benh_nhan,
            -- Doctor info
            nd.ten_nguoi_dung as ten_bac_si,
            nd.ho_nguoi_dung as ho_bac_si,
            -- Specialty
            ck.ten_chuyen_khoa,
            -- Room
            pk.ten_phong_kham,
            pk.so_phong_kham,
            -- Service
            dv.ten_dich_vu,
            dv.don_gia_dich_vu,
            -- Status text
            CASE 
                WHEN lh.trang_thai_lich_hen = 0 THEN 'Chờ xác nhận'
                WHEN lh.trang_thai_lich_hen = 1 THEN 'Đã xác nhận'
                WHEN lh.trang_thai_lich_hen = 2 THEN 'Đã check-in'
                WHEN lh.trang_thai_lich_hen = 4 THEN 'Hoàn thành'
                WHEN lh.trang_thai_lich_hen = 5 THEN 'Đã hủy'
                WHEN lh.trang_thai_lich_hen = 6 THEN 'Không đến'
                ELSE 'Không xác định'
            END as trang_thai_text
        FROM bang_lich_hen lh
        INNER JOIN bang_benh_nhan bn ON lh.ma_benh_nhan = bn.ma_benh_nhan
        INNER JOIN bang_bac_si bs ON lh.ma_bac_si = bs.ma_bac_si
        INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
        LEFT JOIN bang_chuyen_khoa ck ON lh.ma_chuyen_khoa = ck.ma_chuyen_khoa
        LEFT JOIN bang_phong_kham pk ON lh.ma_phong_kham = pk.ma_phong_kham
        LEFT JOIN bang_dich_vu dv ON lh.ma_dich_vu_lich_hen = dv.ma_dich_vu
        WHERE lh.ngay_hen = ?
    `;

        const params = [today];

        // Nếu là Bác sĩ → chỉ lấy lịch của mình + đã xác nhận / đã check-in
        if (role === 'Bác sĩ' && userId) {
            query += `
        AND bs.ma_nguoi_dung_bac_si = UUID_TO_BIN(?)
        AND lh.trang_thai_lich_hen IN (1, 2)
    `;
            params.push(userId);
        }


        query += ' ORDER BY lh.gio_bat_dau ASC, lh.trang_thai_lich_hen ASC';

        const [rows] = await db.execute(query, params);
        return rows;
    }

    // Thống kê lịch hẹn theo trạng thái
    static async getStatsByStatus(fromDate = null, toDate = null, doctorId = null) {
        let query = `
      SELECT 
        lh.trang_thai_lich_hen,
        COUNT(*) as so_luong,
        CASE 
          WHEN lh.trang_thai_lich_hen = 0 THEN 'Chờ xác nhận'
          WHEN lh.trang_thai_lich_hen = 1 THEN 'Đã xác nhận'
          WHEN lh.trang_thai_lich_hen = 2 THEN 'Đã check-in'
          WHEN lh.trang_thai_lich_hen = 3 THEN 'Hoàn thành'
          WHEN lh.trang_thai_lich_hen = 4 THEN 'Đã hủy'
        END as trang_thai_text
      FROM bang_lich_hen lh
    `;

        const params = [];
        const conditions = [];

        if (fromDate) {
            conditions.push('tg.ngay >= ?');
            params.push(fromDate);
        }

        if (toDate) {
            conditions.push('tg.ngay <= ?');
            params.push(toDate);
        }

        if (doctorId) {
            conditions.push('lh.ma_bac_si = ?');
            params.push(UUIDUtil.toBinary(doctorId));
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' GROUP BY lh.trang_thai_lich_hen ORDER BY lh.trang_thai_lich_hen';

        const [rows] = await db.execute(query, params);

        // Tính tổng
        const total = rows.reduce((sum, row) => sum + row.so_luong, 0);

        return {
            data: rows,
            total
        };
    }

    // Lấy lịch hẹn đang chờ xác nhận (cho Lễ tân)
    static async getPendingAppointments(page = 1, limit = 10) {
        return this.findAll(page, limit, { status: 0 });
    }

    // Lấy lịch hẹn đã check-in (sẵn sàng khám - cho Bác sĩ)
    static async getCheckedInAppointments(doctorId, page = 1, limit = 10) {
        return this.findAll(page, limit, { doctorId, status: 2 });
    }

    // Dashboard stats cho Lễ tân
    static async getReceptionistDashboard() {
        const today = new Date().toISOString().split('T')[0];

        // Lịch hẹn hôm nay
        const todayAppointments = await this.getTodayAppointments();

        // Thống kê theo trạng thái hôm nay
        const statsToday = await this.getStatsByStatus(today, today);

        // Lịch hẹn chờ xác nhận
        const pending = await this.getPendingAppointments(1, 5);

        return {
            today: {
                total: todayAppointments.length,
                appointments: todayAppointments,
                stats: statsToday
            },
            pending: pending.data
        };
    }

    // Dashboard stats cho Bác sĩ
    static async getDoctorDashboard(userId) {
        const today = new Date().toISOString().split('T')[0];

        // Tìm bác sĩ từ userId
        const doctorQuery = `
      SELECT BIN_TO_UUID(ma_bac_si) as ma_bac_si
      FROM bang_bac_si
      WHERE ma_nguoi_dung_bac_si = ?
    `;
        const [doctors] = await db.execute(doctorQuery, [UUIDUtil.toBinary(userId)]);

        if (doctors.length === 0) {
            throw new Error('Không tìm thấy thông tin bác sĩ');
        }

        const doctorId = doctors[0].ma_bac_si;

        // Lịch hẹn hôm nay của bác sĩ
        const todayAppointments = await this.getTodayAppointments(userId, 'Bác sĩ');

        // Lịch hẹn đã check-in (sẵn sàng khám)
        const checkedIn = await this.getCheckedInAppointments(doctorId, 1, 10);

        // Thống kê tuần này
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const statsWeek = await this.getStatsByStatus(
            weekStart.toISOString().split('T')[0],
            weekEnd.toISOString().split('T')[0],
            doctorId
        );

        return {
            today: {
                total: todayAppointments.length,
                appointments: todayAppointments
            },
            checkedIn: checkedIn.data,
            weekStats: statsWeek
        };
    }

    // Cập nhật trạng thái hoàn thành
    static async complete(appointmentId) {
        const updated = await this.update(appointmentId, {
            trang_thai_lich_hen: 3,
            thoi_gian_hoan_thanh: new Date()
        });
        return updated;
    }

    // // Lấy lịch hẹn hôm nay (tất cả)
    static async getTodayAppointmentsWithFilter(filters = {}) {
        const {
            doctorId,
            status,
            search
        } = filters;

        let query = `
        SELECT 
            BIN_TO_UUID(lh.ma_lich_hen) as ma_lich_hen,
            BIN_TO_UUID(lh.ma_benh_nhan) as ma_benh_nhan,
            BIN_TO_UUID(lh.ma_bac_si) as ma_bac_si,
            lh.ngay_hen,
            lh.gio_bat_dau,
            lh.gio_ket_thuc,
            lh.trang_thai_lich_hen,
            lh.ly_do_kham_lich_hen,
            lh.ghi_chu_lich_hen,
            lh.thoi_gian_check_in,  -- ✅ ĐỔI
            lh.ngay_tao_lich_hen,
            -- Patient info
            bn.ho_benh_nhan,
            bn.ten_benh_nhan,
            bn.so_dien_thoai_benh_nhan,
            bn.ngay_sinh_benh_nhan,
            bn.gioi_tinh_benh_nhan,
            -- Doctor info
            nd.ho_nguoi_dung as ho_bac_si,
            nd.ten_nguoi_dung as ten_bac_si,
            -- Specialty
            GROUP_CONCAT(DISTINCT ck.ten_chuyen_khoa SEPARATOR ', ') as ten_chuyen_khoa,
            -- Room
            pk.ten_phong_kham,
            pk.so_phong_kham,
            -- Work schedule info
            llv.thoi_gian_bat_dau_lich_lam_viec,
            llv.thoi_gian_ket_thuc_lich_lam_viec
        FROM bang_lich_hen lh
        INNER JOIN bang_benh_nhan bn ON lh.ma_benh_nhan = bn.ma_benh_nhan
        INNER JOIN bang_bac_si bs ON lh.ma_bac_si = bs.ma_bac_si
        INNER JOIN bang_nguoi_dung nd ON bs.ma_nguoi_dung_bac_si = nd.ma_nguoi_dung
        LEFT JOIN bang_bac_si_chuyen_khoa bsck ON bs.ma_bac_si = bsck.ma_bac_si
        LEFT JOIN bang_chuyen_khoa ck ON bsck.ma_chuyen_khoa = ck.ma_chuyen_khoa
        LEFT JOIN bang_lich_lam_viec llv ON lh.ma_lich_lam_viec = llv.ma_lich_lam_viec
        LEFT JOIN bang_phong_kham pk ON llv.ma_phong_kham_lich_lam_viec = pk.ma_phong_kham
        WHERE DATE(lh.ngay_hen) = CURDATE()
    `;

        const params = [];

        if (doctorId) {
            query += ' AND lh.ma_bac_si = ?';
            params.push(UUIDUtil.toBinary(doctorId));
        }

        if (status !== null && status !== undefined) {
            query += ' AND lh.trang_thai_lich_hen = ?';
            params.push(parseInt(status));
        }

        if (search) {
            query += ` AND (
            bn.ten_benh_nhan LIKE ? OR 
            bn.ho_benh_nhan LIKE ? OR 
            bn.so_dien_thoai_benh_nhan LIKE ?
        )`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ' GROUP BY lh.ma_lich_hen';
        query += ' ORDER BY lh.gio_bat_dau ASC, lh.ngay_tao_lich_hen ASC';

        const [rows] = await db.execute(query, params);
        return rows;
    }

    // Xác nhận lịch hẹn
    static async confirm(appointmentId, receptionistNote = null) {
        const query = `
        UPDATE bang_lich_hen 
        SET 
            trang_thai_lich_hen = 1,
            ghi_chu_lich_hen = COALESCE(?, ghi_chu_lich_hen),
            ngay_cap_nhat_lich_hen = CURRENT_TIMESTAMP  -- ✅ ĐỔI
        WHERE ma_lich_hen = ?
    `;

        const [result] = await db.execute(query, [
            receptionistNote,
            UUIDUtil.toBinary(appointmentId)
        ]);

        return result.affectedRows > 0;
    }

    // Check-in bệnh nhân
    static async checkIn(appointmentId) {
        const query = `
        UPDATE bang_lich_hen 
        SET 
            trang_thai_lich_hen = 2,
            thoi_gian_check_in = CURRENT_TIMESTAMP,  -- ✅ ĐỔI
            ngay_cap_nhat_lich_hen = CURRENT_TIMESTAMP
        WHERE ma_lich_hen = ?
    `;

        const [result] = await db.execute(query, [
            UUIDUtil.toBinary(appointmentId)
        ]);

        return result.affectedRows > 0;
    }

    // Đánh dấu không đến
    static async markNoShow(appointmentId) {
        const query = `
        UPDATE bang_lich_hen 
        SET 
            trang_thai_lich_hen = 6,
            ngay_cap_nhat_lich_hen = CURRENT_TIMESTAMP  -- ✅ ĐỔI
        WHERE ma_lich_hen = ?
    `;

        const [result] = await db.execute(query, [
            UUIDUtil.toBinary(appointmentId)
        ]);

        return result.affectedRows > 0;
    }

    static async updateNote(appointmentId, note) {
        const query = `
        UPDATE bang_lich_hen 
        SET 
            ghi_chu_lich_hen = ?,
            ngay_cap_nhat_lich_hen = CURRENT_TIMESTAMP
        WHERE ma_lich_hen = ?
    `;

        const safeNote = note ?? null; // ✅ QUAN TRỌNG

        const [result] = await db.execute(query, [
            safeNote,
            UUIDUtil.toBinary(appointmentId)
        ]);

        return result.affectedRows > 0;
    }

    // Thống kê dashboard
    static async getDashboardStats(date = null) {
        const queryDate = date || new Date().toISOString().split('T')[0];

        const query = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN trang_thai_lich_hen = 0 THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN trang_thai_lich_hen = 1 THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN trang_thai_lich_hen = 2 THEN 1 ELSE 0 END) as checked_in,
                SUM(CASE WHEN trang_thai_lich_hen = 3 THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN trang_thai_lich_hen = 4 THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN trang_thai_lich_hen = 5 THEN 1 ELSE 0 END) as cancelled,
                SUM(CASE WHEN trang_thai_lich_hen = 6 THEN 1 ELSE 0 END) as no_show
            FROM bang_lich_hen
            WHERE DATE(ngay_hen) = ?
        `;

        const [rows] = await db.execute(query, [queryDate]);
        return rows[0];
    }

    // Lấy lịch hẹn tiếp theo của bác sĩ
    static async getNextAppointment(doctorId) {
        const query = `
        SELECT 
            BIN_TO_UUID(lh.ma_lich_hen) as ma_lich_hen,
            BIN_TO_UUID(lh.ma_benh_nhan) as ma_benh_nhan,
            lh.gio_bat_dau,
            bn.ho_benh_nhan,
            bn.ten_benh_nhan
        FROM bang_lich_hen lh
        INNER JOIN bang_benh_nhan bn ON lh.ma_benh_nhan = bn.ma_benh_nhan
        WHERE lh.ma_bac_si = ?
            AND DATE(lh.ngay_hen) = CURDATE()
            AND lh.trang_thai_lich_hen = 2
        ORDER BY lh.thoi_gian_check_in ASC  -- ✅ ĐỔI
        LIMIT 1
    `;

        const [rows] = await db.execute(query, [
            UUIDUtil.toBinary(doctorId)
        ]);

        return rows[0] || null;
    }

    // Lấy hàng đợi theo bác sĩ
    static async getQueueByDoctor(doctorId, date = null) {
        // Nếu không truyền ngày → lấy ngày hiện tại
        const queryDate = date
            ? date
            : new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        const query = `
        SELECT 
            BIN_TO_UUID(lh.ma_lich_hen)          AS ma_lich_hen,
            BIN_TO_UUID(lh.ma_benh_nhan)         AS ma_benh_nhan,
            BIN_TO_UUID(lh.ma_bac_si)            AS ma_bac_si,

            lh.gio_bat_dau,
            lh.gio_ket_thuc,
            lh.trang_thai_lich_hen,
            lh.thoi_gian_check_in,
            lh.ghi_chu_lich_hen,

            bn.ho_benh_nhan,
            bn.ten_benh_nhan,
            bn.so_dien_thoai_benh_nhan,

            -- Ưu tiên trong hàng đợi
            CASE 
                WHEN lh.trang_thai_lich_hen = 2 THEN 1  -- Checked-in
                WHEN lh.trang_thai_lich_hen = 1 THEN 2  -- Confirmed
                WHEN lh.trang_thai_lich_hen = 0 THEN 3  -- Pending
                ELSE 4
            END AS priority_order

        FROM bang_lich_hen lh
        INNER JOIN bang_benh_nhan bn 
            ON lh.ma_benh_nhan = bn.ma_benh_nhan

        WHERE lh.ma_bac_si = ?
          AND DATE(lh.ngay_hen) = ?
          AND lh.trang_thai_lich_hen IN (0, 1, 2)

        ORDER BY 
            priority_order ASC,
            lh.thoi_gian_check_in ASC,
            lh.gio_bat_dau ASC
    `;

        const [rows] = await db.execute(query, [
            UUIDUtil.toBinary(doctorId),
            queryDate
        ]);

        return rows;
    }

    // Lấy lịch hẹn của bác sĩ theo ngày
    static async findByDoctorAndDate(doctorId, date) {
        const query = `
        SELECT 
            BIN_TO_UUID(lh.ma_lich_hen) as ma_lich_hen,
            BIN_TO_UUID(lh.ma_nguoi_tao_lich_hen) as ma_nguoi_tao_lich_hen,
            BIN_TO_UUID(lh.ma_bac_si) as ma_bac_si,
            BIN_TO_UUID(lh.ma_benh_nhan) as ma_benh_nhan,
            BIN_TO_UUID(lh.ma_chuyen_khoa) as ma_chuyen_khoa,
            BIN_TO_UUID(lh.ma_phong_kham) as ma_phong_kham,
            BIN_TO_UUID(lh.ma_dich_vu_lich_hen) as ma_dich_vu_lich_hen,
            BIN_TO_UUID(lh.ma_lich_lam_viec) as ma_lich_lam_viec,
            lh.ngay_hen,
            lh.gio_bat_dau,
            lh.gio_ket_thuc,
            lh.trang_thai_lich_hen,
            lh.ly_do_kham_lich_hen,
            lh.ly_do_huy_lich_hen,
            lh.ghi_chu_lich_hen,
            lh.thoi_gian_xac_nhan,
            lh.thoi_gian_check_in,
            lh.thoi_gian_vao_kham,
            lh.thoi_gian_hoan_thanh,
            lh.gia_dich_vu_lich_hen,
            lh.tong_gia_lich_hen,
            lh.ngay_tao_lich_hen,
            lh.ngay_cap_nhat_lich_hen,
            
            -- Patient info
            bn.ten_benh_nhan,
            bn.ho_benh_nhan,
            bn.so_dien_thoai_benh_nhan,
            bn.gioi_tinh_benh_nhan,
            bn.ngay_sinh_benh_nhan,
            
            -- Specialty
            ck.ten_chuyen_khoa,
            
            -- Room
            pk.ten_phong_kham,
            pk.so_phong_kham,
            
            -- Service
            dv.ten_dich_vu,
            dv.don_gia_dich_vu
            
        FROM bang_lich_hen lh
        INNER JOIN bang_benh_nhan bn ON lh.ma_benh_nhan = bn.ma_benh_nhan
        LEFT JOIN bang_chuyen_khoa ck ON lh.ma_chuyen_khoa = ck.ma_chuyen_khoa
        LEFT JOIN bang_phong_kham pk ON lh.ma_phong_kham = pk.ma_phong_kham
        LEFT JOIN bang_dich_vu dv ON lh.ma_dich_vu_lich_hen = dv.ma_dich_vu
        WHERE lh.ma_bac_si = UUID_TO_BIN(?)
            AND lh.ngay_hen = ?
        ORDER BY lh.gio_bat_dau ASC, lh.ngay_tao_lich_hen ASC
    `;

        const [rows] = await db.execute(query, [doctorId, date]);
        return rows;
    }

    static async getTodayQueue(doctorId) {
        const query = `
      SELECT
        BIN_TO_UUID(lh.ma_lich_hen) as ma_lich_hen,
        lh.ngay_hen,
        lh.gio_bat_dau,
        lh.gio_ket_thuc,
        lh.trang_thai_lich_hen,
        lh.ly_do_kham_lich_hen,
        lh.thoi_gian_check_in,
        lh.thoi_gian_vao_kham,
        BIN_TO_UUID(bn.ma_benh_nhan) as ma_benh_nhan,
        CONCAT(bn.ho_benh_nhan, ' ', bn.ten_benh_nhan) as ten_benh_nhan,
        bn.gioi_tinh_benh_nhan,
        bn.ngay_sinh_benh_nhan,
        bn.so_dien_thoai_benh_nhan,
        dv.ten_dich_vu,
        lh.gia_dich_vu_lich_hen,
        pk.ten_phong_kham,
        pk.so_phong_kham,
        ROW_NUMBER() OVER (ORDER BY lh.thoi_gian_check_in) as stt
      FROM bang_lich_hen lh
      INNER JOIN bang_benh_nhan bn ON lh.ma_benh_nhan = bn.ma_benh_nhan
      LEFT JOIN bang_dich_vu dv ON lh.ma_dich_vu_lich_hen = dv.ma_dich_vu
      LEFT JOIN bang_phong_kham pk ON lh.ma_phong_kham = pk.ma_phong_kham
      WHERE lh.ma_bac_si = UUID_TO_BIN(?)
        AND lh.ngay_hen = CURDATE()
        AND lh.trang_thai_lich_hen IN (2, 3)
      ORDER BY lh.thoi_gian_check_in ASC
    `;
        const [rows] = await db.execute(query, [doctorId]);
        return rows;
    }

}

module.exports = AppointmentModel;