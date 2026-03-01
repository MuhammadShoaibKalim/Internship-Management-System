import React, { useState } from 'react';
import {
    Users,
    UserCheck,
    UserX,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Shield,
    Plus,
    Download,
    Trash2,
    Edit,
    CheckCircle,
    XCircle,
    UserPlus,
    Clock,
    Sparkles
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeRoleTab, setActiveRoleTab] = useState('all');

    const users = [
        { id: 1, name: 'Shoaib Ahmed', email: 'shoaib@example.com', role: 'student', status: 'active', joined: 'Oct 12, 2023', department: 'CS' },
        { id: 2, name: 'TechFlow Solutions', email: 'hr@techflow.io', role: 'industry', status: 'pending', joined: 'Oct 15, 2023', department: 'N/A' },
        { id: 3, name: 'Dr. Sarah Wilson', email: 'sarah.w@university.edu', role: 'supervisor', status: 'active', joined: 'Sep 20, 2023', department: 'EE' },
        { id: 4, name: 'Ali Khan', email: 'ali.cs@student.com', role: 'student', status: 'active', joined: 'Nov 02, 2023', department: 'CS' },
        { id: 5, name: 'Innovative Soft', email: 'contact@innovative.com', role: 'industry', status: 'active', joined: 'Aug 28, 2023', department: 'N/A' },
        { id: 6, name: 'Prof. Usman Malik', email: 'usman.m@university.edu', role: 'supervisor', status: 'inactive', joined: 'Jan 10, 2023', department: 'ME' },
        { id: 7, name: 'Zoya Fatima', email: 'zoya@example.com', role: 'student', status: 'pending', joined: 'Feb 20, 2026', department: 'BBA' },
    ];

    const roles = ['all', 'student', 'industry', 'supervisor'];

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeRoleTab === 'all' || user.role === activeRoleTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Clean Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200/50">
                        <Users size={14} className="text-slate-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">Identity Registry</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            User <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-secondary-700 to-slate-500">Management</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium mt-3 max-w-2xl leading-relaxed">
                            Oversee entire academic ecosystem. Manage permissions, monitor <span className="font-bold text-slate-900 px-1">node access</span>, and ensure compliance across all user roles.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all flex items-center gap-3">
                        <Download size={16} /> Export
                    </button>
                    <button className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 no-underline">
                        <UserPlus size={20} className="text-primary-400" /> Register User
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Accounts', value: '1,284', icon: Users, color: 'text-primary-600 bg-primary-50', trend: '+12% MTD' },
                    { label: 'Verified Roles', value: '852', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50', trend: 'Compliance' },
                    { label: 'Account Requests', value: '24', icon: Clock, color: 'text-amber-600 bg-amber-50', trend: 'Awaiting' },
                    { label: 'Deactivated', value: '08', icon: XCircle, color: 'text-rose-600 bg-rose-50', trend: 'Safety' }
                ].map((stat, i) => (
                    <div key={i} className="portal-card p-10 flex flex-col justify-between group hover:border-slate-100 transition-all shadow-xl shadow-slate-200/50 bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform shadow-inner`}>
                                <stat.icon size={28} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter leading-none">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3 italic">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Hub */}
            <div className="flex items-center gap-4 p-2 bg-slate-100/50 rounded-3xl w-fit border border-slate-100">
                {roles.map(role => (
                    <button
                        key={role}
                        onClick={() => setActiveRoleTab(role)}
                        className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRoleTab === role
                            ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-y-[-2px]'
                            : 'text-slate-400 hover:text-slate-900 hover:bg-white'
                            }`}
                    >
                        {role}
                    </button>
                ))}
            </div>

            {/* Users Table */}
            <div className="portal-card overflow-hidden bg-white shadow-2xl shadow-slate-200/50 border-none">
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="relative group w-full max-w-2xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={24} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by identity, email or department credentials..."
                            className="w-full pl-16 pr-10 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-100 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                            <Filter size={24} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Identity Profile</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Academic Unit</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Security Role</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Compliance</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-slate-900 text-primary-400 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-slate-900 uppercase tracking-tight leading-none">{user.name}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Mail size={12} className="text-slate-300" />
                                                    <span className="text-[10px] text-slate-400 font-bold italic tracking-wide">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200/50">
                                            {user.department}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                                                user.role === 'industry' ? 'bg-amber-500' : 'bg-primary-500'
                                                }`} />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <StatusBadge status={user.status} />
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100">
                                                <Edit size={20} />
                                            </button>
                                            <button className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100">
                                                <Trash2 size={20} />
                                            </button>
                                            <button className="p-3 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-all">
                                                <MoreVertical size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
