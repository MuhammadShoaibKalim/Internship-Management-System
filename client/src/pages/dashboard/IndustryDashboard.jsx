import React from 'react';
import { Plus, Users, Layout, FileText, TrendingUp, ArrowRight, Building2, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';

const IndustryDashboard = () => {
    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Clean Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-100/50">
                        <Building2 size={14} className="text-amber-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Industry Partner</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            Corporate <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">Command Center</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium mt-3 max-w-2xl leading-relaxed">
                            Optimize your organizational talent pipeline and manage active internship cycles with <span className="font-bold text-slate-900">real-time analytics</span> and vetting tools.
                        </p>
                    </div>
                </div>
                <Link to="/dashboard/industry/manage" className="px-8 py-5 bg-slate-900 text-white rounded-3xl font-bold text-sm shadow-2xl shadow-slate-200 hover:bg-amber-600 active:scale-95 transition-all flex items-center gap-3 no-underline group">
                    <Plus size={20} className="text-amber-400 group-hover:rotate-90 transition-transform" />
                    Post New Node
                </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                    { label: 'Active Posts', value: '05', icon: Layout, color: 'primary', path: '/dashboard/industry/manage', accent: 'border-l-primary-500' },
                    { label: 'Applicants', value: '42', icon: Users, color: 'amber', path: '/dashboard/industry/applicants', accent: 'border-l-amber-500' },
                    { label: 'Onboarding', value: '12', icon: TrendingUp, color: 'emerald', path: '/dashboard/industry/interns', accent: 'border-l-emerald-500' }
                ].map((stat, i) => (
                    <Link key={i} to={stat.path} className="portal-card p-10 group hover:border-amber-100 transition-all no-underline bg-white relative overflow-hidden">
                        <div className="flex justify-between items-start mb-8 relative z-10 font-inter">
                            <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:rotate-12 transition-all shadow-inner">
                                <stat.icon size={24} />
                            </div>
                            <ArrowRight size={20} className="text-slate-200 group-hover:text-amber-500 group-hover:translate-x-2 transition-all" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter leading-none">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3">{stat.label}</p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-110 group-hover:bg-amber-500/10" />
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 portal-card p-10 bg-white shadow-2xl shadow-slate-200/50">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">Talent Pipeline</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Review incoming applications for compliance</p>
                        </div>
                        <Link to="/dashboard/industry/applicants" className="p-3 bg-slate-50 text-slate-400 hover:text-amber-600 rounded-xl transition-all">
                            <Users size={20} />
                        </Link>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <Link to="/dashboard/industry/applicants" key={i} className="flex items-center justify-between p-6 bg-slate-50 border-2 border-transparent hover:border-amber-100 hover:bg-white hover:shadow-xl transition-all group cursor-pointer rounded-3xl no-underline">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Applicant Node {i}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60 italic">UI/UX Designer • B.S Computing</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <StatusBadge status="Pending" />
                                    <ArrowRight size={20} className="text-slate-200 group-hover:text-amber-600 group-hover:translate-x-2 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="portal-card p-12 bg-slate-900 text-white border-none flex flex-col items-center justify-center text-center group relative overflow-hidden h-full shadow-2xl shadow-slate-200">
                        <div className="relative z-10 space-y-6">
                            <div className="w-20 h-20 bg-amber-500 rounded-[2.5rem] flex items-center justify-center text-slate-900 shadow-[0_0_50px_rgba(245,158,11,0.3)] group-hover:rotate-12 transition-transform mx-auto">
                                <Building2 size={40} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-extrabold uppercase tracking-tight">Vetting Profile</h3>
                                <p className="text-slate-400 text-xs font-medium italic mt-4 px-6 leading-relaxed max-w-xs mx-auto">
                                    Ensure your organization profile maintains <span className="text-amber-400 font-bold">100% verification</span> status to attract elite academic talent.
                                </p>
                            </div>
                            <Link to="/dashboard/industry/profile" className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all no-underline block mx-auto w-fit">
                                Sync Settings
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-amber-500/20 transition-all duration-1000" />
                    </div>
                </div>
            </div>

            <div className="p-12 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-amber-500">
                        <Globe size={36} />
                    </div>
                    <div>
                        <h4 className="text-xl font-extrabold text-slate-900 uppercase tracking-tighter">Global Ecosystem Ranking</h4>
                        <p className="text-slate-400 text-xs font-medium italic mt-1">Your organization is currently performing in the <span className="text-amber-600 font-bold">top 15%</span> of regional talent intake.</p>
                    </div>
                </div>
                <div className="h-4 w-full max-w-sm bg-white rounded-full overflow-hidden p-1 shadow-inner border border-slate-100">
                    <div className="h-full bg-amber-500 rounded-full w-[85%] animate-pulse shadow-lg" />
                </div>
            </div>
        </div>
    );
};

export default IndustryDashboard;
