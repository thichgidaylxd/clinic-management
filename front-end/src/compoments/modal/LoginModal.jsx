import React, { useState } from 'react';
import { Search, ArrowRight, Video, Shield, X, Mail, Lock, User, Phone } from 'lucide-react';

// Login Modal Component
function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
    const [formData, setFormData] = useState({
        ten_dang_nhap: '',
        mat_khau: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Lưu token vào localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                alert('Đăng nhập thành công!');
                onClose();
                window.location.reload(); // Reload để cập nhật UI
            } else {
                setError(data.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError('Không thể kết nối đến server');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại</h2>
                    <p className="text-gray-600">Đăng nhập để tiếp tục</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-teal-700 rounded" />
                            <span className="text-gray-600">Ghi nhớ đăng nhập</span>
                        </label>
                        <a href="#" className="text-teal-700 hover:text-teal-800 font-medium">
                            Quên mật khẩu?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-700 text-white py-3 rounded-xl hover:bg-teal-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Chưa có tài khoản?{' '}
                    <button
                        onClick={onSwitchToRegister}
                        className="text-teal-700 hover:text-teal-800 font-medium"
                    >
                        Đăng ký ngay
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;