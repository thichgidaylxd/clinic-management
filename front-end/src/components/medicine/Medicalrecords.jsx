// front-end/src/components/medicine/MedicalRecords.jsx
// Component hiển thị danh sách hồ sơ bệnh án cho bác sĩ

import React, { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    Calendar,
    User,
    Stethoscope,
    Eye,
    Filter,
    Loader2,
    AlertCircle
} from 'lucide-react';
import medicalRecordAPI from '../../services/medicalRecordAPI'; // Import API của bạn
import { useNavigate } from 'react-router-dom';

function MedicalRecords() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [error, setError] = useState('');

    const pageSize = 10; // Số bản ghi mỗi trang

    useEffect(() => {
        loadRecords();
    }, [currentPage, searchKeyword, filterSpecialty]);

    const loadRecords = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await medicalRecordAPI.getAllForDoctor({
                page: currentPage,
                limit: pageSize,
                search: searchKeyword.trim(),
                specialty: filterSpecialty === 'all' ? 'all' : filterSpecialty
            });

            /**
             * response.data =
             * {
             *   data: [...],
             *   pagination: { total, page, limit, totalPages }
             * }
             */
            const recordsData = response?.data?.data || [];
            const pagination = response?.data?.pagination || {};

            setRecords(recordsData);
            setTotalRecords(pagination.total || 0);
            setTotalPages(pagination.totalPages || 1);

        } catch (err) {
            console.error('Load medical records error:', err);
            setError('Không thể tải danh sách hồ sơ. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };


    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xác định';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewRecord = (recordId) => {
        navigate(`/doctor/medical-records/${recordId}`);
    };

    const filteredRecords = records;

    return (
        <div className="space-y-6">
            {/* Search & Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => {
                                    setSearchKeyword(e.target.value);
                                    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                                }}
                                placeholder="Tìm theo tên bệnh nhân, chẩn đoán..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition"
                            />
                        </div>
                    </div>


                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {totalRecords}
                            </div>

                            <div className="text-sm text-gray-600">Tổng hồ sơ</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {records.filter(r => {
                                    const today = new Date().toISOString().split('T')[0];
                                    return r.ngay_tao_ho_so?.startsWith(today);
                                }).length}
                            </div>

                            <div className="text-sm text-gray-600">Hôm nay</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {new Set(records.map(r => r.ma_benh_nhan)).size}
                            </div>

                            <div className="text-sm text-gray-600">Bệnh nhân</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {/* Tính tuần này - bạn có thể dùng logic date */}
                                0
                            </div>
                            <div className="text-sm text-gray-600">Tuần này</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Records List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">
                        Danh sách hồ sơ ({filteredRecords.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="text-center py-20">
                        <FileText className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                        <p className="text-lg text-gray-600 mb-2">
                            {searchKeyword || filterSpecialty !== 'all'
                                ? 'Không tìm thấy hồ sơ phù hợp với bộ lọc'
                                : 'Chưa có hồ sơ bệnh án nào'}
                        </p>
                        <p className="text-sm text-gray-500">
                            Hồ sơ sẽ được tạo tự động khi bạn hoàn tất khám bệnh và kê đơn thuốc
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredRecords.map((record) => (
                            <div
                                key={record.ma_ho_so_benh_an}
                                className="p-6 hover:bg-gray-50 transition cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {record.ho_benh_nhan} {record.ten_benh_nhan}
                                            </h3>

                                            {record.ten_chuyen_khoa && (
                                                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                                                    {record.ten_chuyen_khoa}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <Stethoscope className="w-4 h-4 text-teal-600" />
                                                <span className="font-medium">Chẩn đoán:</span>
                                                <span>{record.chuan_doan || 'Chưa có chẩn đoán'}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span>{formatDate(record.ngay_tao_ho_so)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewRecord(record.ma_ho_so_benh_an);
                                        }}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium shadow-sm"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Trước
                        </button>

                        <span className="text-sm text-gray-600">
                            Trang {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MedicalRecords;