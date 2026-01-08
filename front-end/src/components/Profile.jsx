import React, { useEffect, useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Calendar,
    Loader2
} from 'lucide-react';
import { authAPI } from '../services/authAPI';
import ChangePasswordModal from './modal/ChangePasswordModal';


function Profile() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await authAPI.getCurrentUser();
            console.log('User profile:', res);
            setUser(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('vi-VN');

    const genderText = (value) => {
        if (value === 1) return 'Nam';
        if (value === 0) return 'Nữ';
        return 'Khác';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user) return null;

    const fullName = [user.ho_nguoi_dung, user.ten_nguoi_dung]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {fullName}
                            </h1>
                            <p className="text-blue-100">
                                {user.ten_vai_tro}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem icon={<User />} label="Tên đăng nhập" value={user.ten_dang_nhap_nguoi_dung} />
                    <InfoItem icon={<Mail />} label="Email" value={user.email_nguoi_dung} />
                    <InfoItem icon={<Phone />} label="Số điện thoại" value={user.so_dien_thoai_nguoi_dung} />
                    <InfoItem icon={<User />} label="Giới tính" value={genderText(user.gioi_tinh_nguoi_dung)} />
                    <InfoItem icon={<Calendar />} label="Ngày tạo tài khoản" value={formatDate(user.ngay_tao_nguoi_dung)} />
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-between items-center">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium
        ${user.trang_thai_nguoi_dung === 1
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {user.trang_thai_nguoi_dung === 1 ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                    </span>

                    <button
                        onClick={() => setShowChangePassword(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Đổi mật khẩu
                    </button>
                </div>
                {showChangePassword && (
                    <ChangePasswordModal
                        onClose={() => setShowChangePassword(false)}
                    />
                )}
            </div>


        </div>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-4 bg-gray-50 rounded-lg p-4">
            <div className="text-blue-600">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

export default Profile;
