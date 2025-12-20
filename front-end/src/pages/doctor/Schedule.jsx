import React, { useEffect, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Building2,
    CheckCircle2
} from 'lucide-react';
import { doctorAPI } from '../../services/doctorAPI';

/* ===== Helpers xử lý ngày (FIX UTC) ===== */
const toLocalDateKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay() || 7; // CN = 7
    if (day !== 1) d.setDate(d.getDate() - (day - 1));
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const formatHeaderDate = (date) =>
    date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function WorkSchedule() {
    const [schedules, setSchedules] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const res = await doctorAPI.getMyWorkSchedule();
            setSchedules(res.data || []);
        } finally {
            setLoading(false);
        }
    };

    /* Group lịch theo ngày (LOCAL DATE – KHÔNG LỖI) */
    const scheduleByDate = schedules.reduce((acc, s) => {
        const key = toLocalDateKey(s.ngay_lich_lam_viec);
        if (!acc[key]) acc[key] = [];
        acc[key].push(s);
        return acc;
    }, {});

    const formatTime = (time) => {
        if (!time) return '';
        return time.slice(0, 5); // "08:00:00" → "08:00"
    };


    const daysOfWeek = [...Array(7)].map((_, i) => addDays(currentWeek, i));

    if (loading) {
        return (
            <div className="flex justify-center py-20 text-gray-500">
                Đang tải lịch làm việc...
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                    className="p-2 hover:bg-gray-200 rounded"
                >
                    <ChevronLeft />
                </button>

                <h2 className="text-lg font-semibold">
                    Tuần {formatHeaderDate(daysOfWeek[0])} – {formatHeaderDate(daysOfWeek[6])}
                </h2>

                <button
                    onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                    className="p-2 hover:bg-gray-200 rounded"
                >
                    <ChevronRight />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {daysOfWeek.map((day, idx) => {
                    const key = toLocalDateKey(day);
                    const daySchedules = scheduleByDate[key] || [];

                    return (
                        <div
                            key={key}
                            className="bg-white rounded-lg border p-2 min-h-[120px]"
                        >
                            {/* Day header */}
                            <div className="text-center mb-2">
                                <div className="text-xs text-gray-500">
                                    {weekDays[idx]}
                                </div>
                                <div className="font-semibold text-sm">
                                    {day.getDate()}
                                </div>
                            </div>

                            {/* Events */}
                            <div className="space-y-1">
                                {daySchedules.map((s) => (
                                    <div
                                        key={s.ma_lich_lam_viec}
                                        className="bg-blue-50 border border-blue-200 rounded p-1 text-xs"
                                    >
                                        <div className="flex items-center gap-1 text-blue-700 font-medium">
                                            <Clock className="w-3 h-3" />
                                            {formatTime(s.thoi_gian_bat_dau_lich_lam_viec)}
                                            {' - '}
                                            {formatTime(s.thoi_gian_ket_thuc_lich_lam_viec)}
                                        </div>

                                        <div className="flex items-center gap-1 text-gray-600 mt-0.5">
                                            <Building2 className="w-3 h-3" />
                                            {s.ten_phong_kham}
                                        </div>

                                        {s.trang_thai_lich_lam_viec === 1 && (
                                            <div className="flex items-center gap-1 text-green-600 mt-0.5">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Hoạt động
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default WorkSchedule;
