import React from 'react';
import { Search, Bell, ChevronLeft, ChevronRight } from 'lucide-react';

const Header = ({ user = { name: 'User', role: 'Student' }, role, toggleSidebar, isSidebarOpen }) => {
    return (
        <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Professional Toggle Button placed at the start of Header */}
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all active:scale-95 group"
                    title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {isSidebarOpen ? <ChevronLeft size={20} className="group-hover:text-primary-600 transition-colors" /> : <ChevronRight size={20} className="group-hover:text-primary-600 transition-colors" />}
                </button>

                <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 w-64 shadow-sm focus-within:ring-2 focus-within:ring-primary-500/10 focus-within:border-primary-500 transition-all">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search everything..."
                        className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full text-slate-600 font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors relative group">
                    <Bell size={20} className="group-hover:text-primary-600 transition-colors" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-100/50 animate-pulse"></span>
                </button>

                <div className="h-8 w-px bg-slate-100 mx-1"></div>

                <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-secondary-900 leading-none group-hover:text-primary-600 transition-colors uppercase tracking-tight">Shoaib Ahmed</p>
                        <p className="text-[10px] text-slate-400 mt-1 capitalize font-black tracking-widest">{role || user.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-lg shadow-slate-200">
                        S
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
