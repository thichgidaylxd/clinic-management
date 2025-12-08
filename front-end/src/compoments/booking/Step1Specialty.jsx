import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../../services/api';
import { ChevronRight, Loader2 } from 'lucide-react';

function Step1Specialty({ onNext, selectedSpecialty, setSelectedSpecialty }) {
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSpecialties();
    }, []);

    const loadSpecialties = async () => {
        try {
            setLoading(true);
            const response = await bookingAPI.getSpecialties();
            setSpecialties(response.data.data || []);
        } catch (err) {
            setError('Không thể tải danh sách chuyên khoa');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (specialty) => {
        setSelectedSpecialty(specialty);
        setTimeout(() => onNext(), 300); // Delay nhỏ để có animation
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
                <span className="ml-3 text-gray-600">Đang tải chuyên khoa...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={loadSpecialties}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Chọn Chuyên Khoa
            </h2>
            <p className="text-gray-600 mb-6">
                Vui lòng chọn chuyên khoa bạn muốn khám
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specialties.map((specialty) => (
                    <button
                        key={specialty.ma_chuyen_khoa}
                        onClick={() => handleSelect(specialty)}
                        className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg ${selectedSpecialty?.ma_chuyen_khoa === specialty.ma_chuyen_khoa
                                ? 'border-teal-700 bg-teal-50'
                                : 'border-gray-200 hover:border-teal-300'
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">
                                    {specialty.ten_chuyen_khoa}
                                </h3>
                                {specialty.mo_ta_chuyen_khoa && (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {specialty.mo_ta_chuyen_khoa}
                                    </p>
                                )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Step1Specialty;