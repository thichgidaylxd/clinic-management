import React from 'react';
import { Outlet } from 'react-router-dom';

function ReceptionistLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Receptionist Dashboard
                </h1>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                    <p className="text-yellow-800">
                        🚧 Layout Lễ tân đang được phát triển...
                    </p>
                </div>
                <Outlet />
            </div>
        </div>
    );
}

export default ReceptionistLayout;