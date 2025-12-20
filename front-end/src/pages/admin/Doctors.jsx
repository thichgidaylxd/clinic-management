import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, Star } from 'lucide-react';

import { adminAPI } from '../../services/adminAPI';
import DoctorModal from '../../components/admin/DoctorsModal';

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getDoctors(1, 100);
            setDoctors(response.data.data || []);
        } catch (error) {
            console.error('Load doctors error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedDoctor(null);
        setShowModal(true);
    };

    const handleEdit = (doctor) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    const handleDelete = async (doctorId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) return;

        try {
            await adminAPI.deleteDoctor(doctorId);
            alert('Xóa bác sĩ thành công');
            loadDoctors();
        } catch (error) {
            alert(error.message || 'Xóa thất bại');
        }
    };

    const filteredDoctors = doctors.filter((d) =>
        `${d.ho_nguoi_dung} ${d.ten_nguoi_dung}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Quản lý Bác sĩ
                    </h1>
                    <p className="text-gray-600">
                        Quản lý danh sách bác sĩ trong hệ thống
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Thêm bác sĩ
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bác sĩ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
                    </div>
                ) : (
                    filteredDoctors.map((doctor) => (
                        <div
                            key={doctor.ma_bac_si}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
                        >
                            {/* Avatar */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl font-bold text-teal-700">
                                        {doctor.ho_nguoi_dung?.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg">
                                        {doctor.ho_nguoi_dung} {doctor.ten_nguoi_dung}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {doctor.ten_chuc_vu || 'Bác sĩ'}
                                    </p>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 mb-4">
                                {doctor.ten_chuyen_khoa && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full">
                                            {doctor.ten_chuyen_khoa}
                                        </span>
                                    </div>
                                )}
                                {doctor.so_nam_kinh_nghiem_bac_si && (
                                    <p className="text-sm text-gray-600">
                                        {doctor.so_nam_kinh_nghiem_bac_si} năm kinh nghiệm
                                    </p>
                                )}
                                {doctor.avg_rating && (
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-medium text-gray-700">
                                            {doctor.avg_rating} ({doctor.total_ratings || 0} đánh giá)
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t">
                                <button
                                    onClick={() => handleEdit(doctor)}
                                    className="flex-1 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                                >
                                    <Edit className="w-4 h-4 inline mr-2" />
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(doctor.ma_bac_si)}
                                    className="flex-1 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition font-medium"
                                >
                                    <Trash2 className="w-4 h-4 inline mr-2" />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {!loading && filteredDoctors.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">Không tìm thấy bác sĩ nào</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <DoctorModal
                    doctor={selectedDoctor}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedDoctor(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setSelectedDoctor(null);
                        loadDoctors();
                    }}
                />
            )}
        </div>
    );
}

export default Doctors;