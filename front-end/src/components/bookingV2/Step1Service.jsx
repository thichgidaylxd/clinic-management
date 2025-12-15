import React, { useState, useEffect } from 'react';
import { Stethoscope, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { bookingAPI } from '../../services/api';

function Step1Service({ onNext }) {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [specialty, setSpecialty] = useState(null);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        setLoading(true);
        setError('');

        try {
            // Step 1: Tìm chuyên khoa "Nha khoa"
            const specialtyData = await bookingAPI.getSpecialties({ search: 'Nha khoa' });

            console.log('Specialty data:', specialtyData.data);

            // Kiểm tra có data không
            if (!specialtyData.data || specialtyData.data.length === 0) {
                throw new Error('Không tìm thấy chuyên khoa Nha khoa');
            }

            // Lấy chuyên khoa đầu tiên
            const nhaKhoaSpecialty = specialtyData.data.data[0];
            setSpecialty(nhaKhoaSpecialty);

            console.log('Nha khoa specialty:', nhaKhoaSpecialty);

            // Step 2: Lấy dịch vụ theo chuyên khoa
            const servicesData = await bookingAPI.getServicesBySpecialty(
                nhaKhoaSpecialty.ma_chuyen_khoa
            );

            console.log('Services data:', servicesData);

            setServices(servicesData.data || []);

            if (!servicesData.data || servicesData.data.length === 0) {
                setError('Chưa có dịch vụ nào cho chuyên khoa Nha khoa');
            }

        } catch (err) {
            console.error('Load services error:', err);
            setError(err.message || 'Có lỗi xảy ra khi tải dịch vụ');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleSelectService = (service) => {
        setSelectedService(service);
    };

    const handleNext = () => {
        if (!selectedService) {
            setError('Vui lòng chọn dịch vụ');
            return;
        }

        onNext({
            service: selectedService,
            specialty: specialty
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
                <p className="text-gray-600">Đang tải dịch vụ...</p>
            </div>
        );
    }

    if (error && services.length === 0) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={loadServices}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Chọn Dịch Vụ Nha Khoa
            </h2>
            <p className="text-gray-600 mb-6">
                Vui lòng chọn dịch vụ bạn muốn sử dụng
            </p>

            {error && services.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-600 text-sm">{error}</p>
                </div>
            )}

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {services.map((service) => (
                    <div
                        key={service.ma_dich_vu}
                        onClick={() => handleSelectService(service)}
                        className={`
                            relative border-2 rounded-xl p-4 cursor-pointer transition-all
                            ${selectedService?.ma_dich_vu === service.ma_dich_vu
                                ? 'border-teal-600 bg-teal-50 shadow-md'
                                : 'border-gray-200 hover:border-teal-300 hover:shadow-sm'
                            }
                        `}
                    >
                        {/* Selected Badge */}
                        {selectedService?.ma_dich_vu === service.ma_dich_vu && (
                            <div className="absolute top-3 right-3">
                                <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* Service Icon */}
                        <div className="flex items-start gap-4">
                            <div className={`
                                w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                                ${selectedService?.ma_dich_vu === service.ma_dich_vu
                                    ? 'bg-teal-600'
                                    : 'bg-gray-100'
                                }
                            `}>
                                <Stethoscope className={`w-6 h-6 ${selectedService?.ma_dich_vu === service.ma_dich_vu
                                    ? 'text-white'
                                    : 'text-gray-600'
                                    }`} />
                            </div>

                            <div className="flex-1">
                                {/* Service Name */}
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {service.ten_dich_vu}
                                </h3>

                                {/* Description */}
                                {service.mo_ta_dich_vu && (
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                        {service.mo_ta_dich_vu}
                                    </p>
                                )}

                                {/* Price */}
                                <div className="flex items-center gap-2 text-teal-700">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="font-bold text-lg">
                                        {formatPrice(service.don_gia_dich_vu)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {services.length === 0 && !loading && (
                <div className="text-center py-12">
                    <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có dịch vụ nào</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={!selectedService}
                    className="px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}

export default Step1Service;