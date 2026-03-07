import React, { useState, useEffect } from 'react';
import { Users, BookOpen, ClipboardCheck, MapPin, ArrowRight, GraduationCap, Sparkles, ShieldCheck, LayoutDashboardIcon, Users2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import SectionHeader from '../../components/common/SectionHeader';

const SupervisorDashboard = () => {
    const [stats, setStats] = useState({
        assignedStudents: 0,
        pendingLogs: 0,
        siteVisits: 0,
        finalMarkingReady: 0,
        pendingEndorsements: 0
    });
    const [monitoringQueue, setMonitoringQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await API.get('/supervisor/stats');
                if (response.data.status === 'success') {
                    setStats(response.data.data.stats);
                    setMonitoringQueue(response.data.data.monitoringQueue || []);
                }
            } catch (err) {
                console.error('Failed to fetch supervisor dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl text-center">
                <p className="text-rose-600 font-bold">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            <SectionHeader
                title="Supervisor Dashboard"
                subtitle="Supervisor Portal"
                description="Academic endorsement portal for department students and site visit management."
                icon={GraduationCap}
                gradientFrom="from-indigo-600"
                gradientTo="to-primary-500"
            >
                <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-primary-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative px-8 py-5 bg-white text-indigo-600 rounded-3xl shadow-sm text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 border border-slate-100">
                        <LayoutDashboardIcon size={20} className="text-amber-500 animate-pulse" />
                        Cycle 2026-B Active
                    </div>
                </div>
            </SectionHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                    { label: 'Endorsements', value: stats.pendingEndorsements, icon: ShieldCheck, color: 'rose', link: '/dashboard/supervisor/endorsements', gradient: 'from-rose-500 to-pink-400', pulse: stats.pendingEndorsements > 0 },
                    { label: 'Dept. Students', value: stats.assignedStudents, icon: Users, color: 'primary', link: '/dashboard/supervisor/endorsements', gradient: 'from-indigo-600 to-blue-500' },
                    { label: 'Site Visits', value: stats.siteVisits, icon: MapPin, color: 'blue', link: '/dashboard/supervisor/visits', gradient: 'from-blue-600 to-sky-400' },
                ].map((stat, i) => (
                    <Link key={i} to={stat.link} className="portal-card p-8 group no-underline bg-white relative overflow-hidden ring-1 ring-slate-100/50 hover:ring-primary-500/20 transition-all duration-500">
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-6 shadow-inner transition-all duration-500 flex items-center justify-center border border-transparent group-hover:border-white/10 ${stat.pulse ? 'ring-4 ring-primary-500/10' : ''}`}>
                                <stat.icon size={28} className={stat.pulse ? 'animate-pulse text-primary-500 group-hover:text-white' : ''} />
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

            {/* Priority Alerts */}
            {stats.pendingEndorsements > 0 && (
                <div className="glass-card p-1 items-center bg-white/40 border-none shadow-4xl shadow-rose-500/10 animate-slide-up relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-700">
                                <ShieldCheck size={32} className="animate-pulse" />
                            </div>
                            <div className="space-y-1 text-center md:text-left">
                                <h4 className="text-[10px] font-black uppercase text-rose-500 tracking-[0.3em] italic">Priority Action Required</h4>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                                    {stats.pendingEndorsements} Pending {stats.pendingEndorsements === 1 ? 'Endorsement' : 'Endorsements'}
                                </h3>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic leading-relaxed">
                                    Students from your department are waiting for your academic endorsement to proceed.
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/dashboard/supervisor/endorsements"
                            className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-4xl shadow-slate-900/20 hover:bg-rose-500 transition-all flex items-center justify-center gap-3 italic group/btn no-underline"
                        >
                            Review Applications
                            <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                        </Link>
                    </div>
                </div>
            )}

            <div className="pt-6">
                <div className="portal-card p-12 bg-white border border-slate-100/50 flex flex-col justify-center text-center group hover:shadow-3xl transition-all duration-700 relative overflow-hidden">
                    <div className="space-y-10 relative z-10">
                        <div className="w-24 h-24 bg-slate-50 text-indigo-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700">
                            <MapPin size={48} />
                        </div>
                        <div>
                            <h4 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Monitoring Visits</h4>
                            <p className="text-slate-500 text-sm font-medium italic mt-4 px-12 leading-relaxed opacity-80">
                                Schedule academic site visits to verify internship quality and student placement.
                            </p>
                        </div>
                        <Link to="/dashboard/supervisor/visits" className="btn-premium py-5 px-12 group no-underline mx-auto w-fit italic">
                            Visit Scheduler <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-all duration-700" />
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;

