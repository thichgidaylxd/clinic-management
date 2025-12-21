//Logic kê đơn thuốc cho bệnh nhân

const db = require('../config/database');
const UUIDUtil = require('../utils/uuid.util');

class PrescriptionModel {
    /**
     * Tạo đơn thuốc (Hóa đơn + Chi tiết thuốc)
     * @param {Object} prescriptionData 
     * @returns {String} ma_hoa_don
     */
    // static async create(prescriptionData) {
    //     const connection = await db.getConnection();

    //     try {
    //         await connection.beginTransaction();

    //         const {
    //             ma_benh_nhan,
    //             ma_chuyen_khoa,
    //             ma_nguoi_dung_hoa_don,
    //             gia_dich_vu,
    //             medicines, // Array of { ma_thuoc, so_luong, ghi_chu }
    //             ghi_chu_hoa_don
    //         } = prescriptionData;

    //         // Step 1: Tính tổng tiền thuốc
    //         let tongTienThuoc = 0;
    //         for (const medicine of medicines) {
    //             // Get medicine price
    //             const [medicineData] = await connection.execute(
    //                 'SELECT don_gia_thuoc FROM bang_thuoc WHERE ma_thuoc = UUID_TO_BIN(?)',
    //                 [medicine.ma_thuoc]
    //             );

    //             if (medicineData.length === 0) {
    //                 throw new Error(`Không tìm thấy thuốc ${medicine.ma_thuoc}`);
    //             }

    //             tongTienThuoc += medicineData[0].don_gia_thuoc * medicine.so_luong;
    //         }

    //         const tongThanhTien = parseFloat(gia_dich_vu || 0) + tongTienThuoc;

    //         // Step 2: Tạo hóa đơn
    //         const ma_hoa_don = UUIDUtil.generate();

    //         const invoiceQuery = `
    //             INSERT INTO bang_hoa_don (
    //                 ma_hoa_don,
    //                 ma_chuyen_khoa_hoa_don,
    //                 ma_benh_nhan_hoa_don,
    //                 ma_nguoi_dung_hoa_don,
    //                 tong_thanh_tien_hoa_don,
    //                 trang_thai_hoa_don,
    //                 ghi_chu_hoa_don,
    //                 ngay_tao_hoa_don
    //             ) VALUES (?, ?, ?, ?, ?, 0, ?, CURRENT_TIMESTAMP)
    //         `;

    //         await connection.execute(invoiceQuery, [
    //             UUIDUtil.toBinary(ma_hoa_don),
    //             ma_chuyen_khoa ? UUIDUtil.toBinary(ma_chuyen_khoa) : null,
    //             UUIDUtil.toBinary(ma_benh_nhan),
    //             ma_nguoi_dung_hoa_don ? UUIDUtil.toBinary(ma_nguoi_dung_hoa_don) : null,
    //             tongThanhTien,
    //             ghi_chu_hoa_don || null
    //         ]);

    //         // Step 3: Thêm chi tiết thuốc vào hóa đơn
    //         for (const medicine of medicines) {
    //             const ma_thuoc_hoa_don = UUIDUtil.generate();

    //             const itemQuery = `
    //                 INSERT INTO bang_thuoc_hoa_don (
    //                     ma_thuoc_hoa_don,
    //                     ma_hoa_don,
    //                     ma_thuoc,
    //                     so_luong_thuoc_hoa_don,
    //                     ghi_chu_thuoc
    //                 ) VALUES (?, ?, ?, ?, ?)
    //             `;

    //             await connection.execute(itemQuery, [
    //                 UUIDUtil.toBinary(ma_thuoc_hoa_don),
    //                 UUIDUtil.toBinary(ma_hoa_don),
    //                 UUIDUtil.toBinary(medicine.ma_thuoc),
    //                 medicine.so_luong,
    //                 medicine.ghi_chu || null
    //             ]);

    //             // Step 4: Trừ tồn kho
    //             const updateStockQuery = `
    //                 UPDATE bang_thuoc 
    //                 SET so_luong_thuoc_ton_thuoc = so_luong_thuoc_ton_thuoc - ?
    //                 WHERE ma_thuoc = UUID_TO_BIN(?)
    //                     AND so_luong_thuoc_ton_thuoc >= ?
    //             `;

    //             const [updateResult] = await connection.execute(updateStockQuery, [
    //                 medicine.so_luong,
    //                 medicine.ma_thuoc,
    //                 medicine.so_luong
    //             ]);

    //             if (updateResult.affectedRows === 0) {
    //                 throw new Error(`Thuốc ${medicine.ma_thuoc} không đủ tồn kho`);
    //             }
    //         }

