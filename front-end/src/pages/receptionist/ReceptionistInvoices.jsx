import React, { useEffect, useState } from 'react';
import { Search, Download, CheckCircle, Clock, Filter, RefreshCw } from 'lucide-react';
import invoiceAPI from '../../services/invoiceAPI';

function ReceptionistInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [processingId, setProcessingId] = useState(null);
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await invoiceAPI.getAll();
            console.log('Invoices data:', res.data);
            setInvoices(res.data);
        } catch (error) {
            console.error('Lỗi khi tải hóa đơn:', error);
        } finally {
            setLoading(false);
        }
    };

    const payInvoice = async (id) => {
        if (!confirm('Xác nhận thanh toán hóa đơn này?')) return;

        try {
            setProcessingId(id);
            await invoiceAPI.pay(id);
            await fetchInvoices();
        } catch (error) {
            alert('Lỗi khi thanh toán: ' + error.message);
        } finally {
            setProcessingId(null);
        }
    };

    const printInvoice = async (id) => {
        try {
            setProcessingId(id);

            // Lấy token từ localStorage hoặc nơi bạn lưu
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            // Fetch PDF với authentication
            const response = await fetch(`http://localhost:5000/api/v1/invoices/${id}/print`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });


            if (!response.ok) {
                throw new Error('Không thể tải PDF');
            }

            // Tạo blob và mở trong tab mới
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');

            // Cleanup URL sau 1 phút
            setTimeout(() => window.URL.revokeObjectURL(url), 60000);
        } catch (error) {
            alert('Lỗi khi in hóa đơn: ' + error.message);
        } finally {
            setProcessingId(null);
        }
    };

    // Filter invoices
    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch =
            invoice.ma_hoa_don.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${invoice.ho_benh_nhan} ${invoice.ten_benh_nhan}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'paid' && invoice.trang_thai_hoa_don === 1) ||
            (statusFilter === 'unpaid' && invoice.trang_thai_hoa_don === 0);

        const matchesDate =
            !dateFilter ||
            invoice.ngay_tao_hoa_don?.split('T')[0] === dateFilter;

        return matchesSearch && matchesStatus && matchesDate;
    });


    // Statistics
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(i => i.trang_thai_hoa_don === 1).length;
    const unpaidInvoices = invoices.filter(i => i.trang_thai_hoa_don === 0).length;
    const totalAmount = invoices.reduce((sum, i) => sum + Number(i.tong_thanh_tien_hoa_don), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý hóa đơn</h1>
                    <p className="text-gray-600 mt-1">Theo dõi và xử lý các hóa đơn thanh toán</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng hóa đơn</p>
                                <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Filter className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Đã thanh toán</p>
                                <p className="text-2xl font-bold text-green-600">{paidInvoices}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Chưa thanh toán</p>
                                <p className="text-2xl font-bold text-orange-600">{unpaidInvoices}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {totalAmount.toLocaleString()} đ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo mã hóa đơn hoặc tên bệnh nhân..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        {/* Date Filter */}
                        <div className="relative">
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={() => setDateFilter('')}
                            className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                        >
                            Xóa ngày
                        </button>

                        {/* Status Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Tất cả
                            </button>
                            <button
                                onClick={() => setStatusFilter('paid')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'paid'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Đã thanh toán
                            </button>
                            <button
                                onClick={() => setStatusFilter('unpaid')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'unpaid'
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Chưa thanh toán
                            </button>
                            <button
                                onClick={fetchInvoices}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Làm mới
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {filteredInvoices.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Không tìm thấy hóa đơn nào</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Mã hóa đơn
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Bệnh nhân
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Tổng tiền
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredInvoices.map((invoice) => (
                                        <tr
                                            key={invoice.ma_hoa_don}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-mono text-sm text-gray-900">
                                                    {invoice.ma_hoa_don.slice(0, 8)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {invoice.ho_benh_nhan} {invoice.ten_benh_nhan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {Number(invoice.tong_thanh_tien_hoa_don).toLocaleString()} đ
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {invoice.trang_thai_hoa_don === 1 ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Đã thanh toán
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                        <Clock className="w-3 h-3" />
                                                        Chưa thanh toán
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {invoice.trang_thai_hoa_don === 0 && (
                                                        <button
                                                            onClick={() => payInvoice(invoice.ma_hoa_don)}
                                                            disabled={processingId === invoice.ma_hoa_don}
                                                            className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {processingId === invoice.ma_hoa_don ? (
                                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <CheckCircle className="w-4 h-4" />
                                                            )}
                                                            Thanh toán
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => printInvoice(invoice.ma_hoa_don)}
                                                        disabled={processingId === invoice.ma_hoa_don}
                                                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {processingId === invoice.ma_hoa_don ? (
                                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Download className="w-4 h-4" />
                                                        )}
                                                        In PDF
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 text-center text-sm text-gray-600">
                    Hiển thị {filteredInvoices.length} / {totalInvoices} hóa đơn
                </div>
            </div>
        </div>
    );
}

export default ReceptionistInvoices;