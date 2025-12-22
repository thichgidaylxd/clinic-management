import React, { useEffect, useState } from 'react';
import { Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { bookingAPI } from '../../services/api';

function Step2DateTime({
    specialty,
    onNext,
    onBack,
    initialDate,
    initialTimeSlot
}) {
    const [selectedDate, setSelectedDate] = useState(initialDate || '');
    const [selectedSlot, setSelectedSlot] = useState(initialTimeSlot || null);

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (initialDate) {
            setSelectedDate(initialDate);
        }
        if (initialTimeSlot) {
            setSelectedSlot(initialTimeSlot);
        }
    }, [initialDate, initialTimeSlot]);

    useEffect(() => {
        if (selectedDate && specialty?.ma_chuyen_khoa) {
            loadSlots();
        }
    }, [selectedDate, specialty?.ma_chuyen_khoa]);
    const isToday = (dateStr) => {
        const today = new Date();
        const selected = new Date(dateStr);

        return (
            today.getFullYear() === selected.getFullYear() &&
            today.getMonth() === selected.getMonth() &&
            today.getDate() === selected.getDate()
        );
    };

    const timeToMinutes = (time) => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    };

    const loadSlots = async () => {
        setLoading(true);
        setError('');
        setSlots([]);

        try {
            const res = await bookingAPI.getAvailableSlotsV2({
                date: selectedDate,
                specialtyId: specialty.ma_chuyen_khoa
            });

            let data = res.data || [];

            // Nếu là hôm nay → chỉ lấy slot sau thời điểm hiện tại
            if (isToday(selectedDate)) {
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                data = data.filter(slot => timeToMinutes(slot.start) > currentMinutes);
            }

            setSlots(data);

            // ✅ GIỮ LẠI SLOT CŨ NẾU CÒN TỒN TẠI
            setSelectedSlot(prev =>
                prev &&
                    data.some(
                        s => s.start === prev.start && s.end === prev.end
                    )
                    ? prev
                    : null
            );

            if (data.length === 0) {
                setError('Không có khung giờ trống phù hợp trong ngày này');
            }
        } catch (err) {
            console.error(err);
            setError('Không thể tải khung giờ');
        } finally {
            setLoading(false);
        }
    };

    const isSunday = (dateStr) => {
        const date = new Date(dateStr);
        return date.getDay() === 0; // 0 = Sunday
    };


    const handleNext = () => {
        if (!selectedSlot) {
            setError('Vui lòng chọn khung giờ');
            return;
        }

        onNext({
            date: selectedDate,
            timeSlot: {
                start: selectedSlot.start,
                end: selectedSlot.end
            }
        });
    };

    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Chọn Ngày & Giờ Khám
            </h2>
            <p className="text-gray-600 mb-6">
                Các khung giờ hiển thị là những khung còn bác sĩ làm việc
            </p>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* DATE */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Chọn ngày
                </label>
                <input
                    type="date"
                    min={minDate}
                    value={selectedDate}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (isSunday(value)) {
                            setError('Không nhận khám vào ngày Chủ nhật');
                            setSelectedDate('');
                            setSlots([]);
                            setSelectedSlot(null);
                            return;
                        }

                        setError('');
                        setSelectedDate(value);
                    }}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:border-teal-600"
                />

            </div>

            {/* SLOTS */}
            {selectedDate && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        <Clock className="w-5 h-5 inline mr-2" />
                        Chọn giờ
                    </label>

                    {loading && (
                        <div className="flex flex-col items-center py-10">
                            <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-3" />
                            <p className="text-gray-600">Đang tải khung giờ...</p>
                        </div>
                    )}

                    {!loading && slots.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3 bg-gray-50 border rounded-xl">
                            {slots.map((slot, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`
                                        px-4 py-3 border-2 rounded-lg text-sm font-medium transition
                                        ${selectedSlot?.start === slot.start
                                            ? 'bg-teal-600 text-white border-teal-600 scale-105'
                                            : 'bg-white border-gray-300 hover:border-teal-400'
                                        }
                                    `}
                                >
                                    <div>{slot.start} - {slot.end}</div>
                                    <div className="text-xs opacity-80 mt-1">
                                        {slot.doctorCount} bác sĩ
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-between gap-4 mt-8">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50"
                >
                    Quay lại
                </button>

                <button
                    onClick={handleNext}
                    disabled={!selectedSlot}
                    className="px-8 py-3 bg-teal-600 text-white rounded-xl disabled:opacity-50"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}

export default Step2DateTime;
