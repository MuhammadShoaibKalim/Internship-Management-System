import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRedirect = () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    const role = user.role;

    switch (role) {
        case 'student':
            return <Navigate to="/dashboard/student" replace />;
        case 'industry':
            return <Navigate to="/dashboard/industry" replace />;
        case 'supervisor':
            return <Navigate to="/dashboard/supervisor" replace />;
        case 'admin':
            return <Navigate to="/dashboard/admin" replace />;
        default:
            return <Navigate to="/auth/login" replace />;
    }
};

export default RoleBasedRedirect;
