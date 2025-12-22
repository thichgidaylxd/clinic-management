import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    DollarSign,
    Calendar,
    Activity,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminAPI } from '../../services/adminAPI';

function RevenueDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [revenueData, setRevenueData] = useState({
        summary: {
            serviceRevenue: 0,
            extraRevenue: 0,
            totalRevenue: 0
        },
        chart: []
    });

    // State cho date filter
    const [dateFilter, setDateFilter] = useState({
        fromDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchRevenueData();
    }, [dateFilter]);

    const fetchRevenueData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await adminAPI.getDashboard(dateFilter);
            setRevenueData(response.data);
        } catch (err) {
            console.error('Error fetching revenue:', err);
            setError(err.message || 'Không thể tải dữ liệu doanh thu');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit'
        });
    };

    // Format data cho chart
    const chartData = revenueData.chart.map(item => ({
        date: formatDate(item.ngay),
        fullDate: item.ngay,
        revenue: Number(item.doanh_thu || 0)
    }));

    const handleQuickFilter = (days) => {
        const toDate = new Date().toISOString().split('T')[0];
        const fromDate = new Date(new Date().setDate(new Date().getDate() - days)).toISOString().split('T')[0];
        setDateFilter({ fromDate, toDate });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Activity className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Đang tải dữ liệu doanh thu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                        Báo Cáo Doanh Thu
                    </h1>
                    <p className="text-gray-600 mt-2">Theo dõi và phân tích doanh thu phòng khám</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                        <div>
                            <p className="font-semibold text-red-900">Có lỗi xảy ra</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Date Filter */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Lọc Theo Thời Gian</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Quick Filters */}
                        <button
                            onClick={() => handleQuickFilter(7)}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium"
                        >
                            7 ngày qua
                        </button>
                        <button
                            onClick={() => handleQuickFilter(30)}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium"
                        >
                            30 ngày qua
                        </button>
                        <button
                            onClick={() => handleQuickFilter(90)}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium"
                        >
                            90 ngày qua
                        </button>
                        <button
                            onClick={() => handleQuickFilter(365)}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium"
                        >
                            1 năm qua
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Từ ngày
                            </label>
                            <input
                                type="date"
                                value={dateFilter.fromDate}
                                onChange={(e) => setDateFilter(prev => ({ ...prev, fromDate: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đến ngày
                            </label>
                            <input
                                type="date"
                                value={dateFilter.toDate}
                                onChange={(e) => setDateFilter(prev => ({ ...prev, toDate: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Total Revenue */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold opacity-90">Tổng Doanh Thu</h3>
                            <DollarSign className="w-8 h-8 opacity-80" />
                        </div>
                        <p className="text-3xl font-bold mb-2">
                            {formatPrice(revenueData.summary.totalRevenue)}
                        </p>
                        <p className="text-sm opacity-80">
                            {dateFilter.fromDate} đến {dateFilter.toDate}
                        </p>
                    </div>

                    {/* Service Revenue */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold opacity-90">Doanh Thu Dịch Vụ</h3>
                            <Activity className="w-8 h-8 opacity-80" />
                        </div>
                        <p className="text-3xl font-bold mb-2">
                            {formatPrice(revenueData.summary.serviceRevenue)}
                        </p>
                        <p className="text-sm opacity-80">
                            {((revenueData.summary.serviceRevenue / revenueData.summary.totalRevenue) * 100 || 0).toFixed(1)}% tổng doanh thu
                        </p>
                    </div>

                    {/* Extra Revenue */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold opacity-90">Chi Phí Phát Sinh</h3>
                            <TrendingUp className="w-8 h-8 opacity-80" />
                        </div>
                        <p className="text-3xl font-bold mb-2">
                            {formatPrice(revenueData.summary.extraRevenue)}
                        </p>
                        <p className="text-sm opacity-80">
                            {((revenueData.summary.extraRevenue / revenueData.summary.totalRevenue) * 100 || 0).toFixed(1)}% tổng doanh thu
                        </p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Line Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Biểu Đồ Doanh Thu Theo Ngày
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    style={{ fontSize: '12px' }}
                                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                />
                                <Tooltip
                                    formatter={(value) => formatPrice(value)}
                                    labelFormatter={(label) => `Ngày: ${label}`}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Doanh thu"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Biểu Đồ Cột Doanh Thu
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    style={{ fontSize: '12px' }}
                                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                />
                                <Tooltip
                                    formatter={(value) => formatPrice(value)}
                                    labelFormatter={(label) => `Ngày: ${label}`}
                                />
                                <Legend />
                                <Bar
                                    dataKey="revenue"
                                    name="Doanh thu"
                                    fill="#10b981"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow-md mt-6 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Chi Tiết Doanh Thu Theo Ngày
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Doanh Thu
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {chartData.length > 0 ? (
                                    chartData.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(item.fullDate).toLocaleDateString('vi-VN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                                                {formatPrice(item.revenue)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-8 text-center text-gray-500">
                                            Không có dữ liệu trong khoảng thời gian này
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RevenueDashboard;