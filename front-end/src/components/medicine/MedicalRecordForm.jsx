import React from 'react';
import { Activity, Heart, Thermometer, Stethoscope } from 'lucide-react';

function MedicalRecordForm({ formData, onChange }) {
    const handleChange = (field, value) => {
        onChange({
            ...formData,
            [field]: value
        });
    };

    return (
        <div className="space-y-6">
            {/* Sinh hiệu */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-teal-600" />
                    Sinh Hiệu
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Chiều cao */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chiều cao (cm)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="300"
                            step="0.1"
                            value={formData.chieu_cao || ''}
                            onChange={(e) => handleChange('chieu_cao', e.target.value)}
                            placeholder="170"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                        />
                    </div>

                    {/* Cân nặng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cân nặng (kg)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="500"
                            step="0.1"
                            value={formData.can_nang || ''}
                            onChange={(e) => handleChange('can_nang', e.target.value)}
                            placeholder="65"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                        />
                    </div>

                    {/* Huyết áp */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            Huyết áp (mmHg)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="300"
                            value={formData.huyet_ap || ''}
                            onChange={(e) => handleChange('huyet_ap', e.target.value)}
                            placeholder="120"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">VD: 120 (cho 120/80)</p>
                    </div>

                    {/* Nhiệt độ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            Nhiệt độ (°C)
                        </label>
                        <input
                            type="number"
                            min="30"
                            max="45"
                            step="0.1"
                            value={formData.nhiet_do || ''}
                            onChange={(e) => handleChange('nhiet_do', e.target.value)}
                            placeholder="37.5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                        />
                    </div>

                    {/* Nhịp tim */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Heart className="w-4 h-4 text-pink-500" />
                            Nhịp tim (bpm)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="300"
                            value={formData.nhip_tim || ''}
                            onChange={(e) => handleChange('nhip_tim', e.target.value)}
                            placeholder="75"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Thông tin khám bệnh */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-teal-600" />
                    Thông Tin Khám Bệnh
                </h3>

                <div className="space-y-4">
                    {/* Triệu chứng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Triệu chứng
                        </label>
                        <textarea
                            value={formData.trieu_chung || ''}
                            onChange={(e) => handleChange('trieu_chung', e.target.value)}
                            placeholder="Nhập triệu chứng chi tiết..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Chẩn đoán */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chẩn đoán <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.chuan_doan || ''}
                            onChange={(e) => handleChange('chuan_doan', e.target.value)}
                            placeholder="Nhập chẩn đoán bệnh..."
                            rows={3}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Phương pháp điều trị */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phương pháp điều trị
                        </label>
                        <textarea
                            value={formData.phuong_phap_dieu_tri || ''}
                            onChange={(e) => handleChange('phuong_phap_dieu_tri', e.target.value)}
                            placeholder="Nhập phương pháp điều trị..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MedicalRecordForm;