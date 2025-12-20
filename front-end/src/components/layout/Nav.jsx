import React, { useEffect, useState } from "react";
import { ArrowRight, User } from "lucide-react";
import { Stethoscope, Layers, Briefcase, Info, BookOpen } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

function Nav({ onLoginClick, onRegisterClick, onLogout, user }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        const userData = JSON.parse(storedUser);

        // Check if user is Admin
        if (userData && userData.ten_vai_tro == 'Admin') {
            setIsAdmin(true);
        }

    }, []);


    return (
        <nav className="container mx-auto px-6 py-2 left-0 w-full bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img
                        src="/clinic_logo_no_bg.png"
                        alt="Clinic Logo"
                        className="w-auto h-12"
                        onClick={() => navigate('/')}
                    />
                    <span className="text-2xl font-semibold text-gray-800">Health</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {[
                        { label: "Tìm Bác Sĩ", icon: <Stethoscope className="w-4 h-4 text-gray-500" /> },
                        { label: "Chuyên Khoa", icon: <Layers className="w-4 h-4 text-gray-500" /> },
                        { label: "Dịch Vụ", icon: <Briefcase className="w-4 h-4 text-gray-500" /> },
                        { label: "Về Chúng Tôi", icon: <Info className="w-4 h-4 text-gray-500" /> },
                        { label: "Tài Nguyên", icon: <BookOpen className="w-4 h-4 text-gray-500" /> },
                    ].map((item, idx) => (
                        <a
                            key={idx}
                            href="#"
                            className="flex items-center gap-2 relative text-gray-600 hover:text-teal-700 transition 
        after:content-[''] after:absolute after:left-1/2 after:bottom-0 
        after:w-0 after:h-[2px] after:bg-teal-700 after:transition-all after:duration-300 
        hover:after:w-full hover:after:left-0"
                        >
                            {item.icon}
                            {item.label}
                        </a>
                    ))}
                    <button
                        onClick={() => Navigate('/booking')}
                        className="flex items-center gap-2 relative text-gray-600 hover:text-teal-700 transition 
              after:content-[''] after:absolute after:left-1/2 after:bottom-0 
              after:w-0 after:h-[2px] after:bg-teal-700 after:transition-all after:duration-300 
              hover:after:w-full hover:after:left-0"
                    >
                        <Stethoscope className="w-4 h-4 text-gray-500" />
                        Đặt Lịch Khám
                    </button>
                </div>

                {/* Auth / User Avatar */}
                <div className="hidden md:flex items-center gap-4 relative">
                    {user ? (
                        <div className="relative">
                            {/* Avatar */}
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold"
                            >
                                {user.ten_nguoi_dung?.charAt(0) || <User className="w-5 h-5" />}
                            </button>

                            {/* Dropdown menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                        {user.ten_nguoi_dung}
                                    </div>
                                    <a
                                        href="/patient/profile"
                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                    >
                                        Profile
                                    </a>
                                    <a
                                        href="/patient/appointments"
                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                    >
                                        Lịch sử đặt lịch
                                    </a>
                                    <a
                                        href="/patient/my-invoices"
                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                    >
                                        Hoá đơn của tôi
                                    </a>
                                    {isAdmin && (
                                        <a
                                            href="/admin/dashboard"
                                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                        >
                                            Admin
                                        </a>)
                                    }
                                    <button
                                        onClick={onLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Đăng Xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={onLoginClick}
                                className="flex items-center gap-2 bg-teal-800 text-white px-6 py-2.5 rounded-full hover:bg-teal-900 transition"
                            >
                                <ArrowRight className="w-4 h-4" />
                                Đăng Nhập
                            </button>
                            <button
                                onClick={onRegisterClick}
                                className="flex items-center gap-2 bg-gray-200 text-teal-800 px-6 py-2.5 rounded-full hover:bg-gray-300 transition"
                            >
                                Đăng Ký
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-600"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden mt-4 pb-4 space-y-3 border-t pt-4">
                    {["Tìm Bác Sĩ", "Chuyên Khoa", "Dịch Vụ", "Về Chúng Tôi", "Tài Nguyên"].map(
                        (item, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="block text-gray-600 hover:text-teal-700"
                            >
                                {item}
                            </a>
                        )
                    )}
                    {user ? (
                        <>
                            <a
                                href="#profile"
                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            >
                                Profile
                            </a>
                            <a
                                href="#history"
                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            >
                                Lịch sử
                            </a>
                            <button
                                onClick={onLogout}
                                className="w-full bg-red-600 text-white px-6 py-2.5 rounded-full hover:bg-red-700"
                            >
                                Đăng Xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onLoginClick}
                                className="w-full bg-teal-800 text-white px-6 py-2.5 rounded-full hover:bg-teal-900"
                            >
                                Đăng Nhập
                            </button>
                            <button
                                onClick={onRegisterClick}
                                className="w-full bg-gray-200 text-teal-800 px-6 py-2.5 rounded-full hover:bg-gray-300"
                            >
                                Đăng Ký
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Nav;
