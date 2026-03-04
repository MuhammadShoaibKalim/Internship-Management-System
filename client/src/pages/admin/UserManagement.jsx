import React, { useState, useEffect } from 'react';
import {
    Users,
    UserCheck,
    UserX,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Shield,
    Plus,
    Download,
    Trash2,
    Edit,
    CheckCircle,
    XCircle,
    UserPlus,
    Clock,
    Sparkles,
    Loader2,
    RefreshCw,
    Lock
} from 'lucide-react';
import API from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeRoleTab, setActiveRoleTab] = useState('all');
    const [error, setError] = useState('');

    // Sub-Admin Modal State
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminFormData, setAdminFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        permissions: ['read_only']
    });
    const [creatingAdmin, setCreatingAdmin] = useState(false);

    // Permission Logic
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userPermissions = currentUser.adminMeta?.permissions || [];
    const isSuperAdmin = userPermissions.includes('all') || userPermissions.length === 0;
    const canManageUsers = isSuperAdmin || userPermissions.includes('manage_users');
    const canCreateAdmin = isSuperAdmin;

    const roles = ['all', 'student', 'industry', 'supervisor', 'admin'];

    useEffect(() => {
        fetchUsers();
    }, [activeRoleTab]); // Refetch when role tab changes

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/admin/users?role=${activeRoleTab}&search=${searchTerm}`);
            setUsers(response.data.data.users);
        } catch (err) {
            setError('Failed to fetch user registry');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleStatusUpdate = async (userId, newStatus) => {
        const targetUser = users.find(u => u._id === userId);
        if (targetUser?.role === 'admin') {
            alert('Security Protocol: Administrative accounts cannot be modified via this interface.');
            return;
        }
        try {
            await API.patch(`/admin/users/${userId}`, { status: newStatus });
            // Update local state
            setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
        } catch (err) {
            alert('Failed to update user status');
        }
    };

    const handleDelete = async (userId) => {
        const targetUser = users.find(u => u._id === userId);
        if (targetUser?.role === 'admin') {
            alert('Security Protocol: Administrative accounts cannot be purged.');
            return;
        }

        if (!window.confirm(`Are you sure you want to permanently remove ${targetUser.name} from the registry? This action is irreversible.`)) return;

        try {
            await API.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleEdit = (user) => {
        // For now, since no modal is implemented, we can show an alert or just log
        // If the user wants a full edit modal, I can implement it later.
        alert(`Configuration protocol for ${user.name} initialized. Full profile modification dashboard coming soon.`);
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setCreatingAdmin(true);
        try {
            await API.post('/admin/users/create-admin', adminFormData);
            setShowAdminModal(false);
            setAdminFormData({
                name: '',
                email: '',
                password: '',
                passwordConfirm: '',
                permissions: ['read_only']
            });
            fetchUsers();
            alert('New administrative node successfully synchronized with the global registry.');
        } catch (err) {
            alert(err.response?.data?.message || 'Administrative registration protocol failed.');
        } finally {
            setCreatingAdmin(false);
        }
    };

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        pending: users.filter(u => u.status === 'pending').length,
        inactive: users.filter(u => u.status === 'inactive').length,
    };

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Clean Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200/50">
                        <Users size={14} className="text-slate-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">Identity Registry</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            User <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-secondary-700 to-slate-500">Management</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium mt-3 max-w-2xl leading-relaxed">
                            Oversee entire academic ecosystem. Manage permissions, monitor <span className="font-bold text-slate-900 px-1">node access</span>, and ensure compliance across all user roles.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all flex items-center gap-3">
                        <Download size={16} /> Export
                    </button>
                    {canCreateAdmin && (
                        <button
                            onClick={() => setShowAdminModal(true)}
                            className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 no-underline"
                        >
                            <UserPlus size={20} className="text-primary-400" /> Register Admin
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Accounts', value: stats.total, icon: Users, color: 'text-primary-600 bg-primary-50', trend: 'Global' },
                    { label: 'Active Users', value: stats.active, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50', trend: 'Compliant' },
                    { label: 'Pending Access', value: stats.pending, icon: Clock, color: 'text-amber-600 bg-amber-50', trend: 'Awaiting' },
                    { label: 'Restricted', value: stats.inactive, icon: XCircle, color: 'text-rose-600 bg-rose-50', trend: 'Security' }
                ].map((stat, i) => (
                    <div key={i} className="portal-card p-10 flex flex-col justify-between group hover:border-slate-100 transition-all shadow-xl shadow-slate-200/50 bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform shadow-inner`}>
                                <stat.icon size={28} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter leading-none">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3 italic">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Hub */}
            <div className="flex items-center gap-4 p-2 bg-slate-100/50 rounded-3xl w-fit border border-slate-100">
                {roles.map(role => (
                    <button
                        key={role}
                        onClick={() => setActiveRoleTab(role)}
                        className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRoleTab === role
                            ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-y-[-2px]'
                            : 'text-slate-400 hover:text-slate-900 hover:bg-white'
                            }`}
                    >
                        {role}
                    </button>
                ))}
            </div>

            {/* Users Table */}
            <div className="portal-card overflow-hidden bg-white shadow-2xl shadow-slate-200/50 border-none">
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <form onSubmit={handleSearch} className="relative group w-full max-w-2xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={24} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by identity, email or department credentials..."
                            className="w-full pl-16 pr-20 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-100 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Search</button>
                    </form>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchUsers} className="p-5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Accessing Identity Registry...</p>
                        </div>
                    ) : users.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Identity Profile</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Academic Unit</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Security Role</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Compliance</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map(user => (
                                    <tr key={user._id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-900 text-primary-400 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-base font-bold text-slate-900 uppercase tracking-tight leading-none">{user.name}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Mail size={12} className="text-slate-300" />
                                                        <span className="text-[10px] text-slate-400 font-bold italic tracking-wide">{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200/50">
                                                {user.studentMeta?.department || user.supervisorMeta?.department || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                                                    user.role === 'industry' ? 'bg-amber-500' : 'bg-primary-500'
                                                    }`} />
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{user.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <StatusBadge status={user.status} />
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {user.role === 'admin' ? (
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-xl border border-slate-200 cursor-not-allowed">
                                                        <Lock size={14} className="animate-pulse" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Protected</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {canManageUsers ? (
                                                            <>
                                                                {user.status !== 'active' && (
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(user._id, 'active')}
                                                                        className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
                                                                        title="Activate"
                                                                    >
                                                                        <CheckCircle size={20} />
                                                                    </button>
                                                                )}
                                                                {user.status === 'active' && (
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(user._id, 'inactive')}
                                                                        className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                                                        title="Deactivate"
                                                                    >
                                                                        <XCircle size={20} />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleEdit(user)}
                                                                    className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                                                                >
                                                                    <Edit size={20} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(user._id)}
                                                                    className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                                                >
                                                                    <Trash2 size={20} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-300 rounded-xl border border-slate-100 italic">
                                                                <Shield size={12} />
                                                                <span className="text-[9px] font-bold uppercase tracking-widest">View Only Mode</span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
                                <Users size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase">Registry Empty</h3>
                            <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest italic">No identities found matching these parameters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sub-Admin Modal */}
            {
                showAdminModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                        <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-slide-up">
                            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">New Admin Node</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Register administrative identity with restricted access</p>
                                </div>
                                <button onClick={() => setShowAdminModal(false)} className="p-3 hover:bg-white rounded-2xl transition-all">
                                    <XCircle size={24} className="text-slate-300 hover:text-rose-500" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateAdmin} className="p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Display Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={adminFormData.name}
                                            onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm"
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Access Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={adminFormData.email}
                                            onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm"
                                            placeholder="admin@ims.edu"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Primary Key</label>
                                        <input
                                            type="password"
                                            required
                                            value={adminFormData.password}
                                            onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirm Parity</label>
                                        <input
                                            type="password"
                                            required
                                            value={adminFormData.passwordConfirm}
                                            onChange={(e) => setAdminFormData({ ...adminFormData, passwordConfirm: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] block">Access Capabilities (Permissions)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'all', label: 'Full Protocol Access', desc: 'Unlimited administrative rights' },
                                            { id: 'approve_only', label: 'Approval Sub-node', desc: 'Can only verify/approve nodes' },
                                            { id: 'read_only', label: 'Observer Node', desc: 'View-only access to registry' },
                                            { id: 'manage_users', label: 'Identity Manager', desc: 'Manage students/industry/supervisors' }
                                        ].map((perm) => (
                                            <button
                                                key={perm.id}
                                                type="button"
                                                onClick={() => {
                                                    const newPerms = adminFormData.permissions.includes(perm.id)
                                                        ? adminFormData.permissions.filter(p => p !== perm.id)
                                                        : [...adminFormData.permissions, perm.id];
                                                    setAdminFormData({ ...adminFormData, permissions: newPerms });
                                                }}
                                                className={`p-5 rounded-2xl border-2 text-left transition-all ${adminFormData.permissions.includes(perm.id)
                                                    ? 'border-slate-900 bg-slate-900 text-white shadow-xl translate-y-[-2px]'
                                                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                                                    }`}
                                            >
                                                <p className="text-[10px] font-black uppercase tracking-widest">{perm.label}</p>
                                                <p className={`text-[9px] mt-1 font-medium italic ${adminFormData.permissions.includes(perm.id) ? 'text-slate-400' : 'text-slate-300'}`}>
                                                    {perm.desc}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={creatingAdmin}
                                    className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-2xl shadow-slate-200"
                                >
                                    {creatingAdmin ? <Loader2 className="animate-spin" /> : <Shield size={20} className="text-primary-400" />}
                                    Synchronize Sub-Admin Identity
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default UserManagement;
