import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Shield,
    User,
    Mail,
    Phone,
    Key,
    UserCheck,
    UserX
} from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';
import UserModal from '../../components/admin/UserModal';
import PasswordModal from '../../components/admin/PasswordModal';

function Users() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [filters, setFilters] = useState({
        search: '',
        roleId: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        byRole: {}
    });

    useEffect(() => {
        loadData();
        loadRoles();
    }, [pagination.page, filters]);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getUsers(
                pagination.page,
                pagination.limit,
                filters.search,
                filters.roleId
            );
            setUsers(response.data.data || []);
            setPagination(response.data.pagination || pagination);
            calculateStats(response.data.data || []);
        } catch (error) {
            console.error('Load users error:', error);
            alert('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const loadRoles = async () => {
        try {
            const response = await adminAPI.getRoles();
            setRoles(response.data || []);
        } catch (error) {
            console.error('Load roles error:', error);
        }
    };

    const calculateStats = (data) => {
        const byRole = {};
        data.forEach(user => {
            byRole[user.ten_vai_tro] = (byRole[user.ten_vai_tro] || 0) + 1;
        });

        setStats({
            total: data.length,
            active: data.filter(u => u.trang_thai_nguoi_dung === 1).length,
            inactive: data.filter(u => u.trang_thai_nguoi_dung === 0).length,
            byRole
        });
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setShowModal(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleChangePassword = (user) => {
        setSelectedUser(user);
        setShowPasswordModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

        try {
            await adminAPI.deleteUser(id);
            alert('Xóa thành công');
            loadData();
        } catch (error) {
            alert(error.message || 'Không thể xóa người dùng');
        }
    };

    const handleModalSuccess = () => {
        setShowModal(false);
        setShowPasswordModal(false);
        loadData();
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            'Quản trị viên': 'bg-purple-100 text-purple-700 border-purple-200',
            'Bác sĩ': 'bg-blue-100 text-blue-700 border-blue-200',
            'Lễ tân': 'bg-green-100 text-green-700 border-green-200',
            'Bệnh nhân': 'bg-gray-100 text-gray-700 border-gray-200'
        };
        return roleColors[role] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Người dùng</h1>
                    <p className="text-gray-600">Quản lý tài khoản và phân quyền người dùng</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Thêm người dùng
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <User className="w-6 h-6 text-blue-700" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Tổng người dùng</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-xl">
                            <UserCheck className="w-6 h-6 text-green-700" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                            <div className="text-sm text-gray-600">Đang hoạt động</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-xl">
                            <UserX className="w-6 h-6 text-red-700" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.inactive}</div>
                            <div className="text-sm text-gray-600">Ngừng hoạt động</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <Shield className="w-6 h-6 text-purple-700" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Theo vai trò</div>
                            <div className="flex flex-wrap gap-1">
                                {Object.entries(stats.byRole).map(([role, count]) => (
                                    <span key={role} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {role}: {count}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email, SĐT..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={filters.roleId}
                        onChange={(e) => setFilters({ ...filters, roleId: e.target.value })}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-700 focus:outline-none"
                    >
                        <option value="">Tất cả vai trò</option>
                        {roles.map((role) => (
                            <option key={role.ma_vai_tro} value={role.ma_vai_tro}>
                                {role.ten_vai_tro}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12">
                        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có người dùng</h3>
                        <p className="text-gray-600 mb-4">Chưa có người dùng nào trong hệ thống</p>
                        <button
                            onClick={handleCreate}
                            className="px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition font-medium"
                        >
                            Thêm người dùng đầu tiên
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Người dùng
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Thông tin liên hệ
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Vai trò
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Ngày tạo
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.ma_nguoi_dung} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                                                        <span className="text-teal-700 font-semibold">
                                                            {user.ten_nguoi_dung?.[0]?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {user.ho_nguoi_dung} {user.ten_nguoi_dung}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            @{user.ten_dang_nhap_nguoi_dung}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail className="w-4 h-4" />
                                                        {user.email_nguoi_dung}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="w-4 h-4" />
                                                        {user.so_dien_thoai_nguoi_dung}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.ten_vai_tro)}`}>
                                                    <Shield className="w-3 h-3" />
                                                    {user.ten_vai_tro}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.trang_thai_nguoi_dung === 1
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {user.trang_thai_nguoi_dung === 1 ? '● Hoạt động' : '● Ngừng'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(user.ngay_tao_nguoi_dung).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleChangePassword(user)}
                                                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                                        title="Đổi mật khẩu"
                                                    >
                                                        <Key className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Sửa"
                                                    >
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.ma_nguoi_dung)}
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
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Hiển thị {users.length} / {pagination.total} người dùng
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        Trước
                                    </button>
                                    <span className="px-4 py-2 bg-teal-700 text-white rounded-lg">
                                        {pagination.page}
                                    </span>
                                    <button
                                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            {showModal && (
                <UserModal
                    user={selectedUser}
                    roles={roles}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}

            {showPasswordModal && (
                <PasswordModal
                    user={selectedUser}
                    onClose={() => setShowPasswordModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}
        </div>
    );
}

export default Users;