import React, { useState, useEffect } from 'react';
import { X, Loader2, Upload, FileText, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';

function MedicineModal({ medicine, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        ten_thuoc: '',
        thanh_phan_thuoc: '',
        huong_dan_su_dung_thuoc: '',
        don_vi_tinh: '',
        don_gia_thuoc: '',
        so_luong_thuoc_ton_thuoc: '',
        han_su_dung_thuoc: '',
        giay_to_kiem_dinh_thuoc: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filePreview, setFilePreview] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('');
    const [showFileModal, setShowFileModal] = useState(false);

    const isEdit = !!medicine;

    useEffect(() => {
        if (medicine) {
            setFormData({
                ten_thuoc: medicine.ten_thuoc || '',
                thanh_phan_thuoc: medicine.thanh_phan_thuoc || '',
                huong_dan_su_dung_thuoc: medicine.huong_dan_su_dung_thuoc || '',
                don_vi_tinh: medicine.don_vi_tinh || '',
                don_gia_thuoc: medicine.don_gia_thuoc || '',
                so_luong_thuoc_ton_thuoc: medicine.so_luong_thuoc_ton_thuoc || '',
                han_su_dung_thuoc: medicine.han_su_dung_thuoc
                    ? new Date(medicine.han_su_dung_thuoc).toISOString().split('T')[0]
                    : '',
                giay_to_kiem_dinh_thuoc: ''
            });

            if (medicine.giay_to_kiem_dinh_thuoc) {
                setFilePreview(`data:application/pdf;base64,${medicine.giay_to_kiem_dinh_thuoc}`);
                setFileName('Giấy tờ hiện có');
            }
        }
    }, [medicine]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setError('Chỉ chấp nhận file PDF hoặc ảnh (JPG, PNG)');
            return;
        }

        // Giảm xuống 2MB để đảm bảo không vượt quá giới hạn database
        if (file.size > 2 * 1024 * 1024) {
            setError('Kích thước file không được vượt quá 2MB');
            return;
        }

        setError('');
        setFileName(file.name);

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setFormData({ ...formData, giay_to_kiem_dinh_thuoc: base64String });
            setFilePreview(base64String);
            setFileType(file.type.startsWith('image/') ? 'image' : 'pdf');
        };
        reader.readAsDataURL(file);
    };

    const removeFile = () => {
        setFormData({ ...formData, giay_to_kiem_dinh_thuoc: '' });
        setFilePreview(null);
        setFileName('');
        setFileType('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.ten_thuoc.trim()) {
                throw new Error('Vui lòng nhập tên thuốc');
            }
            if (!formData.don_vi_tinh) {
                throw new Error('Vui lòng chọn đơn vị tính');
            }
            if (!formData.don_gia_thuoc || formData.don_gia_thuoc <= 0) {
                throw new Error('Vui lòng nhập đơn giá hợp lệ');
            }
            if (!formData.so_luong_thuoc_ton_thuoc || formData.so_luong_thuoc_ton_thuoc < 0) {
                throw new Error('Vui lòng nhập số lượng tồn kho hợp lệ');
            }

            const submitData = {
                ten_thuoc: formData.ten_thuoc.trim(),
                thanh_phan_thuoc: formData.thanh_phan_thuoc.trim() || null,
                huong_dan_su_dung_thuoc: formData.huong_dan_su_dung_thuoc.trim() || null,
                don_vi_tinh: formData.don_vi_tinh,
                don_gia_thuoc: parseFloat(formData.don_gia_thuoc),
                so_luong_thuoc_ton_thuoc: parseInt(formData.so_luong_thuoc_ton_thuoc),
                han_su_dung_thuoc: formData.han_su_dung_thuoc || null,
                giay_to_kiem_dinh_thuoc: formData.giay_to_kiem_dinh_thuoc || null
            };

            if (isEdit) {
                await adminAPI.updateMedicine(medicine.ma_thuoc, submitData);
                alert('Cập nhật thuốc thành công');
            } else {
                await adminAPI.createMedicine(submitData);
                alert('Thêm thuốc mới thành công');
            }

            onSuccess();
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra');
            console.error('Submit error:', err);
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
                    {isEdit ? 'Cập nhật Thuốc' : 'Thêm Thuốc Mới'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-5">
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
                            placeholder="Ví dụ: Paracetamol 500mg"
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
                            placeholder="Ví dụ: Paracetamol, Caffeine"
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
                            placeholder="Cách sử dụng, liều lượng, lưu ý..."
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
                                <option value="Lọ">Lọ</option>
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
                                step="1"
                                value={formData.don_gia_thuoc}
                                onChange={(e) => setFormData({ ...formData, don_gia_thuoc: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                placeholder="5000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hạn sử dụng
                            </label>
                            <input
                                type="date"
                                value={formData.han_su_dung_thuoc}
                                onChange={(e) => setFormData({ ...formData, han_su_dung_thuoc: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giấy tờ kiểm định (PDF/Ảnh)
                        </label>

                        {!filePreview ? (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-teal-700 cursor-pointer transition bg-gray-50 hover:bg-gray-100">
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">Click để tải file lên</span>
                                <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Tối đa 2MB)</span>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        ) : (
                            <div className="border-2 border-gray-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8 text-teal-700" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{fileName}</p>
                                            <p className="text-xs text-gray-500">
                                                {fileType === 'image' ? 'Ảnh' : 'File PDF'} đã tải lên
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowFileModal(true)}
                                            className="px-3 py-1.5 text-sm text-teal-700 hover:bg-teal-50 rounded-lg transition font-medium"
                                        >
                                            Xem
                                        </button>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                {fileType === 'image' && (
                                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={filePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-contain bg-gray-50 cursor-pointer hover:opacity-90 transition"
                                            onClick={() => setShowFileModal(true)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
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
                            type="button"
                            onClick={handleSubmit}
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
                </div>

                {/* Modal hiển thị file */}
                {showFileModal && (
                    <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Giấy tờ kiểm định
                                </h3>
                                <button
                                    onClick={() => setShowFileModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                                {fileType === 'image' ? (
                                    <img
                                        src={filePreview}
                                        alt="Giấy tờ kiểm định"
                                        className="w-full h-auto rounded-lg"
                                    />
                                ) : (
                                    <iframe
                                        src={filePreview}
                                        className="w-full h-[70vh] rounded-lg border"
                                        title="PDF Preview"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MedicineModal;