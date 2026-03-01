import React from 'react';
import { Shield, UserPlus, FileCheck, Settings, AlertCircle, ArrowUpRight, Users, GraduationCap, Building2, BarChart3, Sparkles, ArrowRight  } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';

const AdminDashboard = () => {
    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Clean Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-full border border-rose-100/50">
                        <Shield size={14} className="text-rose-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-700">Root Administrator</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-indigo-600">Command Center</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium mt-3 max-w-2xl leading-relaxed">
                            Global oversight of users, institutional approvals, and platform health telemetry. Monitor <span className="font-bold text-slate-900 px-1">real-time sync</span> across all university nodes.
                        </p>
                    </div>
                </div>
                <div className="p-4 bg-slate-900 text-primary-400 rounded-[2rem] shadow-2xl hover:bg-slate-800 transition-all cursor-help border-4 border-white">
                    <Shield size={32} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                <div className="lg:col-span-3 space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                            { label: 'Pending Approvals', value: '14', icon: GraduationCap, color: 'primary', path: '/dashboard/admin/industry' },
                            { label: 'Total Users', value: '1,240', icon: Users, color: 'secondary', path: '/dashboard/admin/users' },
                            { label: 'System Reports', value: '86', icon: BarChart3, color: 'emerald', path: '/dashboard/admin/reports' },
                        ].map((s, i) => (
                            <Link key={i} to={s.path} className="portal-card p-10 group hover:border-rose-100 transition-all no-underline bg-white relative overflow-hidden">
                                <div className="flex justify-between items-start mb-8 relative z-10 font-inter">
                                    <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 group-hover:rotate-12 transition-all shadow-inner relative z-10">
                                        <s.icon size={24} />
                                    </div>
                                    <ArrowRight size={20} className="text-slate-200 group-hover:text-rose-500 group-hover:translate-x-2 transition-all" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter leading-none">{s.value}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3">{s.label}</p>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-110 group-hover:bg-rose-500/10" />
                            </Link>
                        ))}
                    </div>

                    <div className="portal-card p-10 bg-white border-none shadow-2xl shadow-slate-100/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-6 border-b border-slate-50">
                            <div>
                                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">Institutional Vetting</h3>
                                <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest italic">Awaiting root level verification</p>
                            </div>
                            <Link to="/dashboard/admin/industry" className="px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                Open Full Registry
                            </Link>
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border-2 border-transparent hover:border-rose-100 hover:bg-white hover:shadow-2xl transition-all group rounded-3xl">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 text-slate-300 font-black group-hover:text-rose-500 transition-colors">
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase">TechSolutions Global {i}</h4>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Feb 28</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <span className="text-[10px] text-rose-600 font-bold uppercase tracking-widest">Awaiting Sync</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Link to="/dashboard/admin/industry" className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-rose-600 transition-all no-underline">Perform Audit</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Health Monitoring Column */}
                <div className="space-y-8">
                    <div className="portal-card p-10 bg-slate-900 text-white border-none shadow-2xl shadow-slate-200 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xs font-bold text-primary-400 uppercase tracking-[0.3em] flex items-center gap-3 mb-10 pb-4 border-b border-white/5">
                                <Settings size={16} className="text-primary-400 animate-spin-slow" />
                                Real-time Health
                            </h3>
                            <div className="space-y-10">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Node CPU Load</span>
                                        <span className="text-primary-400 italic underline">24.2%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-primary-500 rounded-full w-[24%]" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>DB Consistency</span>
                                        <span className="text-emerald-400">100%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-emerald-500 rounded-full w-full" />
                                    </div>
                                </div>
                                <div className="pt-6 flex items-center justify-between border-t border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Status</span>
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[8px] font-black uppercase border border-emerald-500/20">Active Node</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-primary-500/15 transition-all duration-1000" />
                    </div>

                    <div className="portal-card p-10 bg-white">
                        <h3 className="text-xs font-bold text-slate-400 mb-8 flex items-center gap-3 uppercase tracking-widest pb-4 border-b border-slate-50">
                            <AlertCircle size={16} className="text-rose-500" />
                            Security Feed
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="group cursor-pointer p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 relative overflow-hidden">
                                    <div className="flex justify-between items-start relative z-10">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AUTH LOG 0x{i}B</p>
                                        <ArrowUpRight size={12} className="text-slate-300 group-hover:text-rose-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-600 mt-2 italic leading-snug relative z-10">Access denied at secondary node sync...</p>
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-rose-500 group-hover:h-8 transition-all rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default AdminDashboard;
