import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';

function DoctorModal({ doctor, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        // User fields
        ten_nguoi_dung: '',
        ho_nguoi_dung: '',
        ten_dang_nhap_nguoi_dung: '',
        email_nguoi_dung: '',
        so_dien_thoai_nguoi_dung: '',
        mat_khau_nguoi_dung: '',
        gioi_tinh_nguoi_dung: 0,
        // Doctor fields
        chuyen_khoa_ids: [], // ✅ Array thay vì single ID
        ma_chuc_vu_bac_si: '',
        so_nam_kinh_nghiem_bac_si: ''
    });
    const [specialties, setSpecialties] = useState([]);
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEdit = !!doctor;

    useEffect(() => {
        loadData();
        console.log('Editing doctor:', doctor);
        if (doctor) {
            setFormData({
                ten_nguoi_dung: doctor.ten_nguoi_dung || '',
                ho_nguoi_dung: doctor.ho_nguoi_dung || '',
                ten_dang_nhap_nguoi_dung: doctor.ten_dang_nhap_nguoi_dung || '',
                email_nguoi_dung: doctor.email_nguoi_dung || '',
                so_dien_thoai_nguoi_dung: doctor.so_dien_thoai_nguoi_dung || '',
                mat_khau_nguoi_dung: '',
                gioi_tinh_nguoi_dung: doctor.gioi_tinh_nguoi_dung ?? 0,
                // ✅ Parse array chuyên khoa từ doctor.chuyen_khoa
                chuyen_khoa_ids: doctor.chuyen_khoa?.map(ck => ck.ma_chuyen_khoa) || [],
                ma_chuc_vu_bac_si: doctor.ma_chuc_vu_bac_si || '',
                so_nam_kinh_nghiem_bac_si: doctor.so_nam_kinh_nghiem_bac_si || ''
            });
        }
    }, [doctor]);

    const loadData = async () => {
        try {
            const [specialtiesRes, positionsRes] = await Promise.all([
                adminAPI.getSpecialties(1, 100),
                adminAPI.getPositions()
            ]);
            setSpecialties(specialtiesRes.data.data || []);
            setPositions(positionsRes.data || []);
        } catch (error) {
            console.error('Load data error:', error);
        }
    };

    // ✅ Toggle checkbox chuyên khoa
    const handleSpecialtyToggle = (specialtyId) => {
        setFormData(prev => {
            const current = prev.chuyen_khoa_ids;
            if (current.includes(specialtyId)) {
                // Bỏ chọn
                return { ...prev, chuyen_khoa_ids: current.filter(id => id !== specialtyId) };
            } else {
                // Chọn thêm
                return { ...prev, chuyen_khoa_ids: [...current, specialtyId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Validate: Phải chọn ít nhất 1 chuyên khoa
        if (formData.chuyen_khoa_ids.length === 0) {
            setError('Vui lòng chọn ít nhất 1 chuyên khoa');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await adminAPI.updateDoctor(doctor.ma_bac_si, formData);
            } else {
                console.log('Creating doctor with data:', formData);
                await adminAPI.createDoctor(formData);
            }
            alert(isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công');
            onSuccess();
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {isEdit ? 'Cập nhật Bác sĩ' : 'Thêm Bác sĩ'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ============ THÔNG TIN TÀI KHOẢN ============ */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                            Thông tin tài khoản
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.ho_nguoi_dung}
                                        onChange={(e) => setFormData({ ...formData, ho_nguoi_dung: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                        placeholder="Nguyễn Văn"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.ten_nguoi_dung}
                                        onChange={(e) => setFormData({ ...formData, ten_nguoi_dung: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                        placeholder="An"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên đăng nhập <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required={!isEdit}
                                        disabled={isEdit}
                                        value={formData.ten_dang_nhap_nguoi_dung}
                                        onChange={(e) => setFormData({ ...formData, ten_dang_nhap_nguoi_dung: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="doctor_an"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {isEdit ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'}
                                        {!isEdit && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="password"
                                        required={!isEdit}
                                        value={formData.mat_khau_nguoi_dung}
                                        onChange={(e) => setFormData({ ...formData, mat_khau_nguoi_dung: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                        placeholder={isEdit ? 'Nhập mật khẩu mới' : 'Tối thiểu 6 ký tự'}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email_nguoi_dung}
                                        onChange={(e) => setFormData({ ...formData, email_nguoi_dung: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                        placeholder="doctor@clinic.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        pattern="[0-9]{10}"
                                        value={formData.so_dien_thoai_nguoi_dung}
                                        onChange={(e) => setFormData({ ...formData, so_dien_thoai_nguoi_dung: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                        placeholder="0987654321"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giới tính <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="0"
                                            checked={formData.gioi_tinh_nguoi_dung === 0}
                                            onChange={() => setFormData({ ...formData, gioi_tinh_nguoi_dung: 0 })}
                                            className="w-4 h-4 text-teal-700"
                                        />
                                        <span>Nam</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="1"
                                            checked={formData.gioi_tinh_nguoi_dung === 1}
                                            onChange={() => setFormData({ ...formData, gioi_tinh_nguoi_dung: 1 })}
                                            className="w-4 h-4 text-teal-700"
                                        />
                                        <span>Nữ</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ============ THÔNG TIN BÁC SĨ ============ */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                            Thông tin bác sĩ
                        </h3>
                        <div className="space-y-4">
                            {/* ✅ MULTI-SELECT CHUYÊN KHOA */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chuyên khoa <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto bg-gray-50">
                                    {specialties.length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center py-4">
                                            Đang tải chuyên khoa...
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {specialties.map((specialty) => (
                                                <label
                                                    key={specialty.ma_chuyen_khoa}
                                                    className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.chuyen_khoa_ids.includes(specialty.ma_chuyen_khoa)}
                                                        onChange={() => handleSpecialtyToggle(specialty.ma_chuyen_khoa)}
                                                        className="w-4 h-4 text-teal-700 rounded focus:ring-teal-500"
                                                    />
                                                    <span className="text-gray-900 text-sm">
                                                        {specialty.ten_chuyen_khoa}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {formData.chuyen_khoa_ids.length > 0 ? (
                                        <span className="text-teal-700 font-medium">
                                            ✓ Đã chọn {formData.chuyen_khoa_ids.length} chuyên khoa
                                        </span>
                                    ) : (
                                        <span className="text-red-500">
                                            Vui lòng chọn ít nhất 1 chuyên khoa
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chức vụ
                                    </label>
                                    <select
                                        value={formData.ma_chuc_vu_bac_si}
                                        onChange={(e) => setFormData({ ...formData, ma_chuc_vu_bac_si: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                    >
                                        <option value="">Chọn chức vụ</option>
                                        {positions.map((p) => (
                                            <option key={p.ma_chuc_vu} value={p.ma_chuc_vu}>
                                                {p.ten_chuc_vu}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số năm kinh nghiệm
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.so_nam_kinh_nghiem_bac_si}
                                        onChange={(e) => setFormData({ ...formData, so_nam_kinh_nghiem_bac_si: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ============ ACTIONS ============ */}
                    <div className="flex gap-3 pt-4 border-t">
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

export default DoctorModal;