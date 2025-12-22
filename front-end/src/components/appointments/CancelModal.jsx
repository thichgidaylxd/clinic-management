import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { bookingAPI } from '../../services/api';

function CancelModal({ appointment, onClose, onSuccess }) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason.trim()) {
            setError('Vui lòng nhập lý do hủy');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await bookingAPI.cancelAppointment(appointment.ma_lich_hen, reason, token);
            onSuccess();

        } catch (err) {
            setError(err.message || 'Hủy lịch thất bại');
        } finally {
            setLoading(false);
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

                {/* Warning Icon */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Hủy lịch hẹn
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                    Bạn có chắc chắn muốn hủy lịch hẹn này không?
                </p>

                {/* Appointment Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="text-sm text-gray-600 mb-2">Thông tin lịch hẹn</div>
                    <div className="space-y-1">
                        <div className="font-medium">
                            {appointment.ho_bac_si} {appointment.ten_bac_si}
                        </div>
                        <div className="text-sm text-gray-600">
                            {formatDate(appointment.ngay_hen)} • {appointment.gio_bat_dau.slice(0, 5)} - {appointment.gio_ket_thuc.slice(0, 5)}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Reason Input */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lý do hủy <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows="4"
                            placeholder="Vui lòng cho chúng tôi biết lý do hủy lịch..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50"
                        >
                            Đóng
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang hủy...
                                </>
                            ) : (
                                'Xác nhận hủy'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CancelModal;