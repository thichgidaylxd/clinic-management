import React from 'react';
import { DollarSign, Stethoscope, Pill, CheckCircle2, Save, Loader2, ArrowLeft } from 'lucide-react';

function InvoiceSummary({
    serviceFee,
    medicineTotal,
    grandTotal,
    selectedMedicines,
    medicalRecord,
    submitting,
    onSubmit,
    onCancel
}) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Tổng Kết Chi Phí
                </h3>
            </div>
            <div className="p-6">
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700 flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-blue-600" />
                            Tiền khám
                        </span>
                        <span className="font-semibold text-gray-900">{formatPrice(serviceFee)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700 flex items-center gap-2">
                            <Pill className="w-4 h-4 text-green-600" />
                            Tiền thuốc
                        </span>
                        <span className="font-semibold text-gray-900">{formatPrice(medicineTotal)}</span>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                            <span className="text-xl font-bold text-purple-700">{formatPrice(grandTotal)}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Kiểm tra:</p>
                    <div className="flex items-center gap-2 text-sm">
                        {selectedMedicines.length > 0 ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                        <span className={selectedMedicines.length > 0 ? 'text-green-700' : 'text-gray-600'}>
                            {selectedMedicines.length} loại thuốc
                        </span>
                    </div>
                    {/* Các item kiểm tra khác tương tự */}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={submitting}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-md"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Hoàn Tất Khám
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InvoiceSummary;