    //         await connection.commit();
    //         return ma_hoa_don;

    //     } catch (error) {
    //         await connection.rollback();
    //         throw error;
    //     } finally {
    //         connection.release();
    //     }
    // }

    static async create(data) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const {
                ma_benh_nhan,
                ma_chuyen_khoa,
                ma_nguoi_dung_hoa_don,
                gia_dich_vu,
                medicines,
                ghi_chu_hoa_don
            } = data;

            // ===== TÍNH TIỀN THUỐC =====
            let tongTienThuoc = 0;

            for (const m of medicines) {
                const [rows] = await connection.execute(
                    `SELECT don_gia_thuoc
                 FROM bang_thuoc
                 WHERE ma_thuoc = UUID_TO_BIN(?)`,
                    [m.ma_thuoc]
                );

                tongTienThuoc += rows[0].don_gia_thuoc * m.so_luong;
            }

            const tongThanhTien = Number(gia_dich_vu || 0) + tongTienThuoc;

            // ===== TẠO HÓA ĐƠN =====
            const ma_hoa_don = UUIDUtil.generate();

            await connection.execute(
                `INSERT INTO bang_hoa_don (
                ma_hoa_don,
                ma_chuyen_khoa_hoa_don,
                ma_benh_nhan_hoa_don,
                ma_nguoi_dung_hoa_don,
                tong_thanh_tien_hoa_don,
                trang_thai_hoa_don,
                ghi_chu_hoa_don
            ) VALUES (?, ?, ?, ?, ?, 0, ?)`,
                [
                    UUIDUtil.toBinary(ma_hoa_don),
                    ma_chuyen_khoa ? UUIDUtil.toBinary(ma_chuyen_khoa) : null,
                    UUIDUtil.toBinary(ma_benh_nhan),
                    ma_nguoi_dung_hoa_don ? UUIDUtil.toBinary(ma_nguoi_dung_hoa_don) : null,
                    tongThanhTien,
                    ghi_chu_hoa_don || null
                ]
            );

            // ===== CHI TIẾT THUỐC =====
            for (const m of medicines) {
                const ma_thuoc_hoa_don = UUIDUtil.generate();

                await connection.execute(
                    `INSERT INTO bang_thuoc_hoa_don (
                    ma_thuoc_hoa_don,
                    ma_hoa_don,
                    ma_thuoc,
                    so_luong_thuoc_hoa_don,
                    ghi_chu_thuoc
                ) VALUES (?, ?, ?, ?, ?)`,
                    [
                        UUIDUtil.toBinary(ma_thuoc_hoa_don),
                        UUIDUtil.toBinary(ma_hoa_don),
                        UUIDUtil.toBinary(m.ma_thuoc),
                        m.so_luong,
                        m.ghi_chu || null
                    ]
                );

                // ===== TRỪ TỒN KHO =====
                const [update] = await connection.execute(
                    `UPDATE bang_thuoc
                 SET so_luong_thuoc_ton_thuoc = so_luong_thuoc_ton_thuoc - ?
                 WHERE ma_thuoc = UUID_TO_BIN(?)
                   AND so_luong_thuoc_ton_thuoc >= ?`,
                    [m.so_luong, m.ma_thuoc, m.so_luong]
                );

                if (update.affectedRows === 0) {
                    throw new Error('Thuốc không đủ tồn kho');
                }
            }

