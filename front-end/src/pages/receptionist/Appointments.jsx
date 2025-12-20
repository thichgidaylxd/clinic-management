import React, { useEffect, useState } from 'react';
import {
    Clock,
    CheckCircle,
    UserCheck,
    Stethoscope,
    XCircle,
    AlertCircle,
    User,
    Phone,
    CalendarDays,
    FileText
} from 'lucide-react';
import { receptionistAPI } from '../../services/receptionistAPI';
import { adminAPI } from '../../services/adminAPI';
import TokenUtil from '../../util/tokenUtil';

function ReceptionistAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const [filters, setFilters] = useState({
        search: '',
        doctorId: '',
        status: ''
    });

    const [noteModal, setNoteModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [note, setNote] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadData();
        }, 500); // Debounce 500ms

        return () => clearTimeout(timeoutId);
    }, [selectedDate, filters.search, filters.doctorId, filters.status]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [aptRes, doctorRes] = await Promise.all([
                receptionistAPI.getAppointmentsByDate(selectedDate),
                adminAPI.getDoctors(1, 100)
            ]);

            let filteredAppointments = aptRes.data || [];

            // Lọc theo tìm kiếm (tên hoặc SĐT bệnh nhân)
            if (filters.search.trim()) {
                const searchLower = filters.search.toLowerCase().trim();
                filteredAppointments = filteredAppointments.filter(apt => {
                    const fullName = `${apt.ho_benh_nhan} ${apt.ten_benh_nhan}`.toLowerCase();
                    const phone = apt.so_dien_thoai_benh_nhan || '';
                    return fullName.includes(searchLower) || phone.includes(searchLower);
                });
            }

            // Lọc theo bác sĩ
            if (filters.doctorId) {
                filteredAppointments = filteredAppointments.filter(
                    apt => apt.ma_bac_si === parseInt(filters.doctorId)
                );
            }

            // Lọc theo trạng thái
            if (filters.status !== '') {
                filteredAppointments = filteredAppointments.filter(
                    apt => apt.trang_thai_lich_hen === parseInt(filters.status)
                );
            }

            // Sắp xếp theo trạng thái
            const sortedAppointments = filteredAppointments.sort((a, b) => {
                return a.trang_thai_lich_hen - b.trang_thai_lich_hen;
            });

            setAppointments(sortedAppointments);
            setDoctors(doctorRes.data.data || []);
        } catch (e) {
            alert('Không thể tải dữ liệu');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Helper: Cập nhật trạng thái local cho 1 appointment
    const updateAppointmentStatus = (appointmentId, newStatus) => {
        setAppointments(prevAppointments => {
            const updated = prevAppointments.map(apt =>
                apt.ma_lich_hen === appointmentId
                    ? { ...apt, trang_thai_lich_hen: newStatus }
                    : apt
            );

            // Sắp xếp lại theo trạng thái
            return updated.sort((a, b) => a.trang_thai_lich_hen - b.trang_thai_lich_hen);
        });
    };

    /* ================= ACTIONS – LỄ TÂN ================= */
    const handleConfirm = async (id) => {
        if (!confirm('Xác nhận lịch hẹn này?')) return;
        try {
            TokenUtil.getUserId();
            await receptionistAPI.confirmAppointment(id, null);
            updateAppointmentStatus(id, 1); // Cập nhật sang "Đã xác nhận"
        } catch (e) {
            alert('Không thể xác nhận lịch hẹn');
        }
    };

    const handleCheckIn = async (id) => {
        if (!confirm('Check-in bệnh nhân này?')) return;
        try {
            await receptionistAPI.checkInAppointment(id);
            updateAppointmentStatus(id, 2); // Cập nhật sang "Đã check-in"
        } catch (e) {
            alert('Không thể check-in');
        }
    };


    const handleNoShow = async (id) => {
        if (!confirm('Đánh dấu bệnh nhân không đến?')) return;
        try {
            await receptionistAPI.markNoShow(id);
            updateAppointmentStatus(id, 6); // Cập nhật sang "Không đến"
        } catch (e) {
            alert('Không thể cập nhật trạng thái');
        }
    };

    const handleSaveNote = async () => {
        try {
            await receptionistAPI.updateNote(selectedAppointment.ma_lich_hen, note);

            // Cập nhật ghi chú local
            setAppointments(prevAppointments =>
                prevAppointments.map(apt =>
                    apt.ma_lich_hen === selectedAppointment.ma_lich_hen
                        ? { ...apt, ghi_chu_lich_hen: note }
                        : apt
                )
            );

            setNoteModal(false);
        } catch (e) {
            alert('Không thể lưu ghi chú');
        }
    };

    /* ================= STATUS BADGE ================= */
    const getStatusBadge = (status) => {
        const map = {
            0: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
            1: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
            2: { label: 'Đã check-in', color: 'bg-teal-100 text-teal-700', icon: UserCheck },
            3: { label: 'Đang khám', color: 'bg-purple-100 text-purple-700', icon: Stethoscope },
            4: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: CheckCircle },
            5: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle },
            6: { label: 'Không đến', color: 'bg-gray-200 text-gray-700', icon: AlertCircle }
        };

        const s = map[status];
        const Icon = s.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>
                <Icon className="w-3 h-3" />
                {s.label}
            </span>
        );
    };

    /* ================= TIMELINE ================= */
    const Timeline = ({ status }) => {
        if (status === 5 || status === 6) return null;

        const steps = [
            { code: 0, label: 'Chờ xác nhận', icon: Clock },
            { code: 1, label: 'Xác nhận', icon: CheckCircle },
            { code: 2, label: 'Check-in', icon: UserCheck },
            { code: 3, label: 'Đang khám', icon: Stethoscope },
            { code: 4, label: 'Hoàn thành', icon: CheckCircle }
        ];

        return (
            <div className="flex items-center mt-5">
                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isDone = status > step.code;
                    const isActive = status === step.code;

                    return (
                        <div key={step.code} className="flex-1 flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                    ${isDone ? 'bg-green-600 text-white'
                                        : isActive ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-400'}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-xs mt-1 text-center">{step.label}</span>
                            </div>

                            {idx < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1 transition-all duration-300
                                    ${status > step.code ? 'bg-green-600' : 'bg-gray-300'}`} />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    /* ================= UI ================= */
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-6">
                <CalendarDays className="w-6 h-6 text-teal-700" />
                <h1 className="text-2xl font-bold text-gray-800">
                    Lịch hẹn ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
                </h1>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="ml-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
            </div>

            {/* FILTERS */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* TÌM KIẾM */}
                    <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Tìm bệnh nhân
                        </label>
                        <input
                            type="text"
                            placeholder="Tên hoặc SĐT"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                    </div>

                    {/* BÁC SĨ */}
                    <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Bác sĩ
                        </label>
                        <select
                            value={filters.doctorId}
                            onChange={(e) => setFilters({ ...filters, doctorId: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                            <option value="">Tất cả bác sĩ</option>
                            {doctors.map((d) => (
                                <option key={d.ma_bac_si} value={d.ma_bac_si}>
                                    BS. {d.ho_nguoi_dung} {d.ten_nguoi_dung}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* TRẠNG THÁI */}
                    <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Trạng thái
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                            <option value="">Tất cả</option>
                            <option value="0">Chờ xác nhận</option>
                            <option value="1">Đã xác nhận</option>
                            <option value="2">Đã check-in</option>
                            <option value="3">Đang khám</option>
                            <option value="4">Hoàn thành</option>
                            <option value="5">Đã hủy</option>
                            <option value="6">Không đến</option>
                        </select>
                    </div>

                    {/* RESET */}
                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ search: '', doctorId: '', status: '' })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Xóa lọc
                        </button>
                    </div>
                </div>
            </div>

            {/* APPOINTMENTS LIST */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    <p className="mt-2 text-gray-600">Đang tải...</p>
                </div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Không có lịch hẹn</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <div
                            key={apt.ma_lich_hen}
                            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            {/* HEADER - Time & Status */}
                            <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-teal-600" />
                                    <span className="text-xl font-semibold text-gray-800">
                                        {apt.gio_bat_dau?.substring(0, 5)} - {apt.gio_ket_thuc?.substring(0, 5)}
                                        {apt.ngay_hen !== selectedDate && (
                                            <span className="ml-2 text-sm text-gray-500">
                                                ({new Date(apt.ngay_hen).toLocaleDateString('vi-VN')})
                                            </span>
                                        )}
                                    </span>
                                </div>
                                {getStatusBadge(apt.trang_thai_lich_hen)}
                            </div>

                            {/* MAIN INFO - 2 Columns */}
                            <div className="grid md:grid-cols-2 gap-6 mb-4">
                                {/* Patient Info */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Thông tin bệnh nhân
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-teal-50 p-2 rounded-lg">
                                            <User className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {apt.ho_benh_nhan} {apt.ten_benh_nhan}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <Phone className="w-3 h-3" />
                                                {apt.so_dien_thoai_benh_nhan}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Info */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Bác sĩ khám
                                    </h4>
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            BS. {apt.ho_bac_si} {apt.ten_bac_si}
                                        </p>
                                        {apt.ten_chuyen_khoa && (
                                            <p className="text-sm text-teal-600 font-medium mt-1">
                                                {apt.ten_chuyen_khoa}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Reason */}
                            {apt.ly_do_kham && (
                                <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                                    <p className="text-xs font-semibold text-blue-700 uppercase mb-1">
                                        Lý do khám
                                    </p>
                                    <p className="text-sm text-gray-700">{apt.ly_do_kham}</p>
                                </div>
                            )}

                            {/* TIMELINE */}
                            <Timeline status={apt.trang_thai_lich_hen} />

                            {/* ACTIONS */}
                            <div className="flex flex-wrap items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                                {/* CHỜ XÁC NHẬN */}
                                {apt.trang_thai_lich_hen === 0 && (
                                    <>
                                        <button
                                            onClick={() => handleConfirm(apt.ma_lich_hen)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Xác nhận
                                        </button>

                                        <button
                                            onClick={() => handleNoShow(apt.ma_lich_hen)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            Không đến
                                        </button>
                                    </>
                                )}

                                {/* ĐÃ XÁC NHẬN */}
                                {apt.trang_thai_lich_hen === 1 && (
                                    <>
                                        <button
                                            onClick={() => handleCheckIn(apt.ma_lich_hen)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <UserCheck className="w-4 h-4" />
                                            Check-in
                                        </button>

                                        <button
                                            onClick={() => handleNoShow(apt.ma_lich_hen)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            Không đến
                                        </button>
                                    </>
                                )}

                                {/* GHI CHÚ - LUÔN HIỂN THỊ */}
                                <button
                                    onClick={() => {
                                        setSelectedAppointment(apt);
                                        setNote(apt.ghi_chu_lich_hen || '');
                                        setNoteModal(true);
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    Ghi chú
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* NOTE MODAL */}
            {noteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Ghi chú lịch hẹn</h2>
                        <textarea
                            rows="4"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Nhập ghi chú..."
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setNoteModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveNote}
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReceptionistAppointments;