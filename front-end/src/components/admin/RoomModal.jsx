import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';
import RoomTypeModal from './RoomTypeModal';

function RoomModal({ room, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        ten_phong_kham: '',
        so_phong_kham: '',
        mo_ta_phong_kham: '',
        ma_loai_phong_kham: '',
        trang_thai_phong_kham: 1
    });
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showRoomTypeModal, setShowRoomTypeModal] = useState(false);

    const isEdit = !!room;

    useEffect(() => {
        loadRoomTypes();
        if (room) {
            setFormData({
                ten_phong_kham: room.ten_phong_kham || '',
                so_phong_kham: room.so_phong_kham || '',
                mo_ta_phong_kham: room.mo_ta_phong_kham || '',
                ma_loai_phong_kham: room.ma_loai_phong_kham || '',
                trang_thai_phong_kham: room.trang_thai_phong_kham ?? 1
            });
        }
    }, [room]);

    const loadRoomTypes = async () => {
        try {
            const response = await adminAPI.getRoomTypes();
            setRoomTypes(response.data || []);
        } catch (error) {
            console.error('Load room types error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await adminAPI.updateRoom(room.ma_phong_kham, formData);
            } else {
                await adminAPI.createRoom(formData);
            }
            alert(isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công');
            onSuccess();
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleRoomTypeCreated = (newRoomType) => {
        setShowRoomTypeModal(false);
        loadRoomTypes(); // Reload danh sách
        // Tự động chọn loại phòng vừa tạo
        if (newRoomType?.ma_loai_phong_kham) {
            setFormData({ ...formData, ma_loai_phong_kham: newRoomType.ma_loai_phong_kham });
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {isEdit ? 'Cập nhật Phòng khám' : 'Thêm Phòng khám'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên phòng khám <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.ten_phong_kham}
                                    onChange={(e) => setFormData({ ...formData, ten_phong_kham: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                    placeholder="Ví dụ: Phòng khám Nội"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số phòng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.so_phong_kham}
                                    onChange={(e) => setFormData({ ...formData, so_phong_kham: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                    placeholder="Ví dụ: 101"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại phòng <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <select
                                    required
                                    value={formData.ma_loai_phong_kham}
                                    onChange={(e) => setFormData({ ...formData, ma_loai_phong_kham: e.target.value })}
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                                >
                                    <option value="">Chọn loại phòng</option>
                                    {roomTypes.map((type) => (
                                        <option key={type.ma_loai_phong_kham} value={type.ma_loai_phong_kham}>
                                            {type.ten_loai_phong_kham}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowRoomTypeModal(true)}
                                    className="px-4 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition flex items-center gap-2 whitespace-nowrap"
                                    title="Thêm loại phòng mới"
                                >
                                    <Plus className="w-5 h-5" />
                                    Thêm loại
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Không tìm thấy loại phòng? Click "Thêm loại" để tạo mới
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                rows="3"
                                value={formData.mo_ta_phong_kham}
                                onChange={(e) => setFormData({ ...formData, mo_ta_phong_kham: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none resize-none"
                                placeholder="Mô tả về phòng khám..."
                            />
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
                                        checked={formData.trang_thai_phong_kham === 1}
                                        onChange={() => setFormData({ ...formData, trang_thai_phong_kham: 1 })}
                                        className="w-4 h-4 text-teal-700"
                                    />
                                    <span>Hoạt động</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="0"
                                        checked={formData.trang_thai_phong_kham === 0}
                                        onChange={() => setFormData({ ...formData, trang_thai_phong_kham: 0 })}
                                        className="w-4 h-4 text-teal-700"
                                    />
                                    <span>Đóng cửa</span>
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

            {/* Nested Modal: Room Type */}
            {showRoomTypeModal && (
                <RoomTypeModal
                    onClose={() => setShowRoomTypeModal(false)}
                    onSuccess={handleRoomTypeCreated}
                />
            )}
        </>
    );
}

export default RoomModal;