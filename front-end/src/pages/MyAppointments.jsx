import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Phone, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import CancelModal from '../components/appointments/CancelModal';

function MyAppointments() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Check login
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        if (!token || !user) {
            navigate('/');
            return;
        }
        loadAppointments();
    }, [filterStatus]);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await bookingAPI.getMyAppointments(token, filterStatus);
            setAppointments(response.data.data || []);
        } catch (err) {
            setError('Không thể tải danh sách lịch hẹn');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            0: { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
            1: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="w-4 h-4" /> },
            2: { text: 'Đã check-in', color: 'bg-purple-100 text-purple-800', icon: <MapPin className="w-4 h-4" /> },
            3: { text: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
            4: { text: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> }
        };
        return statusMap[status] || statusMap[0];
    };

    const canCancel = (appointment) => {
        return appointment.trang_thai_lich_hen === 0 || appointment.trang_thai_lich_hen === 1;
    };

    const handleCancelClick = (appointment) => {
        setSelectedAppointment(appointment);
        setShowCancelModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Lịch Hẹn Của Tôi
                    </h1>
                    <p className="text-gray-600">
                        Quản lý và theo dõi các lịch hẹn khám bệnh của bạn
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex gap-2 overflow-x-auto">
                    {[
                        { value: null, label: 'Tất cả' },
                        { value: 0, label: 'Chờ xác nhận' },
                        { value: 1, label: 'Đã xác nhận' },
                        { value: 2, label: 'Đã check-in' },
                        { value: 3, label: 'Hoàn thành' },
                        { value: 4, label: 'Đã hủy' }
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setFilterStatus(filter.value)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${filterStatus === filter.value
                                ? 'bg-teal-700 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Appointments List */}
                {appointments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Chưa có lịch hẹn
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Bạn chưa có lịch hẹn nào. Đặt lịch khám ngay!
                        </p>
                        <button
                            onClick={() => navigate('/booking')}
                            className="px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition"
                        >
                            Đặt lịch khám
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appointment) => {
                            const statusInfo = getStatusInfo(appointment.trang_thai_lich_hen);
                            return (
                                <div
                                    key={appointment.ma_lich_hen}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        {/* Status Badge */}
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                            {statusInfo.icon}
                                            {statusInfo.text}
                                        </div>

                                        {/* Date */}
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">Ngày khám</div>
                                            <div className="font-bold text-gray-900">{appointment.ngay}</div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        {/* Doctor Info */}
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-teal-700" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Bác sĩ</div>
                                                <div className="font-medium text-gray-900">
                                                    {appointment.ho_bac_si} {appointment.ten_bac_si}
                                                </div>
                                                {appointment.ten_chuyen_khoa && (
                                                    <div className="text-sm text-gray-600">{appointment.ten_chuyen_khoa}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Time */}
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-5 h-5 text-blue-700" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Giờ khám</div>
                                                <div className="font-medium text-gray-900">
                                                    {appointment.gio_bat_dau.slice(0, 5)} - {appointment.gio_ket_thuc.slice(0, 5)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Service */}
                                    {appointment.ten_dich_vu && (
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <div className="text-sm text-gray-600 mb-1">Dịch vụ</div>
                                            <div className="font-medium text-gray-900">{appointment.ten_dich_vu}</div>
                                        </div>
                                    )}

                                    {/* Reason */}
                                    {appointment.ly_do_kham_lich_hen && (
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <div className="text-sm text-gray-600 mb-1">Lý do khám</div>
                                            <div className="text-gray-900">{appointment.ly_do_kham_lich_hen}</div>
                                        </div>
                                    )}

                                    {/* Cancel Reason */}
                                    {appointment.ly_do_huy_lich_hen && (
                                        <div className="bg-red-50 rounded-lg p-3 mb-4">
                                            <div className="text-sm text-red-600 mb-1">Lý do hủy</div>
                                            <div className="text-red-900">{appointment.ly_do_huy_lich_hen}</div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button
                                            onClick={() => navigate(`/appointments/${appointment.ma_lich_hen}`)}
                                            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                                        >
                                            Chi tiết
                                        </button>

                                        {canCancel(appointment) && (
                                            <button
                                                onClick={() => handleCancelClick(appointment)}
                                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                                            >
                                                Hủy lịch
                                            </button>
                                        )}

                                        {appointment.trang_thai_lich_hen === 3 && (
                                            <button
                                                onClick={() => navigate(`/appointments/${appointment.ma_lich_hen}/rate`)}
                                                className="flex-1 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition font-medium"
                                            >
                                                Đánh giá
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <CancelModal
                    appointment={selectedAppointment}
                    onClose={() => {
                        setShowCancelModal(false);
                        setSelectedAppointment(null);
                    }}
                    onSuccess={() => {
                        setShowCancelModal(false);
                        setSelectedAppointment(null);
                        loadAppointments();
                    }}
                />
            )}
        </div>
    );
}

export default MyAppointments;