import React, { useEffect, useState } from 'react';
import {
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    X,
    Calendar,
    CreditCard,
    Pill,
    Receipt
} from 'lucide-react';
import invoiceAPI from '../services/invoiceAPI';

/*
TRẠNG THÁI HÓA ĐƠN
0 - Chưa thanh toán
1 - Đã thanh toán
*/

function MyInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [detailModal, setDetailModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            setLoading(true);
            const res = await invoiceAPI.getMyInvoices();
            setInvoices(res.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openDetail = async (invoiceId) => {
        try {
            setDetailLoading(true);
            setDetailModal(true);
            const res = await invoiceAPI.getById(invoiceId);
            setSelectedInvoice(res.data);
        } catch (e) {
            alert('Không thể tải chi tiết hóa đơn');
            setDetailModal(false);
        } finally {
            setDetailLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        return status === 1 ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3" />
                Đã thanh toán
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                <Clock className="w-3 h-3" />
                Chưa thanh toán
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* HEADER */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-teal-100 p-3 rounded-lg">
                            <Receipt className="w-6 h-6 text-teal-700" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Lịch sử hóa đơn
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Quản lý và theo dõi hóa đơn của bạn
                            </p>
                        </div>
                    </div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                        <p className="mt-2 text-gray-600">Đang tải...</p>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && invoices.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Chưa có hóa đơn
                        </h3>
                        <p className="text-gray-500">
                            Bạn chưa có hóa đơn nào trong hệ thống
                        </p>
                    </div>
                )}

                {/* INVOICES LIST */}
                {!loading && invoices.length > 0 && (
                    <div className="space-y-4">
                        {invoices.map((inv) => (
                            <div
                                key={inv.ma_hoa_don}
                                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* HEADER */}
                                <div className="flex justify-between items-start mb-5 pb-4 border-b border-gray-100">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-teal-50 p-2 rounded-lg">
                                            <FileText className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                Mã hóa đơn
                                            </p>
                                            <p className="font-mono text-base font-semibold text-gray-900 mt-1">
                                                #{inv.ma_hoa_don}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(inv.trang_thai_hoa_don)}
                                </div>

                                {/* INFO GRID */}
                                <div className="grid grid-cols-2 gap-6 mb-5">
                                    {/* Ngày tạo */}
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 p-2 rounded-lg">
                                            <Calendar className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">
                                                Ngày tạo
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {new Date(inv.ngay_tao_hoa_don).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tổng tiền */}
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-50 p-2 rounded-lg">
                                            <CreditCard className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">
                                                Tổng tiền
                                            </p>
                                            <p className="text-lg font-bold text-teal-700">
                                                {Number(inv.tong_thanh_tien_hoa_don).toLocaleString('vi-VN')} ₫
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION */}
                                <div className="flex justify-end pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => openDetail(inv.ma_hoa_don)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ================= MODAL CHI TIẾT ================= */}
                {detailModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                            {/* MODAL HEADER */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-teal-100 p-2 rounded-lg">
                                        <Receipt className="w-5 h-5 text-teal-700" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Chi tiết hóa đơn
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setDetailModal(false)}
                                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* MODAL BODY */}
                            <div className="p-6">
                                {detailLoading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                                        <p className="mt-2 text-gray-600">Đang tải...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Invoice Info */}
                                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                        Mã hóa đơn
                                                    </p>
                                                    <p className="font-mono font-semibold text-gray-900 mt-1">
                                                        #{selectedInvoice?.ma_hoa_don}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                        Trạng thái
                                                    </p>
                                                    <div className="mt-1">
                                                        {getStatusBadge(selectedInvoice?.trang_thai_hoa_don)}
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedInvoice?.ghi_chu_hoa_don && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                        Ghi chú
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        {selectedInvoice.ghi_chu_hoa_don}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Medicines/Services */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Pill className="w-5 h-5 text-teal-600" />
                                                <h3 className="font-semibold text-gray-900">
                                                    Thuốc & Dịch vụ
                                                </h3>
                                            </div>

                                            {selectedInvoice?.medicines?.length === 0 ? (
                                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-gray-500">Không có dữ liệu</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {selectedInvoice?.medicines?.map((m, index) => (
                                                        <div
                                                            key={m.ma_thuoc}
                                                            className="flex justify-between items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className="bg-white p-2 rounded-lg">
                                                                    <span className="text-xs font-bold text-teal-600">
                                                                        {index + 1}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">
                                                                        {m.ten_thuoc}
                                                                    </p>
                                                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                                        <span>
                                                                            SL: <span className="font-medium">{m.so_luong_thuoc_hoa_don}</span>
                                                                        </span>
                                                                        <span>×</span>
                                                                        <span>
                                                                            {Number(m.don_gia_thuoc).toLocaleString('vi-VN')} ₫
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-teal-700">
                                                                    {(m.don_gia_thuoc * m.so_luong_thuoc_hoa_don)
                                                                        .toLocaleString('vi-VN')} ₫
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Total */}
                                        <div className="mt-6 pt-6 border-t-2 border-gray-200">
                                            <div className="flex justify-between items-center bg-teal-50 p-4 rounded-lg">
                                                <span className="text-lg font-semibold text-gray-900">
                                                    Tổng cộng
                                                </span>
                                                <span className="text-2xl font-bold text-teal-700">
                                                    {Number(selectedInvoice?.tong_thanh_tien_hoa_don)
                                                        .toLocaleString('vi-VN')} ₫
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyInvoices;