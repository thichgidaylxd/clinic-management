import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    MapPin,
    Phone,
    AlertCircle,
    CheckCircle,
    XCircle,
    ArrowLeft,
    FileText,
    CreditCard,
    Stethoscope,
    Building2,
    Mail,
    Activity
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import CancelModal from '../components/appointments/CancelModal';

function AppointmentDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        if (!token || !user) {
            navigate('/');
            return;
        }
        loadAppointmentDetail();
    }, [id]);

    const loadAppointmentDetail = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await bookingAPI.getAppointmentById(id, token);
            setAppointment(response.data);
        } catch (err) {
            setError('Không thể tải chi tiết lịch hẹn');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            0: {
                text: 'Chờ xác nhận',
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: <Clock className="w-5 h-5" />,
                description: 'Lịch hẹn đang chờ xác nhận từ phòng khám'
            },
            1: {
                text: 'Đã xác nhận',
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: <CheckCircle className="w-5 h-5" />,
                description: 'Lịch hẹn đã được xác nhận, vui lòng đến đúng giờ'
            },
            2: {
                text: 'Đã check-in',
                color: 'bg-purple-100 text-purple-800 border-purple-200',
                icon: <MapPin className="w-5 h-5" />,
                description: 'Bạn đã check-in, vui lòng chờ đến lượt khám'
            },
            3: {
                text: 'Đang khám',
                color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                icon: <Activity className="w-5 h-5" />,
                description: 'Đang trong quá trình khám bệnh'
            },
            4: {
                text: 'Hoàn thành',
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: <CheckCircle className="w-5 h-5" />,
                description: 'Lịch khám đã hoàn thành'
            },
            5: {
                text: 'Đã hủy',
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: <XCircle className="w-5 h-5" />,
                description: 'Lịch hẹn đã bị hủy'
            },
            6: {
                text: 'Không đến',
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                icon: <AlertCircle className="w-5 h-5" />,
                description: 'Bệnh nhân không đến theo lịch hẹn'
            }
        };
        return statusMap[status] || statusMap[0];
    };

    const canCancel = (appointment) => {
        return appointment?.trang_thai_lich_hen === 0 || appointment?.trang_thai_lich_hen === 1;
    };

    const Timeline = ({ status }) => {
        if (status === 5 || status === 6) return null;

        const steps = [
            { code: 0, label: 'Chờ xác nhận', icon: Clock },
            { code: 1, label: 'Đã xác nhận', icon: CheckCircle },
            { code: 2, label: 'Check-in', icon: MapPin },
            { code: 3, label: 'Đang khám', icon: Stethoscope },
            { code: 4, label: 'Hoàn thành', icon: CheckCircle }
        ];

        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-teal-600" />
                    Tiến trình lịch hẹn
                </h3>
                <div className="flex items-center">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isDone = status > step.code;
                        const isActive = status === step.code;

                        return (
                            <div key={step.code} className="flex-1 flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                        ${isDone ? 'bg-green-600 text-white shadow-lg'
                                            : isActive ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-gray-200 text-gray-400'}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-xs mt-2 text-center font-medium ${isDone || isActive ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>

                                {idx < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 transition-all duration-300 rounded-full
                                        ${status > step.code ? 'bg-green-600' : 'bg-gray-300'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
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

    if (error || !appointment) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy lịch hẹn</h2>
                    <p className="text-gray-600 mb-6">{error || 'Lịch hẹn không tồn tại hoặc đã bị xóa'}</p>
                    <button
                        onClick={() => navigate('/my-appointments')}
                        className="px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(appointment.trang_thai_lich_hen);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/my-appointments')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Quay lại danh sách</span>
                </button>

                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Chi tiết lịch hẹn
                            </h1>
                            <p className="text-sm text-gray-500">
                                Mã lịch hẹn: <span className="font-mono font-semibold text-gray-900">#{appointment.ma_lich_hen}</span>
                            </p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.text}
                        </div>
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <p className="text-sm text-blue-900">
                            {statusInfo.description}
                        </p>
                    </div>
                </div>

                {/* Timeline */}
                <Timeline status={appointment.trang_thai_lich_hen} />

                {/* Main Info Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Date & Time */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-teal-600" />
                            Thời gian khám
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-teal-50 p-2 rounded-lg">
                                    <Calendar className="w-5 h-5 text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase">Ngày khám</p>
                                    <p className="font-semibold text-gray-900 text-lg">
                                        {new Date(appointment.ngay_hen).toLocaleDateString('vi-VN', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-50 p-2 rounded-lg">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase">Giờ khám</p>
                                    <p className="font-semibold text-gray-900 text-lg">
                                        {appointment.gio_bat_dau?.slice(0, 5)} - {appointment.gio_ket_thuc?.slice(0, 5)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-teal-600" />
                            Bác sĩ khám
                        </h3>
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-8 h-8 text-teal-700" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-lg mb-1">
                                    BS. {appointment.ho_bac_si} {appointment.ten_bac_si}
                                </p>
                                {appointment.ten_chuyen_khoa && (
                                    <p className="text-teal-600 font-medium mb-2">
                                        {appointment.ten_chuyen_khoa}
                                    </p>
                                )}
                                {appointment.email_bac_si && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        {appointment.email_bac_si}
                                    </p>
                                )}
                                {appointment.so_dien_thoai_bac_si && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        {appointment.so_dien_thoai_bac_si}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service & Reason */}
                <div className="space-y-4 mb-6">
                    {/* Service */}
                    {appointment.ten_dich_vu && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Stethoscope className="w-5 h-5 text-teal-600" />
                                Dịch vụ khám
                            </h3>
                            <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
                                <p className="font-medium text-gray-900">{appointment.ten_dich_vu}</p>
                                {appointment.gia_dich_vu && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <CreditCard className="w-4 h-4 text-teal-600" />
                                        <span className="font-bold text-teal-700">
                                            {Number(appointment.gia_dich_vu).toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Reason */}
                    {appointment.ly_do_kham_lich_hen && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-teal-600" />
                                Lý do khám
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-800">{appointment.ly_do_kham_lich_hen}</p>
                            </div>
                        </div>
                    )}

                    {/* Note */}
                    {appointment.ghi_chu_lich_hen && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Ghi chú
                            </h3>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-gray-800">{appointment.ghi_chu_lich_hen}</p>
                            </div>
                        </div>
                    )}

                    {/* Cancel Reason */}
                    {appointment.ly_do_huy_lich_hen && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-600" />
                                Lý do hủy
                            </h3>
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-red-900">{appointment.ly_do_huy_lich_hen}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Location */}
                {appointment.dia_chi_phong_kham && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-teal-600" />
                            Địa điểm khám
                        </h3>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                            <p className="text-gray-800">{appointment.dia_chi_phong_kham}</p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex flex-wrap gap-3">
                        {canCancel(appointment) && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="flex-1 min-w-[200px] px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-5 h-5" />
                                Hủy lịch hẹn
                            </button>
                        )}

                        {appointment.trang_thai_lich_hen === 4 && (
                            <button
                                onClick={() => navigate(`/patient/appointments/${appointment.ma_lich_hen}/rate`)}
                                className="flex-1 min-w-[200px] px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition font-medium flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Đánh giá bác sĩ
                            </button>
                        )}

                        <button
                            onClick={() => navigate('/my-appointments')}
                            className="flex-1 min-w-[200px] px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <CancelModal
                    appointment={appointment}
                    onClose={() => setShowCancelModal(false)}
                    onSuccess={() => {
                        setShowCancelModal(false);
                        loadAppointmentDetail();
                    }}
                />
            )}
        </div>
    );
}

export default AppointmentDetail;