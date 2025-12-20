import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';

function ScheduleModal({ schedule, doctors, rooms, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        ma_bac_si_lich_lam_viec: '',
        ngay_lich_lam_viec: '',
        thoi_gian_bat_dau_lich_lam_viec: '',
        thoi_gian_ket_thuc_lich_lam_viec: '',
        ma_phong_kham_lich_lam_viec: '',
        trang_thai_lich_lam_viec: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEdit = !!schedule;
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    useEffect(() => {
        if (schedule) {
            setFormData({
                ma_bac_si_lich_lam_viec: schedule.ma_bac_si_lich_lam_viec || '',
                ngay_lich_lam_viec: formatDateForInput(schedule.ngay_lich_lam_viec),
                thoi_gian_bat_dau_lich_lam_viec: schedule.thoi_gian_bat_dau_lich_lam_viec?.substring(0, 5) || '',
                thoi_gian_ket_thuc_lich_lam_viec: schedule.thoi_gian_ket_thuc_lich_lam_viec?.substring(0, 5) || '',
                ma_phong_kham_lich_lam_viec: schedule.ma_phong_kham_lich_lam_viec || '',
                trang_thai_lich_lam_viec: schedule.trang_thai_lich_lam_viec ?? 1
            });
        }
    }, [schedule]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await adminAPI.updateSchedule(schedule.ma_lich_lam_viec, formData);
            } else {
                await adminAPI.createSchedule(formData);
            }
            alert(isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công');
            onSuccess();
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const today = formatDateForInput(new Date());



    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {isEdit ? 'Cập nhật Lịch làm việc' : 'Thêm Lịch làm việc'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bác sĩ <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.ma_bac_si_lich_lam_viec}
                            onChange={(e) => setFormData({ ...formData, ma_bac_si_lich_lam_viec: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        >
                            <option value="">Chọn bác sĩ</option>
                            {doctors.map((d) => (
                                <option key={d.ma_bac_si} value={d.ma_bac_si}>
                                    {d.ho_nguoi_dung} {d.ten_nguoi_dung} - {d.ten_chuyen_khoa || 'Chưa có chuyên khoa'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày làm việc <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            min={today}
                            value={formData.ngay_lich_lam_viec}
                            onChange={(e) => setFormData({ ...formData, ngay_lich_lam_viec: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giờ bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.thoi_gian_bat_dau_lich_lam_viec}
                                onChange={(e) => setFormData({ ...formData, thoi_gian_bat_dau_lich_lam_viec: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giờ kết thúc <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.thoi_gian_ket_thuc_lich_lam_viec}
                                onChange={(e) => setFormData({ ...formData, thoi_gian_ket_thuc_lich_lam_viec: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phòng khám
                        </label>
                        <select
                            value={formData.ma_phong_kham_lich_lam_viec}
                            onChange={(e) => setFormData({ ...formData, ma_phong_kham_lich_lam_viec: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        >
                            <option value="">Chọn phòng khám</option>
                            {rooms.map((r) => (
                                <option key={r.ma_phong_kham} value={r.ma_phong_kham}>
                                    {r.ten_phong_kham} - {r.ten_loai_phong_kham}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="1"
                                    checked={formData.trang_thai_lich_lam_viec === 1}
                                    onChange={() => setFormData({ ...formData, trang_thai_lich_lam_viec: 1 })}
                                    className="w-4 h-4 text-teal-700"
                                />
                                <span>Hoạt động</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="0"
                                    checked={formData.trang_thai_lich_lam_viec === 0}
                                    onChange={() => setFormData({ ...formData, trang_thai_lich_lam_viec: 0 })}
                                    className="w-4 h-4 text-teal-700"
                                />
                                <span>Đã hủy</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                isEdit ? 'Cập nhật' : 'Thêm mới'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ScheduleModal;