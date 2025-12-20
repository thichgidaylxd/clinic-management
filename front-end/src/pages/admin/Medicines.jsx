import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, Package, AlertTriangle } from 'lucide-react';
import MedicineModal from '../../components/admin/MedicineModal';
import { adminAPI } from '../../services/adminAPI';

function Medicines() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    useEffect(() => {
        loadMedicines();
    }, []);

    const loadMedicines = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getMedicines(1, 100);
            setMedicines(response.data.data || []);
        } catch (error) {
            console.error('Load medicines error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedMedicine(null);
        setShowModal(true);
    };

    const handleEdit = (medicine) => {
        setSelectedMedicine(medicine);
        setShowModal(true);
    };

    const handleDelete = async (medicineId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa thuốc này?')) return;

        try {
            await adminAPI.deleteMedicine(medicineId);
            alert('Xóa thuốc thành công');
            loadMedicines();
        } catch (error) {
            alert(error.message || 'Xóa thất bại');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const filteredMedicines = medicines.filter((m) =>
        m.ten_thuoc.toLowerCase().includes(search.toLowerCase())
    );

    const getLowStockCount = () => {
        return medicines.filter(m => m.so_luong_thuoc_ton_thuoc < 50).length;
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Quản lý Thuốc
                    </h1>
                    <p className="text-gray-600">
                        Quản lý kho thuốc và dược phẩm
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    Thêm thuốc
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Tổng số loại thuốc</p>
                            <p className="text-3xl font-bold text-gray-900">{medicines.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Tổng tồn kho</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {medicines.reduce((sum, m) => sum + (m.so_luong_thuoc_ton_thuoc || 0), 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Sắp hết hàng</p>
                            <p className="text-3xl font-bold text-red-600">{getLowStockCount()}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm thuốc..."
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
                                        Tên thuốc
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Thành phần
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Đơn vị
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Đơn giá
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Tồn kho
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredMedicines.map((medicine) => (
                                    <tr key={medicine.ma_thuoc} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {medicine.ten_thuoc}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 max-w-xs truncate">
                                                {medicine.thanh_phan_thuoc || medicine.huong_dan_su_dung_thuoc || 'Chưa có'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900">
                                                {medicine.don_vi_tinh}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-teal-700">
                                                {formatPrice(medicine.don_gia_thuoc)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 text-sm font-medium rounded-full ${medicine.so_luong_thuoc_ton_thuoc < 50
                                                    ? 'bg-red-100 text-red-800'
                                                    : medicine.so_luong_thuoc_ton_thuoc < 100
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}
                                            >
                                                {medicine.so_luong_thuoc_ton_thuoc || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(medicine)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(medicine.ma_thuoc)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredMedicines.length === 0 && (
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg mb-2">
                                    {search ? 'Không tìm thấy thuốc nào' : 'Chưa có thuốc nào'}
                                </p>
                                <button
                                    onClick={handleCreate}
                                    className="text-teal-700 hover:text-teal-800 font-medium"
                                >
                                    + Thêm thuốc đầu tiên
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <MedicineModal
                    medicine={selectedMedicine}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedMedicine(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setSelectedMedicine(null);
                        loadMedicines();
                    }}
                />
            )}
        </div>
    );
}

export default Medicines;