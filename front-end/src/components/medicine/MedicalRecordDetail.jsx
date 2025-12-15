import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FileText,
    ArrowLeft,
    User,
    Calendar,
    Activity,
    Heart,
    Thermometer,
    Stethoscope,
    Loader2,
    AlertCircle,
    Printer
} from 'lucide-react';
import medicalRecordAPI from '../../services/medicalRecordAPI';

function MedicalRecordDetail() {
    const { recordId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [record, setRecord] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRecord();
    }, [recordId]);

    const loadRecord = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await medicalRecordAPI.getById(recordId);
            setRecord(response.data);
        } catch (err) {
            console.error('Load record error:', err);
            setError('Không thể tải hồ sơ bệnh án');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        );
    }

    if (error || !record) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-700">{error || 'Không tìm thấy hồ sơ'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between no-print">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-teal-600" />
                        Chi Tiết Hồ Sơ Bệnh Án
                    </h1>
                </div>

                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                    <Printer className="w-5 h-5" />
                    In hồ sơ
                </button>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-6">
                    <h2 className="text-2xl font-bold mb-2">HỒ SƠ BỆNH ÁN</h2>
                    <p className="text-teal-100">Phòng khám Nha khoa</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Patient Info */}
                    <div className="grid grid-cols-2 gap-6 pb-6 border-b">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Thông tin bệnh nhân
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p>
                                    <span className="text-gray-600">Họ tên:</span>{' '}
                                    <span className="font-semibold">
                                        {record.ho_benh_nhan} {record.ten_benh_nhan}
                                    </span>
                                </p>
                                {record.ngay_sinh_benh_nhan && (
                                    <p>
                                        <span className="text-gray-600">Ngày sinh:</span>{' '}
                                        {formatDate(record.ngay_sinh_benh_nhan)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Thông tin hồ sơ
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p>
                                    <span className="text-gray-600">Ngày tạo:</span>{' '}
                                    {formatDate(record.ngay_tao_ho_so)}
                                </p>
                                <p>
                                    <span className="text-gray-600">Bác sĩ:</span>{' '}
                                    {record.ho_bac_si} {record.ten_bac_si}
                                </p>
                                {record.ten_chuyen_khoa && (
                                    <p>
                                        <span className="text-gray-600">Chuyên khoa:</span>{' '}
                                        <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">
                                            {record.ten_chuyen_khoa}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vital Signs */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-teal-600" />
                            Sinh Hiệu
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {record.chieu_cao && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 mb-1">Chiều cao</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {record.chieu_cao} <span className="text-sm font-normal">cm</span>
                                    </p>
                                </div>
                            )}

                            {record.can_nang && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 mb-1">Cân nặng</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {record.can_nang} <span className="text-sm font-normal">kg</span>
                                    </p>
                                </div>
                            )}

                            {record.huyet_ap && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                        <Heart className="w-3 h-3" />
                                        Huyết áp
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {record.huyet_ap} <span className="text-sm font-normal">mmHg</span>
                                    </p>
                                </div>
                            )}

                            {record.nhiet_do && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                        <Thermometer className="w-3 h-3" />
                                        Nhiệt độ
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {record.nhiet_do} <span className="text-sm font-normal">°C</span>
                                    </p>
                                </div>
                            )}

                            {record.nhip_tim && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                        <Heart className="w-3 h-3" />
                                        Nhịp tim
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {record.nhip_tim} <span className="text-sm font-normal">bpm</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 text-teal-600" />
                            Thông Tin Khám Bệnh
                        </h3>

                        <div className="space-y-4">
                            {/* Triệu chứng */}
                            {record.trieu_chung && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Triệu chứng:
                                    </label>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-900 whitespace-pre-wrap">
                                            {record.trieu_chung}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Chẩn đoán */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Chẩn đoán:
                                </label>
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                                    <p className="text-gray-900 font-medium whitespace-pre-wrap">
                                        {record.chuan_doan}
                                    </p>
                                </div>
                            </div>

                            {/* Phương pháp điều trị */}
                            {record.phuong_phap_dieu_tri && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phương pháp điều trị:
                                    </label>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <p className="text-gray-900 whitespace-pre-wrap">
                                            {record.phuong_phap_dieu_tri}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t text-center text-sm text-gray-600">
                        <p>Hồ sơ bệnh án được lưu trữ và bảo mật theo quy định</p>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background: white;
                    }
                }
            `}</style>
        </div>
    );
}

export default MedicalRecordDetail;