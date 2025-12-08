import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../../services/api';
import { ChevronRight, Loader2, DollarSign } from 'lucide-react';

function Step3Service({
    specialtyId,
    onNext,
    onBack,
    selectedService,
    setSelectedService
}) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadServices();
    }, [specialtyId]);

    const loadServices = async () => {
        try {
            setLoading(true);
            const params = specialtyId ? { specialtyId } : {};
            const response = await bookingAPI.getServices(params);
            setServices(response.data.data || []);
        } catch (err) {
            setError('Không thể tải danh sách dịch vụ');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (service) => {
        setSelectedService(service);
    };

    const handleSkip = () => {
        setSelectedService(null);
        onNext();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
                <span className="ml-3 text-gray-600">Đang tải dịch vụ...</span>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Chọn Dịch Vụ
            </h2>
            <p className="text-gray-600 mb-6">
                Chọn dịch vụ bạn muốn sử dụng (hoặc bỏ qua)
            </p>

            <div className="space-y-4 mb-6">
                {services.map((service) => (
                    <button
                        key={service.ma_dich_vu}
                        onClick={() => handleSelect(service)}
                        className={`w-full p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg ${selectedService?.ma_dich_vu === service.ma_dich_vu
                                ? 'border-teal-700 bg-teal-50'
                                : 'border-gray-200 hover:border-teal-300'
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-gray-900 text-lg">
                                        {service.ten_dich_vu}
                                    </h3>
                                    <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                                        {formatPrice(service.don_gia_dich_vu)}
                                    </span>
                                </div>
                                {service.mo_ta_dich_vu && (
                                    <p className="text-sm text-gray-600">
                                        {service.mo_ta_dich_vu}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {selectedService?.ma_dich_vu === service.ma_dich_vu && (
                                    <div className="w-6 h-6 bg-teal-700 rounded-full flex items-center justify-center">
                                        <ChevronRight className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-4">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                    Quay lại
                </button>

                <div className="flex gap-4">
                    <button
                        onClick={handleSkip}
                        className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition"
                    >
                        Bỏ qua
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!selectedService}
                        className="px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Tiếp tục
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Step3Service;