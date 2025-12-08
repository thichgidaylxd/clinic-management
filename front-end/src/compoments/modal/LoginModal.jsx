import React, { useState } from "react";
import { X, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
    const [formData, setFormData] = useState({
        ten_dang_nhap_nguoi_dung: "",
        mat_khau_nguoi_dung: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log("Login response data:", data);

            if (response.ok) {
                // Lưu token và user
                localStorage.setItem("token", data.data.accessToken);
                localStorage.setItem("user", JSON.stringify(data.data.user));



                // chạy progress rồi mới navigate
                NProgress.start();
                NProgress.set(0.3);
                setTimeout(() => NProgress.set(0.7), 300);
                setTimeout(() => {
                    NProgress.done();
                    window.location.reload();
                }, 600);
                onClose();
            } else {
                setError(data.message || "Đăng nhập thất bại");
            }
        } catch (err) {
            setError("Không thể kết nối đến server");
            console.error("Login error:", err);
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
                                value={formData.ten_dang_nhap_nguoi_dung}
                                onChange={(e) =>
                                    setFormData({ ...formData, ten_dang_nhap_nguoi_dung: e.target.value })
                                }
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
                                value={formData.mat_khau_nguoi_dung}
                                onChange={(e) =>
                                    setFormData({ ...formData, mat_khau_nguoi_dung: e.target.value })
                                }
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-700 text-white py-3 rounded-xl hover:bg-teal-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
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
