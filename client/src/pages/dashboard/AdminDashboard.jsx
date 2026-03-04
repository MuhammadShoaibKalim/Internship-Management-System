import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, FileCheck, Settings, AlertCircle, ArrowUpRight, Users, GraduationCap, Building2, BarChart3, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await API.get('/admin/stats');
                setData(response.data.data);
            } catch (err) {
                setError('Failed to fetch system telemetry');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60s0px] flex flex-col items-center justify-center space-y-4 animate-pulse">
                <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Initializing Command Center...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center bg-rose-50 rounded-[3rem] border-2 border-rose-100">
                <AlertCircle className="w-16 h-16 text-rose-600 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-rose-900 uppercase">Telemetry Link Severed</h3>
                <p className="text-rose-500 font-medium mt-2">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Re-establish Sync</button>
            </div>
        );
    }

    const { stats, institutionalVetting, telemetry, securityFeed } = data;

    // Permission Logic
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userPermissions = currentUser.adminMeta?.permissions || [];
    const isSuperAdmin = userPermissions.includes('all') || userPermissions.length === 0;
    const canApprove = isSuperAdmin || userPermissions.includes('approve_only');

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
                            { label: 'Pending Approvals', value: stats.pendingIndustries, icon: GraduationCap, color: 'primary', path: '/dashboard/admin/industry' },
                            { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'secondary', path: '/dashboard/admin/users' },
                            { label: 'System Reports', value: stats.systemReports, icon: BarChart3, color: 'emerald', path: '/dashboard/admin/reports' },
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
                            {institutionalVetting.length > 0 ? (
                                institutionalVetting.map((org) => (
                                    <div key={org._id} className="flex items-center justify-between p-6 bg-slate-50 border-2 border-transparent hover:border-rose-100 hover:bg-white hover:shadow-2xl transition-all group rounded-3xl">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 text-slate-300 font-black group-hover:text-rose-500 transition-colors">
                                                <Building2 size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase">{org.name}</h4>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(org.createdAt).toLocaleDateString()}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                    <span className="text-[10px] text-rose-600 font-bold uppercase tracking-widest">{org.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            {canApprove ? (
                                                <Link to="/dashboard/admin/industry" className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-rose-600 transition-all no-underline">Perform Audit</Link>
                                            ) : (
                                                <span className="px-6 py-3 bg-slate-50 text-slate-300 rounded-xl text-[8px] font-black uppercase tracking-widest border border-slate-100 italic">Audit Only Mode</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No pending institutional audits</p>
                                </div>
                            )}
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
                                        <span className="text-primary-400 italic underline">{telemetry.cpuLoad}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${telemetry.cpuLoad}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>DB Consistency</span>
                                        <span className="text-emerald-400">{telemetry.dbConsistency}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-emerald-500 rounded-full w-full" />
                                    </div>
                                </div>
                                <div className="pt-6 flex items-center justify-between border-t border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Status</span>
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[8px] font-black uppercase border border-emerald-500/20">{telemetry.nodeStatus}</span>
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
                            {securityFeed.map((log) => (
                                <div key={log.id} className="group cursor-pointer p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 relative overflow-hidden">
                                    <div className="flex justify-between items-start relative z-10">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.type} {log.id}</p>
                                        <ArrowUpRight size={12} className="text-slate-300 group-hover:text-rose-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-600 mt-2 italic leading-snug relative z-10">{log.message}</p>
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
