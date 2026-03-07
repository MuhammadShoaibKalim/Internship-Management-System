import React, { useState, useEffect } from "react";
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
    EyeOff,
    Loader2,
    GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { toast } from "react-hot-toast";
import SectionHeader from "../../components/common/SectionHeader";

const SupervisorSettings = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        specialization: "",
        avatar: ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await API.get("/users/me");
            if (response.data.status === "success") {
                const user = response.data.data.user;
                setUserData({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    department: user.supervisorMeta?.department || "",
                    specialization: user.supervisorMeta?.specialization || "",
                    avatar: user.avatar || ""
                });
            }
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            toast.error("Failed to load profile data.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            const updatePayload = {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                supervisorMeta: {
                    department: userData.department,
                    specialization: userData.specialization
                }
            };
            const response = await API.patch("/users/updateMe", updatePayload);
            if (response.data.status === "success") {
                toast.success("Profile Updated!");
                setIsEditing(false); // Switch back to view mode
                // Update local storage if needed
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...storedUser, ...response.data.data.user }));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Profile update failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Security mismatch: Passwords do not correlate.");
        }
        try {
            setLoading(true);
            const response = await API.patch("/users/updateMyPassword", {
                passwordCurrent: passwordData.currentPassword,
                password: passwordData.newPassword,
                passwordConfirm: passwordData.confirmPassword
            });
            if (response.data.status === "success") {
                toast.success("Security Credentials Updated!");
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Authentication update failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setLoading(true);
            const response = await API.post("/users/upload-avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.status === "success") {
                const updatedUser = response.data.data.user;
                setUserData(prev => ({ ...prev, avatar: updatedUser.avatar }));
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
            setLoading(false);
        }
    };

    const inputClasses = "w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-secondary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all duration-300";

    return (
        <div className="animate-fade-in space-y-8 pb-12">
            <SectionHeader
                title="Account Settings"
                subtitle="Supervisor Sub-Page"
                description="Manage your profile and account security."
                icon={ArrowLeft}
                linkTo="/dashboard/supervisor"
                linkText="Back to Dashboard"
                gradientFrom="from-primary-600"
                gradientTo="to-indigo-600"
            >
                <div className="px-6 py-3 bg-slate-900 text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl border border-slate-800 flex items-center gap-3 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                    <Verified size={16} className="text-emerald-400 animate-pulse" /> Verified Supervisor
                </div>
            </SectionHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-3 space-y-6">
                    {[
                        { id: "profile", label: "Profile Info", icon: User, desc: "Personal Details" },
                        { id: "security", label: "Security", icon: Lock, desc: "Password Management" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full group flex flex-col items-start p-8 rounded-[3rem] transition-all duration-700 text-left border-none relative overflow-hidden active:scale-95
                                ${activeTab === tab.id
                                    ? "bg-slate-900 text-white shadow-4xl shadow-slate-900/20"
                                    : "bg-white/60 text-slate-500 hover:bg-white border border-slate-100 shadow-sm"}`}
                        >
                            {activeTab === tab.id && (
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
                            )}
                            <div className="flex items-center gap-5 relative z-10">
                                <div className={`p-4 rounded-2xl transition-all duration-500 ${activeTab === tab.id ? "bg-primary-500 text-white rotate-12" : "bg-slate-100 text-slate-400 group-hover:rotate-12"}`}>
                                    <tab.icon size={20} />
                                </div>
                                <div className="space-y-1">
                                    <span className="font-black text-xs uppercase tracking-[0.2em] italic">{tab.label}</span>
                                    <p className={`text-[9px] font-black uppercase tracking-widest opacity-60 italic ${activeTab === tab.id ? 'text-primary-200' : 'text-slate-400'}`}>
                                        {tab.desc}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-9 space-y-8">
                    {activeTab === "profile" && (
                        <div className="glass-card p-12 bg-white/60 border-slate-100 shadow-sm transition-all duration-700 hover:shadow-4xl hover:shadow-primary-500/10 rounded-[4rem] group overflow-hidden relative animate-fade-in active:scale-[0.995]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary-500/10 transition-all duration-1000"></div>

                            <div className="flex flex-col md:flex-row items-center justify-between pb-12 border-b border-slate-100 gap-10 relative z-10">
                                <div className="flex flex-col md:flex-row items-center gap-10">
                                    <div className="relative group/avatar">
                                        {/* Simple Circle Frame */}
                                        <div className="relative w-28 h-28 bg-slate-900 rounded-full p-1 shadow-2xl transition-all duration-500">
                                            <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden border border-white/10 relative">
                                                {userData.avatar ? (
                                                    <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover/avatar:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
                                                        <span className="text-3xl font-black italic text-white/20 uppercase">{userData.name?.charAt(0) || 'S'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Upload Trigger Badge */}
                                            <label className="absolute -bottom-1 -right-1 w-10 h-10 bg-primary-600 text-white rounded-full shadow-xl hover:bg-slate-900 active:scale-90 transition-all flex items-center justify-center cursor-pointer border-4 border-white z-20 group/cam duration-500">
                                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} className="group-hover/cam:rotate-12 transition-transform duration-500" />}
                                                <input type="file" hidden onChange={handleAvatarUpload} accept="image/*" disabled={loading} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left space-y-3">
                                        <h3 className="text-4xl font-black text-slate-900 leading-none uppercase tracking-tighter italic">{userData.name || "Loading Profile..."}</h3>
                                        <div className="flex items-center gap-4 justify-center md:justify-start">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic flex items-center gap-3">
                                                <Briefcase size={16} className="text-primary-500" /> Faculty Supervisor
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {isEditing ? (
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    fetchProfile();
                                                }}
                                                className="px-8 py-5 border-2 border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-slate-50 transition-all active:scale-95"
                                            >
                                                Abort
                                            </button>
                                            <button
                                                onClick={handleUpdateProfile}
                                                disabled={loading}
                                                className="btn-premium py-5 px-10 text-[10px] font-black uppercase tracking-[0.3em] italic flex items-center gap-4 shadow-4xl shadow-primary-500/20 active:scale-95 disabled:opacity-50"
                                            >
                                                {loading ? <Loader2 size={18} className="animate-spin text-primary-200" /> : <Save size={18} className="text-primary-200" />}
                                                Save Profile
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-10 py-5 bg-slate-900 text-primary-400 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic flex items-center gap-4 hover:bg-slate-800 transition-all shadow-4xl shadow-slate-900/20 active:scale-95"
                                        >
                                            <User size={18} className="text-primary-400" />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pt-12 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Full Name</label>
                                    <div className="relative group/input">
                                        <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors z-10" />
                                        <input
                                            type="text"
                                            placeholder="Enter Full Name"
                                            value={userData.name}
                                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                            disabled={!isEditing}
                                            className={`${inputClasses} pl-16 py-5 ${!isEditing ? 'bg-slate-50/30 cursor-not-allowed opacity-50 border-transparent shadow-none' : 'bg-white/40 shadow-inner'}`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Email Address</label>
                                    <div className="relative group/input">
                                        <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors z-10" />
                                        <input
                                            type="email"
                                            placeholder="Enter Email Address"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            disabled={!isEditing}
                                            className={`${inputClasses} pl-16 py-5 ${!isEditing ? 'bg-slate-50/30 cursor-not-allowed opacity-50 border-transparent shadow-none' : 'bg-white/40 shadow-inner'}`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Phone Number</label>
                                    <div className="relative group/input">
                                        <Phone size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors z-10" />
                                        <input
                                            type="text"
                                            placeholder="+92 XXX XXXXXXX"
                                            value={userData.phone}
                                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                            disabled={!isEditing}
                                            className={`${inputClasses} pl-16 py-5 ${!isEditing ? 'bg-slate-50/30 cursor-not-allowed opacity-50 border-transparent shadow-none' : 'bg-white/40 shadow-inner'}`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Department</label>
                                    <div className="relative group/input">
                                        <Building2 size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors z-10" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Computer Science"
                                            value={userData.department}
                                            onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                                            disabled={!isEditing}
                                            className={`${inputClasses} pl-16 py-5 ${!isEditing ? 'bg-slate-50/30 cursor-not-allowed opacity-50 border-transparent shadow-none' : 'bg-white/40 shadow-inner'}`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 md:col-span-2">
                                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Specialization</label>
                                    <div className="relative group/input">
                                        <GraduationCap size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors z-10" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Web Development, AI, Data Science"
                                            value={userData.specialization}
                                            onChange={(e) => setUserData({ ...userData, specialization: e.target.value })}
                                            disabled={!isEditing}
                                            className={`${inputClasses} pl-16 py-5 ${!isEditing ? 'bg-slate-50/30 cursor-not-allowed opacity-50 border-transparent shadow-none' : 'bg-white/40 shadow-inner'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center gap-6 p-8 bg-slate-900 text-white rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group/notice italic">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                                <Verified size={24} className="text-primary-400 shrink-0 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-loose pr-4">Your profile information is securely managed and synced with the university database.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="glass-card p-12 bg-white/60 border-l-[12px] border-l-rose-500 shadow-sm transition-all duration-700 hover:shadow-4xl hover:shadow-rose-500/10 rounded-[3rem] animate-fade-in relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                            <div className="space-y-4 relative z-10 mb-12">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Security Settings</h3>
                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] italic">Change your password and manage account access.</p>
                            </div>

                            <div className="space-y-10 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Current Password</label>
                                    <div className="relative group/input">
                                        <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-rose-500 transition-colors z-10" />
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className={`${inputClasses} pl-16 py-5 bg-white/40 shadow-inner`}
                                            placeholder="••••••••••••"
                                        />
                                        <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 transition-colors">
                                            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">New Password</label>
                                        <div className="relative group/input">
                                            <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-rose-500 transition-colors z-10" />
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className={`${inputClasses} pl-16 py-5 bg-white/40 shadow-inner`}
                                                placeholder="••••••••"
                                            />
                                            <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 transition-colors">
                                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Confirm New Password</label>
                                        <div className="relative group/input">
                                            <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-rose-500 transition-colors z-10" />
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className={`${inputClasses} pl-16 py-5 bg-white/40 shadow-inner`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleUpdatePassword}
                                disabled={loading}
                                className="w-full mt-12 py-6 bg-rose-600 text-white rounded-[2rem] flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] italic shadow-4xl shadow-rose-600/20 hover:bg-rose-700 active:scale-95 disabled:opacity-50 transition-all duration-500"
                            >
                                {loading ? <Loader2 className="animate-spin text-rose-200" /> : <Lock size={20} className="text-rose-200" />}
                                Update Password
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupervisorSettings;
