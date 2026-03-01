import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, ShieldAlert, Sparkles, ArrowRight, ArrowLeft, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentCVBuilder = () => {
    const [isUploaded, setIsUploaded] = useState(false);

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
                    <Sparkles size={14} className="text-amber-400" />
                    Feature Roadmap: AI Builder
                </div>
                <h2 className="text-5xl font-black text-secondary-900 tracking-tighter leading-none">Your Engineering Identity</h2>
                <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">Our AI-powered CV builder is coming soon. For now, please upload your existing resume in PDF format.</p>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className={`portal-card p-12 text-center border-2 border-dashed transition-all duration-500
                    ${isUploaded ? 'bg-emerald-50 border-emerald-200 shadow-2xl shadow-emerald-100' : 'bg-white border-slate-200 hover:border-primary-400'}`}>

                    {!isUploaded ? (
                        <div className="space-y-6">
                            <div className="w-24 h-24 bg-slate-50 text-slate-400 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform">
                                <Upload size={40} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-secondary-900 tracking-tight">Upload Resume</h3>
                                <p className="text-slate-400 text-sm mt-2 font-medium">Accepted formats: PDF (Max 5MB)</p>
                            </div>
                            <div className="flex justify-center">
                                <label className="btn-primary flex items-center gap-3 px-12 py-5 cursor-pointer active:scale-95 shadow-2xl shadow-primary-200 text-sm">
                                    <input type="file" className="hidden" onChange={() => setIsUploaded(true)} />
                                    Choose PDF File
                                    <ArrowRight size={20} />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-fade-in">
                            <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
                                <FileText size={40} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-secondary-900 flex items-center justify-center gap-3 tracking-tight">
                                    Resume_Shoaib_2024.pdf
                                    <CheckCircle2 size={24} className="text-emerald-500" />
                                </h3>
                                <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest opacity-60">Successfully Linked to Profile</p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                                <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all" onClick={() => setIsUploaded(false)}>
                                    Change File
                                </button>
                                <Link to="/dashboard/student/hub" className="btn-primary px-12 py-4 flex items-center justify-center gap-2 shadow-2xl shadow-primary-200 no-underline text-[10px] font-black uppercase tracking-widest">
                                    <Globe size={16} />
                                    Explore Internships
                                </Link>
                            </div>
                        </div>
                    )}
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
        </div>
    );
};

export default StudentCVBuilder;
