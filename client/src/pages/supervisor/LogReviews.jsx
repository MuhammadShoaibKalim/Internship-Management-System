import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, XCircle, Clock, ArrowLeft, Search, Filter, MessageSquare, Download } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';

const LogReviews = () => {
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('student');

    const logs = [
        {
            id: 1,
            studentName: 'Ayesha Khan',
            week: 'Week 8',
            date: 'Oct 28, 2023',
            content: 'Worked on integrating the payment gateway API. Completed the unit tests for the checkout flow and resolved 3 critical bugs.',
            status: 'pending',
            hours: 40
        },
        {
            id: 2,
            studentName: 'Ali Raza',
            week: 'Week 8',
            date: 'Oct 28, 2023',
            content: 'Assisted in database schema migration. Documented the new microservices architecture and participated in code reviews.',
            status: 'approved',
            hours: 38
        },
        {
            id: 3,
            studentName: 'Zainab Ahmed',
            week: 'Week 12',
            date: 'Nov 02, 2023',
            content: 'Finalized the frontend documentation. Prepared the internship completion report and handed over the repository to the team.',
            status: 'completed',
            hours: 35
        }
    ];

    // Filter by student if ID is provided in URL
    const displayedLogs = studentId ? logs.filter(l => l.id.toString() === studentId) : logs;

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link to="/dashboard/supervisor" className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-[10px] uppercase tracking-widest mb-2 no-underline transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Weekly Log Reviews</h1>
                    <p className="text-slate-500 font-medium italic">Validate and provide feedback on student weekly progress reports.</p>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="portal-card p-6 bg-white border-l-4 border-l-amber-400">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Waiting Review</p>
                    <p className="text-3xl font-black text-secondary-900">12</p>
                </div>
                <div className="portal-card p-6 bg-white border-l-4 border-l-emerald-500">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Approved This Week</p>
                    <p className="text-3xl font-black text-secondary-900">45</p>
                </div>
                <div className="portal-card p-6 bg-white border-l-4 border-l-primary-500">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Logs Processed</p>
                    <p className="text-3xl font-black text-secondary-900">284</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-slate-50 shadow-sm">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search by student or content..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-secondary-900 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all" />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors">
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Logs List */}
            <div className="space-y-4">
                {displayedLogs.map(log => (
                    <div key={log.id} className="portal-card p-8 bg-white group hover:border-primary-100 transition-all">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-1/4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center font-black">
                                        {log.studentName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-secondary-900 leading-tight">{log.studentName}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.week} • {log.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-50">
                                    <Clock size={16} className="text-slate-400" />
                                    <span className="text-xs font-bold text-secondary-900">{log.hours} Hours Logged</span>
                                </div>
                                <StatusBadge status={log.status} />
                            </div>

                            <div className="lg:w-1/2 space-y-4">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Work Accomplished</h5>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4">
                                    "{log.content}"
                                </p>
                            </div>

                            <div className="lg:w-1/4 flex flex-col justify-center gap-3">
                                {log.status === 'pending' ? (
                                    <>
                                        <button className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                            <CheckCircle2 size={18} /> Approve Log
                                        </button>
                                        <button className="w-full py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">
                                            <XCircle size={18} className="inline mr-2" /> Request Revision
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <button className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-default opacity-60">
                                            <CheckCircle2 size={18} /> Processed
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <button className="flex-1 p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary-600 rounded-xl transition-all">
                                                <MessageSquare size={18} className="mx-auto" />
                                            </button>
                                            <button className="flex-1 p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary-600 rounded-xl transition-all">
                                                <Download size={18} className="mx-auto" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation CTA */}
            <div className="flex justify-between items-center pt-6">
                <Link to="/dashboard/supervisor/students" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors no-underline flex items-center gap-2">
                    <ArrowLeft size={14} /> Back to Student List
                </Link>
                <Link to="/dashboard/supervisor/marking" className="btn-primary py-4 px-10 text-[10px] font-black uppercase tracking-widest no-underline shadow-xl shadow-primary-50">
                    Final Assessments
                </Link>
            </div>
        </div>
    );
};

export default LogReviews;
