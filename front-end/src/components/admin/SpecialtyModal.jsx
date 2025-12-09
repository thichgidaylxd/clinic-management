import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';

function SpecialtyModal({ specialty, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        ten_chuyen_khoa: '',
        mo_ta_chuyen_khoa: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEdit = !!specialty;

    useEffect(() => {
        if (specialty) {
            setFormData({
                ten_chuyen_khoa: specialty.ten_chuyen_khoa || '',
                mo_ta_chuyen_khoa: specialty.mo_ta_chuyen_khoa || ''
            });
        }
    }, [specialty]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.ten_chuyen_khoa.trim()) {
            setError('Tên chuyên khoa không được để trống');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await adminAPI.updateSpecialty(specialty.ma_chuyen_khoa, formData);
                alert('✅ Cập nhật chuyên khoa thành công');
            } else {
                await adminAPI.createSpecialty(formData);
                alert('✅ Thêm chuyên khoa thành công');
            }
            onSuccess();
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 relative animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {isEdit ? 'Cập nhật Chuyên khoa' : 'Thêm Chuyên khoa'}
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {isEdit
                            ? 'Chỉnh sửa thông tin chuyên khoa'
                            : 'Thêm chuyên khoa mới vào hệ thống'
                        }
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-shake">
                        <span className="text-red-600 text-sm flex-1">{error}</span>
                        <button
                            onClick={() => setError('')}
                            className="text-red-400 hover:text-red-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Tên chuyên khoa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên chuyên khoa <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="ten_chuyen_khoa"
                            required
                            value={formData.ten_chuyen_khoa}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Ví dụ: Tim mạch, Răng hàm mặt..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Nhập tên chuyên khoa rõ ràng, dễ hiểu
                        </p>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả
                        </label>
                        <textarea
                            name="mo_ta_chuyen_khoa"
                            rows="4"
                            value={formData.mo_ta_chuyen_khoa}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Mô tả chi tiết về chuyên khoa, các dịch vụ và bệnh lý điều trị..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none resize-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            {formData.mo_ta_chuyen_khoa.length}/500 ký tự
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    {isEdit ? '💾 Cập nhật' : '➕ Thêm mới'}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Info Note */}
                {!isEdit && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800">
                            💡 <strong>Lưu ý:</strong> Sau khi thêm chuyên khoa, bạn có thể gán bác sĩ và dịch vụ cho chuyên khoa này.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SpecialtyModal;