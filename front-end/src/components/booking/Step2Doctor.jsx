import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../../services/api';
import { Star, ChevronRight, Loader2, Search } from 'lucide-react';

function Step2Doctor({
    specialtyId,
    onNext,
    onBack,
    selectedDoctor,
    setSelectedDoctor
}) {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadDoctors();
    }, [specialtyId]);

    const loadDoctors = async () => {
        try {
            setLoading(true);
            const response = await bookingAPI.getDoctors({
                // specialtyId: specialtyId, // Filter theo chuyên khoa nếu cần
                limit: 20
            });
            setDoctors(response.data.data || []);
        } catch (err) {
            setError('Không thể tải danh sách bác sĩ');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setTimeout(() => onNext(), 300);
    };

    const filteredDoctors = doctors.filter(doctor =>
        doctor.ten_nguoi_dung?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
                <span className="ml-3 text-gray-600">Đang tải danh sách bác sĩ...</span>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Chọn Bác Sĩ
            </h2>
            <p className="text-gray-600 mb-6">
                Chọn bác sĩ bạn muốn đặt lịch khám
            </p>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bác sĩ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                    />
                </div>
            </div>

            {/* Doctors List */}
            <div className="space-y-4">
                {filteredDoctors.map((doctor) => (
                    <button
                        key={doctor.ma_bac_si}
                        onClick={() => handleSelect(doctor)}
                        className={`w-full p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg ${selectedDoctor?.ma_bac_si === doctor.ma_bac_si
                                ? 'border-teal-700 bg-teal-50'
                                : 'border-gray-200 hover:border-teal-300'
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                                {/* Avatar */}
                                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl font-bold text-teal-700">
                                        {doctor.ho_nguoi_dung?.charAt(0)}
                                    </span>
                                </div>

                                {/* Info */}
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">
                                        {doctor.ho_nguoi_dung} {doctor.ten_nguoi_dung}
                                    </h3>

                                    {/* Rating */}
                                    {doctor.avg_rating && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="ml-1 text-sm font-medium text-gray-700">
                                                    {doctor.avg_rating}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                ({doctor.total_ratings || 0} đánh giá)
                                            </span>
                                        </div>
                                    )}

                                    {/* Experience */}
                                    {doctor.so_nam_kinh_nghiem_bac_si && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {doctor.so_nam_kinh_nghiem_bac_si} năm kinh nghiệm
                                        </p>
                                    )}
                                </div>
                            </div>

                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Back Button */}
            <div className="mt-8 flex justify-between">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
}

export default Step2Doctor;