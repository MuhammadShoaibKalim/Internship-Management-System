import React from 'react';
import { UserCheck, Star, Calendar, MessageSquare, Download, ShieldCheck } from 'lucide-react';

const IndustryInterns = () => {
    const interns = [
        { id: 1, name: 'Shoaib Ahmed', project: 'Mobile Banking App', startDate: 'Oct 01, 2023', progress: '75%', university: 'Fast NUCES' },
        { id: 2, name: 'Jane Smith', project: 'Admin Dashboard Refactor', startDate: 'Sep 15, 2023', progress: '90%', university: 'GIKI Swabi' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Active Interns Team</h1>
                    <p className="text-slate-500 font-medium italic">Monitor the performance and progress of your current cohort.</p>
                </div>
                <div className="px-6 py-3 bg-secondary-900 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                    <UserCheck size={18} className="text-primary-400" />
                    Total Active: 02
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {interns.map(intern => (
                    <div key={intern.id} className="portal-card p-8 bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-slate-50">
                                    {intern.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-secondary-900 text-lg leading-none">{intern.name}</h3>
                                    <p className="text-[10px] font-bold text-primary-600 mt-2 uppercase tracking-widest">{intern.university}</p>
                                </div>
                            </div>
                            <ShieldCheck className="text-emerald-500" size={24} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Project</p>
                                    <p className="text-sm font-black text-secondary-900">{intern.project}</p>
                                </div>
                                <Star size={18} className="text-amber-400 fill-amber-400" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Joined On</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400" />
                                        <span className="text-xs font-bold text-secondary-800">{intern.startDate}</span>
                                    </div>
                                </div>
                                <div className="p-4 border border-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Completion</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary-500 rounded-full" style={{ width: intern.progress }}></div>
                                        </div>
                                        <span className="text-xs font-black text-secondary-900">{intern.progress}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button className="flex-1 py-3 bg-white border border-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                <MessageSquare size={14} /> Send Note
                            </button>
                            <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                                <Download size={14} /> Report
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IndustryInterns;
