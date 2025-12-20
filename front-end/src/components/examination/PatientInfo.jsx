import React from 'react';
import { User, Phone, Calendar } from 'lucide-react';

function PatientInfo({ appointment }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                Thông tin bệnh nhân
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-600">Bệnh nhân</p>
                        <p className="font-semibold text-gray-900">
                            {appointment.ho_benh_nhan} {appointment.ten_benh_nhan}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-600">Số điện thoại</p>
                        <p className="font-semibold text-gray-900">{appointment.so_dien_thoai_benh_nhan}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="bg-purple-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-600">Lịch hẹn</p>
                        <p className="font-semibold text-gray-900">
                            {appointment.gio_bat_dau.slice(0, 5)} - {new Date(appointment.ngay_hen).toLocaleDateString('vi-VN')}
                        </p>
                    </div>
                </div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-yellow-50 rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Lý do khám</p>
                    <p className="font-medium text-gray-900">
                        {appointment.ly_do_kham_lich_hen || '—'}
                    </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Dịch vụ khám</p>
                    <p className="font-medium text-gray-900">
                        {appointment.ten_dich_vu}
                    </p>
                    <p className="text-sm text-indigo-700 mt-1">
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(appointment.gia_dich_vu_lich_hen)}
                    </p>
                </div>
            </div>

        </div>
    );
}

export default PatientInfo;