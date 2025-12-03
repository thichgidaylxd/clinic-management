const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class RoomModel {
    // Tạo phòng khám mới
    static async create(roomData) {
        const {
            ma_chuyen_khoa_phong_kham,
            ma_loai_phong_kham,
            so_phong_kham,
            ten_phong_kham,
            trang_thai_phong_kham
        } = roomData;

        const ma_phong_kham = UUIDUtil.generate();

        const query = `
      INSERT INTO bang_phong_kham (
        ma_phong_kham,
        ma_chuyen_khoa_phong_kham,
        ma_loai_phong_kham,
        so_phong_kham,
        ten_phong_kham,
        trang_thai_phong_kham
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

        await db.execute(query, [
            UUIDUtil.toBinary(ma_phong_kham),
            ma_chuyen_khoa_phong_kham ? UUIDUtil.toBinary(ma_chuyen_khoa_phong_kham) : null,
            ma_loai_phong_kham ? UUIDUtil.toBinary(ma_loai_phong_kham) : null,
            so_phong_kham || null,
            ten_phong_kham,
            trang_thai_phong_kham !== undefined ? trang_thai_phong_kham : 1
        ]);

        return ma_phong_kham;
    }

    // Lấy danh sách phòng khám
    static async findAll(page = 1, limit = 10, search = '', specialtyId = null, roomTypeId = null, status = null) {
        const pageInt = parseInt(page) || 1;
        const limitInt = parseInt(limit) || 10;
        const offset = (pageInt - 1) * limitInt;

        let query = `
      SELECT 
        BIN_TO_UUID(pk.ma_phong_kham) as ma_phong_kham,
        BIN_TO_UUID(pk.ma_chuyen_khoa_phong_kham) as ma_chuyen_khoa_phong_kham,
        BIN_TO_UUID(pk.ma_loai_phong_kham) as ma_loai_phong_kham,
        pk.so_phong_kham,
        pk.ten_phong_kham,
        pk.trang_thai_phong_kham,
        pk.ngay_tao_phong_kham,
        pk.ngay_cap_nhat_phong_kham,
        ck.ten_chuyen_khoa,
        lpk.ten_loai_phong_kham
      FROM bang_phong_kham pk
      LEFT JOIN bang_chuyen_khoa ck ON pk.ma_chuyen_khoa_phong_kham = ck.ma_chuyen_khoa
      LEFT JOIN bang_loai_phong_kham lpk ON pk.ma_loai_phong_kham = lpk.ma_loai_phong_kham
    `;

        const params = [];
        const conditions = [];

        if (search) {
            conditions.push('(pk.ten_phong_kham LIKE ? OR pk.so_phong_kham LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }

        if (specialtyId) {
            conditions.push('pk.ma_chuyen_khoa_phong_kham = ?');
            params.push(UUIDUtil.toBinary(specialtyId));
        }

        if (roomTypeId) {
            conditions.push('pk.ma_loai_phong_kham = ?');
            params.push(UUIDUtil.toBinary(roomTypeId));
        }

        if (status !== null && status !== undefined) {
            conditions.push('pk.trang_thai_phong_kham = ?');
            params.push(parseInt(status));
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` ORDER BY pk.so_phong_kham ASC, pk.ten_phong_kham ASC LIMIT ${offset}, ${limitInt}`;

        const [rows] = await db.execute(query, params);

        // Đếm tổng số
        let countQuery = 'SELECT COUNT(*) as total FROM bang_phong_kham pk';
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

    // Tìm phòng khám theo ID
    static async findById(roomId) {
        const query = `
      SELECT 
        BIN_TO_UUID(pk.ma_phong_kham) as ma_phong_kham,
        BIN_TO_UUID(pk.ma_chuyen_khoa_phong_kham) as ma_chuyen_khoa_phong_kham,
        BIN_TO_UUID(pk.ma_loai_phong_kham) as ma_loai_phong_kham,
        pk.so_phong_kham,
        pk.ten_phong_kham,
        pk.trang_thai_phong_kham,
        pk.ngay_tao_phong_kham,
        pk.ngay_cap_nhat_phong_kham,
        ck.ten_chuyen_khoa,
        lpk.ten_loai_phong_kham
      FROM bang_phong_kham pk
      LEFT JOIN bang_chuyen_khoa ck ON pk.ma_chuyen_khoa_phong_kham = ck.ma_chuyen_khoa
      LEFT JOIN bang_loai_phong_kham lpk ON pk.ma_loai_phong_kham = lpk.ma_loai_phong_kham
      WHERE pk.ma_phong_kham = ?
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(roomId)]);
        return rows[0] || null;
    }

    // Tìm theo tên
    static async findByName(name) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_phong_kham) as ma_phong_kham,
        ten_phong_kham
      FROM bang_phong_kham
      WHERE ten_phong_kham = ?
    `;

        const [rows] = await db.execute(query, [name]);
        return rows[0] || null;
    }

    // Tìm theo số phòng
    static async findByRoomNumber(roomNumber) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_phong_kham) as ma_phong_kham,
        so_phong_kham,
        ten_phong_kham
      FROM bang_phong_kham
      WHERE so_phong_kham = ?
    `;

        const [rows] = await db.execute(query, [roomNumber]);
        return rows[0] || null;
    }

    // Cập nhật phòng khám
    static async update(roomId, updateData) {
        const {
            ma_chuyen_khoa_phong_kham,
            ma_loai_phong_kham,
            so_phong_kham,
            ten_phong_kham,
            trang_thai_phong_kham
        } = updateData;

        const fields = [];
        const values = [];

        if (ma_chuyen_khoa_phong_kham !== undefined) {
            fields.push('ma_chuyen_khoa_phong_kham = ?');
            values.push(ma_chuyen_khoa_phong_kham ? UUIDUtil.toBinary(ma_chuyen_khoa_phong_kham) : null);
        }

        if (ma_loai_phong_kham !== undefined) {
            fields.push('ma_loai_phong_kham = ?');
            values.push(ma_loai_phong_kham ? UUIDUtil.toBinary(ma_loai_phong_kham) : null);
        }

        if (so_phong_kham !== undefined) {
            fields.push('so_phong_kham = ?');
            values.push(so_phong_kham);
        }

        if (ten_phong_kham !== undefined) {
            fields.push('ten_phong_kham = ?');
            values.push(ten_phong_kham);
        }

        if (trang_thai_phong_kham !== undefined) {
            fields.push('trang_thai_phong_kham = ?');
            values.push(trang_thai_phong_kham);
        }

        if (fields.length === 0) {
            throw new Error('Không có dữ liệu để cập nhật');
        }

        values.push(UUIDUtil.toBinary(roomId));

        const query = `
      UPDATE bang_phong_kham 
      SET ${fields.join(', ')}
      WHERE ma_phong_kham = ?
    `;

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    // Xóa phòng khám
    static async delete(roomId) {
        const query = 'DELETE FROM bang_phong_kham WHERE ma_phong_kham = ?';
        const [result] = await db.execute(query, [UUIDUtil.toBinary(roomId)]);
        return result.affectedRows > 0;
    }

    // Kiểm tra tên đã tồn tại
    static async existsByName(name, excludeId = null) {
        let query = 'SELECT COUNT(*) as count FROM bang_phong_kham WHERE ten_phong_kham = ?';
        const params = [name];

        if (excludeId) {
            query += ' AND ma_phong_kham != ?';
            params.push(UUIDUtil.toBinary(excludeId));
        }

        const [rows] = await db.execute(query, params);
        return rows[0].count > 0;
    }

    // Kiểm tra số phòng đã tồn tại
    static async existsByRoomNumber(roomNumber, excludeId = null) {
        let query = 'SELECT COUNT(*) as count FROM bang_phong_kham WHERE so_phong_kham = ?';
        const params = [roomNumber];

        if (excludeId) {
            query += ' AND ma_phong_kham != ?';
            params.push(UUIDUtil.toBinary(excludeId));
        }

        const [rows] = await db.execute(query, params);
        return rows[0].count > 0;
    }

    // Kiểm tra phòng có đang được sử dụng không
    static async isInUse(roomId) {
        const query = 'SELECT COUNT(*) as count FROM bang_lich_lam_viec WHERE ma_phong_kham_lich_lam_viec = ?';
        const [rows] = await db.execute(query, [UUIDUtil.toBinary(roomId)]);
        return rows[0].count > 0;
    }

    // Lấy phòng khám có sẵn (trạng thái = 1)
    static async getAvailableRooms(specialtyId = null, roomTypeId = null) {
        let query = `
      SELECT 
        BIN_TO_UUID(pk.ma_phong_kham) as ma_phong_kham,
        pk.so_phong_kham,
        pk.ten_phong_kham,
        ck.ten_chuyen_khoa,
        lpk.ten_loai_phong_kham
      FROM bang_phong_kham pk
      LEFT JOIN bang_chuyen_khoa ck ON pk.ma_chuyen_khoa_phong_kham = ck.ma_chuyen_khoa
      LEFT JOIN bang_loai_phong_kham lpk ON pk.ma_loai_phong_kham = lpk.ma_loai_phong_kham
      WHERE pk.trang_thai_phong_kham = 1
    `;

        const params = [];

        if (specialtyId) {
            query += ' AND pk.ma_chuyen_khoa_phong_kham = ?';
            params.push(UUIDUtil.toBinary(specialtyId));
        }

        if (roomTypeId) {
            query += ' AND pk.ma_loai_phong_kham = ?';
            params.push(UUIDUtil.toBinary(roomTypeId));
        }

        query += ' ORDER BY pk.so_phong_kham ASC';

        const [rows] = await db.execute(query, params);
        return rows;
    }

    // Thống kê phòng khám theo chuyên khoa
    static async getStatsBySpecialty() {
        const query = `
      SELECT 
        BIN_TO_UUID(ck.ma_chuyen_khoa) as ma_chuyen_khoa,
        ck.ten_chuyen_khoa,
        COUNT(pk.ma_phong_kham) as tong_so_phong,
        SUM(CASE WHEN pk.trang_thai_phong_kham = 1 THEN 1 ELSE 0 END) as phong_hoat_dong,
        SUM(CASE WHEN pk.trang_thai_phong_kham = 0 THEN 1 ELSE 0 END) as phong_khong_hoat_dong
      FROM bang_chuyen_khoa ck
      LEFT JOIN bang_phong_kham pk ON ck.ma_chuyen_khoa = pk.ma_chuyen_khoa_phong_kham
      GROUP BY ck.ma_chuyen_khoa, ck.ten_chuyen_khoa
      ORDER BY tong_so_phong DESC
    `;

        const [rows] = await db.execute(query);
        return rows;
    }

    // Thống kê phòng khám theo loại
    static async getStatsByRoomType() {
        const query = `
      SELECT 
        BIN_TO_UUID(lpk.ma_loai_phong_kham) as ma_loai_phong_kham,
        lpk.ten_loai_phong_kham,
        COUNT(pk.ma_phong_kham) as tong_so_phong,
        SUM(CASE WHEN pk.trang_thai_phong_kham = 1 THEN 1 ELSE 0 END) as phong_hoat_dong,
        SUM(CASE WHEN pk.trang_thai_phong_kham = 0 THEN 1 ELSE 0 END) as phong_khong_hoat_dong
      FROM bang_loai_phong_kham lpk
      LEFT JOIN bang_phong_kham pk ON lpk.ma_loai_phong_kham = pk.ma_loai_phong_kham
      GROUP BY lpk.ma_loai_phong_kham, lpk.ten_loai_phong_kham
      ORDER BY tong_so_phong DESC
    `;

        const [rows] = await db.execute(query);
        return rows;
    }
}

module.exports = RoomModel;