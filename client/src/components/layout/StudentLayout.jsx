import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const StudentLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar
                role="student"
                isOpen={isSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header
                    role="student"
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <footer className="py-6 px-8 border-t border-slate-100 text-center text-slate-400 text-xs font-medium">
                    &copy; 2026 Academic Internship Management Portal (IMS). All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default StudentLayout;
