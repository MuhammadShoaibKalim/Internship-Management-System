import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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
    Briefcase,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

const IndustrySettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        industryMeta: {
            website: '',
            bio: '',
            hrEmail: '',
            hrPhone: '',
            headquarters: ''
        }
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await API.get('/users/me');
            if (response.data.status === 'success') {
                const userData = response.data.data.user;
                setUser(userData);
                setFormData({
                    name: userData.name || '',
                    industryMeta: {
                        website: userData.industryMeta?.website || '',
                        bio: userData.industryMeta?.bio || '',
                        hrEmail: userData.industryMeta?.hrEmail || '',
                        hrPhone: userData.industryMeta?.hrPhone || '',
                        headquarters: userData.industryMeta?.headquarters || ''
                    }
                });
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await API.patch('/users/updateMe', formData);
            if (response.data.status === 'success') {
                setUser(response.data.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                toast.success('Organization profile updated successfully!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('avatar', file);

        setUploading(true);
        try {
            const response = await API.post('/users/upload-avatar', formDataUpload);
            if (response.data.status === 'success') {
                const updatedUser = response.data.data.user;
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.dispatchEvent(new Event('storage'));
                toast.success('Logo updated successfully!');
            }
        } catch (err) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.newPasswordConfirm) {
            return toast.error('New passwords do not match');
        }
        setSaving(true);
        try {
            await API.patch('/auth/updateMyPassword', {
                passwordCurrent: passwords.currentPassword,
                password: passwords.newPassword,
                passwordConfirm: passwords.newPasswordConfirm
            });
            toast.success('Password updated successfully!');
            setPasswords({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Password update failed');
        } finally {
            setSaving(false);
        }
    };

    const inputClasses = "w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-secondary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all duration-300";

    const tabs = [
        { id: 'profile', label: 'Company Profile', icon: Building2, desc: 'Public identity & branding' },
        { id: 'contact', label: 'Point of Contact', icon: Smartphone, desc: 'HR & Office locations' },
        { id: 'security', label: 'Security & Auth', icon: Shield, desc: 'Password & Privacy' }
    ];

    return (
        <div className="animate-fade-in space-y-8 pb-12">
            <SectionHeader
                title="Company Settings"
                subtitle="Industry Sub-Page"
                description="Manage your company profile and security"
                icon={ArrowLeft}
                linkTo="/dashboard/industry"
                linkText="Back to Dashboard"
                gradientFrom="from-primary-600"
                gradientTo="to-indigo-600"
            >
                <div className="px-8 py-5 bg-slate-900 border border-slate-800 rounded-[2rem] text-white text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 shadow-4xl shadow-slate-900/20 group">
                    <ShieldCheck size={20} className="text-primary-400 group-hover:scale-110 transition-transform duration-500" />
                    Verified: <span className="text-primary-400 text-sm tracking-tighter italic">Industry Partner</span>
                </div>
            </SectionHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Vertical Navigation Tabs */}
                {/* High-Fidelity Navigation Matrix */}
                <div className="lg:col-span-3 space-y-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full group flex flex-col items-start p-6 rounded-[2.5rem] transition-all duration-700 text-left relative overflow-hidden active:scale-95
                                ${activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-4xl shadow-slate-900/40 translate-x-2 border-none'
                                    : 'bg-white/60 text-slate-500 hover:bg-white hover:shadow-xl border border-slate-100 backdrop-blur-md'}`}
                        >
                            {activeTab === tab.id && (
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-3xl -mr-12 -mt-12"></div>
                            )}
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 ${activeTab === tab.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/40' : 'bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500'}`}>
                                    <tab.icon size={20} />
                                </div>
                                <span className="font-black text-[11px] uppercase tracking-[0.2em] italic">{tab.label}</span>
                            </div>
                            <span className={`text-[9px] mt-3 font-black uppercase tracking-widest opacity-60 relative z-10 block pl-14 ${activeTab === tab.id ? 'text-primary-300' : 'text-slate-400'}`}>
                                {tab.desc}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Settings Content Panels */}
                <div className="lg:col-span-9 space-y-8">
                    {loading ? (
                        <div className="portal-card p-20 flex flex-col items-center justify-center">
                            <Loader2 className="animate-spin text-primary-600 mb-4" size={40} />
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loading Settings...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'profile' && (
                                <div className="glass-card p-12 bg-white/60 space-y-12 animate-fade-in relative overflow-hidden backdrop-blur-xl border-slate-100 rounded-[3rem]">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                                    <div className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-slate-100 relative z-10">
                                        <div className="relative group/avatar">
                                            {/* Simple Circle Frame */}
                                            <div className="relative w-28 h-28 bg-slate-900 rounded-full p-1 shadow-2xl transition-all duration-500">
                                                <div className="w-full h-full rounded-full bg-white overflow-hidden border border-slate-100 relative flex items-center justify-center">
                                                    {user?.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <span className="text-3xl font-black italic text-primary-600 uppercase">{user?.name?.charAt(0) || 'I'}</span>
                                                    )}

                                                    {uploading && (
                                                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-full">
                                                            <Loader2 className="animate-spin text-white" size={24} />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Upload Trigger Badge */}
                                                <label className="absolute -bottom-1 -right-1 w-10 h-10 bg-slate-900 text-white rounded-full shadow-xl hover:bg-primary-600 active:scale-95 transition-all duration-500 flex items-center justify-center ring-4 ring-white cursor-pointer z-20">
                                                    <Camera size={16} className="text-primary-400" />
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="text-center md:text-left space-y-4">
                                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{user?.name}</h3>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                                                <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl">
                                                    <Globe size={16} className="text-primary-500" />
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{user?.industryMeta?.website || 'No website added'}</span>
                                                </div>
                                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] italic">Industry Partner</span>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2 italic">Company Name</label>
                                            <div className="relative group">
                                                <Building2 size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-all duration-500" />
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full pl-14 pr-7 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-black text-slate-900 uppercase tracking-tight focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none shadow-sm transition-all duration-500 italic"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2 italic">Website</label>
                                            <div className="relative group">
                                                <Globe size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-all duration-500" />
                                                <input
                                                    type="text"
                                                    value={formData.industryMeta.website}
                                                    onChange={e => setFormData({ ...formData, industryMeta: { ...formData.industryMeta, website: e.target.value } })}
                                                    className="w-full pl-14 pr-7 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-black text-slate-900 tracking-tight focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none shadow-sm transition-all duration-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2 italic">About / Bio</label>
                                            <div className="relative group">
                                                <textarea
                                                    rows="5"
                                                    className="w-full px-8 py-6 bg-white border border-slate-200 rounded-[2.5rem] text-sm font-medium text-slate-600 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none shadow-sm transition-all duration-500 resize-none leading-relaxed italic"
                                                    value={formData.industryMeta.bio}
                                                    onChange={e => setFormData({ ...formData, industryMeta: { ...formData.industryMeta, bio: e.target.value } })}
                                                    placeholder="Define your company's mission and culture..."
                                                ></textarea>
                                                <div className="absolute top-6 right-6 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest italic group-focus-within:text-primary-500 group-focus-within:border-primary-200 transition-all">bio</div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 pt-8">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="btn-premium w-full py-6 flex items-center justify-center gap-4 shadow-4xl shadow-primary-500/20 active:scale-[0.98] transition-all text-xs font-black uppercase tracking-[0.4em] italic disabled:opacity-50"
                                            >
                                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                                Save Profile
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="glass-card p-12 bg-white/60 space-y-12 animate-fade-in relative overflow-hidden backdrop-blur-xl border-slate-100 rounded-[3rem]">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                                    <div className="relative z-10 space-y-4">
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Contact <span className="text-primary-600">Details</span></h3>
                                        <div className="flex items-center gap-3">
                                            <div className="h-0.5 w-12 bg-primary-500 rounded-full"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Hiring team & operational headquarters coordination.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleUpdateProfile} className="space-y-10 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2 italic">HR Email</label>
                                                <div className="relative group">
                                                    <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-all duration-500" />
                                                    <input
                                                        type="email"
                                                        value={formData.industryMeta.hrEmail}
                                                        onChange={e => setFormData({ ...formData, industryMeta: { ...formData.industryMeta, hrEmail: e.target.value } })}
                                                        className="w-full pl-14 pr-7 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-black text-slate-900 tracking-tight focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none shadow-sm transition-all duration-500 italic"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2 italic">HR Phone</label>
                                                <div className="relative group">
                                                    <Smartphone size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-all duration-500" />
                                                    <input
                                                        type="tel"
                                                        value={formData.industryMeta.hrPhone}
                                                        onChange={e => setFormData({ ...formData, industryMeta: { ...formData.industryMeta, hrPhone: e.target.value } })}
                                                        className="w-full pl-14 pr-7 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-black text-slate-900 tracking-tight focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none shadow-sm transition-all duration-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2 italic">Headquarters</label>
                                                <div className="relative group">
                                                    <MapPin size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-all duration-500" />
                                                    <input
                                                        type="text"
                                                        value={formData.industryMeta.headquarters}
                                                        onChange={e => setFormData({ ...formData, industryMeta: { ...formData.industryMeta, headquarters: e.target.value } })}
                                                        className="w-full pl-14 pr-7 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-black text-slate-900 tracking-tight focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none shadow-sm transition-all duration-500 italic"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-slate-100/50 rounded-[2rem] border border-slate-200 flex items-center gap-6 group hover:bg-slate-100 transition-all duration-700">
                                            <div className="w-14 h-14 bg-white rounded-2xl text-primary-500 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                                <Briefcase size={28} />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Note</h4>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic opacity-60">This information will be visible to students and applicants.</p>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="btn-premium w-full py-6 flex items-center justify-center gap-4 shadow-4xl shadow-primary-500/20 active:scale-[0.98] transition-all text-xs font-black uppercase tracking-[0.4em] italic disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                            Save Contact Info
                                        </button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="glass-card p-12 bg-white/60 space-y-12 animate-fade-in relative overflow-hidden backdrop-blur-xl border-slate-100 rounded-[3rem]">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

                                    <div className="flex items-center gap-6 pb-12 border-b border-slate-100 relative z-10">
                                        <div className="w-16 h-16 bg-slate-900 text-primary-400 rounded-3xl flex items-center justify-center shadow-4xl shadow-slate-900/20 group">
                                            <Lock size={32} className="group-hover:rotate-12 transition-transform duration-700" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Change <span className="text-primary-600">Password</span></h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Update your account password to keep it secure.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2 italic">Current Password</label>
                                                <div className="relative group">
                                                    <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-all duration-500" />
                                                    <input
                                                        required
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        value={passwords.currentPassword}
                                                        onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                                        className="w-full pl-14 pr-16 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none shadow-sm transition-all duration-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors z-10"
                                                    >
                                                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2 italic">New Password</label>
                                                <div className="relative group">
                                                    <Shield size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-all duration-500" />
                                                    <input
                                                        required
                                                        type={showNewPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        value={passwords.newPassword}
                                                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                        className="w-full pl-14 pr-16 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none shadow-sm transition-all duration-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors z-10"
                                                    >
                                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2 italic">Confirm New Password</label>
                                                <div className="relative group">
                                                    <ShieldCheck size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-all duration-500" />
                                                    <input
                                                        required
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={passwords.newPasswordConfirm}
                                                        onChange={e => setPasswords({ ...passwords, newPasswordConfirm: e.target.value })}
                                                        className="w-full pl-14 pr-7 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none shadow-sm transition-all duration-500"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="btn-premium w-full py-6 flex items-center justify-center gap-4 shadow-4xl shadow-primary-500/20 active:scale-[0.98] transition-all text-xs font-black uppercase tracking-[0.4em] italic disabled:opacity-50"
                                            >
                                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                                Update Password
                                            </button>
                                        </div>
                                        <div className="bg-slate-900/5 p-10 rounded-[3rem] border border-slate-100 flex flex-col justify-between">
                                            <div className="space-y-6">
                                                <h4 className="font-black text-slate-900 text-xs uppercase tracking-[0.3em] italic">Password Requirements</h4>
                                                <ul className="space-y-6">
                                                    {[
                                                        "Minimum 8 characters required.",
                                                        "Include symbols and numbers for stronger security.",
                                                        "Update your password every 90 days.",
                                                        "You will be logged out after a password change."
                                                    ].map((tip, i) => (
                                                        <li key={i} className="flex items-start gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest italic leading-relaxed">
                                                            <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="pt-8 mt-12 border-t border-slate-200/50">
                                                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                                    <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                                                        <ShieldCheck size={18} />
                                                    </div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Your account is secure.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}

                    <div className="p-10 border-2 border-dashed border-rose-100 rounded-[3rem] bg-rose-50/20 group hover:bg-rose-50/40 transition-all duration-700">
                        <h4 className="text-[14px] font-black text-rose-600 uppercase tracking-[0.3em] mb-4 italic flex items-center gap-3">
                            <Shield className="animate-pulse" size={18} /> Danger Zone / Account Deletion
                        </h4>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic mb-10 opacity-60 leading-relaxed">
                            Deleting your account will remove all your internship postings, disconnect active interns, and permanently delete your company data from the platform.
                        </p>
                        <button className="px-12 py-5 border-2 border-rose-200 text-rose-600 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-4xl hover:shadow-rose-600/20 active:scale-95 transition-all duration-500 italic">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndustrySettings;
