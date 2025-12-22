import React from 'react';
import { CheckCircle2, Calendar, Clock, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SuccessModal({ isOpen, onClose, appointmentData }) {
    const navigate = useNavigate();

    if (!isOpen || !appointmentData) return null;

    const handleViewAppointments = () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
            navigate('/patient/appointments'); // Trang lịch hẹn của bệnh nhân
        } else {
            onClose();
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('vi-VN');


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Success Icon */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Đặt lịch thành công!
                    </h2>
                    <p className="text-gray-600">
                        Lịch hẹn của bạn đã được ghi nhận
                    </p>
                </div>

                {/* Appointment Info */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-3">
                    <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-600">Bác sĩ</p>
                            <p className="font-medium text-gray-900">
                                {appointmentData.ho_bac_si} {appointmentData.ten_bac_si}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-600">Ngày khám</p>
                            <p className="font-medium text-gray-900">{formatDate(appointmentData.ngay_hen)}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-600">Giờ khám</p>
                            <p className="font-medium text-gray-900">
                                {appointmentData.gio_bat_dau.slice(0, 5)} - {appointmentData.gio_ket_thuc.slice(0, 5)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                        <strong>Lưu ý:</strong> Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục.
                        Phòng khám sẽ liên hệ với bạn để xác nhận lịch hẹn.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleViewAppointments}
                        className="w-full bg-teal-700 text-white py-3 rounded-xl hover:bg-teal-800 transition font-medium"
                    >
                        Xem lịch hẹn
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full border-2 border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SuccessModal;