// front-end/src/components/medicine/Medicalrecords.jsx
// Component để hiển thị danh sách hồ sơ bệnh án cho bác sĩ

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
import medicalRecordAPI from '../../services/medicalRecordAPI';
import { useNavigate } from 'react-router-dom';

function MedicalRecords() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadRecords();
    }, [currentPage]);

    const loadRecords = async () => {
        setLoading(true);
        try {
            // TODO: Implement get all medical records for current doctor
            // For now, show empty state
            setRecords([]);
            setTotalPages(1);
        } catch (error) {
            console.error('Load records error:', error);
        } finally {
            setLoading(false);
        }
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

    const handleViewRecord = (recordId) => {
        navigate(`/doctor/medical-records/${recordId}`);
    };

    const filteredRecords = records.filter(record => {
        const matchSearch = searchKeyword === '' ||
            record.ten_benh_nhan?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            record.ho_benh_nhan?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            record.chuan_doan?.toLowerCase().includes(searchKeyword.toLowerCase());

        const matchSpecialty = filterSpecialty === 'all' ||
            record.ten_chuyen_khoa === filterSpecialty;

        return matchSearch && matchSpecialty;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-teal-600" />
                    Hồ Sơ Bệnh Án
                </h1>
                <p className="text-gray-600 mt-1">
                    Quản lý hồ sơ bệnh án của bệnh nhân
                </p>
            </div>

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
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="Tìm theo tên bệnh nhân, chẩn đoán..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Filter by Specialty */}
                    <div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={filterSpecialty}
                                onChange={(e) => setFilterSpecialty(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none appearance-none bg-white"
                            >
                                <option value="all">Tất cả chuyên khoa</option>
                                <option value="Nha khoa">Nha khoa</option>
                                <option value="Nội khoa">Nội khoa</option>
                                <option value="Ngoại khoa">Ngoại khoa</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{records.length}</div>
                            <div className="text-sm text-gray-600">Tổng hồ sơ</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">0</div>
                            <div className="text-sm text-gray-600">Hôm nay</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">0</div>
                            <div className="text-sm text-gray-600">Bệnh nhân</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">0</div>
                            <div className="text-sm text-gray-600">Tuần này</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Records List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">
                        Danh sách hồ sơ ({filteredRecords.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                            {searchKeyword || filterSpecialty !== 'all'
                                ? 'Không tìm thấy hồ sơ phù hợp'
                                : 'Chưa có hồ sơ bệnh án nào'
                            }
                        </p>
                        <p className="text-sm text-gray-500">
                            Hồ sơ sẽ được tạo tự động khi bạn kê đơn thuốc
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredRecords.map((record) => (
                            <div
                                key={record.ma_ho_so_benh_an}
                                className="p-6 hover:bg-gray-50 transition cursor-pointer"
                                onClick={() => handleViewRecord(record.ma_ho_so_benh_an)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {record.ho_benh_nhan} {record.ten_benh_nhan}
                                            </h3>
                                            {record.ten_chuyen_khoa && (
                                                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                                                    {record.ten_chuyen_khoa}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Stethoscope className="w-4 h-4" />
                                                <span className="font-medium">Chẩn đoán:</span>
                                                <span>{record.chuan_doan}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(record.ngay_tao_ho_so)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewRecord(record.ma_ho_so_benh_an);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
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
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>

                        <span className="text-sm text-gray-600">
                            Trang {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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