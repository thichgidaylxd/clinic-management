import React from 'react';
import { Ruler, Scale, Heart, Thermometer, Activity } from 'lucide-react';

function VitalSignsForm({ medicalRecord, onChange }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Chỉ số sinh hiệu
                </h2>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Ruler className="w-4 h-4 text-blue-600" />
                            Chiều cao (cm)
                        </label>
                        <input
                            type="number"
                            value={medicalRecord.chieu_cao}
                            onChange={(e) => handleMedicalRecordChange('chieu_cao', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="170"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Scale className="w-4 h-4 text-green-600" />
                            Cân nặng (kg)
                        </label>
                        <input
                            type="number"
                            value={medicalRecord.can_nang}
                            onChange={(e) => handleMedicalRecordChange('can_nang', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="65"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-600" />
                            Huyết áp (mmHg)
                        </label>
                        <input
                            type="text"
                            value={medicalRecord.huyet_ap}
                            onChange={(e) => handleMedicalRecordChange('huyet_ap', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="120/80"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-orange-600" />
                            Nhiệt độ (°C)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={medicalRecord.nhiet_do}
                            onChange={(e) => handleMedicalRecordChange('nhiet_do', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="36.5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-purple-600" />
                            Nhịp tim (bpm)
                        </label>
                        <input
                            type="number"
                            value={medicalRecord.nhip_tim}
                            onChange={(e) => handleMedicalRecordChange('nhip_tim', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="75"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VitalSignsForm;