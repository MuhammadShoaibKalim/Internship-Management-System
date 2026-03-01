import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, role = 'student' }) => {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar - Desktop Only */}
            <Sidebar role={role} />

            <div className="flex-1 flex flex-col lg:pl-64">
                {/* Header */}
                <Header user={{ name: 'Shoaib Engineer', role: role }} />

                {/* Main Content Area */}
                <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1">
                    <div className="animate-fade-in">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-6 px-10 border-t border-slate-100 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
                    <p>© 2026 Academic Internship Management System (IMS). All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
