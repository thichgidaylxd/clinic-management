import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Users,
    AlertCircle,
    TrendingUp
} from 'lucide-react';
import { receptionistAPI } from '../../services/receptionistAPI';

function ReceptionistDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await receptionistAPI.getDashboardStats();
            setStats(response.data);
        } catch (error) {
            console.error('Load stats error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Tổng lịch hẹn',
            value: stats?.total || 0,
            icon: Calendar,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Chờ xác nhận',
            value: stats?.pending || 0,
            icon: Clock,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            label: 'Đã check-in',
            value: stats?.checked_in || 0,
            icon: Users,
            color: 'bg-teal-500',
            textColor: 'text-teal-600',
            bgColor: 'bg-teal-50'
        },
        {
            label: 'Hoàn thành',
            value: stats?.completed || 0,
            icon: CheckCircle,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Đã hủy',
            value: stats?.cancelled || 0,
            icon: XCircle,
            color: 'bg-red-500',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50'
        },
        {
            label: 'Không đến',
            value: stats?.no_show || 0,
            icon: AlertCircle,
            color: 'bg-gray-500',
            textColor: 'text-gray-600',
            bgColor: 'bg-gray-50'
        }
    ];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Lễ Tân</h1>
                <p className="text-gray-600">
                    Hôm nay: {new Date().toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                            <span className={`text-3xl font-bold ${stat.textColor}`}>
                                {stat.value}
                            </span>
                        </div>
                        <h3 className="text-gray-600 font-medium">{stat.label}</h3>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/receptionist/appointments"
                        className="p-4 border-2 border-gray-200 rounded-xl hover:border-teal-700 hover:bg-teal-50 transition group"
                    >
                        <Calendar className="w-8 h-8 text-teal-700 mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-1">Xem lịch hẹn</h3>
                        <p className="text-sm text-gray-600">Quản lý lịch hẹn hôm nay</p>
                    </a>
                    <a
                        href="/receptionist/queue"
                        className="p-4 border-2 border-gray-200 rounded-xl hover:border-teal-700 hover:bg-teal-50 transition group"
                    >
                        <Clock className="w-8 h-8 text-teal-700 mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-1">Hàng đợi</h3>
                        <p className="text-sm text-gray-600">Theo dõi hàng đợi bác sĩ</p>
                    </a>
                    <a
                        href="/receptionist/walk-in"
                        className="p-4 border-2 border-gray-200 rounded-xl hover:border-teal-700 hover:bg-teal-50 transition group"
                    >
                        <Users className="w-8 h-8 text-teal-700 mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-1">Khám trực tiếp</h3>
                        <p className="text-sm text-gray-600">Tạo lịch hẹn walk-in</p>
                    </a>
                </div >
            </div >
        </div >
    );
}

export default ReceptionistDashboard;