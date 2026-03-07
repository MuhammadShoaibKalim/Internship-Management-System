import React, { useState, useEffect } from 'react';
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
    GraduationCap,
    Loader2,
    Users,
    Sparkles,
    Activity,
    Zap
} from 'lucide-react';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await API.get('/student/stats');
                setData(response.data.data);
            } catch (err) {
                console.error('Failed to fetch student stats:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4 animate-pulse">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Dashboard...</p>
            </div>
        );
    }

    const { stats, currentPlacement } = data;
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const statCards = [
        { label: 'Applications', value: stats.totalApplications.toString().padStart(2, '0'), icon: FileText, color: 'primary', path: '/dashboard/student/applications' },
        { label: 'Shortlisted', value: stats.shortlisted.toString().padStart(2, '0'), icon: CheckCircle2, color: 'emerald', path: '/dashboard/student/applications' },
        { label: 'Weekly Logs', value: stats.weeklyLogs.toString().padStart(2, '0'), icon: ClipboardList, color: 'amber', path: '/dashboard/student/logs' },
    ];
    // Deadlines are derived dynamically from placement status
    const upcomingDeadlines = currentPlacement ? [
        { title: 'Weekly Log Submission', date: 'End of current academic week', urgency: 'high' }
    ] : [];

    // Calculate Internship Progression
    let progression = 0;
    if (currentPlacement && currentPlacement.status === 'approved') {
        const start = new Date(currentPlacement.updatedAt);
        const now = new Date();
        const diffWeeks = Math.floor((now - start) / (1000 * 60 * 60 * 24 * 7));
        const totalWeeks = parseInt(currentPlacement.internship?.duration) || 8; // Default to 8 if not specified
        progression = Math.min(Math.max(Math.round((diffWeeks / totalWeeks) * 100), 5), 100);
    } else if (currentPlacement && currentPlacement.status === 'completed') {
        progression = 100;
    }

    return (
        <div className="animate-fade-in space-y-12 pb-12">
            <SectionHeader
                title="My Dashboard"
                subtitle="Student Portal"
                description="Track your applications, internship progress, and weekly logs all in one place."
                icon={Users}
                linkTo="/dashboard/student/hub"
                linkText="Browse Internships"
                gradientFrom="from-indigo-600"
                gradientTo="to-violet-500"
                badgeColor="bg-indigo-50"
                badgeTextColor="text-indigo-700"
            />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                    { label: 'Applications', value: stats.totalApplications, icon: FileText, color: 'primary', path: '/dashboard/student/applications', gradient: 'from-indigo-500 to-blue-400' },
                    { label: 'Shortlisted', value: stats.shortlisted, icon: CheckCircle2, color: 'indigo', path: '/dashboard/student/applications', gradient: 'from-violet-500 to-purple-400' },
                    { label: 'Weekly Logs', value: stats.weeklyLogs, icon: ClipboardList, color: 'emerald', path: '/dashboard/student/logs', gradient: 'from-emerald-500 to-teal-400' }
                ].map((stat, i) => (
                    <Link key={i} to={stat.path} className="portal-card p-10 group no-underline bg-white relative overflow-hidden">
                        <div className="flex justify-between items-start mb-10 relative z-10 font-inter">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-6 shadow-inner transition-all duration-500 flex items-center justify-center border border-transparent group-hover:border-white/10">
                                <stat.icon size={28} />
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{stat.value.toString().padStart(2, '0')}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${stat.gradient}`}></span>
                                {stat.label}
                            </p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-50 rounded-full group-hover:bg-indigo-500/5 transition-all duration-700 blur-3xl opacity-50 group-hover:opacity-100" />
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Active Internship Track */}
                <div className="lg:col-span-2 glass-card p-12 border-none shadow-3xl shadow-slate-200/50 transition-all duration-700 hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-12 pb-8 border-b border-slate-100/50">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Current Placement</h3>
                            <p className="text-slate-400 text-[10px] font-black mt-3 uppercase tracking-[0.3em] inline-flex items-center gap-2">
                                <Sparkles size={14} className="text-indigo-500" />
                                Internship Status
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 animate-pulse">
                            <Activity size={20} />
                        </div>
                    </div>

                    {!currentPlacement ? (
                        <div className="p-20 text-center bg-slate-50/50 rounded-[3.5rem] border-2 border-dashed border-slate-200">
                            <div className="w-24 h-24 bg-white rounded-full shadow-xl mx-auto mb-8 flex items-center justify-center text-slate-200">
                                <Globe size={40} className="animate-spin-slow" />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 uppercase italic mb-3 tracking-tight">No Active Internship</h4>
                            <p className="text-xs font-bold text-slate-400 px-12 leading-relaxed uppercase tracking-[0.2em]">Browse internships in the hub to start your journey.</p>
                            <Link to="/dashboard/student/hub" className="mt-10 btn-premium py-5 px-12 group no-underline inline-flex">
                                Browse Internships <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <div className="flex flex-col md:flex-row items-center gap-12 p-10 bg-slate-900 text-white rounded-[3rem] relative overflow-hidden group border border-white/5">
                                <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center font-black text-4xl shadow-2xl shadow-indigo-500/30 transition-all duration-500 relative z-10 uppercase border border-white/20">
                                    {currentPlacement.internship?.companyName?.charAt(0) || 'C'}
                                </div>
                                <div className="relative z-10 text-center md:text-left">
                                    <h4 className="text-3xl font-black tracking-tight uppercase leading-tight">{currentPlacement.internship?.title}</h4>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                                        <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[11px] flex items-center gap-3">
                                            <Building2 size={14} /> {currentPlacement.internship?.companyName}
                                        </p>
                                        <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px] flex items-center gap-3">
                                            <Calendar size={14} /> {currentPlacement.internship?.duration} Weeks
                                        </p>
                                    </div>
                                    <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                                        <div className="px-5 py-2.5 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                                            {currentPlacement.internship?.category}
                                        </div>
                                        <div className="px-5 py-2.5 bg-emerald-500 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20">
                                            {currentPlacement.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-indigo-500/20 transition-all duration-1000" />
                            </div>

                            <div className="p-10 bg-white shadow-2xl shadow-slate-100 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12 group">
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] shadow-inner flex items-center justify-center text-indigo-500 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                        <Zap size={28} />
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-black text-slate-900 uppercase tracking-tight">Progress</h5>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                            Status: <span className="text-indigo-600 underline font-black">{progression}% Complete</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-1 w-full max-w-sm space-y-3">
                                    <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden p-1 shadow-inner border border-slate-100">
                                        <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-400 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-1000" style={{ width: `${progression}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                        <span>Start</span>
                                        <span>End</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Updates Column */}
                <div className="space-y-10">
                    <div className="portal-card p-10 bg-slate-900 text-white border-none shadow-3xl shadow-slate-200 group overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em] flex items-center gap-3 pb-8 border-b border-white/5">
                                <Clock size={18} className="animate-pulse" /> Timeline Events
                            </h3>
                            <div className="mt-10 space-y-8">
                                {upcomingDeadlines.length > 0 ? (
                                    upcomingDeadlines.map((item, i) => (
                                        <div key={i} className={`p-8 rounded-[2.5rem] bg-white/5 border border-white/5 group/item cursor-pointer hover:bg-white/10 transition-all duration-500 relative overflow-hidden`}>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`w-3 h-3 rounded-full ${item.urgency === 'high' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-slate-500'}`} />
                                                <p className="text-sm font-black uppercase tracking-tight leading-none">{item.title}</p>
                                            </div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mt-4">
                                                <Calendar size={14} className="text-primary-500" />
                                                {item.date}
                                            </p>
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-primary-500 group-hover/item:h-12 transition-all duration-500 rounded-full" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 px-6 border border-white/5 border-dashed rounded-[2.5rem] bg-white/5">
                                        <p className="text-slate-500 font-black uppercase tracking-widest text-[9px] italic leading-relaxed">No upcoming deadlines.</p>
                                    </div>
                                )}
                            </div>
                            <Link to="/dashboard/student/settings" className="w-full mt-12 btn-primary py-5 px-8 group no-underline justify-center items-center flex gap-3">
                                Identity Sync <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-all duration-1000 group-hover:bg-primary-500/10" />
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
