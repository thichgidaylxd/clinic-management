import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../services/api';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';
import TimeSlotGrid from './TimeSlotGrid';

function Step4DateTime({
    doctorId,
    onNext,
    onBack,
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot
}) {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load slots khi chọn ngày
    useEffect(() => {
        if (selectedDate) {
            loadAvailableSlots();
        }
    }, [selectedDate, doctorId]);

    const loadAvailableSlots = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await bookingAPI.getAvailableSlots(
                doctorId,
                selectedDate,
                30 // slot duration
            );
            setAvailableSlots(response.data.availableSlots || []);
        } catch (err) {
            setError('Không thể tải lịch khám');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Tạo danh sách ngày (từ hôm nay + 30 ngày)
    const generateDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
                full: date.toISOString().split('T')[0], // YYYY-MM-DD
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                dayOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()],
                isToday: i === 0
            });
        }
        return dates;
    };

    const dates = generateDates();

    const handleDateSelect = (date) => {
        setSelectedDate(date.full);
        setSelectedTimeSlot(null); // Reset time slot khi đổi ngày
    };

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot);
    };

    const handleContinue = () => {
        if (!selectedDate || !selectedTimeSlot) {
            setError('Vui lòng chọn ngày và giờ khám');
            return;
        }
        onNext();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Chọn Ngày & Giờ Khám
            </h2>
            <p className="text-gray-600 mb-6">
                Chọn ngày và khung giờ phù hợp với bạn
            </p>

            {/* Date Picker */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <h3 className="font-bold text-gray-900">Chọn ngày</h3>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-4">
                    {dates.map((date) => (
                        <button
                            key={date.full}
                            onClick={() => handleDateSelect(date)}
                            className={`flex-shrink-0 p-4 rounded-xl border-2 transition-all min-w-[80px] ${selectedDate === date.full
                                    ? 'border-teal-700 bg-teal-50 ring-2 ring-teal-200'
                                    : 'border-gray-200 hover:border-teal-300'
                                }`}
                        >
                            <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">{date.dayOfWeek}</div>
                                <div className="text-2xl font-bold text-gray-900">{date.day}</div>
                                <div className="text-xs text-gray-500">Th{date.month}</div>
                                {date.isToday && (
                                    <div className="mt-1 text-xs font-medium text-teal-700">
                                        Hôm nay
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">⏰</span>
                        </div>
                        <h3 className="font-bold text-gray-900">Chọn giờ khám</h3>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
                            <span className="ml-3 text-gray-600">Đang tải lịch...</span>
                        </div>
                    ) : (
                        <TimeSlotGrid
                            slots={availableSlots}
                            selectedSlot={selectedTimeSlot}
                            onSelect={handleTimeSlotSelect}
                        />
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Selected Info */}
            {selectedDate && selectedTimeSlot && (
                <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <h4 className="font-bold text-teal-900 mb-2">Thời gian đã chọn:</h4>
                    <p className="text-teal-700">
                        📅 {selectedDate} • ⏰ {selectedTimeSlot.start} - {selectedTimeSlot.end}
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between gap-4">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                    Quay lại
                </button>

                <button
                    onClick={handleContinue}
                    disabled={!selectedDate || !selectedTimeSlot}
                    className="px-8 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}

export default Step4DateTime;