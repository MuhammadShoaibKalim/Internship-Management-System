import React from 'react';
import { Search, Filter, Plus, Clock, FileText, ChevronRight } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const StudentApplications = () => {
    const applications = [
        { id: 1, title: 'Frontend Developer Intern', company: 'TechFlow Solutions', date: 'Oct 24, 2023', status: 'pending', logo: 'T' },
        { id: 2, title: 'UI Designer Trainee', company: 'Creative Labs', date: 'Oct 20, 2023', status: 'approved', logo: 'C' },
        { id: 3, title: 'Fullstack Engineering Intern', company: 'Alpha Group', date: 'Oct 15, 2023', status: 'rejected', logo: 'A' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">My Applications</h1>
                    <p className="text-slate-500 font-medium italic">Track the status of your potential internship journeys.</p>
                </div>
                <button className="btn-primary flex items-center gap-2 px-6">
                    <Plus size={20} />
                    New Application
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Pending', 'Approved', 'Rejected'].map((status) => (
                    <div key={status} className="portal-card p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{status} Apps</p>
                            <h3 className="text-3xl font-black text-secondary-900 mt-1">
                                {status === 'Approved' ? '01' : status === 'Pending' ? '04' : '02'}
                            </h3>
                        </div>
                        <div className={`p-4 rounded-2xl ${status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                            <Clock size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="portal-card overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h2 className="font-bold text-secondary-900">Application History</h2>
                    <div className="flex gap-2">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Filter results..."
                                className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-xs w-full focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                        <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                            <Filter size={16} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opportunity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applied On</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {applications.map(app => (
                                <tr key={app.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                                                {app.logo}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-secondary-900 leading-none">{app.title}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5">{app.company}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-semibold text-slate-500">{app.date}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-secondary-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all">
                                                Track Progress
                                                <ChevronRight size={14} />
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

export default StudentApplications;
