import React, { useState, useEffect } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';

const StudentSettings = () => {
    const navigate = useNavigate();
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
        documents: []
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
                documents: data.documents || []
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
            alert('Profile updated successfully!');
            setIsEditing(false); // Switch back to view mode on success
            setIsEditingAcademic(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (security.newPassword !== security.confirmPassword) {
            return alert('New passwords do not match!');
        }

        setSaving(true);
        try {
            await API.patch('/auth/updateMyPassword', {
                passwordCurrent: security.currentPassword,
                password: security.newPassword,
                passwordConfirm: security.confirmPassword
            });
            alert('Password updated successfully! Please login again for security purposes.');
            setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
            // Clear auth state and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/auth/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update password');
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
            alert('Document uploaded successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to upload document');
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
            alert('Document deleted successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete document');
        } finally {
            setSaving(false);
        }
    };

    const inputClasses = "w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-secondary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all duration-300";


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
                <div className="lg:col-span-9">
                    {loading ? (
                        <div className="portal-card p-20 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Accessing Student Vault...</p>
                        </div>
                    ) : (
                        <div className="portal-card overflow-hidden">
                            {activeTab === 'profile' && (
                                <form onSubmit={handleUpdateProfile} className="animate-fade-in">
                                    <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-secondary-900 uppercase tracking-tight">Identity Parameters</h2>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Primary Node Config</p>
                                            </div>
                                        </div>
                                        {isEditing ? (
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        fetchProfile(); // Reset to original data
                                                    }}
                                                    className="px-6 py-3 border border-slate-200 text-slate-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="btn-primary px-6 py-3 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                                >
                                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                    Save Changes
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="px-6 py-3 bg-white border-2 border-primary-100 text-primary-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center gap-2 shadow-sm"
                                            >
                                                <User size={16} />
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-8 space-y-8">
                                        {/* Personal Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                                                    <input
                                                        type="text"
                                                        disabled
                                                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 outline-none"
                                                        value={student.name}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Electronic Mail</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                                                    <input
                                                        type="email"
                                                        disabled
                                                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 outline-none"
                                                        value={student.email}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Contact</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                                                    <input
                                                        type="tel"
                                                        disabled={!isEditing}
                                                        className={`w-full pl-12 pr-5 py-4 border rounded-2xl text-sm font-bold outline-none transition-all ${isEditing
                                                            ? 'bg-white border-slate-200 text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500'
                                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                                            }`}
                                                        value={student.phone}
                                                        onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Academic Details */}
                                        <div className="pt-8 border-t border-slate-50">
                                            <h3 className="text-sm font-black text-secondary-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <GraduationCap size={18} className="text-primary-600" />
                                                Academic Credentials
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Roll/ID Number</label>
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold outline-none transition-all ${isEditing
                                                            ? 'bg-white border-slate-200 text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500'
                                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                                            }`}
                                                        value={student.rollNumber}
                                                        onChange={(e) => setStudent({ ...student, rollNumber: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2 lg:col-span-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</label>
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold outline-none transition-all ${isEditing
                                                            ? 'bg-white border-slate-200 text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500'
                                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                                            }`}
                                                        value={student.department}
                                                        onChange={(e) => setStudent({ ...student, department: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Semester</label>
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold outline-none transition-all ${isEditing
                                                            ? 'bg-white border-slate-200 text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500'
                                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                                            }`}
                                                        value={student.semester}
                                                        onChange={(e) => setStudent({ ...student, semester: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">CGPA</label>
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold outline-none transition-all ${isEditing
                                                            ? 'bg-white border-slate-200 text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500'
                                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                                            }`}
                                                        value={student.cgpa}
                                                        onChange={(e) => setStudent({ ...student, cgpa: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2 lg:col-span-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">University</label>
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold outline-none transition-all ${isEditing
                                                            ? 'bg-white border-slate-200 text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500'
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

                            {activeTab === 'academic' && (
                                <form onSubmit={handleUpdateProfile} className="animate-fade-in">
                                    <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                                                <GraduationCap size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-secondary-900 uppercase tracking-tight">Academic Details</h2>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">University Sync</p>
                                            </div>
                                        </div>
                                        {isEditingAcademic ? (
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditingAcademic(false);
                                                        fetchProfile(); // Reset to original data
                                                    }}
                                                    className="px-6 py-3 border border-slate-200 text-slate-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="btn-primary px-6 py-3 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                                >
                                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                    Save Changes
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingAcademic(true)}
                                                className="px-6 py-3 bg-white border-2 border-primary-100 text-primary-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center gap-2 shadow-sm"
                                            >
                                                <BookOpen size={16} />
                                                Edit Academic
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-8">
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                                                <Verified size={24} />
                                            </div>
                                            <p className="text-xs font-bold text-slate-500 italic">Academic parameters are integrated directly with global portal endpoints.</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Roll/ID Number</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditingAcademic}
                                                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold outline-none transition-all ${isEditingAcademic
                                                        ? 'bg-white border-slate-200 text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500'
                                                        : 'bg-slate-50 border-slate-100 text-slate-400'
                                                        }`}
                                                    value={student.rollNumber}
                                                    onChange={(e) => setStudent({ ...student, rollNumber: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2 lg:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditingAcademic}
                                                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold outline-none transition-all ${isEditingAcademic
                                                        ? 'bg-white border-slate-200 text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500'
                                                        : 'bg-slate-50 border-slate-100 text-slate-400'
                                                        }`}
                                                    value={student.department}
                                                    onChange={(e) => setStudent({ ...student, department: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Semester</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditingAcademic}
                                                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold outline-none transition-all ${isEditingAcademic
                                                        ? 'bg-white border-slate-200 text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500'
                                                        : 'bg-slate-50 border-slate-100 text-slate-400'
                                                        }`}
                                                    value={student.semester}
                                                    onChange={(e) => setStudent({ ...student, semester: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">CGPA</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditingAcademic}
                                                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold outline-none transition-all ${isEditingAcademic
                                                        ? 'bg-white border-slate-200 text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500'
                                                        : 'bg-slate-50 border-slate-100 text-slate-400'
                                                        }`}
                                                    value={student.cgpa}
                                                    onChange={(e) => setStudent({ ...student, cgpa: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2 lg:col-span-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">University</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditingAcademic}
                                                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold outline-none transition-all ${isEditingAcademic
                                                        ? 'bg-white border-slate-200 text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500'
                                                        : 'bg-slate-50 border-slate-100 text-slate-400'
                                                        }`}
                                                    value={student.university}
                                                    onChange={(e) => setStudent({ ...student, university: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'documents' && (
                                <div className="p-10 space-y-6 animate-fade-in">
                                    <div className="p-8 bg-secondary-900 text-white rounded-[2.5rem] border-none overflow-hidden relative group">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 text-center md:text-left">
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black tracking-tight">Security Vault</h3>
                                                <p className="text-slate-400 font-medium text-sm italic">Manage high-fidelity verified documents.</p>
                                            </div>
                                            <label className="btn-primary py-4 px-10 text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer">
                                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                                                {saving ? 'Uploading...' : 'Add Document'}
                                                <input type="file" hidden onChange={handleUploadDocument} disabled={saving} accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
                                            </label>
                                        </div>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                    </div>

                                    {/* Downloadable Documents */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                        {student.cvUrl && (
                                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary-200 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-secondary-900">Curriculum Vitae</h4>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-1">Verified Upload</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <a href={student.cvUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-primary-600 rounded-xl hover:bg-primary-50 transition-colors shadow-sm" title="Download CV">
                                                        <Download size={16} />
                                                    </a>
                                                    <button 
                                                        type="button"
                                                        onClick={async () => {
                                                            if(window.confirm('Are you sure you want to remove your CV?')) {
                                                                try {
                                                                    setSaving(true);
                                                                    await API.patch('/student/update-profile', { cvUrl: null });
                                                                    setStudent({ ...student, cvUrl: '' });
                                                                    alert('CV removed successfully');
                                                                } catch (err) {
                                                                    alert('Failed to remove CV');
                                                                } finally {
                                                                    setSaving(false);
                                                                }
                                                            }
                                                        }} 
                                                        className="p-3 bg-white text-rose-500 rounded-xl hover:bg-rose-50 transition-colors shadow-sm"
                                                        title="Remove CV"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {certificates.map((cert) => (
                                            <div key={cert._id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary-200 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                                                        <Award size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-secondary-900 truncate max-w-[150px]">
                                                            {cert.internship?.title || 'Internship'} Certificate
                                                        </h4>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-1">Completed</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <a href={cert.certificate?.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-primary-600 rounded-xl hover:bg-primary-50 transition-colors shadow-sm" title="Download Certificate">
                                                        <Download size={16} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                        {student.documents?.map((doc) => (
                                            <div key={doc._id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary-200 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-secondary-900 truncate max-w-[150px]" title={doc.name}>
                                                            {doc.name}
                                                        </h4>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setPreviewDoc({ name: doc.name, url: doc.url })}
                                                        className="p-3 bg-white text-indigo-500 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
                                                        title="Preview"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-primary-600 rounded-xl hover:bg-primary-50 transition-colors shadow-sm">
                                                        <Download size={16} />
                                                    </a>
                                                    <button onClick={() => handleDeleteDocument(doc._id)} className="p-3 bg-white text-rose-500 rounded-xl hover:bg-rose-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100 disabled:opacity-50" disabled={saving}>
                                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {!student.cvUrl && certificates.length === 0 && (!student.documents || student.documents.length === 0) && (
                                        <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-sm font-bold text-slate-400 italic">No verified documents found.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <form onSubmit={handleUpdatePassword} className="p-10 space-y-10 animate-fade-in">
                                    <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                                            <Shield size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-secondary-900 tracking-tight">Security Credentials</h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Manage Password</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 max-w-lg">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                                                <input
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    required
                                                    className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all"
                                                    value={security.currentPassword}
                                                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                >
                                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    required
                                                    className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all"
                                                    value={security.newPassword}
                                                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirm New Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    required
                                                    className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all"
                                                    value={security.confirmPassword}
                                                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                                            Update Security Credentials
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Document Preview Modal */}
            {previewDoc && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={() => setPreviewDoc(null)}
                >
                    <div
                        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-secondary-900 truncate max-w-[400px]">{previewDoc.name}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Document Preview</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={previewDoc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-700 transition-colors"
                                >
                                    <Download size={14} /> Download
                                </a>
                                <button
                                    onClick={() => setPreviewDoc(null)}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="bg-slate-200 flex-1 relative min-h-[70vh] flex items-center justify-center">
                             <iframe
                                src={previewDoc.url}
                                title={previewDoc.name}
                                className="w-full h-full border-none absolute inset-0 bg-white"
                                style={{ display: 'block' }}
                                key={previewDoc.url}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentSettings;

