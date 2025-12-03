import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

function Nav({ onLoginClick, onRegisterClick, onLogout, user }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white rounded"></div>
                    </div>
                    <span className="text-2xl font-semibold text-gray-800">MedSphere</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {["Tìm Bác Sĩ", "Chuyên Khoa", "Dịch Vụ", "Về Chúng Tôi", "Tài Nguyên"].map(
                        (item, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="relative text-gray-600 hover:text-teal-700 transition 
                  after:content-[''] after:absolute after:left-1/2 after:bottom-0 
                  after:w-0 after:h-[2px] after:bg-teal-700 after:transition-all after:duration-300 
                  hover:after:w-full hover:after:left-0"
                            >
                                {item}
                            </a>
                        )
                    )}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <button
                            onClick={onLogout}
                            className="bg-red-600 text-white px-6 py-2.5 rounded-full hover:bg-red-700 transition"
                        >
                            Đăng Xuất
                        </button>
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
                        <button
                            onClick={onLogout}
                            className="w-full bg-red-600 text-white px-6 py-2.5 rounded-full hover:bg-red-700"
                        >
                            Đăng Xuất
                        </button>
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
