import React, { useState, useEffect } from 'react';
import { Clock, Users, Bell, UserCheck, ChevronRight } from 'lucide-react';
import { receptionistAPI } from '../../services/receptionistAPI';
import { adminAPI } from '../../services/adminAPI';

function ReceptionistQueue() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [queue, setQueue] = useState([]);
    const [nextPatient, setNextPatient] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDoctors();
    }, []);

    useEffect(() => {
        if (selectedDoctor) {
            loadQueue();
            loadNext();
            // Auto refresh mỗi 30s
            const interval = setInterval(() => {
                loadQueue();
                loadNext();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [selectedDoctor]);

    const loadDoctors = async () => {
        try {
            const response = await adminAPI.getDoctors(1, 100);
            setDoctors(response.data.data || []);
            if (response.data.data.length > 0) {
                setSelectedDoctor(response.data.data[0].ma_bac_si);
            }
        } catch (error) {
            console.error('Load doctors error:', error);
        }
    };

    const loadQueue = async () => {
        if (!selectedDoctor) return;
        setLoading(true);
        try {
            const response = await receptionistAPI.getQueue(selectedDoctor);
            setQueue(response.data || []);
        } catch (error) {
            console.error('Load queue error:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadNext = async () => {
        if (!selectedDoctor) return;
        try {
            const response = await receptionistAPI.getNextAppointment(selectedDoctor);
            setNextPatient(response.data);
        } catch (error) {
            console.error('Load next error:', error);
        }
    };

    const handleCallNext = () => {
        if (nextPatient) {
            alert(`🔔 Mời bệnh nhân: ${nextPatient.ho_benh_nhan} ${nextPatient.ten_benh_nhan} vào khám`);
        }
    };

    const getPriorityBadge = (status) => {
        if (status === 2) return '🔴 Đã check-in';
        if (status === 1) return '🟡 Đã xác nhận';
        return '⚪ Chờ xác nhận';
    };

    const getWaitTime = (checkInTime) => {
        if (!checkInTime) return '';
        const minutes = Math.floor((Date.now() - new Date(checkInTime)) / 60000);
        if (minutes < 5) return '⏱️ Vừa đến';
        if (minutes < 15) return `⏱️ ${minutes} phút`;
        if (minutes < 30) return `⏱️ ${minutes} phút ⚠️`;
        return `⏱️ ${minutes} phút 🔴`;
    };

    const doctor = doctors.find(d => d.ma_bac_si === selectedDoctor);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Hàng đợi</h1>
                <p className="text-gray-600">Theo dõi hàng đợi bệnh nhân theo bác sĩ</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Doctor Selection */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Chọn Bác sĩ</h2>
                        <div className="space-y-2">
                            {doctors.map((d) => (
                                <button
                                    key={d.ma_bac_si}
                                    onClick={() => setSelectedDoctor(d.ma_bac_si)}
                                    className={`w-full p-4 rounded-xl text-left transition ${selectedDoctor === d.ma_bac_si
                                            ? 'bg-teal-700 text-white'
                                            : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    <div className="font-semibold mb-1">
                                        BS. {d.ho_nguoi_dung} {d.ten_nguoi_dung}
                                    </div>
                                    {d.chuyen_khoa && d.chuyen_khoa.length > 0 && (
                                        <div className={`text-sm ${selectedDoctor === d.ma_bac_si ? 'text-teal-100' : 'text-gray-600'
                                            }`}>
                                            {d.chuyen_khoa.map(ck => ck.ten_chuyen_khoa).join(', ')}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Queue List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Next Patient Card */}
                    {nextPatient && (
                        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium mb-2 opacity-90">🔔 BỆNH NHÂN TIẾP THEO</div>
                                    <h3 className="text-2xl font-bold mb-1">
                                        {nextPatient.ho_benh_nhan} {nextPatient.ten_benh_nhan}
                                    </h3>
                                    <p className="text-teal-100">Giờ hẹn: {nextPatient.gio_bat_dau?.substring(0, 5)}</p>
                                </div>
                                <button
                                    onClick={handleCallNext}
                                    className="px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition flex items-center gap-2"
                                >
                                    <Bell className="w-5 h-5" />
                                    Gọi vào
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Queue Stats */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Hàng đợi</h2>
                            {doctor && (
                                <span className="text-sm text-gray-600">
                                    BS. {doctor.ho_nguoi_dung} {doctor.ten_nguoi_dung}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-teal-50 rounded-xl">
                                <div className="text-3xl font-bold text-teal-700">
                                    {queue.filter(q => q.trang_thai_lich_hen === 2).length}
                                </div>
                                <div className="text-sm text-teal-600">Đã check-in</div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <div className="text-3xl font-bold text-blue-700">
                                    {queue.filter(q => q.trang_thai_lich_hen === 1).length}
                                </div>
                                <div className="text-sm text-blue-600">Đã xác nhận</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-gray-700">{queue.length}</div>
                                <div className="text-sm text-gray-600">Tổng số</div>
                            </div>
                        </div>

                        {/* Queue List */}
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-4 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-sm text-gray-600">Đang tải...</p>
                            </div>
                        ) : queue.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-600">Không có bệnh nhân trong hàng đợi</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {queue.map((patient, index) => (
                                    <div
                                        key={patient.ma_lich_hen}
                                        className={`p-4 rounded-xl border-2 transition ${patient.trang_thai_lich_hen === 2
                                                ? 'bg-teal-50 border-teal-200'
                                                : 'bg-white border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {/* Position */}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${patient.trang_thai_lich_hen === 2
                                                        ? 'bg-teal-600 text-white'
                                                        : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                    {index + 1}
                                                </div>

                                                {/* Patient Info */}
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {patient.ho_benh_nhan} {patient.ten_benh_nhan}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <span>📞 {patient.so_dien_thoai_benh_nhan}</span>
                                                        <span>•</span>
                                                        <span>🕐 {patient.gio_bat_dau?.substring(0, 5)}</span>
                                                        <span>•</span>
                                                        <span>{getPriorityBadge(patient.trang_thai_lich_hen)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Wait Time */}
                                            {patient.check_in_time && (
                                                <div className="text-sm font-medium text-gray-700">
                                                    {getWaitTime(patient.check_in_time)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReceptionistQueue;