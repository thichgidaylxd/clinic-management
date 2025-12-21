// medicine.model.js - FIX
const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class MedicineModel {
    static async create(medicineData, userId) {
        const {
            ten_thuoc,
            thanh_phan_thuoc,
            don_gia_thuoc,
            huong_dan_su_dung_thuoc,
            don_vi_tinh,
            so_luong_thuoc_ton_thuoc,
            han_su_dung_thuoc,
            giay_to_kiem_dinh_thuoc
        } = medicineData;

        const ma_thuoc = UUIDUtil.generate();

        const query = `
      INSERT INTO bang_thuoc (
        ma_thuoc,
        ma_nguoi_tao_thuoc,
        ma_nguoi_cap_nhat_thuoc,
        ten_thuoc,
        thanh_phan_thuoc,
        don_gia_thuoc,
        huong_dan_su_dung_thuoc,
        don_vi_tinh,
        so_luong_thuoc_ton_thuoc,
        han_su_dung_thuoc,
        giay_to_kiem_dinh_thuoc,
        trang_thai_thuoc
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

        await db.execute(query, [
            UUIDUtil.toBinary(ma_thuoc),
            UUIDUtil.toBinary(userId),
            UUIDUtil.toBinary(userId),
            ten_thuoc,
            thanh_phan_thuoc || null,
            don_gia_thuoc,
            huong_dan_su_dung_thuoc || null,
            don_vi_tinh || null,
            so_luong_thuoc_ton_thuoc || 0,
            han_su_dung_thuoc || null,
            giay_to_kiem_dinh_thuoc || null
        ]);

        return ma_thuoc;
    }

    static async findAll(page = 1, limit = 10, search = '', status = null) {
        const pageInt = parseInt(page) || 1;
        const limitInt = parseInt(limit) || 10;
        const offset = (pageInt - 1) * limitInt;

        let query = `
      SELECT 
        BIN_TO_UUID(t.ma_thuoc) as ma_thuoc,
        BIN_TO_UUID(t.ma_nguoi_tao_thuoc) as ma_nguoi_tao_thuoc,
        BIN_TO_UUID(t.ma_nguoi_cap_nhat_thuoc) as ma_nguoi_cap_nhat_thuoc,
        t.ten_thuoc,
        t.thanh_phan_thuoc,
        t.don_gia_thuoc,
        t.huong_dan_su_dung_thuoc,
        t.don_vi_tinh,
        t.so_luong_thuoc_ton_thuoc,
        t.han_su_dung_thuoc,
        t.giay_to_kiem_dinh_thuoc,
        t.trang_thai_thuoc,
        t.ngay_tao_thuoc,
        t.ngay_cap_nhat_thuoc,
        nd_tao.ten_nguoi_dung as ten_nguoi_tao,
        nd_cap_nhat.ten_nguoi_dung as ten_nguoi_cap_nhat
      FROM bang_thuoc t
      LEFT JOIN bang_nguoi_dung nd_tao ON t.ma_nguoi_tao_thuoc = nd_tao.ma_nguoi_dung
      LEFT JOIN bang_nguoi_dung nd_cap_nhat ON t.ma_nguoi_cap_nhat_thuoc = nd_cap_nhat.ma_nguoi_dung
    `;

        const params = [];
        const conditions = [];

        if (search) {
            conditions.push('t.ten_thuoc LIKE ?');
            params.push(`%${search}%`);
        }

        if (status !== null && status !== undefined) {
            conditions.push('t.trang_thai_thuoc = ?');
            params.push(parseInt(status));
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` ORDER BY t.ngay_tao_thuoc DESC LIMIT ${offset}, ${limitInt}`;

        const [rows] = await db.execute(query, params);

        let countQuery = 'SELECT COUNT(*) as total FROM bang_thuoc t';
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

    static async findById(medicineId) {
        const query = `
      SELECT 
        BIN_TO_UUID(t.ma_thuoc) as ma_thuoc,
        BIN_TO_UUID(t.ma_nguoi_tao_thuoc) as ma_nguoi_tao_thuoc,
        BIN_TO_UUID(t.ma_nguoi_cap_nhat_thuoc) as ma_nguoi_cap_nhat_thuoc,
        t.ten_thuoc,
        t.thanh_phan_thuoc,
        t.don_gia_thuoc,
        t.huong_dan_su_dung_thuoc,
        t.don_vi_tinh,
        t.so_luong_thuoc_ton_thuoc,
        t.han_su_dung_thuoc,
        t.giay_to_kiem_dinh_thuoc,
        t.trang_thai_thuoc,
        t.ngay_tao_thuoc,
        t.ngay_cap_nhat_thuoc,
        nd_tao.ten_nguoi_dung as ten_nguoi_tao,
        nd_cap_nhat.ten_nguoi_dung as ten_nguoi_cap_nhat
      FROM bang_thuoc t
      LEFT JOIN bang_nguoi_dung nd_tao ON t.ma_nguoi_tao_thuoc = nd_tao.ma_nguoi_dung
      LEFT JOIN bang_nguoi_dung nd_cap_nhat ON t.ma_nguoi_cap_nhat_thuoc = nd_cap_nhat.ma_nguoi_dung
      WHERE t.ma_thuoc = ?
    `;

        const [rows] = await db.execute(query, [UUIDUtil.toBinary(medicineId)]);
        return rows[0] || null;
    }

    static async update(medicineId, updateData, userId) {
        const {
            ten_thuoc,
            thanh_phan_thuoc,
            don_gia_thuoc,
            huong_dan_su_dung_thuoc,
            don_vi_tinh,
            so_luong_thuoc_ton_thuoc,
            han_su_dung_thuoc,
            giay_to_kiem_dinh_thuoc,
            trang_thai_thuoc
        } = updateData;

        const fields = [];
        const values = [];

        if (ten_thuoc !== undefined) {
            fields.push('ten_thuoc = ?');
            values.push(ten_thuoc);
        }
        if (thanh_phan_thuoc !== undefined) {
            fields.push('thanh_phan_thuoc = ?');
            values.push(thanh_phan_thuoc);
        }
        if (don_gia_thuoc !== undefined) {
            fields.push('don_gia_thuoc = ?');
            values.push(don_gia_thuoc);
        }
        if (huong_dan_su_dung_thuoc !== undefined) {
            fields.push('huong_dan_su_dung_thuoc = ?');
            values.push(huong_dan_su_dung_thuoc);
        }
        if (don_vi_tinh !== undefined) {
            fields.push('don_vi_tinh = ?');
            values.push(don_vi_tinh);
        }
        if (so_luong_thuoc_ton_thuoc !== undefined) {
            fields.push('so_luong_thuoc_ton_thuoc = ?');
            values.push(so_luong_thuoc_ton_thuoc);
        }
        if (han_su_dung_thuoc !== undefined) {
            fields.push('han_su_dung_thuoc = ?');
            values.push(han_su_dung_thuoc);
        }
        if (giay_to_kiem_dinh_thuoc !== undefined) {
            fields.push('giay_to_kiem_dinh_thuoc = ?');
            values.push(giay_to_kiem_dinh_thuoc);
        }
        if (trang_thai_thuoc !== undefined) {
            fields.push('trang_thai_thuoc = ?');
            values.push(trang_thai_thuoc);
        }

        if (fields.length === 0) {
            throw new Error('Không có dữ liệu để cập nhật');
        }

        fields.push('ma_nguoi_cap_nhat_thuoc = ?');
        values.push(UUIDUtil.toBinary(userId));

        values.push(UUIDUtil.toBinary(medicineId));

        const query = `
      UPDATE bang_thuoc 
      SET ${fields.join(', ')}
      WHERE ma_thuoc = ?
    `;

        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    static async softDelete(medicineId) {
        const query = 'UPDATE bang_thuoc SET trang_thai_thuoc = 0 WHERE ma_thuoc = ?';
        const [result] = await db.execute(query, [UUIDUtil.toBinary(medicineId)]);
        return result.affectedRows > 0;
    }

    static async delete(medicineId) {
        const query = 'DELETE FROM bang_thuoc WHERE ma_thuoc = ?';
        const [result] = await db.execute(query, [UUIDUtil.toBinary(medicineId)]);
        return result.affectedRows > 0;
    }

    static async existsByName(name, excludeId = null) {
        let query = 'SELECT COUNT(*) as count FROM bang_thuoc WHERE ten_thuoc = ?';
        const params = [name];

        if (excludeId) {
            query += ' AND ma_thuoc != ?';
            params.push(UUIDUtil.toBinary(excludeId));
        }

        const [rows] = await db.execute(query, params);
        return rows[0].count > 0;
    }

    static async isInUse(medicineId) {
        const query = 'SELECT COUNT(*) as count FROM bang_thuoc_hoa_don WHERE ma_thuoc = ?';
        const [rows] = await db.execute(query, [UUIDUtil.toBinary(medicineId)]);
        return rows[0].count > 0;
    }

    static async getExpiringSoon(days = 30) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_thuoc) as ma_thuoc,
        ten_thuoc,
        don_vi_tinh,
        so_luong_thuoc_ton_thuoc,
        han_su_dung_thuoc,
        DATEDIFF(han_su_dung_thuoc, CURDATE()) as ngay_con_lai
      FROM bang_thuoc
      WHERE han_su_dung_thuoc IS NOT NULL
        AND han_su_dung_thuoc >= CURDATE()
        AND han_su_dung_thuoc <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
        AND trang_thai_thuoc = 1
      ORDER BY han_su_dung_thuoc ASC
    `;

        const [rows] = await db.execute(query, [days]);
        return rows;
    }

    static async getLowStock(threshold = 10) {
        const query = `
      SELECT 
        BIN_TO_UUID(ma_thuoc) as ma_thuoc,
        ten_thuoc,
        don_vi_tinh,
        so_luong_thuoc_ton_thuoc,
        han_su_dung_thuoc
      FROM bang_thuoc
      WHERE so_luong_thuoc_ton_thuoc <= ?
        AND trang_thai_thuoc = 1
      ORDER BY so_luong_thuoc_ton_thuoc ASC
    `;

        const [rows] = await db.execute(query, [threshold]);
        return rows;
    }

    static async updateStock(medicineId, quantity, type = 'add') {
        let query;
        if (type === 'add') {
            query = `
        UPDATE bang_thuoc 
        SET so_luong_thuoc_ton_thuoc = so_luong_thuoc_ton_thuoc + ?
        WHERE ma_thuoc = ?
      `;
        } else {
            query = `
        UPDATE bang_thuoc 
        SET so_luong_thuoc_ton_thuoc = so_luong_thuoc_ton_thuoc - ?
        WHERE ma_thuoc = ? AND so_luong_thuoc_ton_thuoc >= ?
      `;
        }

        const params = type === 'add'
            ? [quantity, UUIDUtil.toBinary(medicineId)]
            : [quantity, UUIDUtil.toBinary(medicineId), quantity];

        const [result] = await db.execute(query, params);
        return result.affectedRows > 0;
    }
}

module.exports = MedicineModel;