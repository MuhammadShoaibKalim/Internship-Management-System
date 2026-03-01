import React from 'react';
import { Plus, Info, CheckCircle2, AlertCircle, FileText, Send } from 'lucide-react';

const StudentLogs = () => {
    const logs = [
        { id: 1, week: 'Week 04', date: 'Oct 23 - Oct 27', status: 'submitted', summary: 'Implemented authentication flows and user persistent context management.' },
        { id: 2, week: 'Week 03', date: 'Oct 16 - Oct 20', status: 'approved', summary: 'Integrated Lucide icons and refined dashboard responsive layouts.' },
        { id: 3, week: 'Week 02', date: 'Oct 09 - Oct 13', status: 'rejected', summary: 'Initial setup of Vite and Tailwind project architecture.', comment: 'Need more detail on environment variables.' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Weekly Internship Logs</h1>
                    <p className="text-slate-500 font-medium">Document your daily activities and learning progress.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    Submit New Log
                </button>
            </div>

            <div className="bg-primary-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary-200">
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                        <Info size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Submission Deadline</h2>
                        <p className="text-primary-100 mt-1 opacity-90">Please ensure all logs are submitted by every Friday before 5:00 PM for evaluation.</p>
                    </div>
                    <div className="md:ml-auto">
                        <button className="bg-white text-primary-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                            View Guidelines
                        </button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            </div>

            <div className="space-y-6">
                <h2 className="text-lg font-bold text-secondary-900 border-l-4 border-primary-500 pl-4">Record History</h2>

                <div className="grid grid-cols-1 gap-4">
                    {logs.map(log => (
                        <div key={log.id} className="portal-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-transparent hover:border-slate-200 transition-all">
                            <div className="flex gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${log.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : log.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
                                    <span className="text-[10px] font-black leading-none uppercase">{log.week.split(' ')[0]}</span>
                                    <span className="text-lg font-black leading-none mt-1">{log.week.split(' ')[1]}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-secondary-900 uppercase tracking-tight">{log.date}</h3>
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${log.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : log.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {log.status}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm mt-2 line-clamp-1 italic">"{log.summary}"</p>
                                    {log.comment && (
                                        <div className="flex items-center gap-2 mt-3 text-rose-600">
                                            <AlertCircle size={14} />
                                            <p className="text-[10px] font-bold italic">{log.comment}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary-600 rounded-xl transition-colors">
                                    <FileText size={20} />
                                </button>
                                <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary-600 rounded-xl transition-colors">
                                    <Edit2 size={20} />
                                </button>
                                {log.status === 'rejected' && (
                                    <button className="flex items-center gap-2 px-6 py-3 bg-secondary-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
                                        Resubmit
                                        <Send size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Edit2 = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
);

export default StudentLogs;
