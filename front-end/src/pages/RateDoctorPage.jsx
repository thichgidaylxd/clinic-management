import React, { useState, useEffect } from 'react';
import {
    Star,
    ArrowLeft,
    User,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Send,
    Stethoscope
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookingAPI } from '../services/api';

function RateDoctorPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }
        loadAppointment();
    }, [id]);

    const loadAppointment = async () => {
        try {
            setLoading(true);
            const response = await bookingAPI.getAppointmentById(id, token);
            const apt = response.data;

            // Kiểm tra trạng thái có được đánh giá không
            if (apt.trang_thai_lich_hen !== 4) {
                setError('Chỉ có thể đánh giá lịch hẹn đã hoàn thành');
                return;
            }

            setAppointment(apt);
        } catch (err) {
            setError('Không thể tải thông tin lịch hẹn');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Vui lòng chọn số sao đánh giá');
            return;
        }

        if (!comment.trim()) {
            alert('Vui lòng nhập nội dung đánh giá');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            await bookingAPI.createReview(
                {
                    appointmentId: id,
                    doctorId: appointment.ma_bac_si,
                    rating,
                    content: comment.trim()
                },
                token
            );


            setSuccess(true);
            setTimeout(() => {
                navigate('/patient/appointments');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Không thể gửi đánh giá');
        } finally {
            setSubmitting(false);
        }
    };

    const getRatingText = (stars) => {
        const texts = {
            1: 'Rất không hài lòng',
            2: 'Không hài lòng',
            3: 'Bình thường',
            4: 'Hài lòng',
            5: 'Rất hài lòng'
        };
        return texts[stars] || 'Chọn đánh giá';
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

    if (error && !appointment) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Không thể đánh giá</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
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

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Cảm ơn bạn!</h2>
                    <p className="text-gray-600 mb-4">
                        Đánh giá của bạn đã được gửi thành công
                    </p>
                    <p className="text-sm text-gray-500">
                        Đang chuyển hướng...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/my-appointments')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Quay lại</span>
                </button>

                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-teal-100 p-3 rounded-lg">
                            <Star className="w-6 h-6 text-teal-700" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Đánh giá bác sĩ
                            </h1>
                            <p className="text-sm text-gray-500">
                                Chia sẻ trải nghiệm của bạn để giúp người khác
                            </p>
                        </div>
                    </div>
                </div>

                {/* Appointment Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Thông tin lịch khám</h3>

                    <div className="space-y-4">
                        {/* Doctor */}
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-6 h-6 text-teal-700" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Bác sĩ</p>
                                <p className="font-semibold text-gray-900">
                                    BS. {appointment?.ho_bac_si} {appointment?.ten_bac_si}
                                </p>
                                {appointment?.ten_chuyen_khoa && (
                                    <p className="text-sm text-teal-600">{appointment.ten_chuyen_khoa}</p>
                                )}
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-2 rounded-lg">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Ngày khám</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(appointment?.ngay).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="bg-purple-50 p-2 rounded-lg">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Giờ khám</p>
                                    <p className="font-medium text-gray-900">
                                        {appointment?.gio_bat_dau?.slice(0, 5)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-6">Đánh giá của bạn</h3>

                    {/* Star Rating */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Bạn đánh giá như thế nào về bác sĩ?
                        </label>
                        <div className="flex flex-col items-center">
                            <div className="flex gap-2 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-12 h-12 transition-colors ${star <= (hoverRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className={`text-sm font-medium transition-colors ${rating > 0 ? 'text-teal-700' : 'text-gray-500'
                                }`}>
                                {getRatingText(hoverRating || rating)}
                            </p>
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chia sẻ trải nghiệm của bạn
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Hãy chia sẻ chi tiết về trải nghiệm của bạn với bác sĩ. Đánh giá của bạn sẽ giúp ích cho những bệnh nhân khác..."
                            rows="6"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Tối thiểu 10 ký tự • {comment.length}/500 ký tự
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/my-appointments')}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                            disabled={submitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || rating === 0 || !comment.trim()}
                            className="flex-1 px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Gửi đánh giá
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Tips */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-semibold mb-1">Gợi ý khi đánh giá:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Thái độ và sự tận tâm của bác sĩ</li>
                                <li>Kỹ năng chuyên môn và chẩn đoán</li>
                                <li>Thời gian khám và tư vấn</li>
                                <li>Cơ sở vật chất và dịch vụ</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RateDoctorPage;