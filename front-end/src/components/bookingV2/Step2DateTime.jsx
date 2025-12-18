import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, Loader2, Info } from 'lucide-react';
import { bookingAPI } from '../../services/api';

function Step2DateTime({ service, specialty, onNext, onBack }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState({ start: '', end: '' });
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        if (selectedDate && specialty) {
            loadAvailableSlotsOptimized();
        }
    }, [selectedDate, specialty]);

    /**
     * OPTIMIZED STRATEGY:
     * 1. Generate all possible slots (8:00-17:00)
     * 2. Batch check slots (mỗi lần check 1 batch lớn thay vì từng slot)
     * 3. Hiển thị progress để UX tốt hơn
     */
    const loadAvailableSlotsOptimized = async () => {
        setLoading(true);
        setError('');
        setSelectedTime({ start: '', end: '' });
        setLoadingProgress(0);

        try {
            console.log('🔍 Starting optimized slot search...');

            // Step 1: Generate all possible time slots
            const allSlots = generateTimeSlots();
            const totalSlots = allSlots.length;

            console.log(`📋 Total slots to check: ${totalSlots}`);

            // Step 2: Batch processing - chia thành các nhóm
            const BATCH_SIZE = 6; // Check 6 slots cùng lúc
            const batches = [];

            for (let i = 0; i < allSlots.length; i += BATCH_SIZE) {
                batches.push(allSlots.slice(i, i + BATCH_SIZE));
            }

            console.log(`📦 Split into ${batches.length} batches`);

            const availableResults = [];

            // Step 3: Process each batch
            for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
                const batch = batches[batchIndex];

                // Update progress
                const progress = Math.round(((batchIndex + 1) / batches.length) * 100);
                setLoadingProgress(progress);

                // Check all slots in this batch concurrently
                const batchPromises = batch.map(slot => checkSlotAvailability(slot));
                const batchResults = await Promise.all(batchPromises);

                // Collect available slots
                batchResults.forEach(result => {
                    if (result && result.hasDoctor) {
                        availableResults.push(result.slot);
                    }
                });

                console.log(`✓ Batch ${batchIndex + 1}/${batches.length} done - Found ${availableResults.length} slots so far`);
            }

            setLoadingProgress(100);

            // Sort by time
            availableResults.sort((a, b) => a.start.localeCompare(b.start));

            console.log(`✅ Search complete! Found ${availableResults.length}/${totalSlots} available slots`);

            setAvailableSlots(availableResults);

            if (availableResults.length === 0) {
                setError('Không có giờ trống nào trong ngày này. Vui lòng chọn ngày khác.');
            }

        } catch (err) {
            console.error('❌ Error loading slots:', err);
            setError(err.message || 'Có lỗi xảy ra khi tải giờ trống');
            setAvailableSlots([]);
        } finally {
            setLoading(false);
            setLoadingProgress(0);
        }
    };

    /**
     * Check if a slot has available doctors
     */
    const checkSlotAvailability = async (slot) => {
        try {
            const params = {
                date: selectedDate,
                startTime: slot.start,
                endTime: slot.end,
                specialtyId: specialty.ma_chuyen_khoa
            };

            const doctorsData = await bookingAPI.getAvailableDoctors(params);
            console.log(`Checked slot ${slot.start}-${slot.end}:`, doctorsData);
            if (doctorsData.data && doctorsData.data.length > 0) {
                return {
                    slot: {
                        ...slot,
                        doctorCount: doctorsData.data.length
                    },
                    hasDoctor: true
                };
            }

            return { hasDoctor: false };
        } catch (error) {
            console.error(`Error checking slot ${slot.start}-${slot.end}:`, error);
            return { hasDoctor: false };
        }
    };

    /**
     * Generate all possible time slots (8:00 - 17:00, 30min each)
     */
    const generateTimeSlots = (date = new Date()) => {
        const slots = [];
        const defaultStartHour = 8;
        const endHour = 17;
        const slotDuration = 30;

        const now = new Date();
        const isToday =
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate();

        let startHour = defaultStartHour;
        let skipFirstHalf = false;

        if (isToday) {
            startHour = now.getHours();
            // Nếu phút >= 30 thì bỏ slot :00–:30 của giờ hiện tại
            if (now.getMinutes() >= 30) {
                skipFirstHalf = true;
            }
        }

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += slotDuration) {
                // Nếu là giờ hiện tại và cần bỏ slot đầu tiên
                if (skipFirstHalf && hour === startHour && minute === 0) {
                    continue;
                }

                const startTime = `${String(hour).padStart(2, "0")}:${String(
                    minute
                ).padStart(2, "0")}`;

                const endMinute = minute + slotDuration;
                const endHourCalc = endMinute >= 60 ? hour + 1 : hour;
                const endTime = `${String(endHourCalc).padStart(2, "0")}:${String(
                    endMinute % 60
                ).padStart(2, "0")}`;

                slots.push({
                    start: startTime,
                    end: endTime,
                });
            }
        }

        return slots;
    };




    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        return maxDate.toISOString().split('T')[0];
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setError('');
    };

    const handleTimeSelect = (slot) => {
        setSelectedTime({
            start: slot.start,
            end: slot.end
        });
        setError('');
    };

    const handleNext = () => {
        if (!selectedDate) {
            setError('Vui lòng chọn ngày khám');
            return;
        }

        if (!selectedTime.start) {
            setError('Vui lòng chọn giờ khám');
            return;
        }

        onNext({
            date: selectedDate,
            timeSlot: selectedTime
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTimeSlot = (startTime, endTime) => {
        return `${startTime} - ${endTime}`;
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Chọn Ngày & Giờ Khám
            </h2>
            <p className="text-gray-600 mb-6">
                Chọn ngày và giờ bạn muốn đến khám - Chỉ hiển thị giờ còn trống
            </p>

            {/* Info Alert */}
            <div div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3" >
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-blue-700 text-sm">
                    Hệ thống sẽ kiểm tra tất cả khung giờ từ 8:00 - 17:00 để tìm giờ trống cho bạn
                </p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )
            }

            {/* Date Picker */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Chọn Ngày
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {selectedDate && !loading && (
                    <p className="mt-2 text-sm text-gray-600">
                        {formatDate(selectedDate)}
                    </p>
                )}
            </div>

            {/* Time Slots */}
            {
                selectedDate && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            <Clock className="w-5 h-5 inline mr-2" />
                            Chọn Giờ Khả Dụng
                        </label>

                        {/* Loading State with Progress */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                                <div className="text-center space-y-2">
                                    <p className="text-gray-700 font-medium">Đang tìm giờ trống...</p>
                                    <p className="text-sm text-gray-500">Đang kiểm tra lịch bác sĩ</p>

                                    {/* Progress Bar */}
                                    <div className="w-64 mx-auto mt-4">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Tiến độ</span>
                                            <span>{loadingProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${loadingProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Available Slots */}
                        {!loading && availableSlots.length > 0 && (
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Tìm thấy <span className="font-bold text-teal-700 text-lg">{availableSlots.length}</span> khung giờ trống
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        30 phút/slot
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                                    {availableSlots.map((slot, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleTimeSelect(slot)}
                                            className={`
                                            relative px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium
                                            ${selectedTime.start === slot.start
                                                    ? 'border-teal-600 bg-teal-600 text-white shadow-lg scale-105'
                                                    : 'border-gray-300 bg-white hover:border-teal-400 hover:bg-teal-50 text-gray-700 hover:shadow-md'
                                                }
                                        `}
                                        >
                                            <div className="font-semibold">{formatTimeSlot(slot.start, slot.end)}</div>
                                            {slot.doctorCount && (
                                                <div className={`text-xs mt-1 ${selectedTime.start === slot.start ? 'text-teal-100' : 'text-gray-500'}`}>
                                                    {slot.doctorCount} bác sĩ
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && availableSlots.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2 font-medium text-lg">Không có giờ trống</p>
                                <p className="text-sm text-gray-400">Vui lòng chọn ngày khác để tìm giờ phù hợp</p>
                            </div>
                        )}
                    </div>
                )
            }

            {/* Selected Summary */}
            {
                selectedDate && selectedTime.start && !loading && (
                    <div className="mt-6 p-5 bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-300 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-600 mb-2 font-medium">✓ Bạn đã chọn:</p>
                        <div className="space-y-1">
                            <p className="font-bold text-gray-900 text-lg">
                                📅 {formatDate(selectedDate)}
                            </p>
                            <p className="font-bold text-teal-700 text-lg">
                                🕐 {selectedTime.start} - {selectedTime.end}
                            </p>
                        </div>
                    </div>
                )
            }

            {/* Action Buttons */}
            <div className="flex justify-between gap-4 mt-6">
                <button
                    onClick={onBack}
                    disabled={loading}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Quay lại
                </button>

                <button
                    onClick={handleNext}
                    disabled={!selectedDate || !selectedTime.start || loading}
                    className="px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
                >
                    Tiếp tục
                </button>
            </div>
        </div >
    );
}

export default Step2DateTime;