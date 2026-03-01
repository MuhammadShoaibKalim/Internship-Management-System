import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Lock,
    Building2,
    Globe,
    Smartphone,
    Shield,
    Camera,
    Eye,
    EyeOff,
    ArrowLeft,
    ShieldCheck,
    Save,
    MapPin,
    Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

const IndustrySettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const inputClasses = "w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-secondary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all duration-300";

    const tabs = [
        { id: 'profile', label: 'Company Profile', icon: Building2, desc: 'Public identity & branding' },
        { id: 'contact', label: 'Point of Contact', icon: Smartphone, desc: 'HR & Office locations' },
        { id: 'security', label: 'Security & Auth', icon: Shield, desc: 'Password & Privacy' }
    ];

    return (
        <div className="animate-fade-in space-y-8 pb-12">
            {/* Header with Navigation Link */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link to="/dashboard/industry" className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-[10px] uppercase tracking-widest mb-2 no-underline transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Portal
                    </Link>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Organization Settings</h1>
                    <p className="text-slate-500 font-medium italic">Manage your company's presence, hiring team, and security.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-primary-50 text-primary-600 text-[10px] font-black uppercase rounded-2xl border border-primary-100 flex items-center gap-2">
                        <ShieldCheck size={14} /> Verified Industry Partner
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Vertical Navigation Tabs */}
                <div className="lg:col-span-3 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full group flex flex-col items-start p-5 rounded-[2rem] transition-all duration-300 text-left
                                ${activeTab === tab.id
                                    ? 'bg-secondary-900 text-white shadow-2xl shadow-slate-200 translate-x-2'
                                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon size={20} className={activeTab === tab.id ? 'text-primary-400' : 'text-slate-400'} />
                                <span className="font-black text-sm uppercase tracking-tight">{tab.label}</span>
                            </div>
                            <span className={`text-[10px] mt-1 font-medium ${activeTab === tab.id ? 'text-slate-400' : 'text-slate-400'}`}>
                                {tab.desc}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Settings Content Panels */}
                <div className="lg:col-span-9 space-y-8">
                    {activeTab === 'profile' && (
                        <div className="portal-card p-10 bg-white space-y-10 animate-fade-in">
                            <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-slate-50">
                                <div className="relative group">
                                    <div className="w-32 h-32 bg-slate-100 rounded-[3rem] flex items-center justify-center text-slate-400 font-black text-4xl border-8 border-slate-50 shadow-inner overflow-hidden">
                                        TF
                                    </div>
                                    <button className="absolute bottom-2 right-2 p-3 bg-secondary-900 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform flex items-center justify-center ring-4 ring-white">
                                        <Camera size={18} />
                                    </button>
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-3xl font-black text-secondary-900 leading-none">TechFlow Solutions</h3>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Globe size={14} /> www.techflow.io
                                        </span>
                                        <span className="w-1.5 h-1.5 bg-slate-200 rounded-full hidden md:block"></span>
                                        <span className="text-sm font-bold text-primary-600">Global Tech Partner</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                                    <div className="relative group">
                                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="text" defaultValue="TechFlow Solutions" className={inputClasses} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Website</label>
                                    <div className="relative group">
                                        <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="text" defaultValue="www.techflow.io" className={inputClasses} />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company Bio / Story</label>
                                    <textarea
                                        rows="4"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-secondary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all duration-300 resize-none"
                                        defaultValue="Pioneering AI transformation and global software solutions with a focus on high-performance cloud architectures."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button className="btn-primary w-full py-5 flex items-center justify-center gap-3 shadow-2xl shadow-primary-200 hover:scale-[1.01] active:scale-95">
                                    <Save size={20} />
                                    Update Company Profile
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="portal-card p-10 bg-white space-y-8 animate-fade-in border-l-8 border-l-primary-500">
                            <div>
                                <h3 className="text-2xl font-black text-secondary-900 tracking-tight">Contact Points</h3>
                                <p className="text-slate-400 font-medium text-sm mt-1">Manage how students and the university contact your hiring team.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">HR Email Address</label>
                                    <div className="relative group">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="email" defaultValue="hr@techflow.io" className={inputClasses} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">HR Contact Number</label>
                                    <div className="relative group">
                                        <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="tel" defaultValue="+971 4 123 4567" className={inputClasses} />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Headquarters Location</label>
                                    <div className="relative group">
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="text" defaultValue="Dubai Silicon Oasis, UAE" className={inputClasses} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 mt-4">
                                <div className="p-3 bg-white rounded-2xl text-primary-500 shadow-sm">
                                    <Briefcase size={20} />
                                </div>
                                <p className="text-xs font-bold text-slate-500 italic uppercase tracking-tight">These details will be visible to applicants on their hub.</p>
                            </div>

                            <button className="btn-primary w-full py-5 flex items-center justify-center gap-2 shadow-xl shadow-primary-50 mt-4">
                                <Save size={18} />
                                Sync Contact Details
                            </button>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="portal-card p-10 bg-white space-y-10 animate-fade-in">
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                                <div className="w-12 h-12 bg-secondary-900 text-primary-400 rounded-2xl flex items-center justify-center">
                                    <Lock size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-secondary-900">Security Credentials</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-secondary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all duration-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors z-10"
                                            >
                                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Secure Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-secondary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all duration-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors z-10"
                                            >
                                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <button className="btn-primary w-full py-5 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-50">
                                        Update Password
                                    </button>
                                </div>
                                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                                    <h4 className="font-black text-secondary-900 text-sm uppercase tracking-tight">Corporate Security</h4>
                                    <ul className="space-y-4">
                                        {[
                                            "Minimum 12 character complexity",
                                            "Rotate every 90 days recommended",
                                            "Session audit logs available",
                                            "IP whitelist (Coming Soon)"
                                        ].map((tip, i) => (
                                            <li key={i} className="flex items-start gap-3 text-xs text-slate-500 font-medium italic">
                                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5"></div>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-8 border-2 border-dashed border-rose-100 rounded-[2.5rem] bg-rose-50/10">
                        <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest mb-2 italic">Danger Zone</h4>
                        <p className="text-xs font-medium text-slate-500 mb-6">Deactivating your organization account will remove all active postings and student access.</p>
                        <button className="px-6 py-3 border-2 border-rose-200 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                            Deactivate Company Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndustrySettings;
