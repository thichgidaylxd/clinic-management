// src/utils/tokenUtil.js

class TokenUtil {
    static getUser() {
        const userData = localStorage.getItem('user');
        if (!userData) return null;

        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error("Không thể parse dữ liệu user từ localStorage:", error);
            return null;
        }
    }

    static getUserId() {
        const user = this.getUser();
        return user?.ma_nguoi_dung || null;
    }

    static getRoleId() {
        const user = this.getUser();
        return user?.ma_vai_tro || null;
    }

    static getRoleName() {
        const user = this.getUser();
        return user?.ten_vai_tro || null;
    }

    static getUserName() {
        const user = this.getUser();
        return user?.ten_nguoi_dung || null;
    }

    static getEmail() {
        const user = this.getUser();
        return user?.email_nguoi_dung || null;
    }

    static getPhone() {
        const user = this.getUser();
        return user?.so_dien_thoai_nguoi_dung || null;
    }

    static getGender() {
        const user = this.getUser();
        return user?.gioi_tinh_nguoi_dung || null;
    }

    static getStatus() {
        const user = this.getUser();
        return user?.trang_thai_nguoi_dung || null;
    }

    static getCreatedDate() {
        const user = this.getUser();
        return user?.ngay_tao_nguoi_dung || null;
    }
}

export default TokenUtil;
