const UserModel = require('../models/user.model');
const RoleModel = require('../models/role.model');
const BcryptUtil = require('../utils/bcrypt.util');
const JWTUtil = require('../utils/jwt.util');
const CONSTANTS = require('../config/constants');

class AuthService {
    // Đăng ký tài khoản
    static async register(userData) {
        const {
            ten_dang_nhap_nguoi_dung,
            email_nguoi_dung,
            mat_khau_nguoi_dung,
            ma_vai_tro
        } = userData;

        // Kiểm tra username đã tồn tại
        const usernameExists = await UserModel.existsByUsername(ten_dang_nhap_nguoi_dung);
        if (usernameExists) {
            throw new Error('Tên đăng nhập đã tồn tại');
        }

        // Kiểm tra email đã tồn tại (nếu có)
        if (email_nguoi_dung) {
            const emailExists = await UserModel.existsByEmail(email_nguoi_dung);
            if (emailExists) {
                throw new Error('Email đã được sử dụng');
            }
        }

        // Xác định vai trò
        let roleId = ma_vai_tro;
        if (!roleId) {
            // Mặc định tạo tài khoản Bệnh nhân
            const patientRole = await RoleModel.findByName(CONSTANTS.ROLES.PATIENT);
            if (!patientRole) {
                throw new Error('Không tìm thấy vai trò mặc định');
            }
            roleId = patientRole.ma_vai_tro;
        } else {
            // Kiểm tra vai trò có tồn tại
            const role = await RoleModel.findById(roleId);
            if (!role) {
                throw new Error('Vai trò không hợp lệ');
            }
        }

        // Mã hóa mật khẩu
        const hashedPassword = await BcryptUtil.hash(mat_khau_nguoi_dung);

        // Tạo người dùng mới
        const userId = await UserModel.create({
            ...userData,
            ma_vai_tro: roleId,
            mat_khau_nguoi_dung: hashedPassword
        });

        // Lấy thông tin người dùng vừa tạo
        const user = await UserModel.findById(userId);

        // Tạo tokens
        const accessToken = JWTUtil.generateAccessToken({
            ma_nguoi_dung: user.ma_nguoi_dung,
            ten_dang_nhap: user.ten_dang_nhap_nguoi_dung,
            ma_vai_tro: user.ma_vai_tro,
            ten_vai_tro: user.ten_vai_tro
        });

        const refreshToken = JWTUtil.generateRefreshToken({
            ma_nguoi_dung: user.ma_nguoi_dung
        });

        // Loại bỏ mật khẩu khỏi response
        delete user.mat_khau_nguoi_dung;

        return {
            user,
            accessToken,
            refreshToken
        };
    }

    // Đăng nhập
    static async login(credentials) {
        const { ten_dang_nhap_nguoi_dung, mat_khau_nguoi_dung } = credentials;

        // Tìm người dùng
        const user = await UserModel.findByUsername(ten_dang_nhap_nguoi_dung);

        if (!user) {
            throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
        }

        // Kiểm tra trạng thái tài khoản
        if (user.trang_thai_nguoi_dung !== CONSTANTS.STATUS.ACTIVE) {
            throw new Error('Tài khoản đã bị khóa');
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await BcryptUtil.compare(
            mat_khau_nguoi_dung,
            user.mat_khau_nguoi_dung
        );

        if (!isPasswordValid) {
            throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
        }

        // Tạo tokens
        const accessToken = JWTUtil.generateAccessToken({
            ma_nguoi_dung: user.ma_nguoi_dung,
            ten_dang_nhap: user.ten_dang_nhap_nguoi_dung,
            ma_vai_tro: user.ma_vai_tro,
            ten_vai_tro: user.ten_vai_tro
        });

        const refreshToken = JWTUtil.generateRefreshToken({
            ma_nguoi_dung: user.ma_nguoi_dung
        });

        // Loại bỏ mật khẩu khỏi response
        delete user.mat_khau_nguoi_dung;

        return {
            user,
            accessToken,
            refreshToken
        };
    }

    // Refresh token
    static async refreshToken(refreshToken) {
        try {
            // Verify refresh token
            const decoded = JWTUtil.verifyRefreshToken(refreshToken);

            // Lấy thông tin người dùng
            const user = await UserModel.findById(decoded.ma_nguoi_dung);

            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }

            if (user.trang_thai_nguoi_dung !== CONSTANTS.STATUS.ACTIVE) {
                throw new Error('Tài khoản đã bị khóa');
            }

            // Tạo access token mới
            const newAccessToken = JWTUtil.generateAccessToken({
                ma_nguoi_dung: user.ma_nguoi_dung,
                ten_dang_nhap: user.ten_dang_nhap_nguoi_dung,
                ma_vai_tro: user.ma_vai_tro,
                ten_vai_tro: user.ten_vai_tro
            });

            return {
                accessToken: newAccessToken
            };
        } catch (error) {
            throw new Error('Refresh token không hợp lệ');
        }
    }

    // Lấy thông tin người dùng hiện tại
    static async getCurrentUser(userId) {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }

        return user;
    }
}

module.exports = AuthService;