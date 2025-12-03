import { Mail, Phone, User, X, Lock } from "lucide-react";
import { useState } from "react";

function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        ten_nguoi_dung: '',
        ten_dang_nhap: '',
        email: '',
        so_dien_thoai: '',
        mat_khau: '',
        confirmPassword: '',
        gioi_tinh: 1, // 1: Nam, 0: Nữ
        dia_chi: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate
        if (formData.mat_khau !== formData.confirmPassword) {
            setError('Mật khẩu không khớp!');
            setLoading(false);
            return;
        }

        if (formData.so_dien_thoai.length !== 10) {
            setError('Số điện thoại phải có 10 chữ số!');
            setLoading(false);
            return;
        }

        try {
            // Tách họ và tên
            const nameParts = formData.ten_nguoi_dung.trim().split(' ');
            const ho = nameParts.slice(0, -1).join(' ');
            const ten = nameParts[nameParts.length - 1];

            const payload = {
                ten_dang_nhap: formData.ten_dang_nhap,
                mat_khau: formData.mat_khau,
                ten_nguoi_dung: ten,
                ho_nguoi_dung: ho,
                email: formData.email,
                so_dien_thoai: formData.so_dien_thoai,
                gioi_tinh: formData.gioi_tinh,
                dia_chi: formData.dia_chi,
                ma_vai_tro: '550e8400-e29b-41d4-a716-446655440005' // Bệnh nhân
            };

            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                onSwitchToLogin();
            } else {
                setError(data.message || 'Đăng ký thất bại');
            }
        } catch (err) {
            setError('Không thể kết nối đến server');
            console.error('Register error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <div className="w-10 h-10 border-2 border-white rounded"></div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản</h2>
                    <p className="text-gray-600">Đăng ký để bắt đầu chăm sóc sức khỏe</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên đầy đủ
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Nguyễn Văn A"
                                value={formData.ten_nguoi_dung}
                                onChange={(e) => setFormData({ ...formData, ten_nguoi_dung: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên đăng nhập
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="username"
                                value={formData.ten_dang_nhap}
                                onChange={(e) => setFormData({ ...formData, ten_dang_nhap: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại (10 số)
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                placeholder="0901234567"
                                value={formData.so_dien_thoai}
                                onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none transition"
                                pattern="[0-9]{10}"
                                maxLength="10"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giới tính
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="1"
                                    checked={formData.gioi_tinh === 1}
                                    onChange={() => setFormData({ ...formData, gioi_tinh: 1 })}
                                    className="w-4 h-4 text-teal-700"
                                />
                                <span className="text-gray-700">Nam</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="0"
                                    checked={formData.gioi_tinh === 0}
                                    onChange={() => setFormData({ ...formData, gioi_tinh: 0 })}
                                    className="w-4 h-4 text-teal-700"
                                />
                                <span className="text-gray-700">Nữ</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.mat_khau}
                                onChange={(e) => setFormData({ ...formData, mat_khau: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none transition"
                                minLength="6"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                        <input type="checkbox" className="w-4 h-4 text-teal-700 rounded mt-1" required />
                        <span className="text-gray-600">
                            Tôi đồng ý với{' '}
                            <a href="#" className="text-teal-700 hover:text-teal-800">
                                Điều khoản dịch vụ
                            </a>{' '}
                            và{' '}
                            <a href="#" className="text-teal-700 hover:text-teal-800">
                                Chính sách bảo mật
                            </a>
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-700 text-white py-3 rounded-xl hover:bg-teal-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-teal-700 hover:text-teal-800 font-medium"
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterModal;