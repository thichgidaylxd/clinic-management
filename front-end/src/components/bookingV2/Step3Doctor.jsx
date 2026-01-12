import React, { useState, useEffect } from 'react';
import { User, Briefcase, Award, Clock, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { bookingAPI } from '../../services/api';

function Step3Doctor({
    specialty,
    date,
    timeSlot,
    onNext,
    onBack,
    initialDoctor
}) {

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(initialDoctor || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        if (initialDoctor) {
            setSelectedDoctor(initialDoctor);
        }
    }, [initialDoctor]);

    useEffect(() => {
        loadAvailableDoctors();
    }, []);

    const loadAvailableDoctors = async () => {
        setLoading(true);
        setError('');

        try {
            // Gọi API getAvailableDoctors với params
            const params = {
                date: date,
                startTime: timeSlot.start,
                endTime: timeSlot.end,
                specialtyId: specialty?.ma_chuyen_khoa
            };

            console.log('Loading doctors with params:', params);

            const data = await bookingAPI.getAvailableDoctors(params);
            console.log('API response for available doctors:', data);

            console.log('Available doctors:', data);

            setDoctors(data.data || []);

            if (!data.data || data.data.length === 0) {
                setError('Không có bác sĩ nào khả dụng trong thời gian này. Vui lòng chọn thời gian khác.');
            }

        } catch (err) {
            console.error('Load doctors error:', err);
            setError(err.message || 'Có lỗi xảy ra khi tải danh sách bác sĩ');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectDoctor = (doctor) => {
        setSelectedDoctor(doctor);
    };
    const handleNext = () => {
        if (!selectedDoctor) {
            setError('Vui lòng chọn bác sĩ');
            return;
        }
        onNext({ doctor: selectedDoctor });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
                <p className="text-gray-600">Đang tìm bác sĩ khả dụng...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Chọn Bác Sĩ
            </h2>
            <p className="text-gray-600 mb-6">
                Các bác sĩ khả dụng vào {timeSlot.start} - {timeSlot.end}, ngày {new Date(date).toLocaleDateString('vi-VN')}
            </p>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-red-600 text-sm">{error}</p>
                        {doctors.length === 0 && (
                            <button
                                onClick={onBack}
                                className="mt-2 text-sm text-teal-600 hover:underline"
                            >
                                ← Chọn lại thời gian
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Doctors List */}
            <div className="space-y-4 mb-6">
                {doctors.map((doctor) => (
                    <div
                        key={doctor.ma_bac_si}
                        onClick={() => handleSelectDoctor(doctor)}
                        className={`
                            relative border-2 rounded-xl p-5 cursor-pointer transition-all
                            ${selectedDoctor?.ma_bac_si === doctor.ma_bac_si
                                ? 'border-teal-600 bg-teal-50 shadow-md'
                                : 'border-gray-200 hover:border-teal-300 hover:shadow-sm'
                            }
                        `}
                    >
                        {/* Selected Badge */}
                        {selectedDoctor?.ma_bac_si === doctor.ma_bac_si && (
                            <div className="absolute top-4 right-4">
                                <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            {/* Avatar */}
                            <div className={`
                                w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-2xl
                                ${selectedDoctor?.ma_bac_si === doctor.ma_bac_si
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }
                            `}>
                                {doctor.hinh_anh_nguoi_dung ? (
                                    <img
                                        src={`data:image/jpeg;base64,${doctor.hinh_anh_nguoi_dung}`}
                                        alt={doctor.ten_nguoi_dung}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                {/* Name */}
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {doctor.ho_nguoi_dung} {doctor.ten_nguoi_dung}
                                </h3>
                                {/* Rating */}
                                <div className="flex items-center gap-1 mt-1">
                                    {doctor.so_sao_trung_binh ? (
                                        <>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, index) => (
                                                    <svg
                                                        key={index}
                                                        className={`w-4 h-4 ${index < Math.round(doctor.so_sao_trung_binh)
                                                                ? 'text-yellow-400'
                                                                : 'text-gray-300'
                                                            }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.049 9.401c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600 ml-1">
                                                {doctor.so_sao_trung_binh.toFixed(1)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">
                                            Chưa có đánh giá
                                        </span>
                                    )}
                                </div>


                                {/* Position */}
                                {/* {doctor.ten_chuc_vu && (
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <Briefcase className="w-4 h-4" />
                                        <span className="text-sm">{doctor.ten_chuc_vu}</span>
                                    </div>
                                )} */}

                                {/* Experience */}
                                {/* {doctor.so_nam_kinh_nghiem_bac_si > 0 && (
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <Award className="w-4 h-4" />
                                        <span className="text-sm">
                                            {doctor.so_nam_kinh_nghiem_bac_si} năm kinh nghiệm
                                        </span>
                                    </div>
                                )} */}

                                {/* Specialty */}
                                {/* {doctor.chuyen_khoa && (
                                    <div className="flex items-center gap-2 text-teal-700 mb-2">
                                        <span className="text-sm font-medium">
                                            🏥 {doctor.chuyen_khoa}
                                        </span>
                                    </div>
                                )} */}

                                {/* Work Schedule */}
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3 pt-3 border-t">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                            {doctor.thoi_gian_bat_dau_lich_lam_viec} - {doctor.thoi_gian_ket_thuc_lich_lam_viec}
                                        </span>
                                    </div>
                                    {/* {doctor.ten_phong_kham && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>
                                                {doctor.ten_phong_kham}
                                                {doctor.so_phong_kham && ` - Phòng ${doctor.so_phong_kham}`}
                                            </span>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {doctors.length === 0 && !loading && (
                <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Không có bác sĩ nào khả dụng</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between gap-4">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                    Quay lại
                </button>

                <button
                    onClick={handleNext}
                    disabled={!selectedDoctor}
                    className="px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}

export default Step3Doctor;