import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, FileCheck, Settings, AlertCircle, ArrowUpRight, Users, GraduationCap, Building2, BarChart3, Sparkles, ArrowRight, Loader2, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import SectionHeader from '../../components/common/SectionHeader';

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
                setError('Failed to load dashboard data. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[600px] flex flex-col items-center justify-center space-y-4 animate-pulse">
                <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center bg-rose-50 rounded-[3rem] border-2 border-rose-100">
                <AlertCircle className="w-16 h-16 text-rose-600 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-rose-900 uppercase">Unable to Load Data</h3>
                <p className="text-rose-500 font-medium mt-2">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Try Again</button>
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
        <div className="space-y-12 animate-fade-in pb-12">
            <SectionHeader
                title="Command Center"
                subtitle="Admin Panel"
                description="Manage company approvals and monitor platform activity with live system updates across all users and departments."
                icon={Shield}
                gradientFrom="from-rose-600"
                gradientTo="to-indigo-600"
            >
                <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative p-6 bg-slate-900 text-primary-400 rounded-[2.5rem] shadow-2xl transition-all cursor-help border border-white/10">
                        <Shield size={40} className="group-hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>
            </SectionHeader>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="lg:col-span-3 space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                            { label: 'Pending Approvals', value: stats.pendingIndustries, icon: GraduationCap, color: 'primary', path: '/dashboard/admin/industry', gradient: 'from-rose-500 to-orange-400' },
                            { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'secondary', path: '/dashboard/admin/users', gradient: 'from-slate-800 to-slate-900' },
                            { label: 'System Reports', value: stats.systemReports, icon: BarChart3, color: 'emerald', path: '/dashboard/admin/reports', gradient: 'from-emerald-500 to-teal-400' },
                        ].map((s, i) => (
                            <Link key={i} to={s.path} className="portal-card p-10 group no-underline bg-white relative overflow-hidden">
                                <div className="flex justify-between items-start mb-10 relative z-10 font-inter">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-6 shadow-inner transition-all duration-500 flex items-center justify-center border border-transparent group-hover:border-white/10">
                                        <s.icon size={28} />
                                    </div>
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shadow-sm">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{s.value}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${s.gradient}`}></span>
                                        {s.label}
                                    </p>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-50 rounded-full group-hover:bg-rose-500/5 transition-all duration-700 blur-3xl opacity-50 group-hover:opacity-100" />
                            </Link>
                        ))}
                    </div>

                    <div className="glass-card p-12 border-none shadow-3xl shadow-slate-200/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 pb-8 border-b border-slate-100/50">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Company Approvals</h3>
                                <p className="text-slate-400 text-[10px] font-black mt-3 uppercase tracking-[0.3em] inline-flex items-center gap-2">
                                    <Sparkles size={14} className="text-rose-500" />
                                    Pending Review
                                </p>
                            </div>
                            <Link to="/dashboard/admin/industry" className="btn-premium py-4 px-10 shadow-xl shadow-slate-200 group">
                                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="space-y-6">
                            {institutionalVetting.length > 0 ? (
                                institutionalVetting.map((org) => (
                                    <div key={org._id} className="flex items-center justify-between p-8 bg-white/50 border border-slate-100/50 hover:border-rose-100 hover:bg-white hover:shadow-2xl hover:shadow-rose-100/20 transition-all duration-500 group rounded-[2.5rem]">
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-white/10 group-hover:bg-rose-600 transition-colors duration-500">
                                                <Building2 size={28} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">{org.name}</h4>
                                                <div className="flex items-center gap-5 mt-2">
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(org.createdAt).toLocaleDateString()}</span>
                                                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                                                        <span className="text-[10px] text-rose-600 font-black uppercase tracking-widest">{org.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            {canApprove ? (
                                                <Link to="/dashboard/admin/industry" className="btn-primary py-3.5 px-8 hover:shadow-rose-200 transition-all no-underline">Review</Link>
                                            ) : (
                                                <span className="px-6 py-3 bg-slate-50 text-slate-300 rounded-xl text-[8px] font-black uppercase tracking-widest border border-slate-100 italic">No Access</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">No Pending Approvals</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Health Monitoring Column */}
                <div className="space-y-10">
                    <div className="portal-card p-10 bg-slate-900 text-white border-none shadow-3xl shadow-slate-400/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em] flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                                <Activity size={18} className="text-primary-400 animate-pulse" />
                                System Health
                            </h3>
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>CPU Usage</span>
                                        <span className="text-primary-400 font-bold tracking-tighter">{telemetry.cpuLoad}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-gradient-to-r from-primary-600 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${telemetry.cpuLoad}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Network Speed</span>
                                        <span className="text-amber-400 font-bold tracking-tighter">{telemetry.networkLatency}</span>
                                    </div>
                                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-1000" style={{ width: `${(parseInt(telemetry.networkLatency) / 20) * 100}%` }} />
                                    </div>
                                </div>
                                <div className="pt-8 flex items-center justify-between border-t border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">System Status</span>
                                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-[9px] font-black uppercase border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">{telemetry.nodeStatus}</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 group-hover:scale-125 group-hover:bg-primary-500/20" />
                    </div>

                    <div className="portal-card p-10 bg-white shadow-2xl shadow-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 mb-10 flex items-center gap-3 uppercase tracking-[0.2em] pb-6 border-b border-slate-50">
                            <AlertCircle size={18} className="text-rose-500" />
                            Recent Activity
                        </h3>
                        <div className="space-y-6">
                            {securityFeed.map((log) => (
                                <div key={log.id} className="group cursor-pointer p-5 hover:bg-slate-50 rounded-[1.5rem] transition-all border border-transparent hover:border-slate-100 relative overflow-hidden">
                                    <div className="flex justify-between items-start relative z-10">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-rose-400 transition-colors">Log #{log.id.slice(-4)}</p>
                                        <ArrowUpRight size={14} className="text-slate-200 group-hover:text-rose-600 transition-all" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-600 mt-3 leading-relaxed relative z-10">{log.message}</p>
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-rose-500 group-hover:h-12 transition-all duration-500 rounded-full" />
                                </div>
                            ))}
                        </div>
                        <button className="mt-8 w-full py-4 bg-slate-50 text-slate-300 group-hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                            Acknowledge All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
