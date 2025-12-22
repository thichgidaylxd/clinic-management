import React, { useState, useEffect } from 'react';
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    ClipboardList,
    Loader2
} from 'lucide-react';

import AppointmentList from './AppointmentList';
import PatientInfo from './PatientInfo';
import MedicalInfoForm from './MedicalInfoForm';
import MedicinePrescription from './MedicinePrescription';
import InvoiceNote from './InvoiceNote';
import InvoiceSummary from './InvoiceSummary';

import { doctorAPI } from '../../services/doctorAPI';
import medicineAPI from '../../services/medicineAPI';
import prescriptionAPI from '../../services/prescriptionAPI';

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
    const [extraFee, setExtraFee] = useState(0);

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
        setExtraFee(0);
        setInvoiceNote('');
        setSelectedMedicines([]);
        setMedicalRecord({
            trieu_chung: '',
            chuan_doan: '',
            phuong_phap_dieu_tri: ''
        });
    };

    const handleSubmit = async () => {
        if (!selectedAppointment) {
            setError('Vui lòng chọn lịch hẹn');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const payload = {
                ma_lich_hen: selectedAppointment.ma_lich_hen,
                ma_bac_si: selectedAppointment.ma_bac_si,
                trieu_chung: medicalRecord.trieu_chung,
                chuan_doan: medicalRecord.chuan_doan,
                phuong_phap_dieu_tri: medicalRecord.phuong_phap_dieu_tri,
                medicines: selectedMedicines.map(med => ({
                    ma_thuoc: med.ma_thuoc,
                    so_luong: Number(med.so_luong),
                    ghi_chu: med.ghi_chu
                })),
                ghi_chu_hoa_don: invoiceNote,
                chi_phi_phat_sinh: extraFee
            };

            await prescriptionAPI.create(payload);

            setSuccess(true);

            // ⏳ GIỮ LOADING trong suốt quá trình xử lý sau submit
            await fetchData();

            setTimeout(() => {
                setSelectedAppointment(null);
                setSuccess(false);
            }, 1500);

        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi hoàn tất khám bệnh');
        } finally {
            setSubmitting(false);
        }
    };

    const serviceFee = Number(selectedAppointment?.gia_dich_vu_lich_hen || 0);
    const serviceName = selectedAppointment?.ten_dich_vu || 'Dịch vụ khám';

    const medicineTotal = selectedMedicines.reduce((total, med) => {
        const medicine = medicines.find(m => m.ma_thuoc === med.ma_thuoc);
        const price = Number(medicine?.don_gia_thuoc || 0);
        return total + price * Number(med.so_luong || 0);
    }, 0);

    const grandTotal = serviceFee + medicineTotal + extraFee;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Activity className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 relative">

            {/* ===== GLOBAL LOADING OVERLAY ===== */}
            {submitting && (
                <div className="fixed inset-0 bg-black/30 z-[9999] flex items-center justify-center">
                    <div className="bg-white px-8 py-6 rounded-xl shadow-lg flex flex-col items-center">
                        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-3" />
                        <p className="text-sm font-medium text-gray-700">
                            Đang hoàn tất khám bệnh...
                        </p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4">
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-semibold text-green-900">
                                Hoàn tất khám bệnh thành công!
                            </p>
                            <p className="text-sm text-green-700">
                                Đơn thuốc và hóa đơn đã được tạo.
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                        <div>
                            <p className="font-semibold text-red-900">Có lỗi xảy ra</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <AppointmentList
                        appointments={appointments}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedAppointment={selectedAppointment}
                        onSelectAppointment={handleSelectAppointment}
                    />

                    <div className="lg:col-span-2 space-y-6">
                        {!selectedAppointment ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <ClipboardList className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">
                                    Chọn bệnh nhân từ danh sách để bắt đầu khám
                                </p>
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
                                    serviceName={serviceName}
                                    serviceFee={serviceFee}
                                    medicineTotal={medicineTotal}
                                    extraFee={extraFee}
                                    setExtraFee={setExtraFee}
                                    grandTotal={grandTotal}
                                    selectedMedicines={selectedMedicines}
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
