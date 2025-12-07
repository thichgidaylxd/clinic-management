import React from 'react';
import { Check } from 'lucide-react';

const steps = [
    { number: 1, title: 'Chuyên khoa' },
    { number: 2, title: 'Bác sĩ' },
    { number: 3, title: 'Dịch vụ' },
    { number: 4, title: 'Ngày & Giờ' },
    { number: 5, title: 'Xác nhận' }
];

function StepIndicator({ currentStep }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        {/* Step Circle */}
                        <div className="flex flex-col items-center relative">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${step.number < currentStep
                                        ? 'bg-teal-700 text-white'
                                        : step.number === currentStep
                                            ? 'bg-teal-700 text-white ring-4 ring-teal-100'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {step.number < currentStep ? (
                                    <Check className="w-6 h-6" />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <span
                                className={`text-xs mt-2 font-medium ${step.number <= currentStep ? 'text-gray-900' : 'text-gray-400'
                                    }`}
                            >
                                {step.title}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div
                                className={`flex-1 h-1 mx-2 transition-all ${step.number < currentStep ? 'bg-teal-700' : 'bg-gray-200'
                                    }`}
                                style={{ marginTop: '-20px' }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default StepIndicator;