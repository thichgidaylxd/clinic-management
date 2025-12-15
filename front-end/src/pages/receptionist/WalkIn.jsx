import React, { useState } from 'react';
import { UserPlus, Loader2, Calendar, Search } from 'lucide-react';
import { receptionistAPI } from '../../services/receptionistAPI';
import { useNavigate } from 'react-router-dom';

function ReceptionistWalkIn() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Search, 2: Create New
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const [formData, setFormData] = useState({
        ten_benh_nhan: '',
        ho_benh_nhan: '',
        so_dien_thoai_benh_nhan: '',
        email_benh_nhan: '',
        ngay_sinh_benh_nhan: '',
        gioi_tinh_benh_nhan: 0,
        dia_chi_benh_nhan: '',
        create_account: false,
        mat_khau_nguoi_dung: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (searchQuery.length < 3) {
            alert('Vui lòng nhập ít nhất 3 ký tự');
            return;
        }

        setSearching(true);
        try {
            const response = await receptionistAPI.searchPatients(searchQuery);
            setSearchResults(response.data || []);
            if (response.data.length === 0) {
                alert('Không tìm thấy bệnh nhân. Vui lòng tạo mới.');
                setStep(2);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    };

    const handleSelectPatient = (patient) => {
        // Redirect to create appointment with this patient
        navigate('/receptionist/appointments', {
            state: { selectedPatient: patient }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await receptionistAPI.createWalkInPatient(formData);
            alert('Tạo hồ sơ bệnh nhân thành công!');
            // Redirect to create appointment
            navigate('/receptionist/appointments', {
                state: { selectedPatient: response.data }
            });
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Khám trực tiếp (Walk-in)</h1>
                <p className="text-gray-600">Tạo hồ sơ bệnh nhân mới hoặc tìm bệnh nhân cũ</p>
            </div>

            {/* Step 1: Search */}
            {step === 1 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Tìm kiếm bệnh nhân
                    </h2>

                    <div className="flex gap-3 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Nhập tên hoặc số điện thoại bệnh nhân..."
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={searching}
                            className="px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium disabled:opacity-50"
                        >
                            {searching ? 'Đang tìm...' : 'Tìm kiếm'}
                        </button>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="space-y-3 mb-6">
                            <h3 className="font-semibold text-gray-900">Kết quả tìm kiếm:</h3>
                            {searchResults.map((patient) => (
                                <div
                                    key={patient.ma_benh_nhan}
                                    onClick={() => handleSelectPatient(patient)}
                                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-teal-700 hover:bg-teal-50 cursor-pointer transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {patient.ho_benh_nhan} {patient.ten_benh_nhan}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                📞 {patient.so_dien_thoai_benh_nhan} |
                                                🎂 {new Date(patient.ngay_sinh_benh_nhan).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                        <button className="px-4 py-2 bg-teal-700 text-white rounded-lg font-medium">
                                            Chọn
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-200">
                        <button
                            onClick={() => setStep(2)}
                            className="w-full px-6 py-3 border-2 border-teal-700 text-teal-700 rounded-xl hover:bg-teal-50 transition font-medium flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            Hoặc tạo bệnh nhân mới
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Create New */}
            {step === 2 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Tạo hồ sơ bệnh nhân mới
                        </h2>
                        <button
                            onClick={() => setStep(1)}
                            className="text-teal-700 hover:underline"
                        >
                            ← Quay lại tìm kiếm
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Info */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.ho_benh_nhan}
                                        onChange={(e) => setFormData({ ...formData, ho_benh_nhan: e.target.value })}
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
                                        value={formData.ten_benh_nhan}
                                        onChange={(e) => setFormData({ ...formData, ten_benh_nhan: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                        placeholder="An"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    pattern="[0-9]{10}"
                                    value={formData.so_dien_thoai_benh_nhan}
                                    onChange={(e) => setFormData({ ...formData, so_dien_thoai_benh_nhan: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                    placeholder="0987654321"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày sinh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.ngay_sinh_benh_nhan}
                                    onChange={(e) => setFormData({ ...formData, ngay_sinh_benh_nhan: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
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
                                        checked={formData.gioi_tinh_benh_nhan === 0}
                                        onChange={() => setFormData({ ...formData, gioi_tinh_benh_nhan: 0 })}
                                        className="w-4 h-4 text-teal-700"
                                    />
                                    <span>Nam</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="1"
                                        checked={formData.gioi_tinh_benh_nhan === 1}
                                        onChange={() => setFormData({ ...formData, gioi_tinh_benh_nhan: 1 })}
                                        className="w-4 h-4 text-teal-700"
                                    />
                                    <span>Nữ</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Địa chỉ
                            </label>
                            <textarea
                                rows="2"
                                value={formData.dia_chi_benh_nhan}
                                onChange={(e) => setFormData({ ...formData, dia_chi_benh_nhan: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none resize-none"
                                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                            />
                        </div>

                        {/* Account Creation */}
                        <div className="pt-6 border-t border-gray-200">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.create_account}
                                    onChange={(e) => setFormData({ ...formData, create_account: e.target.checked })}
                                    className="w-5 h-5 text-teal-700 rounded"
                                />
                                <span className="font-medium text-gray-900">
                                    Tạo tài khoản cho bệnh nhân (để đăng nhập sau)
                                </span>
                            </label>
                        </div>

                        {formData.create_account && (
                            <div className="grid grid-cols-2 gap-4 bg-teal-50 p-4 rounded-xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required={formData.create_account}
                                        value={formData.email_benh_nhan}
                                        onChange={(e) => setFormData({ ...formData, email_benh_nhan: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        required={formData.create_account}
                                        value={formData.mat_khau_nguoi_dung}
                                        onChange={(e) => setFormData({ ...formData, mat_khau_nguoi_dung: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                        placeholder="Tối thiểu 6 ký tự"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
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
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        Tạo hồ sơ
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ReceptionistWalkIn;