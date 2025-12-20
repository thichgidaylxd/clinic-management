import React from 'react';
import { FileText } from 'lucide-react';

function MedicalInfoForm({ medicalRecord, onChange }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Thông tin khám
                </h2>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Triệu chứng *
                    </label>
                    <textarea
                        value={medicalRecord.trieu_chung}
                        onChange={(e) => handleMedicalRecordChange('trieu_chung', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Mô tả triệu chứng của bệnh nhân..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chẩn đoán *
                    </label>
                    <textarea
                        value={medicalRecord.chuan_doan}
                        onChange={(e) => handleMedicalRecordChange('chuan_doan', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Chẩn đoán bệnh..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phương pháp điều trị
                    </label>
                    <textarea
                        value={medicalRecord.phuong_phap_dieu_tri}
                        onChange={(e) => handleMedicalRecordChange('phuong_phap_dieu_tri', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Phương pháp điều trị..."
                    />
                </div>
            </div>
        </div>
    );
}

export default MedicalInfoForm;