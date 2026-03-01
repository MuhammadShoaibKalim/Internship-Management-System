import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Lock,
    Camera,
    Save,
    ArrowLeft,
    Verified,
    Smartphone,
    Building2,
    BookOpen,
    Users,
    Calendar,
    Briefcase,
    Eye,
    EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SupervisorSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const inputClasses = "w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-secondary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all duration-300";

    return (
        <div className="animate-fade-in space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link to="/dashboard/supervisor" className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-[10px] uppercase tracking-widest mb-2 no-underline transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Faculty Profile</h1>
                    <p className="text-slate-500 font-medium italic">Manage your professional academic profile and supervision preferences.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-2xl border border-blue-100 flex items-center gap-2">
                        <Verified size={14} /> Registered Faculty
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Tabs */}
                <div className="lg:col-span-3 space-y-2">
                    {[
                        { id: 'profile', label: 'Personal Details', icon: User, desc: 'Contact & Photo' },
                        { id: 'academic', label: 'Faculty Info', icon: GraduationCap, desc: 'Department & Rank' },
                        { id: 'supervision', label: 'Supervision Slots', icon: Users, desc: 'Capacity & Interests' },
                        { id: 'security', label: 'Auth & Privacy', icon: Lock, desc: 'Password & Security' },
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
                            <span className="text-[10px] mt-1 font-medium opacity-60">
                                {tab.desc}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="lg:col-span-9 space-y-8">
                    {activeTab === 'profile' && (
                        <div className="portal-card p-10 bg-white space-y-10 animate-fade-in shadow-xl shadow-slate-100">
                            <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-slate-50">
                                <div className="relative group">
                                    <div className="w-32 h-32 bg-slate-100 rounded-[3rem] flex items-center justify-center text-slate-400 font-black text-4xl border-8 border-slate-50 shadow-inner overflow-hidden">
                                        DR
                                    </div>
                                    <button className="absolute bottom-2 right-2 p-3 bg-primary-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform flex items-center justify-center ring-4 ring-white">
                                        <Camera size={18} />
                                    </button>
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-3xl font-black text-secondary-900 leading-none">Dr. Salman Ahmed</h3>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-3 flex items-center gap-2 justify-center md:justify-start">
                                        <Briefcase size={14} /> Associate Professor • Department of CS
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="text" defaultValue="Dr. Salman Ahmed" className={inputClasses} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Faculty Email</label>
                                    <div className="relative group">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="email" defaultValue="salman.ahmed@university.edu" className={inputClasses} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Extension / Phone</label>
                                    <div className="relative group">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="text" defaultValue="+92 (042) 12345 ext 458" className={inputClasses} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Office Number</label>
                                    <div className="relative group">
                                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                                        <input type="text" defaultValue="Room 402, CS Block" className={inputClasses} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button className="btn-primary w-full py-5 flex items-center justify-center gap-3 shadow-2xl shadow-primary-200">
                                    <Save size={20} /> Update Personal Details
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'academic' && (
                        <div className="portal-card p-10 bg-white space-y-8 animate-fade-in border-l-8 border-l-blue-500">
                            <div>
                                <h3 className="text-2xl font-black text-secondary-900 tracking-tight">Academic Role</h3>
                                <p className="text-slate-400 font-medium text-sm mt-1">Configure your primary department and academic standing.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Department</label>
                                        <select className={inputClasses.replace('pl-12', 'pl-6') + " appearance-none cursor-pointer"}>
                                            <option>Computer Science</option>
                                            <option>Electrical Engineering</option>
                                            <option>Software Engineering</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Faculty Rank</label>
                                        <select className={inputClasses.replace('pl-12', 'pl-6') + " appearance-none cursor-pointer"}>
                                            <option>Associate Professor</option>
                                            <option>Professor</option>
                                            <option>Assistant Professor</option>
                                            <option>Lecturer</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Research Specialization</label>
                                    <input type="text" defaultValue="Machine Learning, Data Science, AI Ethics" className={inputClasses.replace('pl-12', 'pl-6')} />
                                </div>
                            </div>
                            <button className="btn-primary w-full py-5 flex items-center justify-center gap-2">
                                <Save size={18} /> Update Academic Information
                            </button>
                        </div>
                    )}

                    {activeTab === 'supervision' && (
                        <div className="portal-card p-10 bg-white space-y-10 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-secondary-900 tracking-tight">Supervision Capacity</h3>
                                <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                    Current Load: 24 Students
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Max Student Limit</label>
                                        <input type="number" defaultValue="30" className={inputClasses.replace('pl-12', 'pl-6')} />
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start gap-4">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <Calendar size={18} className="text-primary-500" />
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold italic leading-relaxed">
                                            Increasing your limit will update the HOD's dashboard regarding your supervision availability.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                                    <h4 className="font-black text-secondary-900 text-sm uppercase tracking-tight">Preferred Industries</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Software', 'FinTech', 'AI/ML', 'Agriculture', 'E-commerce'].map(industry => (
                                            <span key={industry} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:border-primary-500 hover:text-primary-600 transition-all">
                                                {industry}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button className="btn-primary w-full py-5 flex items-center justify-center gap-3">
                                <Save size={20} /> Save Supervision Settings
                            </button>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="portal-card p-10 bg-white space-y-10 animate-fade-in shadow-xl shadow-slate-100">
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                                    <Lock size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-secondary-900 uppercase tracking-tighter">Security Credentials</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className={inputClasses.replace('pl-12', 'pl-6')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors z-20"
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
                                                className={inputClasses.replace('pl-12', 'pl-6')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors z-20"
                                            >
                                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <button className="btn-primary w-full py-5 text-xs font-black uppercase tracking-widest">
                                        Update Account Credentials
                                    </button>
                                </div>
                                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6 flex flex-col justify-center">
                                    <h4 className="font-black text-secondary-900 text-sm uppercase tracking-tight">Faculty Security</h4>
                                    <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
                                        Use a strong password. As a supervisor, your account has access to student academic records and industry evaluations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Missing Lucide components in the scope if any
const GraduationCap = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
);

export default SupervisorSettings;
