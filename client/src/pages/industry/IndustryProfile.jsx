import React, { useState, useEffect } from 'react';
import { Mail, Phone, Building2, MapPin, Globe, Edit2, ShieldCheck, Briefcase, Award, Loader2 } from 'lucide-react';
import API from '../../services/api';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/common/SectionHeader';

const IndustryProfile = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [userRes, statsRes] = await Promise.all([
                    API.get('/users/me'),
                    API.get('/industry/stats')
                ]);

                if (userRes.data.status === 'success') {
                    setUser(userRes.data.data.user);
                }
                if (statsRes.data.status === 'success') {
                    setStats(statsRes.data.data.stats);
                }
            } catch (err) {
                console.error('Failed to fetch profile data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-primary-600" size={40} />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loading Profile...</p>
            </div>
        );
    }

    const { industryMeta = {} } = user || {};

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <div className="glass-card overflow-hidden p-0 border-none shadow-4xl relative rounded-[3.5rem]">
                {/* Premium Banner */}
                <div className="h-64 bg-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 via-indigo-900/40 to-slate-900/40 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500 via-transparent to-transparent"></div>

                    {/* Floating Tech Elements */}
                    <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white/5 rounded-full animate-pulse-slow"></div>
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 border-2 border-white/5 rounded-full animate-spin-slow"></div>

                    <div className="absolute -bottom-24 left-16 group">
                        {/* Circle Frame for Industry Logo */}
                        <div className="w-28 h-28 relative">
                            {/* Premium Ambient Glow */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary-500/10 to-indigo-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            {/* Main Logo Container (Clean Frame) */}
                            <div className="absolute inset-0 z-10">
                                {/* Simple Circle Border */}
                                <div className="absolute inset-0 bg-white shadow-2xl rounded-full border border-slate-100 overflow-hidden">
                                    <div className="absolute inset-[2px] border border-slate-50 rounded-full"></div>
                                </div>

                                {/* Image/Icon Container */}
                                <div className="absolute inset-1 rounded-full overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100 transition-all duration-500">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-500">
                                                <Briefcase size={20} className="text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Verified Status Floating Badge */}
                            <div className="absolute -top-1 -right-1 z-30 w-8 h-8 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-slate-50 transition-transform group-hover:rotate-12">
                                <ShieldCheck size={16} className="text-emerald-500" />
                            </div>
                        </div>
                    </div>
                    <Link to="/dashboard/industry/settings" className="absolute bottom-8 right-12 px-8 py-4 bg-white/10 backdrop-blur-xl text-white border-2 border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/20 hover:border-white/40 transition-all flex items-center gap-3">
                        <Edit2 size={18} className="text-primary-300" /> Update Branding
                    </Link>
                </div>

                {/* Industrial Info Block */}
                <div className="pt-28 px-16 pb-16 bg-white/40">
                    <SectionHeader
                        title={user?.name}
                        subtitle="Public Profile"
                        description={industryMeta.bio ? industryMeta.bio.split('.')[0] + '.' : 'Profile not set. Please update your company information.'}
                        icon={Building2}
                        gradientFrom="from-slate-900"
                        gradientTo="to-slate-700"
                    >
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner group/icon">
                                <ShieldCheck size={32} />
                            </div>
                            <Link to="/dashboard/industry/settings" className="btn-premium from-primary-600 to-indigo-600 py-5 px-12 text-[10px] font-black uppercase tracking-[0.4em] shadow-4xl shadow-primary-500/20 active:scale-95 transition-all">
                                Edit Profile
                            </Link>
                        </div>
                    </SectionHeader>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 bg-slate-50/50 p-8 rounded-[3.5rem] border border-slate-100 shadow-inner">
                        {[
                            { icon: Mail, label: "HR Email", value: industryMeta.hrEmail || user?.email },
                            { icon: Phone, label: "HR Phone", value: industryMeta.hrPhone || 'N/A' },
                            { icon: Globe, label: "Website", value: industryMeta.website || 'N/A' },
                            { icon: MapPin, label: "Headquarters", value: industryMeta.headquarters || 'N/A' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-center px-4 group/stat">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm shrink-0 group-hover/stat:scale-110 group-hover/stat:text-primary-500 transition-all duration-500">
                                    <item.icon size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap overflow-hidden text-ellipsis italic">{item.label}</p>
                                    <p className="text-xs font-black text-slate-900 mt-1 whitespace-nowrap overflow-hidden text-ellipsis uppercase tracking-tighter">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
                        <div className="lg:col-span-2 space-y-12">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4 italic text-gradient from-slate-900 to-slate-600">
                                    <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
                                    Organizational Philosophy
                                </h3>
                                <div className="mt-8 p-10 bg-white/60 rounded-[2.5rem] border border-slate-100 shadow-sm italic leading-relaxed text-slate-600 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500/20 group-hover:bg-primary-500 transition-colors duration-700"></div>
                                    {industryMeta.bio || 'No description added yet. Please update your company profile in Settings.'}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="p-10 glass-card bg-white/60 border-slate-100 rounded-[2.5rem] group hover:border-primary-200 transition-all duration-700 hover:shadow-4xl">
                                    <div className="flex justify-between items-start mb-6">
                                        <Briefcase className="text-primary-600 group-hover:rotate-12 transition-transform duration-700" size={32} />
                                        <div className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[8px] font-black uppercase tracking-widest">Active</div>
                                    </div>
                                    <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.3em] italic">Open Opportunities</h4>
                                    <p className="text-5xl font-black text-slate-900 mt-3 tracking-tighter italic">{stats?.counts?.totalPostings || 0}</p>
                                </div>
                                <div className="p-10 btn-premium from-primary-600 to-indigo-600 rounded-[2.5rem] border-none shadow-4xl shadow-primary-500/20 group hover:scale-[1.02] transition-all duration-700">
                                    <div className="flex justify-between items-start mb-6">
                                        <Award className="text-white group-hover:scale-110 transition-transform duration-700" size={32} />
                                        <div className="px-3 py-1 bg-white/20 text-white rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md">Active</div>
                                    </div>
                                    <h4 className="font-black text-white/60 uppercase text-[10px] tracking-[0.3em] italic">Active Interns</h4>
                                    <p className="text-5xl font-black text-white mt-3 tracking-tighter italic">{stats?.counts?.activeInterns || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="glass-card p-10 bg-slate-900 text-white border-none text-center rounded-[2.5rem] shadow-4xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-all duration-1000"></div>
                                <h3 className="font-black tracking-[0.4em] uppercase text-[10px] text-primary-400 italic">Strategic Impact</h3>
                                <div className="mt-12 space-y-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest px-2 italic">
                                            <span className="text-slate-400">Total Applicants</span>
                                            <span className="text-primary-400 text-lg">{stats?.counts?.totalApplicants || 0}</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: '65%' }}></div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-white/5">
                                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest px-2 italic">
                                            <span className="text-slate-400">Success Ratio</span>
                                            <span className="text-emerald-400 text-lg">
                                                {stats?.counts?.totalApplicants > 0
                                                    ? Math.round((stats?.counts?.activeInterns / stats?.counts?.totalApplicants) * 100)
                                                    : 0}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-4">
                                            <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${stats?.counts?.totalApplicants > 0 ? (stats?.counts?.activeInterns / stats?.counts?.totalApplicants) * 100 : 0}%` }}></div>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] leading-relaxed pt-4 italic">
                                        Based on your current internship data.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndustryProfile;
