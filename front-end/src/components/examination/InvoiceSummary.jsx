import React from 'react';
import { DollarSign, Stethoscope, Pill, CheckCircle2, Save, Loader2, ArrowLeft } from 'lucide-react';

function InvoiceSummary({
    serviceName,
    serviceFee,
    medicineTotal,
    extraFee,
    setExtraFee,
    grandTotal,
    selectedMedicines,
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
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="text-gray-700 flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-blue-600" />
                                {serviceName}
                            </span>
                            <span className="font-semibold text-gray-900">
                                <div className="ms-4">{formatPrice(serviceFee)}</div>
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="text-gray-700 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-orange-600" />
                                Chi phí phát sinh
                            </span>

                            <input
                                type="number"
                                min={0}
                                value={extraFee}
                                onChange={(e) => setExtraFee(Number(e.target.value || 0))}
                                className="w-40 ms-4 text-right px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-semibold"
                            />
                        </div>

                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700 flex items-center gap-2">
                            <Pill className="w-4 h-4 text-green-600" />
                            Tiền thuốc
                        </span>
                        <span className="font-semibold text-gray-900">{formatPrice(medicineTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-orange-600" />
                            Chi phí phát sinh
                        </span>
                        <span className="font-semibold text-gray-900">
                            {formatPrice(extraFee)}
                        </span>
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