import React from 'react';
import { Users, BookOpen, ClipboardCheck, MapPin, ArrowRight, ExternalLink, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';

const SupervisorDashboard = () => {
    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Clean Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100/50">
                        <GraduationCap size={14} className="text-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">Faculty Supervisor</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-primary-500">Oversight Hub</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium mt-3 max-w-2xl leading-relaxed">
                            Monitor assigned student nodes, evaluate <span className="font-bold text-slate-900">technical log compliance</span>, and finalize academic marking cycles for the current semester.
                        </p>
                    </div>
                </div>
                <div className="p-1 bg-slate-50 rounded-3xl flex items-center shadow-inner">
                    <div className="px-8 py-4 bg-white text-indigo-600 rounded-[1.4rem] shadow-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-slate-100">
                        <Sparkles size={18} className="text-amber-500 animate-pulse" /> Cycle 2026-B Active
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Assigned Students', value: '24', icon: Users, color: 'text-indigo-600 bg-indigo-50', link: '/dashboard/supervisor/students' },
                    { label: 'Pending Logs', value: '18', icon: BookOpen, color: 'text-amber-600 bg-amber-50', link: '/dashboard/supervisor/logs' },
                    { label: 'Site Visits', value: '03', icon: MapPin, color: 'text-blue-600 bg-blue-50', link: '/dashboard/supervisor/visits' },
                    { label: 'Final Marking', value: '05', icon: ClipboardCheck, color: 'text-emerald-600 bg-emerald-50', link: '/dashboard/supervisor/marking' },
                ].map((stat, i) => (
                    <Link key={i} to={stat.link} className="portal-card p-10 group hover:border-indigo-100 transition-all no-underline bg-white relative overflow-hidden">
                        <div className="flex justify-between items-start mb-8 relative z-10 font-inter">
                            <div className={`p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:rotate-12 transition-all shadow-inner`}>
                                <stat.icon size={24} />
                            </div>
                            <ArrowRight size={20} className="text-slate-200 group-hover:text-indigo-500 group-hover:translate-x-2 transition-all" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter leading-none">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3">{stat.label}</p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-110 group-hover:bg-indigo-500/10" />
                    </Link>
                ))}
            </div>

            {/* Monitoring Table Section */}
            <div className="portal-card p-10 bg-white shadow-2xl shadow-slate-200/50 border-none">
                <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-50">
                    <div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">Monitoring Queue</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Institutional compliance tracking feed</p>
                    </div>
                    <Link to="/dashboard/supervisor/students" className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all no-underline flex items-center gap-3 shadow-xl shadow-slate-200">
                        View Registry <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 rounded-2xl">
                            <tr className="text-left">
                                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Identity</th>
                                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment Key</th>
                                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Last Sync</th>
                                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance</th>
                                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[1, 2, 3, 4].map(i => (
                                <tr key={i} className="group hover:bg-slate-50/80 transition-all">
                                    <td className="py-8 px-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-slate-900 text-indigo-400 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">
                                                {['SA', 'AR', 'ZA', 'MK'][i - 1] || 'S'}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-900 uppercase tracking-tight text-base block leading-tight group-hover:text-indigo-600 transition-colors">{['Shoaib Ahmed', 'Ali Raza', 'Zainab Ahmed', 'Muhammad Khalid'][i - 1]}</span>
                                                <span className="text-[10px] font-bold text-slate-400 italic mt-1 block">B.S Computer Science</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-8 text-[10px] font-black text-slate-700 uppercase tracking-widest">2021-CS-{120 + i}</td>
                                    <td className="py-8 px-8 text-center">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-1.5 bg-slate-100 rounded-lg">{i * 2}h ago</span>
                                    </td>
                                    <td className="py-8 px-8">
                                        <StatusBadge status={i % 2 === 0 ? 'approved' : 'pending'} />
                                    </td>
                                    <td className="py-8 px-8 text-right">
                                        <Link to={`/dashboard/supervisor/logs?student=${i}`} className="p-4 bg-white border border-slate-100 text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-200 group-hover:shadow-xl rounded-2xl transition-all inline-flex items-center">
                                            <ArrowRight size={22} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                <div className="portal-card p-12 bg-slate-900 text-white border-none flex flex-col items-center justify-center text-center group overflow-hidden relative shadow-2xl shadow-indigo-200/20">
                    <div className="relative z-10 space-y-8">
                        <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(79,70,229,0.3)] mx-auto group-hover:scale-110 transition-transform">
                            <ShieldCheck size={48} />
                        </div>
                        <div>
                            <h4 className="text-3xl font-extrabold uppercase tracking-tight mb-3">Audit Protocol</h4>
                            <p className="text-slate-400 text-sm font-medium italic max-w-sm mx-auto opacity-70 leading-relaxed px-4">
                                Global synchronization of student log books for the current week. <span className="text-indigo-400 font-bold">18 entries</span> pending institutional review.
                            </p>
                        </div>
                        <Link to="/dashboard/supervisor/logs" className="px-12 py-5 bg-white text-slate-900 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-50 transition-all no-underline block mx-auto w-fit active:scale-95">
                            Process Batch Review
                        </Link>
                    </div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] -mr-[200px] -mt-[200px] transition-all duration-1000 group-hover:bg-indigo-500/20" />
                </div>

                <div className="portal-card p-12 bg-white border border-slate-50 flex flex-col justify-center text-center group hover:shadow-2xl transition-all relative">
                    <div className="space-y-8">
                        <div className="w-20 h-20 bg-slate-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all">
                            <MapPin size={40} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">External Verification</h4>
                            <p className="text-slate-500 text-sm font-medium italic mt-3 px-8 leading-relaxed">
                                Schedule and manage your physical industry evaluation visits to verify student <span className="font-bold text-slate-900 italic">on-site conditions</span>.
                            </p>
                        </div>
                        <Link to="/dashboard/supervisor/visits" className="px-10 py-5 bg-slate-50 text-slate-400 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all no-underline block mx-auto w-fit border border-slate-100 italic">
                            Node Visits Scheduler
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;
