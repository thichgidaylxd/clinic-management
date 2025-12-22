import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import NEW components
import Step1Service from '../components/bookingV2/Step1Service';
import Step2DateTime from '../components/bookingV2/Step2DateTime';
import Step3Doctor from '../components/bookingV2/Step3Doctor';
import Step4Confirm from '../components/bookingV2/Step4Confirm';
import SuccessModal from '../components/booking/SuccessModal';
import Step1Specialty from '../components/booking/Step1Specialty';

function BookingV2() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    // Booking data - NEW FLOW
    const [selectedService, setSelectedService] = useState(null);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Success modal
    const [showSuccess, setShowSuccess] = useState(false);
    const [appointmentData, setAppointmentData] = useState(null);

    const handleStep1Next = (data) => {
        setSelectedService(data.service);
        setSelectedSpecialty(data.specialty);
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStep2Next = (data) => {
        setSelectedDate(data.date);
        setSelectedTimeSlot(data.timeSlot);
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStep3Next = (data) => {
        setSelectedDoctor(data.doctor);
        setCurrentStep(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSuccess = (data) => {
        setAppointmentData(data);
        setShowSuccess(true);
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        navigate('/');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1Service
                        onNext={handleStep1Next}
                        initialService={selectedService}
                        initialSpecialty={selectedSpecialty}
                    />
                );

            case 2:
                return (
                    <Step2DateTime
                        specialty={selectedSpecialty}
                        onNext={handleStep2Next}
                        onBack={handleBack}
                        initialDate={selectedDate}
                        initialTimeSlot={selectedTimeSlot}
                    />
                );


            case 3:
                return (
                    <Step3Doctor
                        specialty={selectedSpecialty}
                        date={selectedDate}
                        timeSlot={selectedTimeSlot}
                        onNext={handleStep3Next}
                        onBack={handleBack}
                        initialDoctor={selectedDoctor}
                    />
                );


            case 4:
                return (
                    <Step4Confirm
                        service={selectedService}
                        specialty={selectedSpecialty}
                        date={selectedDate}
                        timeSlot={selectedTimeSlot}
                        doctor={selectedDoctor}
                        onBack={handleBack}
                        onSuccess={handleSuccess}
                    />
                );

            default:
                return null;
        }
    };

    // Custom Step Indicator for 4 steps
    const steps = [
        { number: 1, label: 'Dịch Vụ' },
        { number: 2, label: 'Ngày & Giờ' },
        { number: 3, label: 'Bác Sĩ' },
        { number: 4, label: 'Xác Nhận' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Về trang chủ</span>
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Đặt Lịch Khám Nha Khoa
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Chọn dịch vụ, thời gian và bác sĩ phù hợp với bạn
                    </p>
                </div>

                {/* Custom Step Indicator */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.number}>
                                {/* Step Circle */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`
                                            w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                                            transition-all duration-300
                                            ${currentStep >= step.number
                                                ? 'bg-teal-600 text-white shadow-lg scale-110'
                                                : 'bg-gray-200 text-gray-500'
                                            }
                                        `}
                                    >
                                        {currentStep > step.number ? (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            step.number
                                        )}
                                    </div>
                                    <span
                                        className={`
                                            text-sm font-medium mt-2 text-center
                                            ${currentStep >= step.number ? 'text-teal-700' : 'text-gray-500'}
                                        `}
                                    >
                                        {step.label}
                                    </span>
                                </div>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`
                                            flex-1 h-1 mx-4 rounded-full transition-all duration-300
                                            ${currentStep > step.number ? 'bg-teal-600' : 'bg-gray-200'}
                                        `}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {renderStep()}
                        </div>
                    </div>

                    {/* Progress Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">
                                📋 Tóm tắt đặt lịch
                            </h3>

                            <div className="space-y-4">
                                {/* Service */}
                                {selectedService ? (
                                    <div className="pb-4 border-b border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">DỊCH VỤ</p>
                                        <p className="font-semibold text-gray-900 mb-1">
                                            {selectedService.ten_dich_vu}
                                        </p>
                                        <p className="text-teal-700 font-bold">
                                            {formatPrice(selectedService.don_gia_dich_vu)}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="pb-4 border-b border-gray-200">
                                        <p className="text-sm text-gray-400">Chưa chọn dịch vụ</p>
                                    </div>
                                )}

                                {/* Date & Time */}
                                {selectedDate && selectedTimeSlot ? (
                                    <div className="pb-4 border-b border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">NGÀY & GIỜ</p>
                                        <p className="font-semibold text-gray-900">
                                            📅 {formatDate(selectedDate)}
                                        </p>
                                        <p className="text-gray-700 mt-1">
                                            🕐 {selectedTimeSlot.start} - {selectedTimeSlot.end}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="pb-4 border-b border-gray-200">
                                        <p className="text-sm text-gray-400">Chưa chọn ngày giờ</p>
                                    </div>
                                )}

                                {/* Doctor */}
                                {selectedDoctor ? (
                                    <div className="pb-4 border-b border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">BÁC SĨ</p>
                                        <p className="font-semibold text-gray-900">
                                            👨‍⚕️ {selectedDoctor.ho_nguoi_dung} {selectedDoctor.ten_nguoi_dung}
                                        </p>
                                        {selectedDoctor.ten_chuc_vu && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {selectedDoctor.ten_chuc_vu}
                                            </p>
                                        )}
                                        {selectedDoctor.so_nam_kinh_nghiem_bac_si > 0 && (
                                            <p className="text-sm text-gray-600">
                                                {selectedDoctor.so_nam_kinh_nghiem_bac_si} năm kinh nghiệm
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="pb-4 border-b border-gray-200">
                                        <p className="text-sm text-gray-400">Chưa chọn bác sĩ</p>
                                    </div>
                                )}

                                {/* Specialty */}
                                {selectedSpecialty && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">CHUYÊN KHOA</p>
                                        <p className="font-medium text-gray-700">
                                            🏥 {selectedSpecialty.ten_chuyen_khoa}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600">Tiến độ</span>
                                    <span className="font-semibold text-teal-700">
                                        {currentStep}/4
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(currentStep / 4) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Help Text */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-xs text-gray-600">
                                    💡 <span className="font-medium">Mẹo:</span> Bạn có thể quay lại bước trước để thay đổi lựa chọn bất cứ lúc nào.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccess}
                onClose={handleCloseSuccess}
                appointmentData={appointmentData}
            />
        </div>
    );
}

export default BookingV2;