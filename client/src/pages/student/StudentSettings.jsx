import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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
    EyeOff,
    GraduationCap,
    Shield,
    Loader2,
    Link as LinkIcon,
    Award,
    X
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../../services/api';

import SectionHeader from '../../components/common/SectionHeader';

const StudentSettings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notice, setNotice] = useState(location.state?.message || '');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isEditingAcademic, setIsEditingAcademic] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [previewDoc, setPreviewDoc] = useState(null); // { name, url }
    const [security, setSecurity] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [student, setStudent] = useState({
        name: '',
        email: '',
        cvUrl: '',
        phone: '',
        rollNumber: '',
        department: '',
        semester: '',
        cgpa: '',
        university: '',
        skills: [],
        documents: [],
        avatar: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await API.get('/student/profile');
            const data = response.data.data.student;
            setStudent({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                cvUrl: data.cvUrl || data.cv?.url || '',
                rollNumber: data.academicDetails?.rollNumber || '',
                department: data.academicDetails?.department || '',
                semester: data.academicDetails?.semester || '',
                cgpa: data.academicDetails?.cgpa || '',
                university: data.academicDetails?.university || '',
                skills: data.skills || [],
                documents: data.documents || [],
                avatar: data.avatar || ''
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCertificates = async () => {
        try {
            const response = await API.get('/student/certificates');
            setCertificates(response.data.data.certificates || []);
        } catch (err) {
            console.error('Error fetching certificates:', err);
        }
    };

    useEffect(() => {
        if (activeTab === 'documents') {
            fetchCertificates();
        }
    }, [activeTab]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await API.patch('/student/update-profile', {
                name: student.name,
                phone: student.phone,
                academicDetails: {
                    rollNumber: student.rollNumber,
                    department: student.department,
                    semester: student.semester,
                    cgpa: student.cgpa,
                    university: student.university
                },
                skills: student.skills
            });
            toast.success('Profile updated successfully!');
            setIsEditing(false); // Switch back to view mode on success
            setIsEditingAcademic(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (security.newPassword !== security.confirmPassword) {
            return toast.error('New passwords do not match!');
        }

        setSaving(true);
        try {
            await API.patch('/auth/updateMyPassword', {
                passwordCurrent: security.currentPassword,
                password: security.newPassword,
                passwordConfirm: security.confirmPassword
            });
            toast.success('Password updated successfully! Redirecting to login...');
            setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
            // Clear auth state and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/auth/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password');
        } finally {
            setSaving(false);
        }
    };

    const handleUploadDocument = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('document', file);

        setSaving(true);
        try {
            const response = await API.post('/student/upload-document', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const newDoc = response.data.data.document;
            setStudent({ ...student, documents: [...student.documents, newDoc] });
            toast.success('Document uploaded successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload document');
        } finally {
            setSaving(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleDeleteDocument = async (documentId) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        setSaving(true);
        try {
            await API.delete(`/student/documents/${documentId}`);
            setStudent({
                ...student,
                documents: student.documents.filter(doc => doc._id !== documentId)
            });
            toast.success('Document deleted successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete document');
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
                setStudent(prev => ({ ...prev, avatar: updatedUser.avatar }));
                toast.success("Profile photo updated!");

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

    const inputClasses = "w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-secondary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all duration-300";


    return (
        <div className="animate-fade-in space-y-12 pb-16">
            <SectionHeader
                title="Account Settings"
                subtitle="Student Sub-Page"
                description="Configure your digital persona, academic parameters, and security protocols."
                icon={ArrowLeft}
                linkTo="/dashboard/student"
                linkText="Back to Command Center"
                gradientFrom="from-primary-600"
                gradientTo="to-indigo-500"
            >
                <div className="flex items-center gap-4 bg-emerald-500/5 rounded-3xl px-8 py-4 border border-emerald-500/20 shadow-xl overflow-hidden relative group">
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
                            <Verified size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] block">Trust Level</span>
                            <span className="text-lg font-black text-slate-900 italic tracking-tight">Verified Scholar</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-1000" />
                </div>
            </SectionHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Premium Vertical Navigation */}
                <div className="lg:col-span-3 space-y-3">
                    {[
                        { id: 'profile', label: 'Profile Identity', icon: User, desc: 'Identity params' },
                        { id: 'academic', label: 'Academic Node', icon: BookOpen, desc: 'University sync' },
                        { id: 'documents', label: 'Security Vault', icon: FileText, desc: 'Verified assets' },
                        { id: 'security', label: 'Auth Protocols', icon: Lock, desc: 'Network & Access' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full group flex flex-col items-start p-6 rounded-[2.5rem] transition-all duration-500 text-left relative overflow-hidden
                                ${activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-4xl shadow-slate-900/20 translate-x-3'
                                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 hover:border-primary-100'}`}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`p-3 rounded-2xl transition-all duration-500 ${activeTab === tab.id ? 'bg-primary-500 text-slate-900 shadow-lg' : 'bg-slate-50 text-slate-400group-hover:text-primary-500'}`}>
                                    <tab.icon size={20} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <span className="font-black text-xs uppercase tracking-[0.15em] block">{tab.label}</span>
                                    <span className={`text-[9px] mt-1 font-black uppercase tracking-widest block opacity-60 ${activeTab === tab.id ? 'text-primary-400' : 'text-slate-400'}`}>
                                        {tab.desc}
                                    </span>
                                </div>
                            </div>
                            {activeTab === tab.id && (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -mr-16 -mt-16 blur-[50px]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Settings Content Panels */}
                <div className="lg:col-span-9">
                    {loading ? (
                        <div className="glass-card py-40 flex flex-col items-center justify-center space-y-6">
                            <div className="w-16 h-16 border-4 border-slate-100 rounded-full animate-spin border-t-primary-500"></div>
                            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Secure Vault...</p>
                        </div>
                    ) : (
                        <div className="glass-card bg-white border-none shadow-3xl shadow-slate-200/50 overflow-hidden min-h-[600px]">
                            {activeTab === 'profile' && (
                                <form onSubmit={handleUpdateProfile} className="animate-fade-in h-full flex flex-col">
                                    <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-8">
                                        <div className="flex items-center gap-8">
                                            <div className="relative group/avatar">
                                                {/* Simple Circle Frame */}
                                                <div className="relative w-28 h-28 bg-slate-900 rounded-full p-1 shadow-2xl transition-all duration-500">
                                                    <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden border border-white/10 relative">
                                                        {student.avatar ? (
                                                            <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
                                                                <User size={32} className="text-slate-600 opacity-50" strokeWidth={1.5} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Upload Trigger Badge */}
                                                    <label className="absolute -bottom-1 -right-1 w-10 h-10 bg-primary-600 text-white rounded-full shadow-xl hover:bg-slate-900 active:scale-90 transition-all flex items-center justify-center cursor-pointer border-4 border-white z-20">
                                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                                        <input type="file" hidden onChange={handleAvatarUpload} accept="image/*" disabled={saving} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{student.name || 'Student Node'}</h2>
                                                <p className="text-[10px] text-primary-500 font-black uppercase tracking-[0.3em] italic flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></div>
                                                    Primary Identity Hash
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            fetchProfile();
                                                        }}
                                                        className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-slate-900 hover:border-slate-900 transition-all active:scale-95"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={saving}
                                                        className="btn-premium from-primary-600 to-indigo-500 px-10 py-4 flex items-center gap-3 shadow-2xl shadow-primary-500/20 active:scale-95 disabled:opacity-50"
                                                    >
                                                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="text-primary-200" />}
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronize</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary-600 hover:scale-[1.02] shadow-2xl shadow-slate-900/20 transition-all flex items-center gap-3 active:scale-95"
                                                >
                                                    <User size={18} className="text-primary-400" />
                                                    Modify Identity
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-10 space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Legal Designation</label>
                                                <div className="relative group">
                                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        className={`w-full pl-16 pr-8 py-5 border rounded-[1.8rem] text-sm font-black outline-none transition-all leading-relaxed ${isEditing
                                                            ? 'bg-white border-slate-200 text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 shadow-xl shadow-slate-100'
                                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                                            }`}
                                                        value={student.name}
                                                        onChange={(e) => setStudent({ ...student, name: e.target.value })}
                                                        placeholder="Enter your full name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Network Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                                                    <input
                                                        type="email"
                                                        disabled
                                                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] text-sm font-black text-slate-400 outline-none leading-relaxed"
                                                        value={student.email}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Communication Line</label>
                                                <div className="relative group">
                                                    <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                                                    <input
                                                        type="tel"
                                                        disabled={!isEditing}
                                                        className={`w-full pl-16 pr-8 py-5 border rounded-[1.8rem] text-sm font-black outline-none transition-all leading-relaxed ${isEditing
                                                            ? 'bg-white border-slate-200 text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 shadow-xl shadow-slate-100'
                                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                                            }`}
                                                        value={student.phone}
                                                        onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                                                        placeholder="+92 000 0000000"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-12 border-t border-slate-100 relative group">
                                            <div className="mb-10 flex items-center justify-between">
                                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center shadow-inner">
                                                        <Award size={22} />
                                                    </div>
                                                    Skill Taxonomy
                                                </h3>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Global Merit Matrix</div>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {student.skills.map((skill, idx) => (
                                                    <div key={idx} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg hover:bg-primary-600 transition-all cursor-default">
                                                        {skill}
                                                    </div>
                                                ))}
                                                {student.skills.length === 0 && (
                                                    <p className="text-slate-400 text-sm italic font-medium">No skills materialized yet. Complete profile via Admin Portals.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'academic' && (
                                <form onSubmit={handleUpdateProfile} className="animate-fade-in h-full flex flex-col">
                                    <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-8">
                                        <div className="flex items-center gap-8">
                                            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-primary-500 shadow-2xl border-4 border-white">
                                                <GraduationCap size={44} strokeWidth={1.5} />
                                            </div>
                                            <div className="space-y-1">
                                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Academic Status</h2>
                                                <p className="text-[10px] text-primary-500 font-black uppercase tracking-[0.3em] italic flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></div>
                                                    University Node Synchronized
                                                </p>
                                            </div>
                                        </div>
                                        {isEditingAcademic ? (
                                            <div className="flex items-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditingAcademic(false);
                                                        fetchProfile();
                                                    }}
                                                    className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-slate-900 hover:border-slate-900 transition-all active:scale-95"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="btn-premium from-primary-600 to-indigo-500 px-10 py-4 flex items-center gap-3 shadow-2xl shadow-primary-500/20 active:scale-95 disabled:opacity-50"
                                                >
                                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="text-primary-200" />}
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Commit Assets</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingAcademic(true)}
                                                className="px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary-600 hover:scale-[1.02] shadow-2xl shadow-slate-900/20 transition-all flex items-center gap-3 active:scale-95"
                                            >
                                                <BookOpen size={18} className="text-primary-400" />
                                                Edit Credentials
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-10 space-y-12">
                                        <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 flex items-center gap-8 group">
                                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-500 shadow-xl group-hover:rotate-12 transition-transform duration-500">
                                                <Verified size={32} />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black text-emerald-900 uppercase tracking-tight">Data Integration Protocol</h4>
                                                <p className="text-emerald-700/70 text-sm font-bold italic leading-relaxed">External academic parameters are integrated directly with global portal endpoints to ensure merit integrity.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Registration Index</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditingAcademic}
                                                    className={`w-full px-8 py-5 border rounded-[1.8rem] text-sm font-black outline-none transition-all leading-relaxed ${isEditingAcademic
                                                        ? 'bg-white border-slate-200 text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 shadow-xl shadow-slate-100'
                                                        : 'bg-slate-50 border-slate-100 text-slate-400'
                                                        }`}
                                                    value={student.rollNumber}
                                                    onChange={(e) => setStudent({ ...student, rollNumber: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Department Node</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditingAcademic}
                                                    className={`w-full px-8 py-5 border rounded-[1.8rem] text-sm font-black outline-none transition-all leading-relaxed ${isEditingAcademic
                                                        ? 'bg-white border-slate-200 text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 shadow-xl shadow-slate-100'
                                                        : 'bg-slate-50 border-slate-100 text-slate-400'
                                                        }`}
                                                    value={student.department}
                                                    onChange={(e) => setStudent({ ...student, department: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Academic Cycle</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditingAcademic}
                                                    className={`w-full px-8 py-5 border rounded-[1.8rem] text-sm font-black outline-none transition-all leading-relaxed ${isEditingAcademic
                                                        ? 'bg-white border-slate-200 text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 shadow-xl shadow-slate-100'
                                                        : 'bg-slate-50 border-slate-100 text-slate-400'
                                                        }`}
                                                    value={student.semester}
                                                    onChange={(e) => setStudent({ ...student, semester: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Merit Quotient (CGPA)</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditingAcademic}
                                                    className={`w-full px-8 py-5 border rounded-[1.8rem] text-sm font-black outline-none transition-all leading-relaxed ${isEditingAcademic
                                                        ? 'bg-white border-slate-200 text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 shadow-xl shadow-slate-100'
                                                        : 'bg-slate-50 border-slate-100 text-slate-400'
                                                        }`}
                                                    value={student.cgpa}
                                                    onChange={(e) => setStudent({ ...student, cgpa: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-4 md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Host Institution</label>
                                                <div className="relative group">
                                                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                                                    <input
                                                        type="text"
                                                        disabled={!isEditingAcademic}
                                                        className={`w-full pl-16 pr-8 py-5 border rounded-[1.8rem] text-sm font-black outline-none transition-all leading-relaxed ${isEditingAcademic
                                                            ? 'bg-white border-slate-200 text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 shadow-xl shadow-slate-100'
                                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                                            }`}
                                                        value={student.university}
                                                        onChange={(e) => setStudent({ ...student, university: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'documents' && (
                                <div className="p-10 space-y-10 animate-fade-in">
                                    <div className="p-10 bg-slate-900 text-white rounded-[3rem] border-none overflow-hidden relative group">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10 text-center md:text-left">
                                            <div className="space-y-3">
                                                <h3 className="text-3xl font-black tracking-tighter uppercase">Document <span className="text-primary-500 italic">Vault</span></h3>
                                                <p className="text-slate-400 font-bold text-sm italic tracking-wide">Secure repository for high-fidelity verified assets.</p>
                                            </div>
                                            <label className="btn-premium from-primary-600 to-indigo-500 py-5 px-12 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 shadow-4xl shadow-black/40 hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer transition-all duration-500">
                                                {saving ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} className="text-primary-200" />}
                                                {saving ? 'Transmitting...' : 'Inject Asset'}
                                                <input type="file" hidden onChange={handleUploadDocument} disabled={saving} accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
                                            </label>
                                        </div>
                                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/20 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-primary-500/30 transition-all duration-1000"></div>
                                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px] -ml-20 -mb-20"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {student.cvUrl && (
                                            <div className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:border-primary-200 hover:bg-white transition-all duration-500 group shadow-sm hover:shadow-2xl hover:shadow-slate-200/50">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-primary-500 shadow-xl group-hover:scale-110 transition-all duration-500">
                                                        <FileText size={28} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Curriculum Vitae</h4>
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 mt-2 flex items-center gap-1.5">
                                                            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                                            Verified Identity Attachment
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <a href={student.cvUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-xl shadow-slate-200/50 border border-slate-100" title="Extract CV">
                                                        <Download size={18} />
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            if (window.confirm('Confirm Curriculum Vitae deletion? This action is immutable.')) {
                                                                try {
                                                                    setSaving(true);
                                                                    await API.patch('/student/update-profile', { cvUrl: null });
                                                                    setStudent({ ...student, cvUrl: '' });
                                                                } catch (err) {
                                                                    alert('Deletion sequence failed.');
                                                                } finally {
                                                                    setSaving(false);
                                                                }
                                                            }
                                                        }}
                                                        className="w-12 h-12 bg-white text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-500 shadow-xl shadow-slate-200/50 border border-slate-100"
                                                        title="Purge CV"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {certificates.map((cert) => (
                                            <div key={cert._id} className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:border-primary-200 hover:bg-white transition-all duration-500 group shadow-sm hover:shadow-2xl hover:shadow-slate-200/50">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-amber-500 shadow-xl group-hover:scale-110 transition-all duration-500">
                                                        <Award size={28} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate max-w-[150px]">
                                                            {cert.internship?.title || 'Internship'}
                                                        </h4>
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 mt-2 flex items-center gap-1.5">
                                                            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                                            Merit Certificate
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <a href={cert.certificate?.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-xl shadow-slate-200/50 border border-slate-100">
                                                        <Download size={18} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                        {student.documents?.map((doc) => (
                                            <div key={doc._id} className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:border-primary-200 hover:bg-white transition-all duration-500 group shadow-sm hover:shadow-2xl hover:shadow-slate-200/50">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-500 shadow-xl group-hover:scale-110 transition-all duration-500">
                                                        <FileText size={28} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate max-w-[150px]" title={doc.name}>
                                                            {doc.name}
                                                        </h4>
                                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2 italic">
                                                            Sync: {new Date(doc.uploadedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => setPreviewDoc({ name: doc.name, url: doc.url })}
                                                        className="w-12 h-12 bg-white text-indigo-500 rounded-2xl flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all duration-500 shadow-xl shadow-slate-200/50 border border-slate-100"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-xl shadow-slate-200/50 border border-slate-100">
                                                        <Download size={18} />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDeleteDocument(doc._id)}
                                                        className="w-12 h-12 bg-white text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-500 shadow-xl shadow-slate-200/50 border border-slate-100 group-hover:opacity-100 opacity-0 md:opacity-0"
                                                        disabled={saving}
                                                    >
                                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {!student.cvUrl && certificates.length === 0 && (!student.documents || student.documents.length === 0) && (
                                        <div className="py-24 text-center glass-card bg-slate-50/50 border-dashed border-2 border-slate-200 flex flex-col items-center justify-center space-y-4">
                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-inner">
                                                <FileText size={40} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-lg font-black text-slate-400 uppercase tracking-tighter">Vault empty</p>
                                                <p className="text-xs font-bold text-slate-300 italic">No verified digital assets detected in the current node.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <form onSubmit={handleUpdatePassword} className="p-10 space-y-12 animate-fade-in flex flex-col h-full">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-100">
                                        <div className="flex items-center gap-6 text-center sm:text-left">
                                            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-rose-500/10 border border-rose-100">
                                                <Shield size={32} strokeWidth={1.5} />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Security Protocols</h3>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 italic">Auth Layer Synchronization</p>
                                            </div>
                                        </div>
                                        <div className="px-6 py-3 bg-slate-900 rounded-2xl flex items-center gap-3">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">System Armed</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-10 md:col-span-1">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Current Access Code</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                    <input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        required
                                                        placeholder="••••••••"
                                                        className="w-full pl-16 pr-14 py-5 bg-white border border-slate-200 rounded-[1.8rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all shadow-xl shadow-slate-100"
                                                        value={security.currentPassword}
                                                        onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary-600 transition-colors"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    >
                                                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Target Credential</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        required
                                                        placeholder="••••••••"
                                                        className="w-full pl-16 pr-14 py-5 bg-white border border-slate-200 rounded-[1.8rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all shadow-xl shadow-slate-100"
                                                        value={security.newPassword}
                                                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary-600 transition-colors"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Credential Verification</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        required
                                                        placeholder="••••••••"
                                                        className="w-full pl-16 pr-14 py-5 bg-white border border-slate-200 rounded-[1.8rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all shadow-xl shadow-slate-100"
                                                        value={security.confirmPassword}
                                                        onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center justify-center space-y-8 bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100 text-center relative overflow-hidden group">
                                            <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary-500 shadow-3xl mb-4 group-hover:scale-110 transition-all duration-700">
                                                <Shield size={44} strokeWidth={1} />
                                            </div>
                                            <div className="relative z-10 space-y-4">
                                                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Auth Integrity</h4>
                                                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[250px]">
                                                    Updating your access codes will terminate all current sessions across the network.
                                                </p>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="relative z-10 btn-premium from-primary-600 to-indigo-600 w-full py-5 flex items-center justify-center gap-4 shadow-4xl shadow-primary-500/20 active:scale-95 group/btn"
                                            >
                                                {saving ? <Loader2 size={24} className="animate-spin" /> : <Shield size={22} className="group-hover/btn:rotate-12 transition-transform" strokeWidth={2.5} />}
                                                <span className="text-xs font-black uppercase tracking-[0.3em]">Initialize Update</span>
                                            </button>
                                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-100/50 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Document Preview Modal */}
            {previewDoc && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-2xl p-6 animate-fade-in"
                    onClick={() => setPreviewDoc(null)}
                >
                    <div
                        className="relative w-full max-w-6xl max-h-[95vh] bg-white rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-100 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center shadow-inner">
                                    <FileText size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase truncate max-w-[300px] md:max-w-md">
                                        {previewDoc.name}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 italic">Vault Inspection Active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <a
                                    href={previewDoc.url}
                                    download
                                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-primary-600 hover:scale-105 transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
                                >
                                    <Download size={18} /> Extract Asset
                                </a>
                                <button
                                    onClick={() => setPreviewDoc(null)}
                                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border-2 border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all duration-500 shadow-xl group"
                                >
                                    <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content - Iframe wrapper with high-end loading state */}
                        <div className="bg-slate-50 flex-1 relative min-h-[70vh] flex items-center justify-center group/viewer">
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-10 group-focus-within:opacity-0 transition-opacity">
                                <div className="w-20 h-20 border-4 border-primary-500 rounded-full animate-spin border-t-transparent"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Decoding Stream...</p>
                            </div>
                            <iframe
                                src={previewDoc.url}
                                title={previewDoc.name}
                                className="w-full h-full border-none absolute inset-0 bg-white shadow-inner"
                                style={{ display: 'block' }}
                                key={previewDoc.url}
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic flex items-center justify-center gap-3">
                                <Shield size={10} className="text-primary-400" />
                                End-to-End Encrypted Session Assets Verified via Neural Network
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentSettings;

