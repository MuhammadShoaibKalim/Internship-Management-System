import React, { useState, useEffect } from 'react';
import { Plus, Users, Layout, FileText, TrendingUp, ArrowRight, Building2, Globe, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

const IndustryDashboard = () => {
    const [stats, setStats] = useState({ activePosts: 0, totalApplicants: 0, onboardingInterns: 0 });
    const [recentApplicants, setRecentApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await API.get('/industry/stats');
            if (response.data.status === 'success') {
                setStats(response.data.data.stats);
                setRecentApplicants(response.data.data.recentApplicants);
            }
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Dashboard...</p>
            </div>
        );
    }

    // Simulated dynamic ranking based on active intern nodes
    const rankingPercent = Math.min(Math.max((stats.onboardingInterns * 15) + 40, 45), 98);
    const rankingLabel = rankingPercent > 80 ? 'top 5%' : rankingPercent > 60 ? 'top 15%' : 'top 30%';

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            <SectionHeader
                title="Industry Dashboard"
                subtitle="Industry Portal"
                description="Manage your internship postings and track applicants in real time."
                icon={Building2}
                linkTo="/dashboard/industry/manage"
                linkText="Post New Internship"
                gradientFrom="from-amber-600"
                gradientTo="to-orange-500"
                badgeColor="bg-amber-50"
                badgeTextColor="text-amber-700"
            />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Active Posts', value: stats.activePosts, icon: Layout, color: 'primary', path: '/dashboard/industry/manage', gradient: 'from-amber-600 to-amber-400' },
                    { label: 'Total Applicants', value: stats.totalApplicants, icon: Users, color: 'amber', path: '/dashboard/industry/applicants', gradient: 'from-orange-500 to-orange-400' },
                    { label: 'Active Interns', value: stats.onboardingInterns, icon: TrendingUp, color: 'emerald', path: '/dashboard/industry/interns', gradient: 'from-emerald-500 to-teal-400' },
                    { label: 'Pending Reviews', value: stats.pendingLogs || 0, icon: FileText, color: 'indigo', path: '/dashboard/industry/logs', gradient: 'from-indigo-600 to-violet-400' }
                ].map((stat, i) => (
                    <Link key={i} to={stat.path} className="portal-card p-10 group no-underline bg-white relative overflow-hidden">
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-6 shadow-inner transition-all duration-500 flex items-center justify-center border border-transparent group-hover:border-white/10">
                                <stat.icon size={28} />
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
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
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-50 rounded-full group-hover:bg-amber-500/5 transition-all duration-700 blur-3xl opacity-50 group-hover:opacity-100" />
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 glass-card p-12 border-none shadow-3xl shadow-slate-200/50 transition-all duration-700 hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-12 pb-8 border-b border-slate-100/50">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Talent Pipeline</h3>
                            <p className="text-slate-400 text-[10px] font-black mt-3 uppercase tracking-[0.3em] inline-flex items-center gap-2">
                                <Sparkles size={14} className="text-amber-500" />
                                Incoming Applicant Flow
                            </p>
                        </div>
                        <Link to="/dashboard/industry/applicants" className="btn-premium from-slate-900 to-slate-800 py-3 px-6 text-[9px] group no-underline">
                            View All Talent <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="space-y-8">
                        {recentApplicants.length === 0 ? (
                            <div className="p-20 text-center bg-slate-50/50 rounded-[3.5rem] border-2 border-dashed border-slate-200">
                                <div className="w-20 h-20 bg-white rounded-full shadow-xl mx-auto mb-6 flex items-center justify-center text-slate-200">
                                    <Users size={32} />
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] italic leading-relaxed">No applicants yet. Post internships to attract students.</p>
                            </div>
                        ) : (
                            recentApplicants.map(applicant => (
                                <Link to="/dashboard/industry/applicants" key={applicant._id} className="flex items-center justify-between p-8 bg-white border border-slate-100 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-100 transition-all duration-500 group cursor-pointer rounded-[2.5rem] no-underline">
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 bg-slate-900 text-amber-500 rounded-full flex items-center justify-center font-black text-xl shadow-2xl overflow-hidden transition-transform duration-500 border border-white/10">
                                            {applicant.student?.avatar ? (
                                                <img src={applicant.student.avatar} alt={applicant.student.name} className="w-full h-full object-cover" />
                                            ) : (
                                                applicant.student?.name?.charAt(0) || 'S'
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-amber-600 transition-colors leading-tight">{applicant.student?.name}</h4>
                                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 opacity-70 italic flex items-center gap-2">
                                                <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                                                {applicant.internship?.title}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <StatusBadge status={applicant.status} />
                                        <div className="w-12 h-12 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                                            <ArrowRight size={24} />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="glass-card p-12 bg-slate-900 text-white border-none flex flex-col items-center justify-center text-center group relative overflow-hidden h-full shadow-3xl shadow-amber-400/20">
                        <div className="relative z-10 space-y-10">
                            <div className="w-28 h-28 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2.5rem] flex items-center justify-center text-slate-900 shadow-[0_0_60px_rgba(245,158,11,0.4)] group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 mx-auto border border-white/20">
                                <Building2 size={48} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight">Company Profile</h3>
                                <p className="text-slate-400 text-sm font-medium italic mt-4 px-6 leading-relaxed opacity-80 decoration-amber-500/30 decoration-2 underline underline-offset-8">
                                    Keep your profile updated to attract <span className="text-amber-400 font-black">top student applicants.</span>
                                </p>
                            </div>
                            <Link to="/dashboard/industry/profile" className="btn-primary border-none bg-white text-slate-900 px-12 py-5 rounded-[2rem] group no-underline inline-flex">
                                View Profile <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[150px] -mr-[225px] -mt-[225px] transition-all duration-1000 group-hover:bg-amber-500/20" />
                    </div>
                </div>
            </div>

            <div className="p-12 glass-card border-none shadow-3xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
                <div className="flex items-center gap-10 relative z-10">
                    <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-amber-500 group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-6 transition-all duration-700">
                        <Globe size={48} />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Platform Ranking</h4>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-3 italic flex items-center gap-3">
                            Performance Level: <span className="text-amber-600 underline font-black">{rankingLabel}</span>
                        </p>
                    </div>
                </div>
                <div className="flex-1 w-full max-w-sm space-y-4 relative z-10">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                        <span className="text-xl font-black text-slate-900 tracking-tighter">{rankingPercent}%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner border border-slate-200">
                        <div className="h-full bg-gradient-to-r from-amber-600 to-orange-400 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-1000" style={{ width: `${rankingPercent}%` }} />
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50/50 rounded-full blur-3xl -mr-40 -mt-40 transition-all duration-1000 group-hover:bg-amber-500/5" />
            </div>
        </div>
    );
};

export default IndustryDashboard;
