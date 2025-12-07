import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Step1Specialty from '../compoments/booking/Step1Specialty';
import Step2Doctor from '../compoments/booking/Step2Doctor';
import Step3Service from '../compoments/booking/Step3Service';
import Step4DateTime from '../compoments/booking/Step4DateTime';
import Step5Confirm from '../compoments/booking/Step5Confirm';
import StepIndicator from '../compoments/booking/StepIndicator';
import SuccessModal from '../compoments/booking/SuccessModal';

// Import components


function Booking() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    // Booking data
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    // Success modal
    const [showSuccess, setShowSuccess] = useState(false);
    const [appointmentData, setAppointmentData] = useState(null);

    const handleNext = () => {
        setCurrentStep(prev => Math.min(prev + 1, 5));
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

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1Specialty
                        onNext={handleNext}
                        selectedSpecialty={selectedSpecialty}
                        setSelectedSpecialty={setSelectedSpecialty}
                    />
                );

            case 2:
                return (
                    <Step2Doctor
                        specialtyId={selectedSpecialty?.ma_chuyen_khoa}
                        onNext={handleNext}
                        onBack={handleBack}
                        selectedDoctor={selectedDoctor}
                        setSelectedDoctor={setSelectedDoctor}
                    />
                );

            case 3:
                return (
                    <Step3Service
                        specialtyId={selectedSpecialty?.ma_chuyen_khoa}
                        onNext={handleNext}
                        onBack={handleBack}
                        selectedService={selectedService}
                        setSelectedService={setSelectedService}
                    />
                );

            case 4:
                return (
                    <Step4DateTime
                        doctorId={selectedDoctor?.ma_bac_si}
                        onNext={handleNext}
                        onBack={handleBack}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedTimeSlot={selectedTimeSlot}
                        setSelectedTimeSlot={setSelectedTimeSlot}
                    />
                );

            case 5:
                return (
                    <Step5Confirm
                        specialty={selectedSpecialty}
                        doctor={selectedDoctor}
                        service={selectedService}
                        date={selectedDate}
                        timeSlot={selectedTimeSlot}
                        onBack={handleBack}
                        onSuccess={handleSuccess}
                    />
                );

            default:
                return null;
        }
    };

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
                        Đặt Lịch Khám
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Chọn bác sĩ và thời gian phù hợp với bạn
                    </p>
                </div>

                {/* Step Indicator */}
                <StepIndicator currentStep={currentStep} />

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    {renderStep()}
                </div>

                {/* Progress Summary (Sidebar - Optional) */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Tóm tắt</h3>

                    <div className="space-y-3 text-sm">
                        {selectedSpecialty && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Chuyên khoa:</span>
                                <span className="font-medium text-gray-900">
                                    {selectedSpecialty.ten_chuyen_khoa}
                                </span>
                            </div>
                        )}

                        {selectedDoctor && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Bác sĩ:</span>
                                <span className="font-medium text-gray-900">
                                    {selectedDoctor.ho_nguoi_dung} {selectedDoctor.ten_nguoi_dung}
                                </span>
                            </div>
                        )}

                        {selectedService && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Dịch vụ:</span>
                                <span className="font-medium text-gray-900">
                                    {selectedService.ten_dich_vu}
                                </span>
                            </div>
                        )}

                        {selectedDate && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Ngày:</span>
                                <span className="font-medium text-gray-900">
                                    {selectedDate}
                                </span>
                            </div>
                        )}

                        {selectedTimeSlot && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Giờ:</span>
                                <span className="font-medium text-gray-900">
                                    {selectedTimeSlot.start} - {selectedTimeSlot.end}
                                </span>
                            </div>
                        )}
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

export default Booking;