import React, { useState, useEffect } from 'react';
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
    Fingerprint
} from 'lucide-react';
import API from '../../services/api';

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
            const response = await API.get('/users/getMe');
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
            setTimeout(() => setUpdateSuccess(false), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update identity node');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            alert('Password confirmations do not match the target parity.');
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
            alert('Security keys successfully rotated.');
        } catch (err) {
            alert(err.response?.data?.message || 'Password rotation protocol failed.');
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
            alert('New administrative node successfully synchronized.');
        } catch (err) {
            alert(err.response?.data?.message || 'Administrative registration failed.');
        } finally {
            setSaving(false);
        }
    };

    const addSecondaryEmail = () => {
        if (!newSecondaryEmail || !newSecondaryEmail.includes('@')) return;
        if (email === newSecondaryEmail || secondaryEmails.includes(newSecondaryEmail)) {
            alert('This communication node is already registered.');
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
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Matrix Material...</p>
            </div>
        );
    }

    const tabs = [
        { id: 'identity', label: 'Identity Sync', icon: Fingerprint, desc: 'Central metadata & communication' },
        { id: 'security', label: 'Security Key', icon: Shield, desc: 'Secret key rotation' },
        { id: 'access', label: 'Access Node', icon: UserPlus, desc: 'Register restricted sub-admins' }
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Full-Width Header Card - COMPLETE WIDTH */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[48px] p-12 md:p-20 shadow-2xl shadow-slate-200">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/10 to-transparent pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                    <div className="space-y-6 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl text-primary-400 rounded-full border border-white/10">
                            <Activity size={14} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Node v2.0</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                            Profile <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Matrix</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                            Manage your core identity nodes, synchronize communication channels, and manage cryptographic <span className="text-white font-bold">re-authentication protocols.</span>
                        </p>
                    </div>

                    <div className="shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 flex items-center justify-center relative group">
                            <Shield size={64} className="text-secondary-400 group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-slate-900">
                                <Lock size={16} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                                        Identity Metadata
                                    </h3>
                                    {updateSuccess && (
                                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase animate-bounce">
                                            <CheckCircle size={14} /> Matrix Synced
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity UID (Name)</label>
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
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Access Node (Email)</label>
                                        <div className="w-full px-8 py-5 bg-slate-100 rounded-2xl text-sm font-bold text-slate-400 border-2 border-transparent flex items-center justify-between">
                                            {email}
                                            <Lock size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 border-t border-slate-50">
                                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] block">Redundant Notification Channels (Secondary Emails)</label>
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
                                                No redundant communication nodes registered
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-4">
                                        <input
                                            type="email"
                                            value={newSecondaryEmail}
                                            onChange={(e) => setNewSecondaryEmail(e.target.value)}
                                            className="flex-1 px-8 py-5 bg-slate-50 rounded-2xl text-sm font-bold text-slate-900 border-2 border-transparent focus:bg-white focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
                                            placeholder="Register secondary node..."
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
                                    Commit Matrix Update
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
                                        Security Key Rotation
                                    </h3>
                                    <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="text-slate-500 hover:text-white transition-colors">
                                        {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Legacy Secret Key</label>
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
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">New Access Key</label>
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
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Confirm Target Parity</label>
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
                                    Execute Rotation Protocol
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
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Delegate Authority</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 italic flex items-center gap-2">
                                            <ShieldAlert size={12} className="text-amber-500" /> Granular Access Delegation Layer
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Name</label>
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
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matrix Handle (Email)</label>
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
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secret Key</label>
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
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verify Key</label>
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
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Restricted Capability Matrix</label>
                                        <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100 italic">
                                            Approval Sub-node Only
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-5 bg-white rounded-2xl border-2 border-slate-900 shadow-xl flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 text-primary-400 rounded-xl flex items-center justify-center shrink-0">
                                                <ShieldAlert size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Approval Rights</p>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 leading-tight">Verify & Approve Nodes</p>
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
                                    Synchronize Restricted Sub-Admin
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="text-center pt-12 opacity-30">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Integrated Management Protocol &copy; 2026 Admin Matrix Hub</p>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
