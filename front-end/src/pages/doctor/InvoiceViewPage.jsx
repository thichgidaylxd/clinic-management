import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FileText,
    Printer,
    CreditCard,
    CheckCircle2,
    Clock,
    ArrowLeft,
    Loader2,
    AlertCircle,
    User,
    Calendar,
    Pill
} from 'lucide-react';
import prescriptionAPI from '../../services/prescriptionAPI';
import { formatPrice } from '../../util/priceFormatter';



function InvoiceViewPage() {
    const { invoiceId } = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadInvoice();
    }, [invoiceId]);

    const loadInvoice = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await prescriptionAPI.getInvoice(invoiceId);
            setInvoice(response.data);
        } catch (err) {
            console.error('Load invoice error:', err);
            setError('Không thể tải thông tin hóa đơn');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        if (status === 1) {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã thanh toán
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                <Clock className="w-4 h-4" />
                Chưa thanh toán
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-700">{error || 'Không tìm thấy hóa đơn'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    // Calculate medicine total
    const medicineTotal = invoice.medicines?.reduce(
        (total, med) => total + (med.thanh_tien || 0),
        0
    ) || 0;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-6 no-print">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            <Printer className="w-5 h-5" />
                            In hóa đơn
                        </button>

                        {invoice.trang_thai_hoa_don === 0 && (
                            <button
                                onClick={() => navigate(`/invoices/${invoiceId}/payment`)}
                                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                            >
                                <CreditCard className="w-5 h-5" />
                                Thanh toán
                            </button>
                        )}
                    </div>
                </div>

                {/* Invoice Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">HÓA ĐƠN</h1>
                                <p className="text-teal-100">Phòng khám Nha khoa</p>
                            </div>
                            <FileText className="w-16 h-16 opacity-50" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Status */}
                        <div className="flex items-center justify-between mb-6 pb-6 border-b">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Mã hóa đơn</p>
                                <p className="font-mono font-semibold text-gray-900">
                                    #{invoice.ma_hoa_don?.slice(-8).toUpperCase()}
                                </p>
                            </div>
                            {getStatusBadge(invoice.trang_thai_hoa_don)}
                        </div>

                        {/* Patient Info */}
                        <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Thông tin bệnh nhân
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        <span className="text-gray-600">Họ tên:</span>{' '}
                                        <span className="font-semibold">
                                            {invoice.ho_benh_nhan} {invoice.ten_benh_nhan}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="text-gray-600">SĐT:</span>{' '}
                                        {invoice.so_dien_thoai_benh_nhan}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Thông tin hóa đơn
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        <span className="text-gray-600">Ngày tạo:</span>{' '}
                                        {formatDate(invoice.ngay_tao_hoa_don)}
                                    </p>
                                    {invoice.ngay_tra_tien_hoa_don && (
                                        <p>
                                            <span className="text-gray-600">Ngày thanh toán:</span>{' '}
                                            {formatDate(invoice.ngay_tra_tien_hoa_don)}
                                        </p>
                                    )}
                                    {invoice.ten_chuyen_khoa && (
                                        <p>
                                            <span className="text-gray-600">Chuyên khoa:</span>{' '}
                                            {invoice.ten_chuyen_khoa}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Medicines Table */}
                        {invoice.medicines && invoice.medicines.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Pill className="w-5 h-5 text-teal-600" />
                                    Danh sách thuốc
                                </h3>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b">
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                    STT
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                    Tên thuốc
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                                    SL
                                                </th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                                    Đơn giá
                                                </th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                                    Thành tiền
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoice.medicines.map((medicine, index) => (
                                                <tr key={medicine.ma_thuoc_hoa_don} className="border-b">
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-gray-900">
                                                            {medicine.ten_thuoc}
                                                        </p>
                                                        {medicine.ghi_chu_thuoc && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                💊 {medicine.ghi_chu_thuoc}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                                                        {medicine.so_luong_thuoc_hoa_don} {medicine.don_vi_tinh}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                                                        {formatPrice(medicine.don_gia_thuoc)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                                        {formatPrice(medicine.thanh_tien)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Total Summary */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-700">
                                    <span>Tiền thuốc:</span>
                                    <span className="font-semibold">{formatPrice(medicineTotal)}</span>
                                </div>

                                <div className="border-t-2 border-gray-300 pt-3">
                                    <div className="flex justify-between text-xl font-bold">
                                        <span className="text-gray-900">TỔNG CỘNG:</span>
                                        <span className="text-teal-700">
                                            {formatPrice(invoice.tong_thanh_tien_hoa_don)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        {invoice.ghi_chu_hoa_don && (
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm font-semibold text-blue-900 mb-1">Ghi chú:</p>
                                <p className="text-sm text-blue-700">{invoice.ghi_chu_hoa_don}</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
                            <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
                            <p className="mt-1">Mọi thắc mắc vui lòng liên hệ: 1900-xxxx</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background: white;
                    }
                }
            `}</style>
        </div>
    );
}

export default InvoiceViewPage;