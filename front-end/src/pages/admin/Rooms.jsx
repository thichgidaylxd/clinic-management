import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, DoorOpen, MapPin } from 'lucide-react';
import RoomModal from '../../components/admin/RoomModal';
import { adminAPI } from '../../services/adminAPI';

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getRooms(1, 100);
            setRooms(response.data.data || []);
        } catch (error) {
            console.error('Load rooms error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedRoom(null);
        setShowModal(true);
    };

    const handleEdit = (room) => {
        setSelectedRoom(room);
        setShowModal(true);
    };

    const handleDelete = async (roomId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa phòng khám này?')) return;

        try {
            await adminAPI.deleteRoom(roomId);
            alert('Xóa phòng khám thành công');
            loadRooms();
        } catch (error) {
            alert(error.message || 'Xóa thất bại');
        }
    };

    const getRoomTypes = () => {
        const types = [...new Set(rooms.map(r => r.ten_loai_phong_kham).filter(Boolean))];
        return types;
    };

    const filteredRooms = rooms.filter((r) => {
        const matchSearch = r.ten_phong_kham.toLowerCase().includes(search.toLowerCase()) ||
            r.so_phong_kham?.toLowerCase().includes(search.toLowerCase());
        const matchType = !filterType || r.ten_loai_phong_kham === filterType;
        return matchSearch && matchType;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 1: return 'bg-green-100 text-green-800';
            case 0: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 1: return 'Hoạt động';
            case 0: return 'Đóng cửa';
            default: return 'Không xác định';
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Quản lý Phòng khám
                    </h1>
                    <p className="text-gray-600">
                        Quản lý các phòng khám và phòng điều trị
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    Thêm phòng khám
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Tổng số phòng</p>
                            <p className="text-3xl font-bold text-gray-900">{rooms.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <DoorOpen className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Đang hoạt động</p>
                            <p className="text-3xl font-bold text-green-600">
                                {rooms.filter(r => r.trang_thai_phong_kham === 1).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <DoorOpen className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Đóng cửa</p>
                            <p className="text-3xl font-bold text-red-600">
                                {rooms.filter(r => r.trang_thai_phong_kham === 0).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <DoorOpen className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Loại phòng</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {getRoomTypes().length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm phòng khám..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        >
                            <option value="">Tất cả loại phòng</option>
                            {getRoomTypes().map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
                    </div>
                ) : (
                    filteredRooms.map((room) => (
                        <div
                            key={room.ma_phong_kham}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
                        >
                            {/* Room Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                                        <DoorOpen className="w-6 h-6 text-teal-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">
                                            {room.ten_phong_kham}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Phòng {room.so_phong_kham || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(room.trang_thai_phong_kham)}`}
                                >
                                    {getStatusText(room.trang_thai_phong_kham)}
                                </span>
                            </div>

                            {/* Room Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{room.ten_loai_phong_kham || 'Chưa phân loại'}</span>
                                </div>
                                {room.mo_ta_phong_kham && (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {room.mo_ta_phong_kham}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t">
                                <button
                                    onClick={() => handleEdit(room)}
                                    className="flex-1 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-sm"
                                >
                                    <Edit className="w-4 h-4 inline mr-2" />
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(room.ma_phong_kham)}
                                    className="flex-1 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition font-medium text-sm"
                                >
                                    <Trash2 className="w-4 h-4 inline mr-2" />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {!loading && filteredRooms.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <DoorOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-2">
                            {search || filterType ? 'Không tìm thấy phòng khám nào' : 'Chưa có phòng khám nào'}
                        </p>
                        <button
                            onClick={handleCreate}
                            className="text-teal-700 hover:text-teal-800 font-medium"
                        >
                            + Thêm phòng khám đầu tiên
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <RoomModal
                    room={selectedRoom}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedRoom(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setSelectedRoom(null);
                        loadRooms();
                    }}
                />
            )}
        </div>
    );
}

export default Rooms;