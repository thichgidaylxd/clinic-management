import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Clock,
    UserPlus,
    Menu,
    X,
    LogOut,
    ClipboardList
} from 'lucide-react';

function ReceptionistLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            navigate('/');
            return;
        }

        const userData = JSON.parse(storedUser);

        // Check if user is Receptionist
        if (userData.ten_vai_tro !== 'Lễ tân') {
            alert('Bạn không có quyền truy cập trang này');
            navigate('/');
            return;
        }

        setUser(userData);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const menuItems = [
        {
            path: '/receptionist/dashboard',
            label: 'Tổng quan',
            icon: <LayoutDashboard className="w-5 h-5" />
        },
        {
            path: '/receptionist/appointments',
            label: 'Lịch hẹn hôm nay',
            icon: <Calendar className="w-5 h-5" />
        },
        {
            path: '/receptionist/queue',
            label: 'Hàng đợi',
            icon: <Clock className="w-5 h-5" />
        },
        {
            path: '/receptionist/patients',
            label: 'Bệnh nhân',
            icon: <Users className="w-5 h-5" />
        },
        {
            path: '/receptionist/walk-in',
            label: 'Khám trực tiếp',
            icon: <UserPlus className="w-5 h-5" />
        }
    ];

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } bg-white border-r border-gray-200 w-64`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                            <ClipboardList className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl text-gray-900">Lễ Tân</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Menu */}
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                        ? 'bg-teal-50 text-teal-600 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.ten_nguoi_dung?.charAt(0) || 'L'}
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">
                                {user.ho_nguoi_dung} {user.ten_nguoi_dung}
                            </div>
                            <div className="text-xs text-gray-500">{user.ten_vai_tro}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`${sidebarOpen ? 'lg:ml-64' : ''} transition-all`}>
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                Xin chào, <span className="font-medium">{user.ho_nguoi_dung} {user.ten_nguoi_dung}</span>
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}

export default ReceptionistLayout;