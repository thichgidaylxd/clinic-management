import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Stethoscope,
    FileText,
    Pill
} from 'lucide-react';
import { doctorAPI } from '../../services/doctorAPI';
import { useNavigate } from 'react-router-dom';

function DoctorDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [dashboardData, todayData] = await Promise.all([
                doctorAPI.getDashboard(),
                doctorAPI.getTodayAppointments()
            ]);

            setStats(dashboardData.data);
            setTodayAppointments(todayData.data || []);
        } catch (error) {
            console.error('Load dashboard error:', error);
            alert('Không thể tải dữ liệu dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            0: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
            1: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' },
            2: { label: 'Đã check-in', color: 'bg-teal-100 text-teal-700' },
            3: { label: 'Đang khám', color: 'bg-purple-100 text-purple-700' },
            4: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
            5: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
            6: { label: 'Không đến', color: 'bg-gray-100 text-gray-700' }
        };
        const s = statusMap[status] || statusMap[0];
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>
                {s.label}
            </span>
        );
    };

    // ⭐ NEW: Handle start examination
    const handleStartExam = (appointment) => {
        // Check if appointment is ready for examination
        if (appointment.trang_thai_lich_hen === 2) {
            // CHECKED_IN - Ready to start
            navigate(`/doctor/prescription/${appointment.ma_lich_hen}`);
        } else if (appointment.trang_thai_lich_hen === 3) {
            // IN_PROGRESS - Continue examination
            navigate(`/doctor/prescription/${appointment.ma_lich_hen}`);
        } else {
            alert('Bệnh nhân chưa check-in. Vui lòng đợi lễ tân check-in.');
        }
    };

    // ⭐ NEW: Get action button for appointment
    const getActionButton = (appointment) => {
        const status = appointment.trang_thai_lich_hen;

        if (status === 2) {
            // CHECKED_IN - Can start exam
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStartExam(appointment);
                    }}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-medium flex items-center gap-2"
                >
                    <Pill className="w-4 h-4" />
                    Kê đơn thuốc
                </button>
            );
        } else if (status === 3) {
            // IN_PROGRESS - Continue exam
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStartExam(appointment);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium flex items-center gap-2"
                >
                    <FileText className="w-4 h-4" />
                    Tiếp tục khám
                </button>
            );
        } else if (status === 4) {
            // COMPLETED - View invoice
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to invoice if you have invoice ID
                        // navigate(`/invoices/${appointment.ma_hoa_don}`);
                        alert('Đã hoàn thành khám');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2"
                >
                    <CheckCircle className="w-4 h-4" />
                    Xem hóa đơn
                </button>
            );
        } else if (status === 1) {
            // CONFIRMED - Waiting for check-in
            return (
                <span className="text-sm text-gray-500">
                    Chờ check-in
                </span>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Bác sĩ</h1>
                <p className="text-gray-600 mt-1">
                    {new Date().toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Lịch hẹn hôm nay */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {stats?.today?.total || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Lịch hẹn hôm nay</div>
                </div>

                {/* Chờ khám */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-teal-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {stats?.waitingPatients || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Bệnh nhân chờ khám</div>
                </div>

                {/* Đã khám */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {stats?.completedToday || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Đã khám hôm nay</div>
                </div>

                {/* Tổng tuần này */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {stats?.weekTotal || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Tổng tuần này</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => navigate('/doctor/examination')}
                    className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition flex items-center gap-4"
                >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Stethoscope className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-lg">Bắt đầu khám bệnh</div>
                        <div className="text-sm text-teal-100">Xem danh sách chờ khám</div>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/doctor/schedule')}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-teal-600 hover:bg-teal-50 transition flex items-center gap-4"
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-lg text-gray-900">Lịch làm việc</div>
                        <div className="text-sm text-gray-600">Xem lịch của tôi</div>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/doctor/medical-records')}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-teal-600 hover:bg-teal-50 transition flex items-center gap-4"
                >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-lg text-gray-900">Hồ sơ bệnh án</div>
                        <div className="text-sm text-gray-600">Quản lý hồ sơ</div>
                    </div>
                </button>
            </div>

            {/* Today's Appointments - UPDATED */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Lịch hẹn hôm nay</h2>
                    <button
                        onClick={() => navigate('/doctor/examination')}
                        className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                    >
                        Xem tất cả →
                    </button>
                </div>

                {todayAppointments.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Không có lịch hẹn nào hôm nay</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {todayAppointments.slice(0, 5).map((apt) => (
                            <div
                                key={apt.ma_lich_hen}
                                className="border border-gray-200 rounded-xl p-4 hover:border-teal-600 hover:bg-teal-50 transition"
                            >
                                <div className="flex items-center justify-between">
                                    {/* Left: Time + Patient Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="font-semibold text-gray-900">
                                                {apt.gio_bat_dau?.substring(0, 5)}
                                            </span>
                                        </div>
                                        <div className="h-6 w-px bg-gray-200"></div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {apt.ho_benh_nhan} {apt.ten_benh_nhan}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {apt.ly_do_kham_lich_hen || 'Khám tổng quát'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Status + Action Button */}
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(apt.trang_thai_lich_hen)}
                                        {getActionButton(apt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ⭐ NEW: Quick Stats Summary */}
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Tóm tắt hôm nay</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <div className="text-2xl font-bold">
                            {todayAppointments.filter(a => a.trang_thai_lich_hen === 2).length}
                        </div>
                        <div className="text-sm text-teal-100">Chờ khám</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">
                            {todayAppointments.filter(a => a.trang_thai_lich_hen === 3).length}
                        </div>
                        <div className="text-sm text-teal-100">Đang khám</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">
                            {todayAppointments.filter(a => a.trang_thai_lich_hen === 4).length}
                        </div>
                        <div className="text-sm text-teal-100">Đã hoàn thành</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard;