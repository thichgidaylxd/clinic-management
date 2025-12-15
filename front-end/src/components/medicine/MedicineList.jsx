// front-end/src/components/medicine/MedicineList.jsx
//Component hiển thị danh sách thuốc đã chọn trong đơn thuốc

import React from 'react';
import { Trash2, Package, AlertCircle } from 'lucide-react';
import { formatPrice } from '../../util/priceFormatter';

function MedicineList({ medicines, onUpdateQuantity, onUpdateNote, onRemove }) {
    if (!medicines || medicines.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có thuốc nào được chọn</p>
                <p className="text-sm text-gray-400 mt-1">Tìm và chọn thuốc từ ô tìm kiếm</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {medicines.map((medicine, index) => {
                const subtotal = calculateSubtotal(medicine.don_gia_thuoc, medicine.so_luong);
                const isOverStock = medicine.so_luong > medicine.so_luong_thuoc_ton_thuoc;

                return (
                    <div
                        key={medicine.ma_thuoc}
                        className={`p-4 border-2 rounded-xl ${isOverStock
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 bg-white'
                            }`}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-sm font-semibold flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                    <h4 className="font-semibold text-gray-900">
                                        {medicine.ten_thuoc}
                                    </h4>
                                </div>
                                {medicine.thanh_phan_thuoc && (
                                    <p className="text-sm text-gray-500 mt-1 ml-8">
                                        {medicine.thanh_phan_thuoc}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => onRemove(medicine.ma_thuoc)}
                                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                                title="Xóa thuốc"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Quantity & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    Số lượng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={medicine.so_luong_thuoc_ton_thuoc}
                                    value={medicine.so_luong}
                                    onChange={(e) => onUpdateQuantity(medicine.ma_thuoc, parseInt(e.target.value) || 1)}
                                    className={`w-full px-3 py-2 border rounded-lg ${isOverStock
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300'
                                        }`}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Tồn kho: {medicine.so_luong_thuoc_ton_thuoc} {medicine.don_vi_tinh}
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    Đơn giá
                                </label>
                                <input
                                    type="text"
                                    value={formatPrice(medicine.don_gia_thuoc)}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    Thành tiền
                                </label>
                                <input
                                    type="text"
                                    value={formatPrice(subtotal)}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-semibold text-teal-700"
                                />
                            </div>
                        </div>

                        {/* Note */}
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">
                                Liều lượng & Hướng dẫn sử dụng <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={medicine.ghi_chu || ''}
                                onChange={(e) => onUpdateNote(medicine.ma_thuoc, e.target.value)}
                                placeholder="VD: Uống 3 lần/ngày, mỗi lần 1 viên, sau ăn"
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
                            />
                        </div>

                        {/* Warning */}
                        {isOverStock && (
                            <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">
                                    Số lượng vượt quá tồn kho! Vui lòng giảm xuống tối đa {medicine.so_luong_thuoc_ton_thuoc}.
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default MedicineList;