import React from 'react';
import { Calendar, Search, Clock, Phone, User } from 'lucide-react';

function AppointmentList({
    appointments,
    searchTerm,
    setSearchTerm,
    selectedAppointment,
    onSelectAppointment
}) {
    const filteredAppointments = appointments.filter(a =>
        a.ten_benh_nhan?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Lịch hẹn hôm nay ({filteredAppointments.length})
                    </h2>
                </div>

                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm bệnh nhân..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {filteredAppointments.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>Không có lịch hẹn</p>
                        </div>
                    ) : (
                        filteredAppointments.map((appt) => (
                            <div
                                key={appt.ma_lich_hen}
                                className={`p-4 border-b cursor-pointer transition-all hover:bg-gray-50 ${selectedAppointment?.ma_lich_hen === appt.ma_lich_hen ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                                    }`}
                                onClick={() => onSelectAppointment(appt)}
                            >
                                {/* Giữ nguyên nội dung item */}
                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{appt.ten_benh_nhan}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                            <Clock className="w-4 h-4" />
                                            {appt.gio_bat_dau.slice(0, 5)} - {appt.gio_ket_thuc.slice(0, 5)}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                            <Phone className="w-4 h-4" />
                                            {appt.so_dien_thoai_benh_nhan}
                                        </div>
                                        <div className="mt-2">
                                            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                {appt.ten_chuyen_khoa}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default AppointmentList;