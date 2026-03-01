import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    BookOpen,
    Lock,
    Camera,
    Save,
    Bell,
    FileText,
    Trash2,
    Download,
    ArrowLeft,
    Verified,
    MapPin,
    Smartphone,
    Globe,
    Upload,
    Building2,
    Eye,
    EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const inputClasses = "w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-secondary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all duration-300";

    const documents = [
        { id: 1, name: 'Academic_Transcript.pdf', size: '2.4 MB', type: 'Transcript', date: 'Oct 20, 2023' },
        { id: 2, name: 'University_ID_Card.png', size: '1.1 MB', type: 'ID Proof', date: 'Sep 15, 2023' },
    ];

    return (
        <div className="animate-fade-in space-y-8 pb-12">
            {/* Header with Navigation Link */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link to="/dashboard/student" className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-[10px] uppercase tracking-widest mb-2 no-underline transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Account Settings</h1>
                    <p className="text-slate-500 font-medium italic">Manage your profile, academic verification, and security.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-2xl border border-emerald-100 flex items-center gap-2">
                        <Verified size={14} /> Verified Student
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Vertical Navigation Tabs */}
                <div className="lg:col-span-3 space-y-2">
                    {[
                        { id: 'profile', label: 'Profile Information', icon: User, desc: 'Personal details & photo' },
                        { id: 'academic', label: 'Academic Details', icon: BookOpen, desc: 'University & GPA sync' },
                        { id: 'documents', label: 'Documents Box', icon: FileText, desc: 'Verified uploads' },
                        { id: 'security', label: 'Security & Auth', icon: Lock, desc: 'Password & Privacy' },
                    ].map(tab => (
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
                                        SA
                                    </div>
                                    <button className="absolute bottom-2 right-2 p-3 bg-primary-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform flex items-center justify-center ring-4 ring-white">
                                        <Camera size={18} />
                                    </button>
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-3xl font-black text-secondary-900 leading-none">Shoaib Ahmed</h3>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Globe size={14} /> Student Portal ID: 2021-CS-582
                                        </span>
                                        <span className="w-1.5 h-1.5 bg-slate-200 rounded-full hidden md:block"></span>
                                        <span className="text-sm font-bold text-primary-600">Active Member</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="text" defaultValue="Shoaib Ahmed" className={inputClasses} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Email</label>
                                    <div className="relative group">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="email" defaultValue="shoaib@example.com" className={inputClasses} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="text" defaultValue="+92 300 1234567" className={inputClasses} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Location</label>
                                    <div className="relative group">
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="text" defaultValue="Lahore, Pakistan" className={inputClasses} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button className="btn-primary w-full py-5 flex items-center justify-center gap-3 shadow-2xl shadow-primary-200 hover:scale-[1.01] active:scale-95">
                                    <Save size={20} />
                                    Save Profile Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'academic' && (
                        <div className="portal-card p-10 bg-white space-y-8 animate-fade-in border-l-8 border-l-primary-500">
                            <div>
                                <h3 className="text-2xl font-black text-secondary-900 tracking-tight">University Sync</h3>
                                <p className="text-slate-400 font-medium text-sm mt-1">Keep your GPA and semester data up-to-date for internship eligibility.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Institute Name</label>
                                    <div className="relative group">
                                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="text" defaultValue="FAST National University of Computer and Emerging Sciences" className={inputClasses} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Cumulative GPA</label>
                                        <input type="text" defaultValue="3.82" className={inputClasses.replace('pl-12', 'pl-6')} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Semester</label>
                                        <select className={inputClasses.replace('pl-12', 'pl-6') + " appearance-none cursor-pointer"}>
                                            <option>7th Semester (Active)</option>
                                            <option>8th Semester</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-500 shadow-sm">
                                        <Verified size={24} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 italic">Academic data is verified by the registrar's office automatically every 30 days.</p>
                                </div>
                            </div>
                            <button className="btn-primary w-full py-5 flex items-center justify-center gap-2 shadow-xl shadow-primary-50">
                                <Save size={18} />
                                Sync Academic Profile
                            </button>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="portal-card p-10 bg-secondary-900 text-white border-none overflow-hidden relative group">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 text-center md:text-left">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black tracking-tight">Security Vault</h3>
                                        <p className="text-slate-400 font-medium text-sm italic">Manage high-fidelity verified documents for employers.</p>
                                    </div>
                                    <button className="btn-primary py-4 px-10 text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 whitespace-nowrap">
                                        <Upload size={18} /> Add Document
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {documents.map(doc => (
                                    <div key={doc.id} className="portal-card p-8 flex items-center justify-between group hover:border-primary-100 hover:shadow-2xl transition-all bg-white">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 rounded-[1.5rem] flex items-center justify-center transition-all shadow-inner">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-secondary-900 text-lg group-hover:text-primary-600 transition-colors uppercase tracking-tight">{doc.name}</h4>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">{doc.type}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.size}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <button className="p-4 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">
                                                <Download size={20} />
                                            </button>
                                            <button className="p-4 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="portal-card p-10 bg-white space-y-10 animate-fade-in">
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                                    <Lock size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-secondary-900">Security Credentials</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
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
                                    <h4 className="font-black text-secondary-900 text-sm uppercase tracking-tight">Security Tips</h4>
                                    <ul className="space-y-4">
                                        {[
                                            "Use at least 12 characters",
                                            "Include symbols like @, #, $",
                                            "Enable 2FA (Coming Soon)",
                                            "Don't share your Portal ID"
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
                </div>
            </div>
        </div>
    );
};

export default StudentSettings;
