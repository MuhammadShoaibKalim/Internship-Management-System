import React from 'react';
import { Link } from 'react-router-dom';
import {
    Globe,
    FileText,
    ClipboardList,
    ArrowRight,
    Calendar,
    Building2,
    CheckCircle2,
    Clock,
    GraduationCap
} from 'lucide-react';

const StudentDashboard = () => {
    const stats = [
        { label: 'Applications', value: '04', icon: FileText, color: 'primary', path: '/dashboard/student/applications' },
        { label: 'Shortlisted', value: '02', icon: CheckCircle2, color: 'emerald', path: '/dashboard/student/applications' },
        { label: 'Weekly Logs', value: '12', icon: ClipboardList, color: 'amber', path: '/dashboard/student/logs' },
    ];

    const upcomingDeadlines = [
        { title: 'Weekly Log Submission', date: 'Tomorrow, 5:00 PM', urgency: 'high' },
        { title: 'Mid-term Evaluation', date: 'Oct 30, 2023', urgency: 'medium' },
    ];

    return (
        <div className="animate-fade-in space-y-10 pb-12">
            {/* Clean Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full border border-primary-100/50">
                        <GraduationCap size={14} className="text-primary-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-700">Student Portal</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500">Shoaib Ahmed</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium mt-3 max-w-2xl leading-relaxed">
                            Your internship journey is <span className="font-bold text-slate-900">75% complete</span>. Leverage your insights and keep tracking your professional growth.
                        </p>
                    </div>
                </div>
                <Link to="/dashboard/student/hub" className="px-8 py-5 bg-slate-900 text-white rounded-3xl font-bold text-sm shadow-2xl shadow-slate-200 hover:bg-primary-600 active:scale-95 transition-all flex items-center gap-3 no-underline group">
                    <Globe size={20} className="text-primary-400 group-hover:rotate-12 transition-transform" />
                    Browse Hub
                </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Link to={stat.path} key={i} className="portal-card p-10 group hover:border-primary-100 transition-all no-underline overflow-hidden relative">
                            <div className="flex items-center justify-between relative z-10 font-inter">
                                <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:rotate-12 transition-all shadow-inner">
                                    <Icon size={24} />
                                </div>
                                <ArrowRight size={20} className="text-slate-200 group-hover:text-primary-500 group-hover:translate-x-2 transition-all" />
                            </div>
                            <div className="mt-8 relative z-10">
                                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter leading-none">{stat.value}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3">{stat.label}</p>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-110 group-hover:bg-primary-500/10" />
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Active Internship Track */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="portal-card p-12 bg-white border-2 border-slate-50 relative overflow-hidden group shadow-2xl shadow-slate-100/50">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                                        <Building2 size={16} /> Current Placement
                                    </h2>
                                    <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-4 uppercase">Fullstack Engineering Intern</h3>
                                    <p className="text-slate-500 font-bold text-sm mt-2">TechFlow Solutions • <span className="italic">Oct 2023 - Present</span></p>
                                </div>
                                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary-400 shadow-xl shadow-slate-200">
                                    <Building2 size={32} />
                                </div>
                            </div>

                            <div className="mt-8 bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-10">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Internship Progression</span>
                                        <span className="text-sm font-black text-primary-600">75% Complete</span>
                                    </div>
                                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-primary-600 rounded-full w-3/4 shadow-lg"></div>
                                    </div>
                                </div>
                                <Link to="/dashboard/student/logs" className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all flex items-center gap-3 no-underline">
                                    Manage Logs
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <Link to="/dashboard/student/certificates" className="portal-card p-10 bg-slate-50/50 hover:bg-white border-transparent hover:border-amber-200 transition-all group no-underline text-center">
                            <div className="w-16 h-16 bg-white text-amber-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all">
                                <Award size={32} />
                            </div>
                            <h4 className="font-extrabold text-slate-900 uppercase text-xs tracking-widest">Digital Recognition</h4>
                            <p className="text-slate-500 text-[10px] font-bold mt-2 px-2">Access your verified credentials and awards</p>
                        </Link>
                        <Link to="/dashboard/student/cv-builder" className="portal-card p-10 bg-slate-50/50 hover:bg-white border-transparent hover:border-blue-200 transition-all group no-underline text-center">
                            <div className="w-16 h-16 bg-white text-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-sm group-hover:scale-110 group-hover:-rotate-6 transition-all">
                                <FileText size={32} />
                            </div>
                            <h4 className="font-extrabold text-slate-900 uppercase text-xs tracking-widest">Professional Assets</h4>
                            <p className="text-slate-500 text-[10px] font-bold mt-2 px-2">Optimize your resume for hiring nodes</p>
                        </Link>
                    </div>
                </div>

                {/* Updates Column */}
                <div className="space-y-8">
                    <div className="portal-card p-10 bg-slate-900 text-white border-none shadow-2xl shadow-slate-200">
                        <h3 className="text-xs font-bold text-primary-400 uppercase tracking-[0.3em] flex items-center gap-2 pb-6 border-b border-white/5">
                            <Clock size={16} /> Timeline Alerts
                        </h3>
                        <div className="mt-8 space-y-6">
                            {upcomingDeadlines.map((item, i) => (
                                <div key={i} className={`p-6 rounded-[2rem] bg-white/5 border border-white/5 group/item cursor-pointer hover:bg-white/10 transition-all`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-2 h-2 rounded-full ${item.urgency === 'high' ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'}`} />
                                        <p className="text-xs font-bold uppercase tracking-tight">{item.title}</p>
                                    </div>
                                    <p className="text-[10px] font-bold opacity-40 flex items-center gap-2">
                                        <Calendar size={12} />
                                        {item.date}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <Link to="/dashboard/student/settings" className="w-full mt-10 py-5 bg-primary-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-3 hover:bg-primary-500 transition-all no-underline shadow-xl shadow-primary-900/40">
                            Verify Data Integrity
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Award = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
);

export default StudentDashboard;