            await connection.commit();
            return ma_hoa_don;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Lấy chi tiết hóa đơn (bao gồm thuốc)
     */
    static async getInvoiceDetails(invoiceId) {
        // Get invoice info
        const invoiceQuery = `
            SELECT 
                BIN_TO_UUID(hd.ma_hoa_don) as ma_hoa_don,
                BIN_TO_UUID(hd.ma_benh_nhan_hoa_don) as ma_benh_nhan,
                BIN_TO_UUID(hd.ma_chuyen_khoa_hoa_don) as ma_chuyen_khoa,
                BIN_TO_UUID(hd.ma_nguoi_dung_hoa_don) as ma_nguoi_dung,
                hd.tong_thanh_tien_hoa_don,
                hd.trang_thai_hoa_don,
                hd.ghi_chu_hoa_don,
                hd.ngay_tra_tien_hoa_don,
                hd.ngay_tao_hoa_don,
                -- Patient
                bn.ten_benh_nhan,
                bn.ho_benh_nhan,
                bn.so_dien_thoai_benh_nhan,
                -- Specialty
                ck.ten_chuyen_khoa,
                -- Creator
                nd.ten_nguoi_dung as ten_nguoi_tao,
                nd.ho_nguoi_dung as ho_nguoi_tao
            FROM bang_hoa_don hd
            INNER JOIN bang_benh_nhan bn ON hd.ma_benh_nhan_hoa_don = bn.ma_benh_nhan
            LEFT JOIN bang_chuyen_khoa ck ON hd.ma_chuyen_khoa_hoa_don = ck.ma_chuyen_khoa
            LEFT JOIN bang_nguoi_dung nd ON hd.ma_nguoi_dung_hoa_don = nd.ma_nguoi_dung
            WHERE hd.ma_hoa_don = UUID_TO_BIN(?)
        `;

        const [invoiceRows] = await db.execute(invoiceQuery, [invoiceId]);

        if (invoiceRows.length === 0) {
            return null;
        }

        const invoice = invoiceRows[0];

        // Get medicines
        const medicinesQuery = `
            SELECT 
                BIN_TO_UUID(thd.ma_thuoc_hoa_don) as ma_thuoc_hoa_don,
                BIN_TO_UUID(thd.ma_thuoc) as ma_thuoc,
                thd.so_luong_thuoc_hoa_don,
                thd.ghi_chu_thuoc,
                -- Medicine info
                t.ten_thuoc,
                t.don_gia_thuoc,
                t.don_vi_tinh,
                -- Calculate subtotal
                (t.don_gia_thuoc * thd.so_luong_thuoc_hoa_don) as thanh_tien
            FROM bang_thuoc_hoa_don thd
            INNER JOIN bang_thuoc t ON thd.ma_thuoc = t.ma_thuoc
            WHERE thd.ma_hoa_don = UUID_TO_BIN(?)
        `;

        const [medicineRows] = await db.execute(medicinesQuery, [invoiceId]);

        return {
            ...invoice,
            medicines: medicineRows
        };
    }

    /**
     * Cập nhật trạng thái thanh toán
     */
    static async updatePaymentStatus(invoiceId, paymentData) {

        const query = `
            UPDATE bang_hoa_don
            SET 
                trang_thai_hoa_don = 1,
                ngay_tra_tien_hoa_don = CURRENT_TIMESTAMP
            WHERE ma_hoa_don = UUID_TO_BIN(?)
        `;

        const [result] = await db.execute(query, [
            invoiceId
        ]);

        return result.affectedRows > 0;
    }

    /**
     * Check tồn kho trước khi kê đơn
     */
    static async checkMedicineStock(medicines) {
        const results = [];

        for (const medicine of medicines) {
            const query = `
                SELECT 
                    BIN_TO_UUID(ma_thuoc) as ma_thuoc,
                    ten_thuoc,
                    so_luong_thuoc_ton_thuoc,
                    don_gia_thuoc,
                    han_su_dung_thuoc,
                    trang_thai_thuoc
                FROM bang_thuoc
                WHERE ma_thuoc = UUID_TO_BIN(?)
            `;

            const [rows] = await db.execute(query, [medicine.ma_thuoc]);

            if (rows.length === 0) {
                results.push({
                    ma_thuoc: medicine.ma_thuoc,
                    available: false,
                    reason: 'Không tìm thấy thuốc'
                });
                continue;
            }

            const med = rows[0];

            // Check status
            if (med.trang_thai_thuoc !== 1) {
                results.push({
                    ma_thuoc: medicine.ma_thuoc,
                    ten_thuoc: med.ten_thuoc,
                    available: false,
                    reason: 'Thuốc không còn hoạt động'
                });
                continue;
            }

            // Check expiry
            if (med.han_su_dung_thuoc && new Date(med.han_su_dung_thuoc) < new Date()) {
                results.push({
                    ma_thuoc: medicine.ma_thuoc,
                    ten_thuoc: med.ten_thuoc,
                    available: false,
                    reason: 'Thuốc đã hết hạn'
                });
                continue;
            }

            // Check stock
            if (med.so_luong_thuoc_ton_thuoc < medicine.so_luong) {
                results.push({
                    ma_thuoc: medicine.ma_thuoc,
                    ten_thuoc: med.ten_thuoc,
                    available: false,
                    reason: `Tồn kho không đủ (còn ${med.so_luong_thuoc_ton_thuoc})`
                });
                continue;
            }

            // Available
            results.push({
                ma_thuoc: medicine.ma_thuoc,
                ten_thuoc: med.ten_thuoc,
                available: true,
                stock: med.so_luong_thuoc_ton_thuoc,
                price: med.don_gia_thuoc
            });
        }

        return results;
    }
}

module.exports = PrescriptionModel;