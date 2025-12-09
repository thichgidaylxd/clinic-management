import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import SpecialtyModal from '../../components/admin/SpecialtyModal';

function Specialties() {
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        loadSpecialties();
    }, []);

    const loadSpecialties = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/v1/specialties', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setSpecialties(data.data.data || []);
        } catch (error) {
            console.error('Load specialties error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedSpecialty(null);
        setShowModal(true);
    };

    const handleEdit = (specialty) => {
        setSelectedSpecialty(specialty);
        setShowModal(true);
    };

    const handleDelete = async (specialtyId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa chuyên khoa này?')) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/v1/specialties/${specialtyId}`,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.ok) {
                alert('Xóa chuyên khoa thành công');
                loadSpecialties();
            } else {
                const data = await response.json();
                alert(data.message || 'Xóa thất bại');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Có lỗi xảy ra');
        }
    };

    const filteredSpecialties = specialties.filter((s) =>
        s.ten_chuyen_khoa.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Quản lý Chuyên khoa
                    </h1>
                    <p className="text-gray-600">
                        Quản lý danh sách chuyên khoa trong hệ thống
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Thêm chuyên khoa
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm chuyên khoa..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Tên chuyên khoa
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Mô tả
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSpecialties.map((specialty) => (
                                    <tr key={specialty.ma_chuyen_khoa} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {specialty.ten_chuyen_khoa}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600 text-sm line-clamp-2">
                                                {specialty.mo_ta_chuyen_khoa || 'Chưa có mô tả'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(specialty)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(specialty.ma_chuyen_khoa)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredSpecialties.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Không tìm thấy chuyên khoa nào</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <SpecialtyModal
                    specialty={selectedSpecialty}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedSpecialty(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setSelectedSpecialty(null);
                        loadSpecialties();
                    }}
                />
            )}
        </div>
    );
}

export default Specialties;