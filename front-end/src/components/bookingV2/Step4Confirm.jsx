import React, { useState } from 'react';
import { User, Phone, Mail, Calendar, Clock, DollarSign, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { bookingAPI } from '../../services/api';

function Step4Confirm({ service, specialty, date, timeSlot, doctor, onBack, onSuccess }) {
    const [formData, setFormData] = useState({
        ten_benh_nhan: '',
        ho_benh_nhan: '',
        so_dien_thoai_benh_nhan: '',
        email_benh_nhan: '',
        ngay_sinh_benh_nhan: '',
        gioi_tinh_benh_nhan: 1,
        ly_do_kham_lich_hen: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const appointmentData = {
                ma_bac_si: doctor.ma_bac_si,
                ma_chuyen_khoa: specialty.ma_chuyen_khoa,
                ma_dich_vu_lich_hen: service.ma_dich_vu,
                ngay_hen: date,
                gio_bat_dau: timeSlot.start,
                gio_ket_thuc: timeSlot.end,
                ly_do_kham_lich_hen: formData.ly_do_kham_lich_hen
            };

            let response;

            if (user && token) {
                // Authenticated booking
                response = await bookingAPI.createAuthAppointment(appointmentData, token);
            } else {
                // Guest booking
                const guestData = {
                    ...appointmentData,
                    ten_benh_nhan: formData.ten_benh_nhan,
                    ho_benh_nhan: formData.ho_benh_nhan,
                    so_dien_thoai_benh_nhan: formData.so_dien_thoai_benh_nhan,
                    email_benh_nhan: formData.email_benh_nhan,
                    ngay_sinh_benh_nhan: formData.ngay_sinh_benh_nhan,
                    gioi_tinh_benh_nhan: formData.gioi_tinh_benh_nhan
                };

                console.log('Guest booking data:', guestData);

                response = await bookingAPI.createGuestAppointment(guestData);
            }

            onSuccess(response.data);

        } catch (err) {
            console.error('Booking error:', err);
            setError(err.message || 'Đặt lịch thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Xác Nhận Thông Tin
            </h2>
            <p className="text-gray-600 mb-6">
                Kiểm tra lại thông tin và hoàn tất đặt lịch
            </p>

            {/* Booking Summary */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">📋 Thông tin đặt lịch</h3>

                <div className="space-y-3">
                    {/* Service */}
                    <div className="flex items-start gap-3">
                        <span className="text-gray-600 w-32 flex-shrink-0">Dịch vụ:</span>
                        <span className="font-medium text-gray-900">{service.ten_dich_vu}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-start gap-3">
                        <span className="text-gray-600 w-32 flex-shrink-0">Giá:</span>
                        <span className="font-bold text-teal-700">{formatPrice(service.don_gia_dich_vu)}</span>
                    </div>

                    {/* Doctor */}
                    <div className="flex items-start gap-3">
                        <span className="text-gray-600 w-32 flex-shrink-0">Bác sĩ:</span>
                        <span className="font-medium text-gray-900">
                            {doctor.ho_nguoi_dung} {doctor.ten_nguoi_dung}
                        </span>
                    </div>

                    {/* Date & Time */}
                    <div className="border-t border-teal-200 pt-3 mt-3">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                            <span className="font-medium text-gray-900">{formatDate(date)}</span>
                        </div>
                        <div className="flex items-start gap-3 mt-2">
                            <Clock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                            <span className="font-medium text-gray-900">{timeSlot.start} - {timeSlot.end}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Patient Form (only if not logged in) */}
            {!user && (
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">👤 Thông tin của bạn</h3>

                    {/* Họ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên đệm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Nguyễn Văn"
                            value={formData.ho_benh_nhan}
                            onChange={(e) => setFormData({ ...formData, ho_benh_nhan: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none"
                        />
                    </div>

                    {/* Tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="A"
                            value={formData.ten_benh_nhan}
                            onChange={(e) => setFormData({ ...formData, ten_benh_nhan: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none"
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                required
                                pattern="[0-9]{10}"
                                placeholder="0901234567"
                                value={formData.so_dien_thoai_benh_nhan}
                                onChange={(e) => setFormData({ ...formData, so_dien_thoai_benh_nhan: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                placeholder="example@email.com"
                                value={formData.email_benh_nhan}
                                onChange={(e) => setFormData({ ...formData, email_benh_nhan: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Ngày sinh */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày sinh
                        </label>
                        <input
                            type="date"
                            value={formData.ngay_sinh_benh_nhan}
                            onChange={(e) => setFormData({ ...formData, ngay_sinh_benh_nhan: e.target.value })}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none"
                        />
                    </div>

                    {/* Giới tính */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giới tính
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="1"
                                    checked={formData.gioi_tinh_benh_nhan === 1}
                                    onChange={() => setFormData({ ...formData, gioi_tinh_benh_nhan: 1 })}
                                    className="w-4 h-4 text-teal-600"
                                />
                                <span>Nam</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="0"
                                    checked={formData.gioi_tinh_benh_nhan === 0}
                                    onChange={() => setFormData({ ...formData, gioi_tinh_benh_nhan: 0 })}
                                    className="w-4 h-4 text-teal-600"
                                />
                                <span>Nữ</span>
                            </label>
                        </div>
                    </div>

                    {/* Lý do khám */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lý do khám <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows="4"
                            placeholder="Mô tả triệu chứng hoặc lý do khám..."
                            value={formData.ly_do_kham_lich_hen}
                            onChange={(e) => setFormData({ ...formData, ly_do_kham_lich_hen: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none resize-none"
                        />
                    </div>
                </form>
            )}

            {/* If logged in, just ask for reason */}
            {user && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lý do khám <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        required
                        rows="4"
                        placeholder="Mô tả triệu chứng hoặc lý do khám..."
                        value={formData.ly_do_kham_lich_hen}
                        onChange={(e) => setFormData({ ...formData, ly_do_kham_lich_hen: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none resize-none"
                    />
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between gap-4">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
                >
                    Quay lại
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.ly_do_kham_lich_hen}
                    className="px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang đặt lịch...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Xác nhận đặt lịch
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default Step4Confirm;