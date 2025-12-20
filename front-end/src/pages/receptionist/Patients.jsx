import React, { useState } from 'react';
import { Search, User, Phone, Calendar, MapPin } from 'lucide-react';
import { receptionistAPI } from '../../services/receptionistAPI';

function ReceptionistPatients() {
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (searchQuery.length < 2) {
            alert('Vui lòng nhập ít nhất 2 ký tự');
            return;
        }

        setLoading(true);
        try {
            const response = await receptionistAPI.getPatients({
                search: searchQuery,
                page: 1,
                limit: 20
            });

            setPatients(response.data.data || []);
        } catch (error) {
            console.error('Search error:', error);
            alert('Có lỗi xảy ra khi tìm kiếm');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Bệnh nhân</h1>
                <p className="text-gray-600">Tìm kiếm và xem thông tin bệnh nhân</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Tìm kiếm theo tên, số điện thoại, email..."
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium disabled:opacity-50"
                    >
                        {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                    </button>
                </div>
            </div>

            {/* Results */}
            {patients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {patients.map((patient) => (
                        <div
                            key={patient.ma_benh_nhan}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-teal-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {patient.ho_benh_nhan} {patient.ten_benh_nhan}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Mã BN: {patient.ma_benh_nhan.substring(0, 8)}...
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${patient.gioi_tinh_benh_nhan === 0
                                    ? 'bg-pink-100 text-pink-700'
                                    : 'bg-blue-100 text-blue-700'

                                    }`}>
                                    {patient.gioi_tinh_benh_nhan === 1 ? 'Nam' : 'Nữ'}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    {patient.so_dien_thoai_benh_nhan}
                                </div>
                                {patient.email_benh_nhan && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        📧 {patient.email_benh_nhan}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(patient.ngay_sinh_benh_nhan).toLocaleDateString('vi-VN')}
                                </div>
                                {patient.dia_chi_benh_nhan && (
                                    <div className="flex items-start gap-2 text-gray-600">
                                        <MapPin className="w-4 h-4 mt-0.5" />
                                        <span className="line-clamp-2">{patient.dia_chi_benh_nhan}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {searchQuery ? 'Không tìm thấy bệnh nhân' : 'Nhập từ khóa để tìm kiếm'}
                    </h3>
                    <p className="text-gray-600">
                        {searchQuery
                            ? 'Thử tìm kiếm với từ khóa khác'
                            : 'Tìm kiếm theo tên, số điện thoại hoặc email'
                        }
                    </p>
                </div>
            )}
        </div>
    );
}

export default ReceptionistPatients;