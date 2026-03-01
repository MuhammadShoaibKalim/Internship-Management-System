import React from 'react';
import {
    LayoutGrid,
    Users,
    BookOpen,
    Building2,
    ArrowRight,
    ChevronRight,
    MoreHorizontal,
    Plus,
    GraduationCap,
    Library
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDepartments = () => {
    const departments = [
        {
            id: 1,
            name: 'Computer Science',
            students: 450,
            supervisors: 12,
            activeInternships: 124,
            icon: Library,
            color: 'text-indigo-600 bg-indigo-50'
        },
        {
            id: 2,
            name: 'Electrical Engineering',
            students: 320,
            supervisors: 8,
            activeInternships: 82,
            icon: Library,
            color: 'text-blue-600 bg-blue-50'
        },
        {
            id: 3,
            name: 'Business Administration',
            students: 280,
            supervisors: 6,
            activeInternships: 45,
            icon: Library,
            color: 'text-emerald-600 bg-emerald-50'
        },
        {
            id: 4,
            name: 'Mechanical Engineering',
            students: 190,
            supervisors: 5,
            activeInternships: 38,
            icon: Library,
            color: 'text-rose-600 bg-rose-50'
        },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Clean Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100/50">
                        <GraduationCap size={14} className="text-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">Academic Hierarchy</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            University <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-primary-500">Departments</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium mt-3 max-w-2xl leading-relaxed">
                            Organize academic units, manage faculty appointments, and monitor <span className="font-bold text-slate-900 px-1">department-wide quota</span> and internship metrics.
                        </p>
                    </div>
                </div>
                <button className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 no-underline">
                    <Plus size={20} className="text-indigo-400" /> Create New Unit
                </button>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Active Departments', value: '12', icon: LayoutGrid, color: 'text-primary-600 bg-primary-50' },
                    { label: 'Total Faculty Nodes', value: '64', icon: Users, color: 'text-indigo-600 bg-indigo-50' },
                    { label: 'Academic Units', value: '42', icon: Building2, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Portal Instances', value: '08', icon: Library, color: 'text-emerald-600 bg-emerald-50' }
                ].map((stat, i) => (
                    <div key={i} className="portal-card p-10 flex flex-col justify-between group hover:border-indigo-100 transition-all shadow-xl shadow-slate-200/50 bg-white">
                        <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform shadow-inner w-fit mb-8`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter leading-none">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 italic">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
                {departments.map(dept => (
                    <div key={dept.id} className="portal-card p-10 bg-white border-2 border-slate-50 shadow-2xl shadow-slate-100/50 group hover:border-indigo-100 transition-all flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-10 pb-6 border-b border-slate-50">
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${dept.color}`}>
                                    <dept.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">{dept.name}</h3>
                            </div>
                            <button className="p-4 text-slate-300 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all">
                                <MoreHorizontal size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled</p>
                                <p className="text-xl font-bold text-slate-900">{dept.students}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty</p>
                                <p className="text-xl font-bold text-slate-900">{dept.supervisors}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internships</p>
                                <p className="text-xl font-bold text-primary-600">{dept.activeInternships}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                            <div className="flex -space-x-3 overflow-hidden">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-10 w-10 rounded-xl bg-slate-900 text-white text-[10px] font-black border-4 border-white flex items-center justify-center ring-2 ring-slate-100">
                                        F{i}
                                    </div>
                                ))}
                            </div>
                            <Link to="/dashboard/admin/users" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-slate-900 transition-all no-underline">
                                View Faculty List <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-12 border-2 border-slate-100 rounded-[3rem] bg-indigo-900 text-white flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="relative z-10 flex items-center gap-8">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-indigo-400 border border-white/10 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-2xl">
                        <GraduationCap size={40} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-extrabold uppercase tracking-tight">Quota Synchronization</h4>
                        <p className="text-indigo-300 text-sm font-medium italic mt-2 opacity-80 leading-relaxed max-w-lg">
                            Institutional data shows <span className="text-white font-bold">92% resource allocation</span> across all registered departments.
                        </p>
                    </div>
                </div>
                <button className="relative z-10 px-10 py-5 bg-white text-indigo-900 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl active:scale-95">
                    Process Global Sync
                </button>
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/20 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 group-hover:bg-primary-500/40" />
            </div>
        </div>
    );
};

export default AdminDepartments;
