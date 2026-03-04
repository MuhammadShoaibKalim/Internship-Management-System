import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // 1. Not logged in -> Login
    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // 2. Logged in but role not allowed for this route
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their own dashboard instead of showing an error
        const dashboardMap = {
            student: '/dashboard/student',
            industry: '/dashboard/industry',
            supervisor: '/dashboard/supervisor',
            admin: '/dashboard/admin'
        };

        return <Navigate to={dashboardMap[user.role] || '/auth/login'} replace />;
    }

    // 3. Authorized
    return children;
};

export default ProtectedRoute;
