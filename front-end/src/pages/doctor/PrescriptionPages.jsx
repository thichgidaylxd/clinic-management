import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FileText,
    Pill,
    DollarSign,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ArrowLeft,
    Save
} from 'lucide-react';
import MedicineList from '../../components/medicine/MedicineList';
import MedicineSearch from '../../components/medicine/MedicineSearch';
import MedicalRecordForm from '../../components/medicine/MedicalRecordForm';
import prescriptionAPI from '../../services/prescriptionAPI';
import { formatPrice } from '../../util/priceFormatter';

function PrescriptionPage() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

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
    }, [appointmentId]);

    const loadAppointment = async () => {
        setLoading(true);
        try {
            // TODO: Replace with actual API call
            // const response = await appointmentAPI.getById(appointmentId);
            // setAppointment(response.data);

            // Mock data for now
            setAppointment({
                ma_lich_hen: appointmentId,
                ma_benh_nhan: 'patient-uuid',
                ma_bac_si: 'doctor-uuid',
                ma_chuyen_khoa: 'specialty-uuid',
                ten_benh_nhan: 'Nguyễn Văn A',
                ho_benh_nhan: 'Bác sĩ',
                so_dien_thoai_benh_nhan: '0901234567',
                gia_dich_vu_lich_hen: 200000,
                ten_dich_vu: 'Khám tổng quát',
                ly_do_kham_lich_hen: 'Đau răng'
            });
        } catch (err) {
            console.error('Load appointment error:', err);
            setError('Không thể tải thông tin lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    // Medicine handlers
    const handleSelectMedicine = (medicine) => {
        setSelectedMedicines([
            ...selectedMedicines,
            {
                ...medicine,
                so_luong: 1,
                ghi_chu: ''
            }
        ]);
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

    // Calculate totals
    const serviceFee = appointment?.gia_dich_vu_lich_hen || 0;
    const medicineTotal = selectedMedicines.reduce(
        (total, med) => total + calculateSubtotal(med.don_gia_thuoc, med.so_luong),
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

        // Check if all medicines have notes
        const missingNotes = selectedMedicines.filter(med => !med.ghi_chu || !med.ghi_chu.trim());
        if (missingNotes.length > 0) {
            setError('Vui lòng nhập hướng dẫn sử dụng cho tất cả thuốc');
            return false;
        }

        // Check if any medicine exceeds stock
        const overStock = selectedMedicines.filter(
            med => med.so_luong > med.so_luong_thuoc_ton_thuoc
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
            // Prepare data
            const data = {
                ma_lich_hen: appointmentId,
                ma_bac_si: appointment.ma_bac_si,
                ...medicalRecord,
                medicines: selectedMedicines.map(med => ({
                    ma_thuoc: med.ma_thuoc,
                    so_luong: med.so_luong,
                    ghi_chu: med.ghi_chu
                })),
                ghi_chu_hoa_don: invoiceNote
            };

            // Call API
            const response = await prescriptionAPI.create(data);

            setSuccess(true);

            // Redirect to invoice after 2 seconds
            setTimeout(() => {
                navigate(`/invoices/${response.data.ma_hoa_don}`);
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
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-700">Không tìm thấy lịch hẹn</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-teal-600" />
                        Kê Đơn Thuốc
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Bệnh nhân: <span className="font-semibold">{appointment.ho_benh_nhan} {appointment.ten_benh_nhan}</span>
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-semibold text-green-900">Kê đơn thuốc thành công!</p>
                            <p className="text-sm text-green-700">Đang chuyển đến trang hóa đơn...</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <MedicalRecordForm
                                formData={medicalRecord}
                                onChange={setMedicalRecord}
                            />
                        </div>

                        {/* Medicine Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Pill className="w-6 h-6 text-teal-600" />
                                Kê Đơn Thuốc
                            </h2>

                            {/* Medicine Search */}
                            <div className="mb-6">
                                <MedicineSearch
                                    onSelect={handleSelectMedicine}
                                    excludeIds={selectedMedicines.map(m => m.ma_thuoc)}
                                />
                            </div>

                            {/* Medicine List */}
                            <MedicineList
                                medicines={selectedMedicines}
                                onUpdateQuantity={handleUpdateQuantity}
                                onUpdateNote={handleUpdateNote}
                                onRemove={handleRemoveMedicine}
                            />
                        </div>

                        {/* Invoice Note */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ghi chú hóa đơn
                            </label>
                            <textarea
                                value={invoiceNote}
                                onChange={(e) => setInvoiceNote(e.target.value)}
                                placeholder="VD: Hẹn tái khám sau 1 tuần..."
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-teal-600" />
                                Tổng Kết
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Tiền khám:</span>
                                    <span className="font-semibold">{formatPrice(serviceFee)}</span>
                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span>Tiền thuốc:</span>
                                    <span className="font-semibold">{formatPrice(medicineTotal)}</span>
                                </div>

                                <div className="border-t-2 border-gray-200 pt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Tổng cộng:</span>
                                        <span className="text-teal-700">{formatPrice(grandTotal)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-6">
                                <p>✓ {selectedMedicines.length} loại thuốc</p>
                                <p>✓ Chẩn đoán: {medicalRecord.chuan_doan ? '✓' : '✗'}</p>
                                <p>✓ Hướng dẫn sử dụng: {selectedMedicines.every(m => m.ghi_chu) ? '✓' : '✗'}</p>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
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
    );
}

export default PrescriptionPage;