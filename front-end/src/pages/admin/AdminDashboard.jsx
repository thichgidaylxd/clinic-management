import React, { useState, useEffect } from 'react';
import {
    Users,
    Stethoscope,
    Calendar,
    TrendingUp,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        todayAppointments: 0,
        completedToday: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            // TODO: Call API to get stats
            setStats({
                totalPatients: 245,
                totalDoctors: 12,
                totalAppointments: 156,
                pendingAppointments: 8,
                todayAppointments: 15,
                completedToday: 7
            });
        } catch (error) {
            console.error('Load stats error:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Tổng bệnh nhân',
            value: stats.totalPatients,
            icon: <Users className="w-8 h-8" />,
            color: 'bg-blue-500',
            change: '+12%'
        },
        {
            title: 'Bác sĩ',
            value: stats.totalDoctors,
            icon: <Stethoscope className="w-8 h-8" />,
            color: 'bg-teal-500',
            change: '+2%'
        },
        {
            title: 'Lịch hẹn hôm nay',
            value: stats.todayAppointments,
            icon: <Calendar className="w-8 h-8" />,
            color: 'bg-purple-500',
            change: '+5%'
        },
        {
            title: 'Chờ xác nhận',
            value: stats.pendingAppointments,
            icon: <Clock className="w-8 h-8" />,
            color: 'bg-yellow-500',
            change: '-3%'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Dashboard
                </h1>
                <p className="text-gray-600">
                    Tổng quan hệ thống quản lý phòng khám
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} text-white p-3 rounded-lg`}>
                                {stat.icon}
                            </div>
                            <span className="text-green-600 text-sm font-medium">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Lịch hẹn gần đây
                    </h2>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-teal-700" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            Bệnh nhân #{i}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            08:00 - 08:30 • BS. Nguyễn Văn A
                                        </div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                    Chờ xác nhận
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Trạng thái hệ thống
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-gray-900">Database</span>
                            </div>
                            <span className="text-green-600 text-sm font-medium">Hoạt động</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-gray-900">API Server</span>
                            </div>
                            <span className="text-green-600 text-sm font-medium">Hoạt động</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-gray-900">Storage</span>
                            </div>
                            <span className="text-green-600 text-sm font-medium">75% Free</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;