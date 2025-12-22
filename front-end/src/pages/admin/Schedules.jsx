import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, Calendar, Clock } from 'lucide-react';
import ScheduleModal from '../../components/admin/ScheduleModal';
import { adminAPI } from '../../services/adminAPI';

function Schedules() {
    const [schedules, setSchedules] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    useEffect(() => {
        loadData();
    }, [filterDoctor, filterDate]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Build query params
            const params = new URLSearchParams({
                page: 1,
                limit: 100
            });

            if (filterDoctor) {
                params.append('doctorId', filterDoctor);
            }

            if (filterDate) {
                params.append('fromDate', filterDate);
                params.append('toDate', filterDate);
            }

            console.log('🔍 Fetching with params:', params.toString()); // ✅ Debug

            const token = localStorage.getItem('token');

            const [schedulesRes, doctorsRes] = await Promise.all([
                fetch(`http://localhost:5000/api/v1/work-schedules?${params}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }).then(async res => {
                    const data = await res.json();
                    console.log('📅 Schedules response:', data); // ✅ Debug
                    return data;
                }),
                adminAPI.getDoctors(1, 100),
            ]);

            // ✅ Handle different response structures
            const schedulesData = schedulesRes.data?.data || schedulesRes.data || [];
            const doctorsData = doctorsRes.data?.data || doctorsRes.data || [];

            console.log('✅ Schedules data:', schedulesData); // ✅ Debug

            setSchedules(schedulesData);
            setDoctors(doctorsData);

        } catch (error) {
            console.error('❌ Load data error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedSchedule(null);
        setShowModal(true);
    };

    const handleEdit = (schedule) => {
        setSelectedSchedule(schedule);
        setShowModal(true);
    };

    const handleDelete = async (scheduleId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa lịch làm việc này?')) return;

        try {
            await adminAPI.deleteSchedule(scheduleId);
            alert('Xóa lịch làm việc thành công');
            loadData();
        } catch (error) {
            alert(error.message || 'Xóa thất bại');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.substring(0, 5); // HH:mm
    };

    const getShiftLabel = (start, end) => {
        if (!start) return { label: '', color: '' };
        const startHour = parseInt(start.split(':')[0]);
        if (startHour < 12) return { label: 'Sáng', color: 'bg-yellow-100 text-yellow-800' };
        if (startHour < 17) return { label: 'Chiều', color: 'bg-blue-100 text-blue-800' };
        return { label: 'Tối', color: 'bg-purple-100 text-purple-800' };
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Quản lý Lịch làm việc
                    </h1>
                    <p className="text-gray-600">
                        Quản lý lịch làm việc của bác sĩ
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    Thêm lịch làm việc
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bác sĩ
                        </label>
                        <select
                            value={filterDoctor}
                            onChange={(e) => setFilterDoctor(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        >
                            <option value="">Tất cả bác sĩ</option>
                            {doctors.map((d) => (
                                <option key={d.ma_bac_si} value={d.ma_bac_si}>
                                    {d.ho_nguoi_dung} {d.ten_nguoi_dung}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày
                        </label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Debug info */}
                {(filterDoctor || filterDate) && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        <p className="text-blue-800">
                            <strong>🔍 Đang lọc:</strong>{' '}
                            {filterDoctor && `Bác sĩ ID: ${filterDoctor}`}
                            {filterDoctor && filterDate && ' | '}
                            {filterDate && `Ngày: ${filterDate}`}
                        </p>
                        <p className="text-blue-600 text-xs mt-1">
                            Tìm thấy: {schedules.length} lịch làm việc
                        </p>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Bác sĩ
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Ngày
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Ca làm
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Giờ làm việc
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Phòng khám
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {schedules.map((schedule) => {
                                    const shift = getShiftLabel(
                                        schedule.thoi_gian_bat_dau_lich_lam_viec,
                                        schedule.thoi_gian_ket_thuc_lich_lam_viec
                                    );
                                    return (
                                        <tr key={schedule.ma_lich_lam_viec} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {schedule.ho_nguoi_dung} {schedule.ten_nguoi_dung}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {schedule.ten_chuyen_khoa || 'Chưa có chuyên khoa'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-900">
                                                        {formatDate(schedule.ngay_lich_lam_viec)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 ${shift.color} text-sm font-medium rounded-full`}>
                                                    {shift.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-900">
                                                        {formatTime(schedule.thoi_gian_bat_dau_lich_lam_viec)} -{' '}
                                                        {formatTime(schedule.thoi_gian_ket_thuc_lich_lam_viec)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-900">
                                                    {schedule.ten_phong_kham || 'Chưa gán'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 text-sm font-medium rounded-full ${schedule.trang_thai_lich_lam_viec === 1
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {schedule.trang_thai_lich_lam_viec === 1 ? 'Hoạt động' : 'Đã hủy'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(schedule)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(schedule.ma_lich_lam_viec)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {schedules.length === 0 && (
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg mb-2">
                                    {filterDoctor || filterDate
                                        ? '🔍 Không tìm thấy lịch làm việc nào với bộ lọc này'
                                        : 'Chưa có lịch làm việc nào'
                                    }
                                </p>
                                <button
                                    onClick={handleCreate}
                                    className="text-teal-700 hover:text-teal-800 font-medium"
                                >
                                    + Thêm lịch làm việc {filterDoctor || filterDate ? '' : 'đầu tiên'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <ScheduleModal
                    schedule={selectedSchedule}
                    doctors={doctors}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedSchedule(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setSelectedSchedule(null);
                        loadData();
                    }}
                />
            )}
        </div>
    );
}

export default Schedules;
