import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, DollarSign } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';
import ServiceModal from '../../components/admin/ServiceModal';

function Services() {
    const [services, setServices] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        loadData();
    }, [filterSpecialty]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [servicesRes, specialtiesRes] = await Promise.all([
                adminAPI.getServices(1, 100, filterSpecialty || null),
                adminAPI.getSpecialties(1, 100)
            ]);
            setServices(servicesRes.data.data || []);
            setSpecialties(specialtiesRes.data.data || []);
        } catch (error) {
            console.error('Load data error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedService(null);
        setShowModal(true);
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        setShowModal(true);
    };

    const handleDelete = async (serviceId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) return;

        try {
            await adminAPI.deleteService(serviceId);
            alert('Xóa dịch vụ thành công');
            loadData();
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

    const filteredServices = services.filter((s) =>
        s.ten_dich_vu.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Quản lý Dịch vụ
                    </h1>
                    <p className="text-gray-600">
                        Quản lý danh sách dịch vụ khám chữa bệnh
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Thêm dịch vụ
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm dịch vụ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        />
                    </div>
                    <select
                        value={filterSpecialty}
                        onChange={(e) => setFilterSpecialty(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                    >
                        <option value="">Tất cả chuyên khoa</option>
                        {specialties.map((s) => (
                            <option key={s.ma_chuyen_khoa} value={s.ma_chuyen_khoa}>
                                {s.ten_chuyen_khoa}
                            </option>
                        ))}
                    </select>
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
                                        Tên dịch vụ
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Chuyên khoa
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Đơn giá
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
                                {filteredServices.map((service) => (
                                    <tr key={service.ma_dich_vu} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {service.ten_dich_vu}
                                            </div>
                                        </td>
                                        <td className="px-2 py-4">
                                            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full">
                                                {service.ten_chuyen_khoa || 'Chưa có'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-bold text-teal-700">
                                                <DollarSign className="w-4 h-4" />
                                                {formatPrice(service.don_gia_dich_vu)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600 text-sm line-clamp-2">
                                                {service.mo_ta_dich_vu || 'Chưa có mô tả'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(service)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(service.ma_dich_vu)}
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

                        {filteredServices.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Không tìm thấy dịch vụ nào</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <ServiceModal
                    service={selectedService}
                    specialties={specialties}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedService(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setSelectedService(null);
                        loadData();
                    }}
                />
            )}
        </div>
    );
}

export default Services;