
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
    Scale,
    Clock,
    Search,
    Plus,
    Trash2
} from 'lucide-react';
import { doctorAPI } from '../../services/doctorAPI';
import medicineAPI from '../../services/medicineAPI';
import prescriptionAPI from '../../services/prescriptionAPI';

function Examination() {
    // State cho danh sách lịch hẹn
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form khám bệnh
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

    // Thuốc
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [invoiceNote, setInvoiceNote] = useState('');

    // Load dữ liệu ban đầu
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [appointmentsRes, medicinesRes] = await Promise.all([
                doctorAPI.getTodayAppointments(),
                medicineAPI.getAll()
            ]);
            setAppointments(appointmentsRes.data || []);
            setMedicines(medicinesRes.data.data || []);
        } catch (err) {
            console.error('Lỗi tải dữ liệu:', err);
            setError('Không thể tải dữ liệu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleMedicalRecordChange = (field, value) => {
        setMedicalRecord(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSelectAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setError('');
        setSuccess(false);
        // Reset form
        setMedicalRecord({
            chieu_cao: '',
            can_nang: '',
            huyet_ap: '',
            nhiet_do: '',
            nhip_tim: '',
            trieu_chung: '',
            chuan_doan: '',
            phuong_phap_dieu_tri: ''
        });
        setSelectedMedicines([]);
        setInvoiceNote('');
    };

    // Medicine handlers
    const addMedicine = () => {
        setSelectedMedicines([
            ...selectedMedicines,
            { ma_thuoc: '', so_luong: 1, ghi_chu: '' }
        ]);
    };

    const updateMedicine = (index, field, value) => {
        const newList = [...selectedMedicines];
        newList[index][field] = value;
        setSelectedMedicines(newList);
    };

    const removeMedicine = (index) => {
        setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index));
    };

    // Calculate totals
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const serviceFee = selectedAppointment?.gia_dich_vu_lich_hen || 0;
    const medicineTotal = selectedMedicines.reduce((total, med) => {
        const medicine = medicines.find(m => m.ma_thuoc === med.ma_thuoc);
        return total + (medicine?.don_gia_thuoc || 0) * (parseInt(med.so_luong) || 0);
    }, 0);
    const grandTotal = serviceFee + medicineTotal;

    // Validation
    const validateForm = () => {
        if (!medicalRecord.trieu_chung || !medicalRecord.trieu_chung.trim()) {
            setError('Vui lòng nhập triệu chứng');
            return false;
        }

        if (!medicalRecord.chuan_doan || !medicalRecord.chuan_doan.trim()) {
            setError('Vui lòng nhập chẩn đoán');
            return false;
        }

        if (selectedMedicines.length === 0) {
            setError('Vui lòng chọn ít nhất 1 loại thuốc');
            return false;
        }

        const invalidMedicines = selectedMedicines.filter(med => !med.ma_thuoc);
        if (invalidMedicines.length > 0) {
            setError('Vui lòng chọn thuốc cho tất cả các dòng');
            return false;
        }

        const missingNotes = selectedMedicines.filter(med => !med.ghi_chu || !med.ghi_chu.trim());
        if (missingNotes.length > 0) {
            setError('Vui lòng nhập hướng dẫn sử dụng cho tất cả thuốc');
            return false;
        }

        const overStock = selectedMedicines.filter(med => {
            const medicine = medicines.find(m => m.ma_thuoc === med.ma_thuoc);
            return parseInt(med.so_luong) > (medicine?.so_luong_thuoc_ton_thuoc || 0);
        });
        if (overStock.length > 0) {
            setError('Có thuốc vượt quá tồn kho. Vui lòng kiểm tra lại số lượng.');
            return false;
        }

        return true;
    };

    // Submit
    const handleSubmit = async () => {
        setError('');

        if (!selectedAppointment) {
            setError('Vui lòng chọn lịch hẹn');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                ma_lich_hen: selectedAppointment.ma_lich_hen,
                ma_bac_si: selectedAppointment.ma_bac_si,
                ...medicalRecord,
                medicines: selectedMedicines.map(med => ({
                    ma_thuoc: med.ma_thuoc,
                    so_luong: parseInt(med.so_luong),
                    ghi_chu: med.ghi_chu
                })),
                ghi_chu_hoa_don: invoiceNote
            };

            await prescriptionAPI.create(payload);

            setSuccess(true);

            // Reload danh sách và reset form
            setTimeout(async () => {
                await fetchData();
                setSelectedAppointment(null);
                setSuccess(false);
            }, 2000);

        } catch (err) {
            console.error('Submit error:', err);
            setError(err.message || 'Có lỗi xảy ra khi hoàn tất khám bệnh');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredAppointments = appointments.filter(a =>
        a.ten_benh_nhan?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4">


                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3 shadow-md">
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-green-900">Hoàn tất khám bệnh thành công!</p>
                            <p className="text-sm text-green-700">Đơn thuốc và hóa đơn đã được tạo.</p>
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
                    {/* DANH SÁCH LỊCH HẸN */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                                <h2 className="text-white font-semibold flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Lịch hẹn hôm nay ({filteredAppointments.length})
                                </h2>
                            </div>

                            {/* Search */}
                            <div className="p-4 border-b">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Tìm bệnh nhân..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                                {filteredAppointments.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>Không có lịch hẹn</p>
                                    </div>
                                ) : (
                                    filteredAppointments.map((appointment) => (
                                        <div
                                            key={appointment.ma_lich_hen}
                                            className={`p-4 border-b cursor-pointer transition-all hover:bg-gray-50 ${selectedAppointment?.ma_lich_hen === appointment.ma_lich_hen
                                                ? 'bg-blue-50 border-l-4 border-l-blue-600'
                                                : ''
                                                }`}
                                            onClick={() => handleSelectAppointment(appointment)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 p-2 rounded-lg">
                                                    <User className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">
                                                        {appointment.ten_benh_nhan}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                        <Clock className="w-4 h-4" />
                                                        {appointment.gio_bat_dau.slice(0, 5)} - {appointment.gio_ket_thuc.slice(0, 5)}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                        <Phone className="w-4 h-4" />
                                                        {appointment.so_dien_thoai_benh_nhan}
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                            {appointment.ten_chuyen_khoa}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FORM KHÁM BỆNH */}
                    <div className="lg:col-span-2 space-y-6">
                        {!selectedAppointment ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <ClipboardList className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500 text-lg">
                                    Chọn bệnh nhân từ danh sách để bắt đầu khám
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Patient Info Card */}
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
                                                    {selectedAppointment.ho_benh_nhan} {selectedAppointment.ten_benh_nhan}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                            <div className="bg-green-100 p-2 rounded-lg">
                                                <Phone className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Số điện thoại</p>
                                                <p className="font-semibold text-gray-900">{selectedAppointment.so_dien_thoai_benh_nhan}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                            <div className="bg-purple-100 p-2 rounded-lg">
                                                <Calendar className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Lịch hẹn</p>
                                                <p className="font-semibold text-gray-900">
                                                    {selectedAppointment.gio_bat_dau.slice(0, 5)} - {new Date(selectedAppointment.ngay_hen).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-sm font-medium text-gray-700">
                                                Danh sách thuốc
                                            </label>
                                            <button
                                                onClick={addMedicine}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Thêm thuốc
                                            </button>
                                        </div>

                                        {selectedMedicines.length === 0 ? (
                                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                                <Package className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                                                <p className="text-gray-500 text-lg mb-2">Chưa có thuốc nào được kê</p>
                                                <p className="text-gray-400 text-sm">Nhấn nút "Thêm thuốc" để bắt đầu</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {selectedMedicines.map((med, index) => {
                                                    const medicineInfo = medicines.find(m => m.ma_thuoc === med.ma_thuoc);
                                                    return (
                                                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                            <div className="grid grid-cols-12 gap-3">
                                                                <div className="col-span-5">
                                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                        Tên thuốc *
                                                                    </label>
                                                                    <select
                                                                        value={med.ma_thuoc}
                                                                        onChange={(e) => updateMedicine(index, 'ma_thuoc', e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    />
                                                                </div>

                                                                <div className="col-span-4">
                                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                        Hướng dẫn sử dụng *
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={med.ghi_chu}
                                                                        onChange={(e) => updateMedicine(index, 'ghi_chu', e.target.value)}
                                                                        placeholder="VD: Uống 2 viên sau ăn, ngày 3 lần"
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    />
                                                                </div>

                                                                <div className="col-span-1 flex items-end">
                                                                    <button
                                                                        onClick={() => removeMedicine(index)}
                                                                        className="w-full p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mx-auto" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
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

                                {/* Summary & Submit */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                                                {medicalRecord.trieu_chung && medicalRecord.chuan_doan ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                                )}
                                                <span className={medicalRecord.trieu_chung && medicalRecord.chuan_doan ? 'text-green-700' : 'text-gray-600'}>
                                                    Triệu chứng & Chẩn đoán
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                {selectedMedicines.length > 0 && selectedMedicines.every(m => m.ghi_chu && m.ma_thuoc) ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                                )}
                                                <span className={selectedMedicines.length > 0 && selectedMedicines.every(m => m.ghi_chu && m.ma_thuoc) ? 'text-green-700' : 'text-gray-600'}>
                                                    Hướng dẫn sử dụng đầy đủ
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setSelectedAppointment(null)}
                                                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={submitting}
                                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-md"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Đang xử lý...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-5 h-5" />
                                                        Hoàn Tất Khám
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Examination;