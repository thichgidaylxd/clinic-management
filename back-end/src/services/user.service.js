const UserModel = require('../models/user.model');
const RoleModel = require('../models/role.model');
const BcryptUtil = require('../utils/bcrypt.util');

class UserService {
    // Lấy danh sách người dùng
    static async getAll(page = 1, limit = 10, search = '', roleId = null) {
        const pageInt = parseInt(page) || 1;
        const limitInt = parseInt(limit) || 10;
        const offset = (pageInt - 1) * limitInt;

        let query = `
            SELECT 
                BIN_TO_UUID(nd.ma_nguoi_dung) as ma_nguoi_dung,
                nd.ten_nguoi_dung,
                nd.ho_nguoi_dung,
                nd.ten_dang_nhap_nguoi_dung,
                nd.email_nguoi_dung,
                nd.so_dien_thoai_nguoi_dung,
                nd.gioi_tinh_nguoi_dung,
                nd.trang_thai_nguoi_dung,
                nd.ngay_tao_nguoi_dung,
                BIN_TO_UUID(nd.ma_vai_tro) as ma_vai_tro,
                vt.ten_vai_tro
            FROM bang_nguoi_dung nd
            INNER JOIN bang_vai_tro vt ON nd.ma_vai_tro = vt.ma_vai_tro
        `;

        const params = [];
        const conditions = [];

        // Search filter
        if (search) {
            conditions.push(`(
                nd.ten_nguoi_dung LIKE ? OR 
                nd.ho_nguoi_dung LIKE ? OR 
                nd.email_nguoi_dung LIKE ? OR 
                nd.so_dien_thoai_nguoi_dung LIKE ? OR
                nd.ten_dang_nhap_nguoi_dung LIKE ?
            )`);
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
        }

        // Role filter
        if (roleId) {
            conditions.push('nd.ma_vai_tro = ?');
            const UUIDUtil = require('../utils/uuid.util');
            params.push(UUIDUtil.toBinary(roleId));
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY nd.ngay_tao_nguoi_dung DESC';
        query += ` LIMIT ${offset}, ${limitInt}`;

        const db = require('../config/database');
        const [rows] = await db.execute(query, params);

        // Count total
        let countQuery = `
            SELECT COUNT(*) as total 
            FROM bang_nguoi_dung nd
            INNER JOIN bang_vai_tro vt ON nd.ma_vai_tro = vt.ma_vai_tro
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

    // Lấy người dùng theo ID
    static async getById(userId) {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        // Remove password from response
        delete user.mat_khau_nguoi_dung;

        return user;
    }

    // Tạo người dùng mới
    static async createUser(userData) {
        const {
            ten_nguoi_dung,
            ho_nguoi_dung,
            ten_dang_nhap_nguoi_dung,
            email_nguoi_dung,
            so_dien_thoai_nguoi_dung,
            mat_khau_nguoi_dung,
            gioi_tinh_nguoi_dung,
            ma_vai_tro,
            trang_thai_nguoi_dung
        } = userData;

        // Validate required fields
        if (!ten_nguoi_dung || !ho_nguoi_dung || !ten_dang_nhap_nguoi_dung ||
            !email_nguoi_dung || !so_dien_thoai_nguoi_dung || !mat_khau_nguoi_dung || !ma_vai_tro) {
            throw new Error('Thiếu thông tin bắt buộc');
        }

        // Check username exists
        const existingUsername = await UserModel.findByUsername(ten_dang_nhap_nguoi_dung);
        if (existingUsername) {
            throw new Error('Tên đăng nhập đã tồn tại');
        }

        // Check email exists
        const existingEmail = await UserModel.findByEmail(email_nguoi_dung);
        if (existingEmail) {
            throw new Error('Email đã tồn tại');
        }

        // Check phone exists
        const existingPhone = await UserModel.findByPhone(so_dien_thoai_nguoi_dung);
        if (existingPhone) {
            throw new Error('Số điện thoại đã tồn tại');
        }

        // Validate role
        const role = await RoleModel.findById(ma_vai_tro);
        if (!role) {
            throw new Error('Vai trò không tồn tại');
        }

        // Hash password
        const hashedPassword = await BcryptUtil.hash(mat_khau_nguoi_dung, 10);

        // Create user
        const userId = await UserModel.create({
            ten_nguoi_dung,
            ho_nguoi_dung,
            ten_dang_nhap_nguoi_dung,
            email_nguoi_dung,
            so_dien_thoai_nguoi_dung,
            mat_khau_nguoi_dung: hashedPassword,
            gioi_tinh_nguoi_dung: gioi_tinh_nguoi_dung ?? 0,
            ma_vai_tro,
            trang_thai_nguoi_dung: trang_thai_nguoi_dung ?? 1
        });

        return await this.getById(userId);
    }

    // Cập nhật người dùng
    static async updateUser(userId, updateData) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        const {
            ten_nguoi_dung,
            ho_nguoi_dung,
            email_nguoi_dung,
            so_dien_thoai_nguoi_dung,
            gioi_tinh_nguoi_dung,
            ma_vai_tro,
            trang_thai_nguoi_dung
        } = updateData;

        // Check email if changed
        if (email_nguoi_dung && email_nguoi_dung !== user.email_nguoi_dung) {
            const existingEmail = await UserModel.findByEmail(email_nguoi_dung);
            if (existingEmail && existingEmail.ma_nguoi_dung !== userId) {
                throw new Error('Email đã được sử dụng bởi người dùng khác');
            }
        }

        // Check phone if changed
        if (so_dien_thoai_nguoi_dung && so_dien_thoai_nguoi_dung !== user.so_dien_thoai_nguoi_dung) {
            const existingPhone = await UserModel.findByPhone(so_dien_thoai_nguoi_dung);
            if (existingPhone && existingPhone.ma_nguoi_dung !== userId) {
                throw new Error('Số điện thoại đã được sử dụng bởi người dùng khác');
            }
        }

        // Validate role if changed
        if (ma_vai_tro) {
            const role = await RoleModel.findById(ma_vai_tro);
            if (!role) {
                throw new Error('Vai trò không tồn tại');
            }
        }

        // Update
        const dataToUpdate = {};
        if (ten_nguoi_dung !== undefined) dataToUpdate.ten_nguoi_dung = ten_nguoi_dung;
        if (ho_nguoi_dung !== undefined) dataToUpdate.ho_nguoi_dung = ho_nguoi_dung;
        if (email_nguoi_dung !== undefined) dataToUpdate.email_nguoi_dung = email_nguoi_dung;
        if (so_dien_thoai_nguoi_dung !== undefined) dataToUpdate.so_dien_thoai_nguoi_dung = so_dien_thoai_nguoi_dung;
        if (gioi_tinh_nguoi_dung !== undefined) dataToUpdate.gioi_tinh_nguoi_dung = gioi_tinh_nguoi_dung;
        if (ma_vai_tro !== undefined) dataToUpdate.ma_vai_tro = ma_vai_tro;
        if (trang_thai_nguoi_dung !== undefined) dataToUpdate.trang_thai_nguoi_dung = trang_thai_nguoi_dung;

        if (Object.keys(dataToUpdate).length > 0) {
            await UserModel.update(userId, dataToUpdate);
        }

        return await this.getById(userId);
    }

    // Xóa người dùng
    static async deleteUser(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        // Không cho xóa admin cuối cùng
        if (user.ten_vai_tro === 'Quản trị viên') {
            const db = require('../config/database');
            const [adminCount] = await db.execute(`
                SELECT COUNT(*) as count 
                FROM bang_nguoi_dung nd
                INNER JOIN bang_vai_tro vt ON nd.ma_vai_tro = vt.ma_vai_tro
                WHERE vt.ten_vai_tro = 'Quản trị viên' AND nd.trang_thai_nguoi_dung = 1
            `);

            if (adminCount[0].count <= 1) {
                throw new Error('Không thể xóa admin cuối cùng trong hệ thống');
            }
        }

        await UserModel.delete(userId);
        return true;
    }

    // Đổi mật khẩu
    static async changePassword(userId, oldPassword, newPassword) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        // Verify old password
        const isValidPassword = await BcryptUtil.compare(oldPassword, user.mat_khau_nguoi_dung);
        if (!isValidPassword) {
            throw new Error('Mật khẩu cũ không đúng');
        }

        // Validate new password
        if (newPassword.length < 6) {
            throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
        }

        // Hash new password
        const hashedPassword = await BcryptUtil.hash(newPassword, 10);

        // Update password
        await UserModel.update(userId, {
            mat_khau_nguoi_dung: hashedPassword
        });

        return true;
    }
}

module.exports = UserService;