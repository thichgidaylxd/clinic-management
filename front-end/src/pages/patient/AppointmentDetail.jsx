import React from 'react';
import { useParams } from 'react-router-dom';

function AppointmentDetail() {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Chi tiết lịch hẹn
                </h1>
                <p className="text-gray-600">
                    Appointment ID: {id}
                </p>
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <p className="text-yellow-800">
                        🚧 Trang này đang được phát triển...
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AppointmentDetail;