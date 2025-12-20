import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function DoctorLayout() {
    const navigate = useNavigate();

    const menu = [
        { path: '/doctor/schedule', label: 'Lịch làm việc' },
        { path: '/doctor/examination', label: 'Khám bệnh' },
        { path: '/doctor/medical-records', label: 'Hồ sơ bệnh án' }
    ];

    return (
        <div className="h-screen flex bg-gray-100 overflow-hidden ">
            {/* ================= SIDEBAR ================= */}
            <aside className="w-64 bg-white border-r shadow-sm ">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-blue-700">
                        🩺 Doctor Panel
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Hệ thống quản lý khám bệnh
                    </p>
                </div>

                <nav className="p-4 space-y-2">
                    {menu.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-lg font-medium transition
                                ${isActive
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* LOGOUT (optional) */}
                <div className="absolute bottom-6 left-0 w-64 px-4">
                    <button
                        onClick={() => {
                            localStorage.clear();
                            navigate('/');
                        }}
                        className="w-full px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                    >
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 flex flex-col">
                {/* HEADER */}
                <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Bác sĩ
                    </h1>

                    <div className="text-sm text-gray-600">
                        Xin chào 👋
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <section className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}

export default DoctorLayout;
