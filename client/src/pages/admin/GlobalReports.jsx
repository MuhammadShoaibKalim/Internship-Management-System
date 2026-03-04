import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Activity,
    Download,
    Calendar,
    Filter,
    Globe,
    Zap,
    Users,
    Building2,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import API from '../../services/api';

const GlobalReports = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await API.get('/admin/reports');
                setData(response.data.data);
            } catch (err) {
                setError('Failed to fetch global reports');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[600px] flex flex-col items-center justify-center space-y-4 animate-pulse">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Processing Global Analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center bg-rose-50 rounded-[3rem] border-2 border-rose-100">
                <h3 className="text-2xl font-black text-rose-900 uppercase italic">Analytical Bridge Severed</h3>
                <p className="text-rose-500 font-medium mt-2">{error}</p>
            </div>
        );
    }

    const { funnel, topRecruiters, marketShare } = data;

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Clean Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100/50">
                        <Activity size={14} className="text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Analytical Intel</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">System Reports</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium mt-3 max-w-2xl leading-relaxed">
                            Monitor infrastructure health, visualize recruitment funnels, and track <span className="font-bold text-slate-900 italic px-1">macro-level performance</span> metrics across all academic nodes.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center gap-3">
                        <Calendar size={16} /> Last 30 Days
                    </button>
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                        <Download size={18} className="text-emerald-400" /> Export Data
                    </button>
                </div>
            </div>

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <div className="portal-card p-10 bg-slate-900 text-white border-none shadow-2xl shadow-slate-200 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-3 pb-8 border-b border-white/5">
                                <TrendingUp size={16} /> Recruitment Pipeline Funnel
                            </h3>
                            <div className="mt-12 space-y-10">
                                {[
                                    { label: 'Total Applications', count: funnel.totalApplications, width: 'w-full', alpha: 'bg-white/10' },
                                    { label: 'Initial Vetting', count: funnel.vetted, width: `w-[${(funnel.vetted / funnel.totalApplications * 100).toFixed(0)}%]`, alpha: 'bg-white/20' },
                                    { label: 'Shortlisted Nodes', count: funnel.shortlisted, width: `w-[${(funnel.shortlisted / funnel.totalApplications * 100).toFixed(0)}%]`, alpha: 'bg-emerald-500/40' },
                                    { label: 'Signed MoUs', count: funnel.signedMoUs, width: `w-[${(funnel.signedMoUs / funnel.totalApplications * 100).toFixed(0)}%]`, alpha: 'bg-emerald-500' },
                                ].map((step, i) => (
                                    <div key={i} className="group/step cursor-pointer">
                                        <div className="flex justify-between items-end mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/step:text-white transition-colors">{step.label}</span>
                                            <span className="text-lg font-bold text-white tracking-tight">{step.count}</span>
                                        </div>
                                        <div className="h-4 bg-white/5 rounded-full overflow-hidden p-0.5">
                                            <div className={`h-full ${step.alpha} rounded-full ${step.width} group-hover/step:scale-x-[1.02] transition-transform`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-emerald-500/20 transition-all duration-1000" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="portal-card p-8 bg-white border-2 border-slate-50 flex flex-col justify-between">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 pb-4 border-b border-slate-50">Top Recruiter Nodes</h4>
                            <div className="space-y-6">
                                {topRecruiters.map((recruiter, i) => (
                                    <div key={recruiter._id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs group-hover:bg-emerald-600 transition-colors">
                                                {i + 1}
                                            </div>
                                            <span className="text-xs font-bold text-slate-900 uppercase">{recruiter.name}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-600 italic">{recruiter.count} Placements</span>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-10 w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                View Full Leaderboard
                            </button>
                        </div>

                        <div className="portal-card p-8 bg-white border-2 border-slate-50 relative overflow-hidden group">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 pb-4 border-b border-slate-50 relative z-10">Market Intake Share</h4>
                            <div className="relative z-10 flex items-center justify-center py-4">
                                <div className="w-32 h-32 rounded-full border-[10px] border-slate-100 border-t-emerald-500 border-r-indigo-500 flex items-center justify-center group-hover:rotate-45 transition-transform duration-1000">
                                    <Activity size={32} className="text-slate-200" />
                                </div>
                            </div>
                            <div className="relative z-10 mt-10 space-y-3">
                                <div className="flex flex-col gap-4">
                                    {marketShare.map((share, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span className={i === 0 ? 'text-emerald-600' : 'text-indigo-600'}>{share.department} [{share.percentage}%]</span>
                                            </div>
                                            <div className="h-1 bg-slate-50 rounded-full flex overflow-hidden">
                                                <div className={`h-full ${i === 0 ? 'bg-emerald-500' : 'bg-indigo-500'} w-[${share.percentage}%]`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Monitoring Column */}
                <div className="space-y-8">
                    <div className="portal-card p-10 bg-white border-none shadow-2xl shadow-slate-100/50">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-10 pb-6 border-b border-slate-50 flex items-center gap-3">
                            <Zap size={16} className="text-amber-500" /> System Telemetry
                        </h3>
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Sync Efficiency</span>
                                    <span className="text-emerald-600 font-bold">99.8%</span>
                                </div>
                                <div className="h-3 bg-slate-50 rounded-xl overflow-hidden p-0.5">
                                    <div className="h-full bg-emerald-500 rounded-lg w-[99.8%] shadow-lg shadow-emerald-200" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Database Latency</span>
                                    <span className="text-amber-600 font-bold italic">12ms</span>
                                </div>
                                <div className="h-3 bg-slate-50 rounded-xl overflow-hidden p-0.5">
                                    <div className="h-full bg-amber-500 rounded-lg w-[15%]" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 p-6 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                            <ShieldCheck size={32} className="text-slate-200 mb-4" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                                Security Shield remains <br /> <span className="text-slate-900">VERIFIED & ACTIVE</span>
                            </p>
                        </div>
                    </div>

                    <div className="portal-card p-10 bg-slate-900 text-white border-none">
                        <div className="flex items-center gap-6 mb-10 pb-6 border-b border-white/5">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                <Globe size={28} className="text-emerald-400 animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-lg font-extrabold uppercase tracking-tight">Node Map</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Global instance status</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campus Unit 0{i}</span>
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalReports;
