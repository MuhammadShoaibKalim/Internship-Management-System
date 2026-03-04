import React from 'react';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }) => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user) {
        const dashboardMap = {
            student: '/dashboard/student',
            industry: '/dashboard/industry',
            supervisor: '/dashboard/supervisor',
            admin: '/dashboard/admin'
        };

        return <Navigate to={dashboardMap[user.role] || '/'} replace />;
    }

    return children;
};

export default GuestRoute;
