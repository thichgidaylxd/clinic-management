// File: src/components/ProtectedRoute.jsx
// Thêm console.log để debug

import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    // ⭐ DEBUG
    console.log('=== ProtectedRoute Debug ===');
    console.log('User:', user);
    console.log('Token:', token);
    console.log('Allowed Roles:', allowedRoles);
    console.log('User Role:', user?.ten_vai_tro);
    console.log('Has Access:', allowedRoles?.includes(user?.ten_vai_tro));
    console.log('============================');

    // Check if user is logged in
    if (!user || !token) {
        console.log('❌ No user or token - Redirecting to home');
        return <Navigate to="/" replace />;
    }

    // Check if user has required role
    if (allowedRoles && !allowedRoles.includes(user.ten_vai_tro)) {
        console.log('❌ User role not allowed - Redirecting to home');
        return <Navigate to="/" replace />;
    }

    console.log('✅ Access granted');
    return children;
}

export default ProtectedRoute;