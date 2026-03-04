import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, ShieldAlert, Sparkles, ArrowLeft, Download, Eye, AlertCircle, Loader2, Trash2, CreditCardIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const StudentCVBuilder = () => {
    const [cv, setCv] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await API.get('/student/profile');
                setCv(response.data.data.student.cv);
            } catch (err) {
                console.error('Error fetching CV:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('cv', file);

        setUploading(true);
        try {
            const response = await API.post('/student/upload-cv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCv(response.data.data.cv);
            alert('CV uploaded successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to upload CV');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            {/* Header with Navigation Link */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link to="/dashboard/student" className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-[10px] uppercase tracking-widest mb-2 no-underline transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Professional Resume</h1>
                    <p className="text-slate-500 font-medium italic">Upload your core CV to start applying for opportunities.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-900 border border-secondary-800 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                    <CreditCardIcon size={14} className="text-amber-400" />
                    Feature Roadmap: AI Builder
                </div>
                <h2 className="text-5xl font-black text-secondary-900 tracking-tighter leading-none">Your Engineering Identity</h2>
                <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">Our AI-powered CV builder is coming soon. For now, please upload your existing resume in PDF format.</p>
            </div>

            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="portal-card p-12 border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center text-center group hover:bg-primary-50/30 hover:border-primary-200 transition-all">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                            <Upload className="text-primary-600" size={32} />
                        </div>
                        <h2 className="text-xl font-black text-secondary-900 uppercase tracking-tight">Upload Your Resume</h2>
                        <p className="text-slate-500 text-sm mt-2 max-w-xs font-medium">Standardize your profile by uploading your latest CV in PDF format.</p>

                        <input
                            type="file"
                            id="cv-upload"
                            hidden
                            accept=".pdf"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                        <label
                            htmlFor="cv-upload"
                            className={`mt-8 btn-primary px-10 py-4 flex items-center gap-2 shadow-xl shadow-primary-200 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                            {uploading ? 'Transferring Logic...' : 'Select PDF File'}
                        </label>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Max file size: 5MB</p>
                    </div>

                    {/* Status Section */}
                    <div className={`portal-card p-8 flex flex-col justify-between border-2 transition-all duration-500 ${cv ? 'bg-emerald-50/30 border-emerald-200 shadow-2xl shadow-emerald-100' : 'bg-white border-slate-100'}`}>
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-lg font-bold text-secondary-900 uppercase tracking-tight">System Status</h2>
                                {cv ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100">
                                        <CheckCircle2 size={12} /> Live Node
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg border border-slate-100 italic">
                                        No Data Detected
                                    </span>
                                )}
                            </div>

                            {loading ? (
                                <div className="py-12 flex flex-col items-center">
                                    <Loader2 className="animate-spin text-primary-600" size={32} />
                                </div>
                            ) : cv ? (
                                <div className="space-y-6">
                                    <div className="p-5 bg-slate-900 rounded-3xl text-white flex items-center gap-5 group">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                                            <FileText size={24} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-black truncate uppercase tracking-tight">{cv.name || 'Student_CV.pdf'}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Uploaded {new Date(cv.updatedAt || Date.now()).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <CheckCircle2 size={16} />
                                            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Format: PDF Verified</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Global Access Enabled</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} />
                                    <p className="text-slate-400 font-bold italic text-sm">Upload your professional credentials to proceed with applications.</p>
                                </div>
                            )}
                        </div>

                        {cv && (
                            <div className="flex gap-3 mt-8 pt-8 border-t border-slate-50">
                                <a
                                    href={cv.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 btn-primary py-4 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-primary-200 no-underline text-white text-xs font-black uppercase"
                                >
                                    <Download size={18} />
                                    Download Resume
                                </a>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (window.confirm('Are you sure you want to remove your CV?')) {
                                            try {
                                                setUploading(true);
                                                await API.patch('/student/update-profile', { cvUrl: null });
                                                setCv(null);
                                                alert('CV removed successfully');
                                            } catch (err) {
                                                alert('Failed to remove CV');
                                            } finally {
                                                setUploading(false);
                                            }
                                        }
                                    }}
                                    className="p-4 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-2xl transition-colors shadow-sm active:scale-95"
                                    title="Remove CV"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Roadmap Note */}
            <div className="mt-12 p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-start gap-6 relative overflow-hidden group">
                <div className="p-4 bg-white rounded-2xl text-amber-500 shadow-xl shadow-amber-200/20 shrink-0 relative z-10 transition-transform group-hover:rotate-12">
                    <ShieldAlert size={24} />
                </div>
                <div className="relative z-10">
                    <h4 className="font-black text-amber-900 text-sm uppercase tracking-widest">AI Builder: Under Construction</h4>
                    <p className="text-amber-800 text-xs mt-2 leading-relaxed font-medium opacity-80">
                        Our team is currently integrating LLMs to help you generate high-conversion resumes automatically.
                        This feature will allow you to sync your academic data and certificates directly into the builder.
                    </p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default StudentCVBuilder;
