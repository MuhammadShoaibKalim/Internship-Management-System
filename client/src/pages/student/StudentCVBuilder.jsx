import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, ShieldAlert, Sparkles, ArrowLeft, Download, Eye, AlertCircle, Loader2, Trash2, CreditCardIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

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
        <div className="space-y-16 animate-fade-in pb-16">
            {/* Premium Header with Breadcrumb */}
            <SectionHeader
                title="CV Builder"
                subtitle="Student Sub-Page"
                description="Upload your CV and make it available for internship applications."
                icon={FileText}
                linkTo="/dashboard/student"
                linkText="Back to Dashboard"
                gradientFrom="from-primary-600"
                gradientTo="to-indigo-500"
            />

            {/* AI Hero Section */}
            <div className="max-w-5xl mx-auto text-center space-y-8 py-12">
                <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-50 border border-primary-100 rounded-full text-primary-600 text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
                    <Sparkles size={14} className="animate-pulse" />
                    AI CV Builder (Coming Soon)
                </div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter max-w-3xl mx-auto leading-[1.1]">
                    Synthesize your career <span className="italic text-slate-400">algorithmically</span>.
                </h2>
                <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                    Our AI-powered CV builder is coming soon. For now, please upload your CV as a PDF file.
                </p>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Upload Section - Premium Glass */}
                    <div className="glass-card p-16 border-dashed border-2 bg-slate-50/30 flex flex-col items-center justify-center text-center group hover:border-primary-400 hover:bg-white transition-all duration-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary-500/10 transition-colors" />

                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10">
                            <Upload className="text-primary-600" size={36} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight relative z-10">Upload Your CV</h2>
                        <p className="text-slate-500 text-sm mt-4 max-w-xs font-semibold leading-relaxed relative z-10 italic">Upload your latest CV in PDF format so companies can review your profile.</p>

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
                            className={`mt-12 btn-premium from-primary-600 to-indigo-500 px-12 py-5 flex items-center gap-3 shadow-3xl shadow-primary-500/20 cursor-pointer active:scale-95 transition-all relative z-10 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            {uploading ? <Loader2 className="animate-spin text-white" size={20} /> : <FileText size={20} className="text-primary-200" />}
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{uploading ? 'Uploading...' : 'Choose PDF File'}</span>
                        </label>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mt-6 relative z-10">Max Size: 5.0 MB</p>
                    </div>

                    {/* Status Section - Premium Glass */}
                    <div className={`glass-card p-10 flex flex-col justify-between border-2 transition-all duration-700 relative overflow-hidden ${cv ? 'bg-white border-emerald-500 shadow-4xl shadow-emerald-500/10' : 'bg-slate-50/50 border-transparent shadow-xl'}`}>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">CV Status</h2>
                                {cv ? (
                                    <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-emerald-500/20">
                                        <CheckCircle2 size={14} /> Uploaded
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl border border-slate-200/50">
                                        <ShieldAlert size={14} /> Not Uploaded
                                    </span>
                                )}
                            </div>

                            {loading ? (
                                <div className="py-16 flex flex-col items-center justify-center space-y-6">
                                    <div className="w-12 h-12 border-4 border-slate-100 rounded-full animate-spin border-t-primary-500"></div>
                                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Loading...</p>
                                </div>
                            ) : cv ? (
                                <div className="space-y-10">
                                    <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center gap-8 group hover:bg-slate-800 transition-colors shadow-2xl relative overflow-hidden">
                                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 transition-all duration-500 shrink-0">
                                            <FileText size={32} className="text-white" />
                                        </div>
                                        <div className="overflow-hidden space-y-1">
                                            <p className="text-lg font-black truncate uppercase tracking-tight text-primary-400">{cv.name || 'My_CV.pdf'}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Uploaded on: {new Date(cv.updatedAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl" />
                                    </div>
                                    <div className="space-y-4 px-2">
                                        <div className="flex items-center gap-3 text-emerald-500 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                                            <CheckCircle2 size={18} />
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">PDF Verified</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-xl">
                                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Ready for Applications</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 text-center group">
                                    <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-xl border border-slate-100 group-hover:scale-110 transition-transform relative">
                                        <div className="absolute inset-0 bg-primary-500/5 rounded-[2rem] animate-pulse"></div>
                                        <AlertCircle size={40} className="relative z-10" />
                                    </div>
                                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[11px] italic max-w-xs mx-auto leading-relaxed">Upload your CV to start applying to internships.</p>
                                </div>
                            )}
                        </div>

                        {cv && (
                            <div className="flex gap-4 mt-12 pt-10 border-t border-slate-100/50 relative z-10">
                                <a
                                    href={cv.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-3 btn-premium from-slate-900 to-slate-800 py-5 flex items-center justify-center gap-3 no-underline shadow-3xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all w-full"
                                >
                                    <Download size={22} className="text-primary-400" />
                                    <span className="text-white font-black uppercase tracking-[0.3em] text-[10px]">Download CV</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (window.confirm('Are you sure you want to delete your CV?')) {
                                            try {
                                                setUploading(true);
                                                await API.patch('/student/update-profile', { cvUrl: null });
                                                setCv(null);
                                                alert('CV deleted successfully.');
                                            } catch (err) {
                                                alert('Failed to remove CV. Please try again.');
                                            } finally {
                                                setUploading(false);
                                            }
                                        }
                                    }}
                                    className="w-16 h-16 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[1.8rem] transition-all shadow-xl active:scale-95 border border-rose-100 flex items-center justify-center shrink-0"
                                    title="Delete CV"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-32 -mb-32 blur-[100px]" />
                    </div>
                </div>
            </div>

            {/* AI Roadmap Note - Premium Glass */}
            <div className="max-w-6xl mx-auto glass-card bg-slate-900 border-none p-12 text-white relative overflow-hidden shadow-4xl shadow-primary-500/20 group">
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="p-6 bg-primary-500 rounded-3xl text-slate-900 shadow-3xl shadow-primary-500/50 shrink-0 group-hover:rotate-12 transition-transform duration-700">
                        <ShieldAlert size={36} />
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-2xl font-black uppercase tracking-tight">AI CV Builder: <span className="text-primary-400 italic">Coming Soon</span></h4>
                        <p className="text-primary-100/70 text-lg font-medium leading-relaxed opacity-80 max-w-4xl italic">
                            We are building an <span className="text-white font-black">AI-powered CV generator</span> to help you create a professional CV automatically from your profile, skills, and internship history.
                        </p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full -mr-48 -mt-48 blur-[120px] transition-all duration-1000 group-hover:bg-primary-500/30" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-[80px]" />
            </div>
        </div>
    );
};

export default StudentCVBuilder;
