import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';

function MedicineModal({ medicine, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        ten_thuoc: '',
        thanh_phan_thuoc: '',
        huong_dan_su_dung_thuoc: '',
        don_vi_tinh: '',
        don_gia_thuoc: '',
        so_luong_thuoc_ton_thuoc: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEdit = !!medicine;

    useEffect(() => {
        if (medicine) {
            setFormData({
                ten_thuoc: medicine.ten_thuoc || '',
                thanh_phan_thuoc: medicine.thanh_phan_thuoc || '',
                huong_dan_su_dung_thuoc: medicine.huong_dan_su_dung_thuoc || '',
                don_vi_tinh: medicine.don_vi_tinh || '',
                don_gia_thuoc: medicine.don_gia_thuoc || '',
                so_luong_thuoc_ton_thuoc: medicine.so_luong_thuoc_ton_thuoc || ''
            });
        }
    }, [medicine]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await adminAPI.updateMedicine(medicine.ma_thuoc, formData);
            } else {
                await adminAPI.createMedicine(formData);
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
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {isEdit ? 'Cập nhật Thuốc' : 'Thêm Thuốc'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên thuốc <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.ten_thuoc}
                            onChange={(e) => setFormData({ ...formData, ten_thuoc: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                            placeholder="Ví dụ: Paracetamol"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thành phần
                        </label>
                        <input
                            type="text"
                            value={formData.thanh_phan_thuoc}
                            onChange={(e) => setFormData({ ...formData, thanh_phan_thuoc: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                            placeholder="Ví dụ: Paracetamol 500mg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hướng dẫn sử dụng
                        </label>
                        <textarea
                            rows="3"
                            value={formData.huong_dan_su_dung_thuoc}
                            onChange={(e) => setFormData({ ...formData, huong_dan_su_dung_thuoc: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none resize-none"
                            placeholder="Cách sử dụng thuốc..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đơn vị tính <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.don_vi_tinh}
                                onChange={(e) => setFormData({ ...formData, don_vi_tinh: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                            >
                                <option value="">Chọn đơn vị</option>
                                <option value="Viên">Viên</option>
                                <option value="Vỉ">Vỉ</option>
                                <option value="Hộp">Hộp</option>
                                <option value="Chai">Chai</option>
                                <option value="Ống">Ống</option>
                                <option value="Túi">Túi</option>
                                <option value="Gói">Gói</option>
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
                                step="0.01"
                                value={formData.don_gia_thuoc}
                                onChange={(e) => setFormData({ ...formData, don_gia_thuoc: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                placeholder="5000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số lượng tồn kho <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.so_luong_thuoc_ton_thuoc}
                            onChange={(e) => setFormData({ ...formData, so_luong_thuoc_ton_thuoc: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                            placeholder="100"
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

export default MedicineModal;