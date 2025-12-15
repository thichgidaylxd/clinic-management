import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
    Filter,
    Search,
    MapPin,
    Stethoscope,
    AlertCircle,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';
import { doctorAPI } from '../../services/doctorAPI';

function Schedule() {
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        loadAppointments();
    }, [selectedDate]);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const response = await doctorAPI.getDashboard();
            console.log('Dashboard data:', response);
            setAppointments(response || []);
        } catch (error) {
            console.error('Load appointments error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calendar helpers
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                day: prevMonthLastDay - i,
                isCurrentMonth: false,
                date: new Date(year, month - 1, prevMonthLastDay - i)
            });
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                day,
                isCurrentMonth: true,
                date: new Date(year, month, day)
            });
        }

        // Next month days
        const remainingDays = 42 - days.length; // 6 rows × 7 days
        for (let day = 1; day <= remainingDays; day++) {
            days.push({
                day,
                isCurrentMonth: false,
                date: new Date(year, month + 1, day)
            });
        }

        return days;
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date) => {
        return date.toDateString() === selectedDate.toDateString();
    };

    const hasAppointments = (date) => {
        // TODO: Check if date has appointments
        return false;
    };

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today);
        setSelectedDate(today);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            0: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
            1: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
            2: { label: 'Đã check-in', color: 'bg-teal-100 text-teal-700', icon: CheckCircle },
            3: { label: 'Đang khám', color: 'bg-purple-100 text-purple-700', icon: Stethoscope },
            4: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: CheckCircle },
            5: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle },
            6: { label: 'Không đến', color: 'bg-gray-100 text-gray-700', icon: AlertCircle }
        };
        const s = statusMap[status] || statusMap[0];
        const Icon = s.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>
                <Icon className="w-3 h-3" />
                {s.label}
            </span>
        );
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.substring(0, 5);
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchStatus = filterStatus === 'all' || apt.trang_thai_lich_hen === parseInt(filterStatus);
        const matchSearch = searchKeyword === '' ||
            apt.ten_benh_nhan?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            apt.ho_benh_nhan?.toLowerCase().includes(searchKeyword.toLowerCase());
        return matchStatus && matchSearch;
    });

    const days = getDaysInMonth(currentMonth);
    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <CalendarIcon className="w-8 h-8 text-teal-600" />
                    Lịch Làm Việc
                </h1>
                <p className="text-gray-600 mt-1">
                    Quản lý lịch hẹn và thời gian làm việc
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={goToToday}
                                    className="px-4 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                >
                                    Hôm nay
                                </button>
                                <button
                                    onClick={previousMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {/* Week days */}
                            {weekDays.map(day => (
                                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                                    {day}
                                </div>
                            ))}

                            {/* Days */}
                            {days.map((dayObj, index) => {
                                const isCurrentMonth = dayObj.isCurrentMonth;
                                const isTodayDate = isToday(dayObj.date);
                                const isSelectedDate = isSelected(dayObj.date);
                                const hasApts = hasAppointments(dayObj.date);

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(dayObj.date)}
                                        className={`
                                            aspect-square p-2 rounded-xl text-center transition relative
                                            ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                                            ${isTodayDate ? 'bg-teal-100 text-teal-900 font-bold' : ''}
                                            ${isSelectedDate && !isTodayDate ? 'bg-teal-600 text-white font-bold' : ''}
                                            ${!isSelectedDate && !isTodayDate ? 'hover:bg-gray-100' : ''}
                                        `}
                                    >
                                        <span className="text-sm">{dayObj.day}</span>
                                        {hasApts && (
                                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-teal-600 rounded-full"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-2xl p-6 text-white">
                        <h3 className="text-lg font-bold mb-4">Tổng quan hôm nay</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-teal-100">Tổng lịch hẹn</span>
                                <span className="text-2xl font-bold">0</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-teal-100">Đã hoàn thành</span>
                                <span className="text-2xl font-bold">0</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-teal-100">Chờ khám</span>
                                <span className="text-2xl font-bold">0</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Ngày đã chọn</h3>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-600">
                                {selectedDate.toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                            <div className="pt-3 border-t">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Lịch hẹn:</span>
                                    <span className="font-semibold">{filteredAppointments.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Lịch hẹn ngày {selectedDate.toLocaleDateString('vi-VN')}
                    </h2>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    placeholder="Tìm theo tên bệnh nhân..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-64">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none appearance-none bg-white"
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="0">Chờ xác nhận</option>
                                    <option value="1">Đã xác nhận</option>
                                    <option value="2">Đã check-in</option>
                                    <option value="3">Đang khám</option>
                                    <option value="4">Hoàn thành</option>
                                    <option value="5">Đã hủy</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="text-center py-12">
                            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">
                                {searchKeyword || filterStatus !== 'all'
                                    ? 'Không tìm thấy lịch hẹn phù hợp'
                                    : 'Không có lịch hẹn nào trong ngày này'
                                }
                            </p>
                            <p className="text-sm text-gray-500">
                                Chọn ngày khác để xem lịch hẹn
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAppointments.map((apt) => (
                                <div
                                    key={apt.ma_lich_hen}
                                    className="border border-gray-200 rounded-xl p-4 hover:border-teal-600 hover:bg-teal-50 transition"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex items-center gap-2 text-teal-700 font-semibold">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        {formatTime(apt.gio_bat_dau)} - {formatTime(apt.gio_ket_thuc)}
                                                    </span>
                                                </div>
                                                {getStatusBadge(apt.trang_thai_lich_hen)}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium">
                                                        {apt.ho_benh_nhan} {apt.ten_benh_nhan}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Stethoscope className="w-4 h-4 text-gray-400" />
                                                    <span>{apt.ten_dich_vu}</span>
                                                </div>

                                                {apt.ten_phong_kham && (
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                        <span>{apt.ten_phong_kham}</span>
                                                    </div>
                                                )}

                                                {apt.ly_do_kham_lich_hen && (
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <AlertCircle className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm">{apt.ly_do_kham_lich_hen}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Schedule;