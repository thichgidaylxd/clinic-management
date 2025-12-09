import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles = [] }) {
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');

        // Chưa đăng nhập
        if (!token || !user) {
            setIsAuthorized(false);
            setIsChecking(false);
            return;
        }

        // Kiểm tra role
        if (allowedRoles.length > 0) {
            const hasPermission = allowedRoles.includes(user.ten_vai_tro);
            setIsAuthorized(hasPermission);
        } else {
            // Nếu không có allowedRoles thì chỉ cần login
            setIsAuthorized(true);
        }

        setIsChecking(false);
    };

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        // Redirect về trang chủ với thông báo
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;