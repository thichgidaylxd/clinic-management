import React from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

function TimeSlotGrid({ slots, selectedSlot, onSelect }) {
    // Group slots by morning/afternoon/evening
    const groupedSlots = {
        morning: slots.filter(slot => {
            const hour = parseInt(slot.start.split(':')[0]);
            return hour >= 6 && hour < 12;
        }),
        afternoon: slots.filter(slot => {
            const hour = parseInt(slot.start.split(':')[0]);
            return hour >= 12 && hour < 18;
        }),
        evening: slots.filter(slot => {
            const hour = parseInt(slot.start.split(':')[0]);
            return hour >= 18 && hour < 24;
        })
    };

    const SlotButton = ({ slot }) => {
        const isSelected = selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;
        const isAvailable = slot.status === 'available';

        return (
            <button
                onClick={() => isAvailable && onSelect(slot)}
                disabled={!isAvailable}
                className={`p-4 rounded-lg border-2 transition-all ${isSelected
                        ? 'border-teal-700 bg-teal-50 ring-2 ring-teal-200'
                        : isAvailable
                            ? 'border-gray-200 hover:border-teal-300 hover:shadow-md'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
            >
                <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${isAvailable ? 'text-gray-900' : 'text-gray-400'}`}>
                        {slot.start}
                    </span>
                    {isAvailable ? (
                        <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-teal-700' : 'text-green-500'}`} />
                    ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                    )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{slot.start} - {slot.end}</span>
                </div>
                <div className="mt-2">
                    <span className={`text-xs font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {isAvailable ? 'Còn trống' : 'Đã đặt'}
                    </span>
                </div>
            </button>
        );
    };

    const TimeSection = ({ title, slots, icon }) => {
        if (slots.length === 0) return null;

        return (
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <span className="text-sm text-gray-500">
                        ({slots.filter(s => s.status === 'available').length}/{slots.length} slots)
                    </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {slots.map((slot, index) => (
                        <SlotButton key={index} slot={slot} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <TimeSection
                title="Buổi sáng (6:00 - 12:00)"
                slots={groupedSlots.morning}
                icon={<div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🌅</span>
                </div>}
            />

            <TimeSection
                title="Buổi chiều (12:00 - 18:00)"
                slots={groupedSlots.afternoon}
                icon={<div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">☀️</span>
                </div>}
            />

            <TimeSection
                title="Buổi tối (18:00 - 24:00)"
                slots={groupedSlots.evening}
                icon={<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🌙</span>
                </div>}
            />

            {slots.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                        Bác sĩ không có lịch làm việc trong ngày này
                    </p>
                </div>
            )}
        </div>
    );
}

export default TimeSlotGrid;