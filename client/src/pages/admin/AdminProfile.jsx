import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
    User,
    Mail,
    Shield,
    Key,
    Plus,
    Trash2,
    Save,
    CheckCircle,
    Sparkles,
    Loader2,
    Lock,
    Eye,
    EyeOff,
    UserPlus,
    ShieldAlert,
    Activity,
    Fingerprint,
    Camera
} from 'lucide-react';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

const AdminProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('identity');

    // Identity Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [secondaryEmails, setSecondaryEmails] = useState([]);
    const [newSecondaryEmail, setNewSecondaryEmail] = useState('');

    // Password change state
    const [passwordCurrent, setPasswordCurrent] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    // Sub-Admin state (Access Tab)
    const [adminFormData, setAdminFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        permissions: ['approve_only']
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await API.get('/users/me');
            const userData = response.data.data.user;
            setUser(userData);
            setName(userData.name);
            setEmail(userData.email);
            setSecondaryEmails(userData.secondaryEmails || []);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await API.patch('/users/updateMe', {
                name,
                secondaryEmails
            });
            setUpdateSuccess(true);
            toast.success('Admin profile updated successfully!');
            setTimeout(() => setUpdateSuccess(false), 3000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            toast.error('Passwords do not match.');
            return;
        }
        setSaving(true);
        try {
            await API.patch('/auth/updateMyPassword', {
                passwordCurrent,
                password,
                passwordConfirm
            });
            setPasswordCurrent('');
            setPassword('');
            setPasswordConfirm('');
            toast.success('Security password updated successfully.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password.');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setSaving(true);
            const response = await API.post("/users/upload-avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.status === "success") {
                const updatedUser = response.data.data.user;
                setUser(updatedUser);
                toast.success("Admin photo updated successfully.");

                // Update local storage
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...storedUser, avatar: updatedUser.avatar }));

                // Dispatch event to update Header
                window.dispatchEvent(new Event('storage'));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload photo.");
        } finally {
            setSaving(false);
        }
    };

    const handleCreateSubAdmin = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await API.post('/admin/users/create-admin', adminFormData);
            setAdminFormData({
                name: '',
                email: '',
                password: '',
                passwordConfirm: '',
                permissions: ['approve_only']
            });
            toast.success('New administrative account generated.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Administrative registration failed.');
        } finally {
            setSaving(false);
        }
    };

    const addSecondaryEmail = () => {
        if (!newSecondaryEmail || !newSecondaryEmail.includes('@')) return;
        if (email === newSecondaryEmail || secondaryEmails.includes(newSecondaryEmail)) {
            alert('This email is already added.');
            return;
        }
        setSecondaryEmails([...secondaryEmails, newSecondaryEmail]);
        setNewSecondaryEmail('');
    };

    const removeSecondaryEmail = (emailToRemove) => {
        setSecondaryEmails(secondaryEmails.filter(e => e !== emailToRemove));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Profile...</p>
            </div>
        );
    }

    const tabs = [
        { id: 'identity', label: 'Profile Info', icon: Fingerprint, desc: 'Your name and emails' },
        { id: 'security', label: 'Password', icon: Shield, desc: 'Change your password' },
        { id: 'access', label: 'Add Admin', icon: UserPlus, desc: 'Create a sub-admin account' }
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <SectionHeader
                title="Profile Matrix"
                subtitle="Admin Profile"
                description="Manage your profile information, update contact details, and change your account password."
                icon={Fingerprint}
                gradientFrom="from-primary-400"
                gradientTo="to-indigo-400"
                dark={true}
            >
                <div className="shrink-0 relative group">
                    {/* Premium Ambient Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-primary-500/20 to-indigo-500/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Main Avatar Container (Clean Frame) */}
                    <div className="w-36 h-36 md:w-44 md:h-44 relative z-10">
                        {/* Circle Glass Border */}
                        <div className="absolute inset-x-0 inset-y-0 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl overflow-hidden">
                            <div className="absolute inset-[2px] border border-white/5 rounded-full"></div>
                        </div>

                        {/* Image/Icon Container */}
                        <div className="absolute inset-2 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center border border-white/10 transition-all duration-500">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-500">
                                        <Fingerprint size={32} className="text-white" />
                                    </div>
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Profile</span>
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <label className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center cursor-pointer">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3 border border-white/20">
                                    {saving ? <Loader2 size={20} className="animate-spin text-white" /> : <Camera size={20} className="text-white" />}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Update Matrix</span>
                                <input type="file" hidden onChange={handleAvatarUpload} accept="image/*" disabled={saving} />
                            </label>
                        </div>

                        {/* Professional Status Badge */}
                        <div className="absolute -bottom-2 -right-2 z-20 flex items-center gap-2 bg-slate-900 border border-white/10 pl-3 pr-4 py-2 rounded-2xl shadow-3xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="relative w-2.5 h-2.5">
                                <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></span>
                                <span className="relative block w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                            </div>
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Active Admin</span>
                        </div>

                        {/* Security Badge */}
                        <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-slate-900 z-30 transform group-hover:-rotate-12 transition-transform">
                            <Shield size={20} className="text-white" />
                        </div>
                    </div>
                </div>
            </SectionHeader>

            <div className="max-w-5xl mx-auto space-y-12">
                {/* Compact Toggle Hub */}
                <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-md rounded-[28px] border border-slate-100 shadow-inner max-w-2xl mx-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[22px] transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-white text-slate-900 shadow-xl shadow-slate-200 translate-y-[-1px]'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                }`}
                        >
                            <tab.icon size={18} className={activeTab === tab.id ? 'text-primary-500' : ''} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Transition Area */}
                <div className="mt-12 transition-all duration-500">
                    {activeTab === 'identity' && (
                        <div className="space-y-8 animate-slide-up">
                            <form onSubmit={handleUpdateProfile} className="portal-card p-12 bg-white border-none shadow-2xl shadow-slate-100 space-y-10 group">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                        <Fingerprint className="text-primary-500" size={24} />
                                        Profile Info
                                    </h3>
                                    {updateSuccess && (
                                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase animate-bounce">
                                            <CheckCircle size={14} /> Saved!
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-8 py-5 bg-slate-50 rounded-2xl text-sm font-bold text-slate-900 border-2 border-transparent focus:bg-white focus:border-slate-900 outline-none transition-all"
                                            placeholder="Full Name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3 opacity-50">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Read Only)</label>
                                        <div className="w-full px-8 py-5 bg-slate-100 rounded-2xl text-sm font-bold text-slate-400 border-2 border-transparent flex items-center justify-between">
                                            {email}
                                            <Lock size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 border-t border-slate-50">
                                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] block">Additional Emails</label>
                                    <div className="flex flex-wrap gap-3">
                                        {secondaryEmails.map((se) => (
                                            <div key={se} className="flex items-center gap-3 bg-slate-900 text-white pl-5 pr-3 py-3 rounded-xl shadow-lg border border-slate-800">
                                                <span className="text-xs font-bold leading-none">{se}</span>
                                                <button type="button" onClick={() => removeSecondaryEmail(se)} className="p-2 hover:text-rose-400 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {secondaryEmails.length === 0 && (
                                            <div className="w-full p-8 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 italic text-xs font-medium uppercase tracking-widest">
                                                No additional emails added
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-4">
                                        <input
                                            type="email"
                                            value={newSecondaryEmail}
                                            onChange={(e) => setNewSecondaryEmail(e.target.value)}
                                            className="flex-1 px-8 py-5 bg-slate-50 rounded-2xl text-sm font-bold text-slate-900 border-2 border-transparent focus:bg-white focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
                                            placeholder="Add secondary email..."
                                        />
                                        <button type="button" onClick={addSecondaryEmail} className="px-8 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-2xl transition-all">
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-2xl shadow-slate-200"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : <Save size={20} className="text-primary-400" />}
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8 animate-slide-up">
                            <form onSubmit={handleUpdatePassword} className="portal-card p-12 bg-slate-900 text-white border-none shadow-2xl shadow-slate-200 space-y-12">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                        <Key className="text-secondary-400" size={24} />
                                        Change Password
                                    </h3>
                                    <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="text-slate-500 hover:text-white transition-colors">
                                        {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Current Password</label>
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            value={passwordCurrent}
                                            onChange={(e) => setPasswordCurrent(e.target.value)}
                                            className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:bg-white/10 focus:border-secondary-400 outline-none transition-all"
                                            placeholder="••••••••••••"
                                            required
                                        />
                                    </div>

                                    <div className="pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">New Password</label>
                                            <input
                                                type={showPasswords ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:bg-white/10 focus:border-secondary-400 outline-none transition-all"
                                                placeholder="••••••••••••"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Confirm New Password</label>
                                            <input
                                                type={showPasswords ? "text" : "password"}
                                                value={passwordConfirm}
                                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                                className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:bg-white/10 focus:border-secondary-400 outline-none transition-all"
                                                placeholder="••••••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-6 bg-white text-slate-900 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-2xl shadow-white/10"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : <Sparkles size={20} className="text-secondary-600" />}
                                    Update Password
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'access' && (
                        <div className="space-y-8 animate-slide-up">
                            <form onSubmit={handleCreateSubAdmin} className="portal-card p-12 bg-white border-none shadow-2xl shadow-slate-100 space-y-12">
                                <div className="flex items-center gap-4 border-b border-slate-50 pb-8">
                                    <div className="p-4 bg-slate-900 rounded-2xl text-primary-400 shadow-xl shadow-slate-200">
                                        <UserPlus size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Add New Admin</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 italic flex items-center gap-2">
                                            <ShieldAlert size={12} className="text-amber-500" /> Approvals permission only
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={adminFormData.name}
                                                onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
                                                className="w-full px-8 py-5 bg-slate-50 rounded-2xl text-sm font-bold text-slate-900 border-2 border-transparent focus:bg-white focus:border-slate-900 outline-none transition-all"
                                                placeholder="Sub-Admin Name"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={adminFormData.email}
                                                onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                                                className="w-full px-8 py-5 bg-slate-50 rounded-2xl text-sm font-bold text-slate-900 border-2 border-transparent focus:bg-white focus:border-slate-900 outline-none transition-all"
                                                placeholder="admin.sub@ims.edu"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={adminFormData.password}
                                                onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                                                className="w-full px-8 py-5 bg-slate-50 rounded-2xl text-sm font-bold text-slate-900 border-2 border-transparent focus:bg-white focus:border-slate-900 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={adminFormData.passwordConfirm}
                                                onChange={(e) => setAdminFormData({ ...adminFormData, passwordConfirm: e.target.value })}
                                                className="w-full px-8 py-5 bg-slate-50 rounded-2xl text-sm font-bold text-slate-900 border-2 border-transparent focus:bg-white focus:border-slate-900 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 rounded-[32px] space-y-6 border border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Permissions</label>
                                        <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100 italic">
                                            Approvals Only
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-5 bg-white rounded-2xl border-2 border-slate-900 shadow-xl flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 text-primary-400 rounded-xl flex items-center justify-center shrink-0">
                                                <ShieldAlert size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Approval Rights</p>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 leading-tight">Approve &amp; Reject</p>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-slate-50/50 rounded-2xl border-2 border-slate-100 flex items-center gap-4 opacity-40 italic grayscale">
                                            <div className="w-10 h-10 bg-slate-200 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                                                <Lock size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Config</p>
                                                <p className="text-[8px] text-slate-300 font-bold uppercase mt-1 leading-tight">Changes Restricted</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-2xl shadow-slate-200"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : <Shield size={20} className="text-primary-400" />}
                                    Create Admin Account
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="text-center pt-12 opacity-30">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Internship Management System &copy; 2026</p>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
