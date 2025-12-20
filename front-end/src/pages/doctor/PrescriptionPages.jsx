import React, { useState, useEffect } from 'react';
import {
    FileText,
    Pill,
    DollarSign,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ArrowLeft,
    Save,
    User,
    Phone,
    Calendar,
    Activity,
    Heart,
    Thermometer,
    Ruler,
    ClipboardList,
    Stethoscope,
    Package,
    Scale
} from 'lucide-react';
import { doctorAPI } from '../../services/doctorAPI';

// Mock components - thay thế bằng components thực của bạn
const MedicineSearch = ({ onSelect, excludeIds }) => (
    <div className="relative">
        <input
            type="text"
            placeholder="Tìm kiếm thuốc..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
    </div>
);

const MedicineList = ({ medicines, onUpdateQuantity, onUpdateNote, onRemove }) => (
    <div className="space-y-3">
        {medicines.map((med, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <p className="font-semibold text-gray-900">{med.ten_thuoc}</p>
                        <p className="text-sm text-gray-600">{(med.don_gia_thuoc || 0).toLocaleString('vi-VN')} đ / {med.don_vi_thuoc}</p>
                    </div>
                    <button
                        onClick={() => onRemove(med.ma_thuoc)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng</label>
                        <input
                            type="number"
                            min="1"
                            value={med.so_luong}
                            onChange={(e) => onUpdateQuantity(med.ma_thuoc, parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tồn kho</label>
                        <input
                            type="text"
                            value={med.so_luong_thuoc_ton_thuoc || 0}
                            disabled
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                        />
                    </div>
                </div>
                <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Hướng dẫn sử dụng *</label>
                    <input
                        type="text"
                        value={med.ghi_chu}
                        onChange={(e) => onUpdateNote(med.ma_thuoc, e.target.value)}
                        placeholder="VD: Uống 2 viên sau ăn, ngày 3 lần"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        ))}
    </div>
);

function PrescriptionPage() {
    // Mock appointment ID
    const appointmentId = 'appointment-123';

    // State
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Medical record data
    const [medicalRecord, setMedicalRecord] = useState({
        chieu_cao: '',
        can_nang: '',
        huyet_ap: '',
        nhiet_do: '',
        nhip_tim: '',
        trieu_chung: '',
        chuan_doan: '',
        phuong_phap_dieu_tri: ''
    });

    // Medicines
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [invoiceNote, setInvoiceNote] = useState('');

    // Load appointment
    useEffect(() => {
        loadAppointment();
    }, []);

    const loadAppointment = async () => {
        setLoading(true);
        try {
            setTimeout(() => {
                setAppointment({
                    ma_lich_hen: appointmentId,
                    ma_benh_nhan: 'patient-uuid',
                    ma_bac_si: 'doctor-uuid',
                    ma_chuyen_khoa: 'specialty-uuid',
                    ten_benh_nhan: 'Nguyễn Văn A',
                    ho_benh_nhan: 'Bệnh nhân',
                    so_dien_thoai_benh_nhan: '0901234567',
                    gia_dich_vu_lich_hen: 200000,
                    ten_dich_vu: 'Khám tổng quát',
                    ly_do_kham_lich_hen: 'Đau răng',
                    ngay_hen: '2025-12-18',
                    gio_hen: '14:30'
                });
                setLoading(false);
            }, 1000);
        } catch (err) {
            console.error('Load appointment error:', err);
            setError('Không thể tải thông tin lịch hẹn');
            setLoading(false);
        }
    };

    // Medicine handlers - Mock data cho demo
    const handleSelectMedicine = () => {
        const mockMedicine = {
            ma_thuoc: `med-${Date.now()}`,
            ten_thuoc: 'Paracetamol 500mg',
            don_gia_thuoc: 5000,
            don_vi_thuoc: 'viên',
            so_luong_thuoc_ton_thuoc: 100,
            so_luong: 1,
            ghi_chu: ''
        };
        setSelectedMedicines([...selectedMedicines, mockMedicine]);
    };

    const handleUpdateQuantity = (medicineId, quantity) => {
        setSelectedMedicines(
            selectedMedicines.map(med =>
                med.ma_thuoc === medicineId
                    ? { ...med, so_luong: quantity }
                    : med
            )
        );
    };

    const handleUpdateNote = (medicineId, note) => {
        setSelectedMedicines(
            selectedMedicines.map(med =>
                med.ma_thuoc === medicineId
                    ? { ...med, ghi_chu: note }
                    : med
            )
        );
    };

    const handleRemoveMedicine = (medicineId) => {
        setSelectedMedicines(
            selectedMedicines.filter(med => med.ma_thuoc !== medicineId)
        );
    };

    const handleMedicalRecordChange = (field, value) => {
        setMedicalRecord(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Calculate totals
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const serviceFee = appointment?.gia_dich_vu_lich_hen || 0;
    const medicineTotal = selectedMedicines.reduce(
        (total, med) => total + (med.don_gia_thuoc || 0) * (med.so_luong || 0),
        0
    );
    const grandTotal = serviceFee + medicineTotal;

    // Validation
    const validateForm = () => {
        if (!medicalRecord.chuan_doan || !medicalRecord.chuan_doan.trim()) {
            setError('Vui lòng nhập chẩn đoán');
            return false;
        }

        if (selectedMedicines.length === 0) {
            setError('Vui lòng chọn ít nhất 1 loại thuốc');
            return false;
        }

        const missingNotes = selectedMedicines.filter(med => !med.ghi_chu || !med.ghi_chu.trim());
        if (missingNotes.length > 0) {
            setError('Vui lòng nhập hướng dẫn sử dụng cho tất cả thuốc');
            return false;
        }

        const overStock = selectedMedicines.filter(
            med => med.so_luong > (med.so_luong_thuoc_ton_thuoc || 0)
        );
        if (overStock.length > 0) {
            setError('Có thuốc vượt quá tồn kho. Vui lòng kiểm tra lại số lượng.');
            return false;
        }

        return true;
    };

    // Submit
    const handleSubmit = async () => {
        setError('');

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            setSuccess(true);

            // Mock redirect
            setTimeout(() => {
                alert('Chuyển đến trang hóa đơn...');
            }, 2000);

        } catch (err) {
            console.error('Submit error:', err);
            setError(err.message || 'Có lỗi xảy ra khi kê đơn thuốc');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Activity className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-700 text-lg">Không tìm thấy lịch hẹn</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Quay lại</span>
                    </button>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                            <Stethoscope className="w-8 h-8 text-blue-600" />
                            Kê Đơn Thuốc
                        </h1>

                        {/* Patient Info Cards */}
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
                                        {appointment.gio_hen} - {new Date(appointment.ngay_hen).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3 shadow-md">
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-green-900">Kê đơn thuốc thành công!</p>
                            <p className="text-sm text-green-700">Đang chuyển đến trang hóa đơn...</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 shadow-md">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-red-900">Có lỗi xảy ra</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Medical Record Form */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                                <h2 className="text-white font-semibold flex items-center gap-2">
                                    <ClipboardList className="w-5 h-5" />
                                    Hồ Sơ Khám Bệnh
                                </h2>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Chỉ số sinh hiệu */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-red-600" />
                                        Chỉ số sinh hiệu
                                    </h3>
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

                                {/* Thông tin khám */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Thông tin khám
                                    </h3>
                                    <div className="space-y-4">
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
                            </div>
                        </div>

                        {/* Medicine Section */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
                                <h2 className="text-white font-semibold flex items-center gap-2">
                                    <Pill className="w-5 h-5" />
                                    Kê Đơn Thuốc
                                </h2>
                            </div>

                            <div className="p-6">
                                {/* Medicine Search - Mock button for demo */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tìm kiếm và thêm thuốc
                                    </label>
                                    <div className="flex gap-2">
                                        <MedicineSearch
                                            onSelect={handleSelectMedicine}
                                            excludeIds={selectedMedicines.map(m => m.ma_thuoc)}
                                        />
                                        <button
                                            onClick={handleSelectMedicine}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                                        >
                                            + Thêm thuốc mẫu
                                        </button>
                                    </div>
                                </div>

                                {/* Medicine List */}
                                {selectedMedicines.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <Package className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500 text-lg mb-2">Chưa có thuốc nào được kê</p>
                                        <p className="text-gray-400 text-sm">Sử dụng nút "Thêm thuốc mẫu" để thêm thuốc</p>
                                    </div>
                                ) : (
                                    <MedicineList
                                        medicines={selectedMedicines}
                                        onUpdateQuantity={handleUpdateQuantity}
                                        onUpdateNote={handleUpdateNote}
                                        onRemove={handleRemoveMedicine}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Invoice Note */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-600" />
                                Ghi chú hóa đơn
                            </label>
                            <textarea
                                value={invoiceNote}
                                onChange={(e) => setInvoiceNote(e.target.value)}
                                placeholder="VD: Hẹn tái khám sau 1 tuần..."
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Tổng Kết Chi Phí
                                </h3>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="text-gray-700 flex items-center gap-2">
                                            <Stethoscope className="w-4 h-4 text-blue-600" />
                                            Tiền khám
                                        </span>
                                        <span className="font-semibold text-gray-900">{formatPrice(serviceFee)}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="text-gray-700 flex items-center gap-2">
                                            <Pill className="w-4 h-4 text-green-600" />
                                            Tiền thuốc
                                        </span>
                                        <span className="font-semibold text-gray-900">{formatPrice(medicineTotal)}</span>
                                    </div>

                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                                            <span className="text-xl font-bold text-purple-700">{formatPrice(grandTotal)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checklist */}
                                <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Kiểm tra:</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        {selectedMedicines.length > 0 ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                        )}
                                        <span className={selectedMedicines.length > 0 ? 'text-green-700' : 'text-gray-600'}>
                                            {selectedMedicines.length} loại thuốc
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {medicalRecord.chuan_doan ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                        )}
                                        <span className={medicalRecord.chuan_doan ? 'text-green-700' : 'text-gray-600'}>
                                            Chẩn đoán
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {selectedMedicines.every(m => m.ghi_chu) ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                        )}
                                        <span className={selectedMedicines.every(m => m.ghi_chu) ? 'text-green-700' : 'text-gray-600'}>
                                            Hướng dẫn sử dụng
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-md"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Lưu & Tạo Hóa Đơn
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrescriptionPage;