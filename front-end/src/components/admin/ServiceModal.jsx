import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';

function ServiceModal({ service, specialties, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        ten_dich_vu: '',
        mo_ta_dich_vu: '',
        don_gia_dich_vu: '',
        ma_chuyen_khoa_dich_vu: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEdit = !!service;

    useEffect(() => {
        if (service) {
            setFormData({
                ten_dich_vu: service.ten_dich_vu || '',
                mo_ta_dich_vu: service.mo_ta_dich_vu || '',
                don_gia_dich_vu: service.don_gia_dich_vu || '',
                ma_chuyen_khoa_dich_vu: service.ma_chuyen_khoa_dich_vu || ''
            });
        }
    }, [service]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await adminAPI.updateService(service.ma_dich_vu, formData);
            } else {
                await adminAPI.createService(formData);
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
            <div className="bg-white rounded-3xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {isEdit ? 'Cập nhật Dịch vụ' : 'Thêm Dịch vụ'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên dịch vụ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.ten_dich_vu}
                            onChange={(e) => setFormData({ ...formData, ten_dich_vu: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                            placeholder="Ví dụ: Khám tổng quát"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chuyên khoa
                        </label>
                        <select
                            value={formData.ma_chuyen_khoa_dich_vu}
                            onChange={(e) => setFormData({ ...formData, ma_chuyen_khoa_dich_vu: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        >
                            <option value="">Chọn chuyên khoa</option>
                            {specialties.map((s) => (
                                <option key={s.ma_chuyen_khoa} value={s.ma_chuyen_khoa}>
                                    {s.ten_chuyen_khoa}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Đơn giá (VNĐ) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.don_gia_dich_vu}
                            onChange={(e) => setFormData({ ...formData, don_gia_dich_vu: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                            placeholder="200000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả
                        </label>
                        <textarea
                            rows="4"
                            value={formData.mo_ta_dich_vu}
                            onChange={(e) => setFormData({ ...formData, mo_ta_dich_vu: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none resize-none"
                            placeholder="Mô tả về dịch vụ..."
                        />
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

export default ServiceModal;