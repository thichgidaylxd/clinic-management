import React, { useEffect, useState } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Activity,
    CheckCircle2,
    XCircle,
    Loader2,
    CalendarDays,
    Building2,
    Filter,
    ChevronRight
} from 'lucide-react';
import { doctorAPI } from '../../services/doctorAPI';

function WorkSchedule() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, inactive

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const res = await doctorAPI.getMyWorkSchedule();
            setSchedules(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('vi-VN', options);
    };

    const formatShortDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return days[date.getDay()];
    };

    // Filter schedules
    const filteredSchedules = schedules.filter(schedule => {
        if (filter === 'active') return schedule.trang_thai_lich_lam_viec === 1;
        if (filter === 'inactive') return schedule.trang_thai_lich_lam_viec === 0;
        return true;
    });

    // Group by date
    const groupedSchedules = filteredSchedules.reduce((acc, schedule) => {
        const date = formatShortDate(schedule.ngay_lich_lam_viec);
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(schedule);
        return acc;
    }, {});

    // Statistics
    const totalSchedules = schedules.length;
    const activeSchedules = schedules.filter(s => s.trang_thai_lich_lam_viec === 1).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Đang tải lịch làm việc...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                    <CalendarDays className="w-8 h-8 text-blue-600" />
                                    Lịch Làm Việc
                                </h1>
                                <p className="text-gray-600 mt-1">Quản lý lịch làm việc của bạn</p>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500 p-3 rounded-lg">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-700 font-medium">Tổng ca làm</p>
                                        <p className="text-2xl font-bold text-blue-900">{totalSchedules}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500 p-3 rounded-lg">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-green-700 font-medium">Đang hoạt động</p>
                                        <p className="text-2xl font-bold text-green-900">{activeSchedules}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-500 p-3 rounded-lg">
                                        <Activity className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-700 font-medium">Tỷ lệ hoạt động</p>
                                        <p className="text-2xl font-bold text-purple-900">
                                            {totalSchedules > 0 ? Math.round((activeSchedules / totalSchedules) * 100) : 0}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Tất cả ({totalSchedules})
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'active'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Đang hoạt động ({activeSchedules})
                            </button>
                            <button
                                onClick={() => setFilter('inactive')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'inactive'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Ngừng hoạt động ({totalSchedules - activeSchedules})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Schedule List */}
                {filteredSchedules.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <CalendarDays className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg mb-2">Không có lịch làm việc</p>
                        <p className="text-gray-400">
                            {filter === 'active' && 'Không có ca làm việc đang hoạt động'}
                            {filter === 'inactive' && 'Không có ca làm việc ngừng hoạt động'}
                            {filter === 'all' && 'Chưa có lịch làm việc nào được tạo'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedSchedules).map(([date, daySchedules]) => (
                            <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Date Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-lg">
                                                {formatDate(daySchedules[0].ngay_lich_lam_viec)}
                                            </p>
                                            <p className="text-blue-100 text-sm">
                                                {daySchedules.length} ca làm việc
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule Items */}
                                <div className="divide-y divide-gray-200">
                                    {daySchedules.map((schedule) => (
                                        <div
                                            key={schedule.ma_lich_lam_viec}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 space-y-3">
                                                    {/* Time */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-blue-100 p-2 rounded-lg">
                                                            <Clock className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Thời gian</p>
                                                            <p className="font-semibold text-gray-900">
                                                                {schedule.thoi_gian_bat_dau_lich_lam_viec} - {schedule.thoi_gian_ket_thuc_lich_lam_viec}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Room */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-purple-100 p-2 rounded-lg">
                                                            <Building2 className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Phòng khám</p>
                                                            <p className="font-semibold text-gray-900">
                                                                {schedule.ten_phong_kham}
                                                                {schedule.so_phong_kham && (
                                                                    <span className="text-gray-500 font-normal">
                                                                        {' '}(Phòng {schedule.so_phong_kham})
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <div>
                                                    {schedule.trang_thai_lich_lam_viec === 1 ? (
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            <span className="font-medium text-sm">Đang hoạt động</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
                                                            <XCircle className="w-4 h-4" />
                                                            <span className="font-medium text-sm">Ngừng hoạt động</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorkSchedule;