import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle2, ClipboardList, Loader2 } from 'lucide-react';
import AppointmentList from './AppointmentList';
import PatientInfo from './PatientInfo';
import MedicalInfoForm from './MedicalInfoForm';
import MedicinePrescription from './MedicinePrescription';
import InvoiceNote from './InvoiceNote';
import InvoiceSummary from './InvoiceSummary';
import { doctorAPI } from '../../services/doctorAPI';
import medicineAPI from '../../services/medicineAPI';
import prescriptionAPI from '../../services/prescriptionAPI';
import { use } from 'react';


function Examination() {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [invoiceNote, setInvoiceNote] = useState('');
    function handleMedicalRecordChange(field, value) {
        setMedicalRecord(prev => ({
            ...prev,
            [field]: value
        }));
    }
    const [medicalRecord, setMedicalRecord] = useState({
        trieu_chung: '',
        chuan_doan: '',
        phuong_phap_dieu_tri: ''
    });

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




    const handleSelectAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setError('');
        setSuccess(false);
        setMedicalRecord({
            trieu_chung: '',
            chuan_doan: '',
            phuong_phap_dieu_tri: ''
        });

        setSelectedMedicines([]);
        setInvoiceNote('');
    };

    const handleSubmit = async () => {
        setError('');
        if (!selectedAppointment) {
            setError('Vui lòng chọn lịch hẹn');
            return;
        }
        // Validation logic (giữ nguyên)
        // ... (validateForm như cũ)
        setSubmitting(true);
        try {
            const payload = {
                ma_lich_hen: selectedAppointment.ma_lich_hen,
                ma_bac_si: selectedAppointment.ma_bac_si,
                trieu_chung: medicalRecord.trieu_chung,
                chuan_doan: medicalRecord.chuan_doan,
                phuong_phap_dieu_tri: medicalRecord.phuong_phap_dieu_tri,
                medicines: selectedMedicines.map(med => ({
                    ma_thuoc: med.ma_thuoc,
                    so_luong: parseInt(med.so_luong),
                    ghi_chu: med.ghi_chu
                })),
                ghi_chu_hoa_don: invoiceNote
            };
            await prescriptionAPI.create(payload);
            setSuccess(true);
            setTimeout(async () => {
                await fetchData();
                setSelectedAppointment(null);
                setSuccess(false);
            }, 2000);
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi hoàn tất khám bệnh');
        } finally {
            setSubmitting(false);
        }
    };

    const serviceFee = Number(selectedAppointment?.gia_dich_vu_lich_hen || 0);

    const medicineTotal = selectedMedicines.reduce((total, med) => {
        const medicine = medicines.find(m => m.ma_thuoc === med.ma_thuoc);
        const price = Number(medicine?.don_gia_thuoc || 0);
        const quantity = Number(med.so_luong || 0);
        return total + price * quantity;
    }, 0);

    console.log('Medicine Total:', medicineTotal);
    console.log('Service Fee:', serviceFee);
    const grandTotal = serviceFee + medicineTotal;

    console.log('Grand Total:', grandTotal);
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
                {/* Success & Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3 shadow-md">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-semibold text-green-900">Hoàn tất khám bệnh thành công!</p>
                            <p className="text-sm text-green-700">Đơn thuốc và hóa đơn đã được tạo.</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 shadow-md">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                        <div>
                            <p className="font-semibold text-red-900">Có lỗi xảy ra</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Appointment List */}
                    <AppointmentList
                        appointments={appointments}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedAppointment={selectedAppointment}
                        onSelectAppointment={handleSelectAppointment}
                    />

                    {/* Right: Form Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {!selectedAppointment ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <ClipboardList className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500 text-lg">Chọn bệnh nhân từ danh sách để bắt đầu khám</p>
                            </div>
                        ) : (
                            <>
                                <PatientInfo appointment={selectedAppointment} />


                                <MedicalInfoForm
                                    medicalRecord={medicalRecord}
                                    onChange={handleMedicalRecordChange}
                                />

                                <MedicinePrescription
                                    medicines={medicines}
                                    selectedMedicines={selectedMedicines}
                                    setSelectedMedicines={setSelectedMedicines}
                                />

                                <InvoiceNote
                                    value={invoiceNote}
                                    onChange={setInvoiceNote}
                                />

                                <InvoiceSummary
                                    serviceFee={serviceFee}
                                    medicineTotal={medicineTotal}
                                    grandTotal={grandTotal}
                                    selectedMedicines={selectedMedicines}
                                    medicalRecord={medicalRecord}
                                    submitting={submitting}
                                    onSubmit={handleSubmit}
                                    onCancel={() => setSelectedAppointment(null)}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}



export default Examination;