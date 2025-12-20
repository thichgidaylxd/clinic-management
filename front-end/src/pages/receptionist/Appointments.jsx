import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    CheckCircle,
    Clock,
    XCircle,
    User,
    Phone,
    Calendar,
    AlertCircle,
    UserCheck,
    FileText
} from 'lucide-react';
import { receptionistAPI } from '../../services/receptionistAPI';
import { adminAPI } from '../../services/adminAPI';
import TokenUtil from '../../util/tokenUtil';

function ReceptionistAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        doctorId: '',
        status: '',
        search: ''
    });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [noteModal, setNoteModal] = useState(false);
    const [note, setNote] = useState('');

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );


    useEffect(() => {
        loadData();
    }, [filters, selectedDate]);


    const loadData = async () => {
        setLoading(true);
        try {
            const [appointmentsRes, doctorsRes] = await Promise.all([
                //receptionistAPI.getTodayAppointments(filters),
                receptionistAPI.getAppointmentsByDate(selectedDate, filters),
                adminAPI.getDoctors(1, 100)
            ]);
            setAppointments(appointmentsRes.data || []);
            setDoctors(doctorsRes.data.data || []);
        } catch (error) {
            console.error('Load data error:', error);
            alert('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        if (!confirm('Xác nhận lịch hẹn này?')) return;

        TokenUtil.getUserId();

        try {
            await receptionistAPI.confirmAppointment(id, null);
            alert('Xác nhận thành công');
            loadData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCheckIn = async (id) => {
        if (!confirm('Check-in bệnh nhân này?')) return;

        try {
            await receptionistAPI.checkInAppointment(id);
            alert('Check-in thành công');
            loadData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleNoShow = async (id) => {
        if (!confirm('Đánh dấu bệnh nhân không đến?')) return;

        try {
            await receptionistAPI.markNoShow(id);
            alert('Cập nhật thành công');
            loadData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleAddNote = (appointment) => {
        setSelectedAppointment(appointment);
        setNote(appointment.ghi_chu_lich_hen || '');
        setNoteModal(true);
    };

    const handleSaveNote = async () => {
        try {
            await receptionistAPI.updateNote(selectedAppointment.ma_lich_hen, note);
            alert('Cập nhật ghi chú thành công');
            setNoteModal(false);
            loadData();
        } catch (error) {
            alert(error.message);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            0: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
            1: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
            2: { label: 'Đã check-in', color: 'bg-teal-100 text-teal-700', icon: UserCheck },
            3: { label: 'Đang khám', color: 'bg-purple-100 text-purple-700', icon: User },
            4: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: CheckCircle },
            5: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle },
            6: { label: 'Không đến', color: 'bg-gray-100 text-gray-700', icon: AlertCircle }
        };
        const s = statusMap[status] || statusMap[0];
        const Icon = s.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>
                <Icon className="w-3 h-3" />
                {s.label}
            </span>
        );
    };

    const getTimeSlot = (start) => {
        if (!start) return '';
        const hour = parseInt(start.split(':')[0]);
        if (hour < 12) return '🌅 Sáng';
        if (hour < 17) return '☀️ Chiều';
        return '🌙 Tối';
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Lịch hẹn ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
                </h1>

                <p className="text-gray-600">
                    {new Date().toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm bệnh nhân (tên, SĐT)..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        />
                    </div>

                    {/* Date Filter */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        />
                    </div>


                    {/* Doctor Filter */}
                    <select
                        value={filters.doctorId}
                        onChange={(e) => setFilters({ ...filters, doctorId: e.target.value })}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                    >
                        <option value="">Tất cả bác sĩ</option>
                        {doctors.map((d) => (
                            <option key={d.ma_bac_si} value={d.ma_bac_si}>
                                BS. {d.ho_nguoi_dung} {d.ten_nguoi_dung}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="0">Chờ xác nhận</option>
                        <option value="1">Đã xác nhận</option>
                        <option value="2">Đã check-in</option>
                        <option value="3">Đang khám</option>
                        <option value="4">Hoàn thành</option>
                        <option value="5">Đã hủy</option>
                        <option value="6">Không đến</option>
                    </select>
                </div>
            </div>

            {/* Appointments List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            ) : appointments.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có lịch hẹn</h3>
                    <p className="text-gray-600">Chưa có lịch hẹn nào trong hôm nay</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <div
                            key={apt.ma_lich_hen}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    {/* Time & Slot */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl font-bold text-teal-700">
                                            {apt.gio_bat_dau?.substring(0, 5)}
                                        </span>
                                        <span className="text-gray-400">-</span>
                                        <span className="text-lg text-gray-600">
                                            {apt.gio_ket_thuc?.substring(0, 5)}
                                        </span>
                                        <span className="text-lg">{getTimeSlot(apt.gio_bat_dau)}</span>
                                    </div>

                                    {/* Patient Info */}
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="font-semibold text-gray-900">
                                                {apt.ho_benh_nhan} {apt.ten_benh_nhan}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{apt.so_dien_thoai_benh_nhan}</span>
                                        </div>
                                    </div>

                                    {/* Doctor Info */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm text-gray-500">Bác sĩ:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            BS. {apt.ho_bac_si} {apt.ten_bac_si}
                                        </span>
                                        {apt.ten_chuyen_khoa && (
                                            <>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-sm text-teal-600">{apt.ten_chuyen_khoa}</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Room */}
                                    {apt.ten_phong_kham && (
                                        <div className="text-sm text-gray-600">
                                            📍 {apt.ten_phong_kham} {apt.so_phong_kham && `- Phòng ${apt.so_phong_kham}`}
                                        </div>
                                    )}

                                    {/* Reason */}
                                    {apt.ly_do_kham && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Lý do khám:</span> {apt.ly_do_kham}
                                            </p>
                                        </div>
                                    )}

                                    {/* Note */}
                                    {apt.ghi_chu_lich_hen && (
                                        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <p className="text-sm text-blue-900">
                                                <span className="font-medium">📝 Ghi chú:</span> {apt.ghi_chu_lich_hen}
                                            </p>
                                        </div>
                                    )}

                                    {/* Check-in time */}
                                    {apt.check_in_time && (
                                        <div className="mt-2 text-xs text-gray-500">
                                            ✓ Check-in lúc: {new Date(apt.check_in_time).toLocaleTimeString('vi-VN')}
                                        </div>
                                    )}
                                </div>

                                {/* Status & Actions */}
                                <div className="flex flex-col items-end gap-3">
                                    {getStatusBadge(apt.trang_thai_lich_hen)}

                                    <div className="flex flex-col gap-2">
                                        {/* Pending → Confirm */}
                                        {apt.trang_thai_lich_hen === 0 && (
                                            <button
                                                onClick={() => handleConfirm(apt.ma_lich_hen)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Xác nhận
                                            </button>
                                        )}

                                        {/* Confirmed → Check-in */}
                                        {apt.trang_thai_lich_hen === 1 && (
                                            <button
                                                onClick={() => handleCheckIn(apt.ma_lich_hen)}
                                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-medium flex items-center gap-2"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                                Check-in
                                            </button>
                                        )}

                                        {/* Mark No Show */}
                                        {[0, 1].includes(apt.trang_thai_lich_hen) && (
                                            <button
                                                onClick={() => handleNoShow(apt.ma_lich_hen)}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium flex items-center gap-2"
                                            >
                                                <AlertCircle className="w-4 h-4" />
                                                Không đến
                                            </button>
                                        )}

                                        {/* Add/Edit Note */}
                                        <button
                                            onClick={() => handleAddNote(apt)}
                                            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-teal-700 hover:bg-teal-50 transition text-sm font-medium flex items-center gap-2"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Ghi chú
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Note Modal */}
            {noteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Ghi chú lịch hẹn
                        </h2>

                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows="4"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none resize-none"
                            placeholder="Nhập ghi chú cho lịch hẹn..."
                        />

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setNoteModal(false)}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveNote}
                                className="flex-1 px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium"
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