import React, { useState } from 'react';
import { X, Loader2, Key } from 'lucide-react';
import { authAPI } from '../../services/authAPI';

function ChangePasswordModal({ onClose }) {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.newPassword !== form.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (form.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await authAPI.changeMyPassword(
                form.oldPassword,
                form.newPassword
            );

            alert('Đổi mật khẩu thành công');
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <Key className="text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold">Đổi mật khẩu</h2>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Mật khẩu cũ"
                        type="password"
                        value={form.oldPassword}
                        onChange={(v) => setForm({ ...form, oldPassword: v })}
                    />
                    <Input
                        label="Mật khẩu mới"
                        type="password"
                        value={form.newPassword}
                        onChange={(v) => setForm({ ...form, newPassword: v })}
                    />
                    <Input
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        value={form.confirmPassword}
                        onChange={(v) => setForm({ ...form, confirmPassword: v })}
                    />

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border rounded-lg py-2"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white rounded-lg py-2 flex justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                'Đổi mật khẩu'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Input({ label, type, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
        </div>
    );
}

export default ChangePasswordModal;
