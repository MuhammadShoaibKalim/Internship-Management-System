import React, { useState, useEffect, useRef } from 'react';
import { Award, Star, ClipboardCheck, BookOpen, GraduationCap, TrendingUp, AlertCircle, Loader2, Download, ExternalLink, Calendar, Building2, Clock, ClipboardList, CheckCircle, Printer, Eye, FileText, X } from 'lucide-react';
import API from '../../services/api';
import { toast } from 'react-hot-toast';
import SectionHeader from '../../components/common/SectionHeader';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const InternshipResult = () => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const certificateRef = useRef(null);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const response = await API.get('/student/marking');
            if (response.data.status === 'success') {
                setResults(response.data.data);
            }
        } catch (err) {
            console.error('Failed to load results:', err);
            if (err.response?.status !== 404) {
                toast.error('Failed to sync evaluation data.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getMetricLabel = (value) => {
        if (value < 40) return 'Needs Improvement';
        if (value < 60) return 'Fair';
        if (value < 80) return 'Good';
        if (value < 90) return 'Very Good';
        return 'Excellent';
    };

    const getGradeColor = (value) => {
        if (value < 40) return 'from-rose-500 to-orange-500';
        if (value < 60) return 'from-orange-400 to-amber-500';
        if (value < 80) return 'from-blue-500 to-indigo-600';
        return 'from-emerald-500 to-teal-600';
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-slate-100 border-t-primary-600 rounded-full animate-spin"></div>
                    <Award className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-600 w-8 h-8" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse italic">Retrieving Final Assessment...</p>
            </div>
        );
    }

    if (!results || (!results.marking && !results.industryEvaluation)) {
        return (
            <div className="space-y-8 animate-fade-in">
                <SectionHeader
                    title="Performance Result"
                    subtitle="Final Evaluation"
                    description="Your end-of-internship performance standing"
                    icon={Award}
                    gradientFrom="from-slate-900"
                    gradientTo="to-slate-800"
                />
                <div className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-8 bg-white/40 border-2 border-dashed border-slate-200 rounded-[4rem]">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-inner">
                        <AlertCircle size={48} />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Assessment Pending</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic max-w-xs mx-auto leading-loose">
                            Your final evaluation has not been published yet. Please ensure both your Faculty Supervisor and Industry Partner have submitted their assessments.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const { marking, industryEvaluation } = results;
    const gpa = marking?.industryGpa || 0;
    const industryScore = industryEvaluation?.overallScore || 0;

    const handleDownloadPDF = async () => {
        if (!certificateRef.current) return;
        try {
            setDownloadingPdf(true);
            toast.loading("Generating High-Quality Certificate...", { id: "pdfToast" });

            // Ensure the element is visible and rendered
            await new Promise(resolve => setTimeout(resolve, 800));

            const element = certificateRef.current;

            // Capture only the certificate element with specific options
            const canvas = await html2canvas(element, {
                scale: 3, // Higher scale for better print quality
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                onclone: (clonedDoc) => {
                    // Search for the certificate container in the cloned document
                    const certificate = clonedDoc.getElementById('certificate-download-area');
                    if (certificate) {
                        certificate.style.width = '1000px';
                        certificate.style.maxWidth = 'none';
                        certificate.style.margin = '0';
                        certificate.style.boxShadow = 'none';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width / 3, canvas.height / 3] // Adjust format to match the internal scale
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
            pdf.save(`${industryEvaluation?.student?.name || marking?.student?.name || 'Intern'}_Certificate.pdf`);

            toast.success("Certificate Downloaded Successfully!", { id: "pdfToast" });
        } catch (err) {
            console.error("PDF Export Error", err);
            toast.error("Failed to generate certificate PDF.");
        } finally {
            setDownloadingPdf(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <SectionHeader
                title="Performance Result"
                subtitle="Final Evaluation"
                description="Comprehensive academic & professional review"
                icon={Award}
                gradientFrom="from-slate-800"
                gradientTo="to-slate-950"
            />

            {/* Top Overview Card */}
            {industryEvaluation && (
                <div className="glass-card p-6 md:p-8 bg-white/80 border-slate-100 rounded-[2.5rem] shadow-sm mb-10 print:hidden animate-slide-up">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 w-full md:w-auto">
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2"><Clock size={12} /> Total Hours</span>
                                <span className="text-2xl font-black text-slate-900 italic mt-1 leading-none">{industryEvaluation.totalHours || '--'}</span>
                            </div>
                            <div className="hidden md:block w-px h-10 bg-slate-200"></div>
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2"><ClipboardList size={12} /> Tasks Done</span>
                                <span className="text-2xl font-black text-slate-900 italic mt-1 leading-none">{industryEvaluation.totalTasksCompleted || '--'}</span>
                            </div>
                            <div className="hidden md:block w-px h-10 bg-slate-200"></div>
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2"><CheckCircle size={12} /> Grade Tier</span>
                                <span className={`text-xl font-black uppercase tracking-widest mt-1 italic leading-none ${industryEvaluation.gradeTier === 'Distinction' ? 'text-amber-500' : industryEvaluation.gradeTier === 'Merit' ? 'text-indigo-500' : 'text-emerald-500'}`}>
                                    {industryEvaluation.gradeTier || 'Pass'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button onClick={() => setShowCertificateModal(true)} className="flex-1 md:flex-none btn-premium from-indigo-600 to-indigo-900 py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 no-underline text-white rounded-2xl transition-transform active:scale-95">
                                <Eye size={16} className="text-indigo-300" /> View Certificate
                            </button>
                            <button onClick={handleDownloadPDF} disabled={downloadingPdf} className="flex-1 md:flex-none py-4 px-6 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                {downloadingPdf ? <Loader2 size={16} className="text-slate-400 animate-spin" /> : <Printer size={16} className="text-slate-400" />} Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 print:hidden items-start">
                {/* All Performance Stats & Partners */}
                <div className="lg:col-span-2 xl:col-span-3 space-y-8 flex flex-col">
                    {/* GPA Card */}
                    {marking && (
                        <div className="glass-card p-10 bg-slate-900 text-white border-none shadow-4xl shadow-slate-900/20 rounded-[3rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/30 transition-all duration-700"></div>

                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                        <TrendingUp size={24} className="text-primary-400" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-400/80 leading-none mb-1">Academic Standing</p>
                                        <h3 className="text-2xl font-black tracking-tighter uppercase italic text-white">Final GPA</h3>
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-4">
                                    <span className="text-7xl font-black tracking-tighter italic leading-none text-white">{gpa.toFixed(2)}</span>
                                    <span className="text-xl font-black text-white/30 italic uppercase tracking-widest">/ 4.0</span>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Credit status</p>
                                        <p className="text-[10px] font-black uppercase italic text-emerald-400">Awarded</p>
                                    </div>
                                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                        <Star size={16} className="text-emerald-400 fill-emerald-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Academic Performance */}
                    {marking && (
                        <div className="glass-card p-8 bg-white/60 border-slate-100 rounded-[2.5rem] shadow-sm space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-0.5 w-6 bg-primary-500"></div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-900">Academic Score</h4>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {[
                                    { id: 'technicalProficiency', label: 'Technical Proficiency', icon: BookOpen },
                                    { id: 'softSkills', label: 'Soft Skills', icon: Star },
                                    { id: 'logConsistency', label: 'Log Consistency', icon: ClipboardCheck },
                                    { id: 'industryFeedback', label: 'Work Quality', icon: GraduationCap }
                                ].map((m) => (
                                    <div key={m.id} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-3">
                                                <m.icon size={14} className="text-slate-400" />
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter italic">{m.label}</span>
                                            </div>
                                            <span className="text-xs font-black text-primary-600 italic">{marking.metrics[m.id]}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                            <div
                                                className={`h-full bg-gradient-to-r ${getGradeColor(marking.metrics[m.id])} transition-all duration-1000 ease-out`}
                                                style={{ width: `${marking.metrics[m.id]}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Recommendation</p>
                                <p className="text-xs font-bold text-slate-600 leading-relaxed italic border-l-4 border-primary-500/20 pl-4">
                                    "{marking.recommendation || 'No additional comments provided.'}"
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Industry Performance */}
                    {industryEvaluation && (
                        <div className="glass-card p-8 bg-white/60 border-slate-100 rounded-[2.5rem] shadow-sm space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-0.5 w-6 bg-indigo-500"></div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-900">Professional Traits</h4>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {Object.entries(industryEvaluation.metrics).map(([key, val]) => (
                                    <div key={key} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic m-0">
                                            {key.replace(/([A-Z])/g, ' $1')}
                                        </p>
                                        <div className="flex items-center gap-3 w-1/2">
                                            <span className="text-xl font-black text-slate-900 italic">{val}</span>
                                            <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${val * 10}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Professional Feedback</p>
                                <p className="text-xs font-bold text-slate-600 leading-relaxed italic border-l-4 border-indigo-500/20 pl-4">
                                    "{industryEvaluation.comments || 'Exemplary conduct during tenure.'}"
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Partners Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
                        {/* Academic Supervisor Info */}
                        {marking?.supervisor && (
                            <div className="glass-card p-6 bg-white/60 border-slate-100 rounded-[2.5rem] shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-0.5 w-4 bg-primary-500"></div>
                                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Faculty Supervisor</h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center ring-4 ring-white shadow-lg overflow-hidden shrink-0">
                                        {marking.supervisor.avatar ? (
                                            <img src={marking.supervisor.avatar} alt={marking.supervisor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-black text-slate-300">{marking.supervisor.name?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-slate-900 uppercase tracking-tighter italic text-xs">{marking.supervisor.name}</p>
                                        <p className="text-[8px] font-black text-primary-600 uppercase tracking-widest">{marking.supervisor.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Industry Partner Info */}
                        {industryEvaluation?.industry && (
                            <div className="glass-card p-6 bg-white/60 border-slate-100 rounded-[2.5rem] shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-0.5 w-4 bg-indigo-500"></div>
                                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Industry Partner</h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center ring-4 ring-white shadow-lg overflow-hidden shrink-0">
                                        {industryEvaluation.industry.avatar ? (
                                            <img src={industryEvaluation.industry.avatar} alt={industryEvaluation.industry.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-black text-slate-300">{industryEvaluation.industry.name?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-slate-900 uppercase tracking-tighter italic text-xs">{industryEvaluation.industry.name}</p>
                                        <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Score: {Math.round(industryScore)}%</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Certificate Modal Overlay */}
            {showCertificateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
                    <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-4xl overflow-hidden animate-slide-up relative my-auto">

                        {/* Modal Header */}
                        <div className="p-6 md:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Official Certificate</h3>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Digital performance credential</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={handleDownloadPDF} disabled={downloadingPdf} className="hidden md:flex bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all items-center gap-2">
                                    {downloadingPdf ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                                    Download PDF
                                </button>
                                <button onClick={() => setShowCertificateModal(false)} className="p-3 bg-white text-slate-300 hover:text-rose-500 rounded-2xl shadow-xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-10 bg-slate-50 relative overflow-x-auto overflow-y-hidden max-h-[80vh] custom-scroll">
                            {/* Download visible on mobile inside body */}
                            <div className="md:hidden flex justify-center mb-6">
                                <button onClick={handleDownloadPDF} disabled={downloadingPdf} className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-5 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-3">
                                    {downloadingPdf ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                    Save as PDF
                                </button>
                            </div>

                            {/* Coursera Style Certificate */}
                            {industryEvaluation && (
                                <div id="certificate-section" className="mt-16 pt-10 border-t-2 border-dashed border-slate-200 print:mt-0 print:pt-0 print:border-none">
                                    <div className="flex items-center gap-4 mb-8 print:hidden">
                                        <div className="h-0.5 w-8 bg-indigo-500"></div>
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] italic text-slate-900">Official Certificate</h4>
                                    </div>

                                    {/* The Certificate Container */}
                                    <div id="certificate-download-area" ref={certificateRef} className="relative w-full max-w-[1000px] mx-auto bg-white shadow-2xl overflow-hidden print:shadow-none">
                                        <div className="relative flex flex-row min-h-[650px] border-[1px] border-slate-200 m-4 md:m-8 bg-white/95 backdrop-blur-sm">

                                            {/* Corner Accents */}
                                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-slate-300"></div>
                                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-300"></div>
                                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-slate-300"></div>
                                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-slate-300"></div>

                                            {/* Left Content Area (Main) */}
                                            <div className="flex-1 p-12 md:p-20 flex flex-col items-start text-left relative z-10">
                                                {/* Logo */}
                                                <div className="mb-16">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                                            <Award size={32} />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none uppercase">IMS</h2>
                                                            <p className="text-[10px] font-black text-indigo-600 tracking-[0.4em] mt-1 uppercase">Academic Portal</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-12 w-full">
                                                    <p className="text-sm font-bold text-slate-500 italic">
                                                        {new Date(industryEvaluation.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>

                                                    <div className="space-y-6">
                                                        <h1 className="text-5xl md:text-7xl font-serif text-slate-900 tracking-tight leading-tight">
                                                            {industryEvaluation.student?.name || marking?.student?.name || 'Intern'}
                                                        </h1>
                                                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] italic pl-1">has successfully completed</p>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 italic leading-tight">
                                                            {industryEvaluation.application?.internship?.title}
                                                        </h2>
                                                        <p className="text-sm font-bold text-slate-600 leading-relaxed max-w-2xl italic">
                                                            an online non-credit internship authorized by <span className="text-slate-900 font-black">{industryEvaluation.industry?.name || industryEvaluation.application?.internship?.companyName}</span> and offered through IMS Academic Portal.
                                                        </p>
                                                    </div>

                                                    {/* Signatures */}
                                                    <div className="pt-20 flex justify-between items-end w-full gap-12">
                                                        <div className="flex-1 border-t border-slate-900 pt-4">
                                                            <p className="text-base font-black text-slate-900 italic mb-1">{marking?.supervisor?.name || 'Academic Council'}</p>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Faculty Supervisor</p>
                                                        </div>
                                                        <div className="flex-1 border-t border-slate-900 pt-4 text-right">
                                                            <p className="text-base font-black text-slate-900 italic mb-1">{industryEvaluation.industry?.name || 'Industry Partner'}</p>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authorized Signatory</p>
                                                        </div>
                                                    </div>

                                                    {/* Bottom Verification */}
                                                    <div className="pt-8 w-full flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                                                        <span>Verify at: ims.edu.pk/verify/{industryEvaluation._id.toString().slice(-6)}</span>
                                                        <span className="opacity-50 text-right">IMS has confirmed the identity of this individual and their participation in the course.</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Sidebar (Gray Band) */}
                                            <div className="w-48 bg-slate-100 flex flex-col items-center py-16 relative border-l border-slate-200">
                                                <div className="mt-8 flex flex-col items-center">
                                                    <div className="[writing-mode:vertical-lr] text-center space-y-2 py-4">
                                                        <span className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] leading-none mb-1">COURSE</span>
                                                        <span className="text-sm font-black text-slate-800 uppercase tracking-[0.5em] leading-none">CERTIFICATE</span>
                                                    </div>

                                                    {/* Circular Seal */}
                                                    <div className="mt-16 relative">
                                                        <div className="w-24 h-24 rounded-full border-4 border-slate-300 flex items-center justify-center bg-white shadow-lg overflow-hidden">
                                                            <div className="absolute inset-0 border-2 border-dashed border-slate-200 m-1 rounded-full"></div>
                                                            <div className="relative flex flex-col items-center scale-90">
                                                                <Award size={24} className="text-slate-800 mb-1" />
                                                                <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">ACCREDITED</span>
                                                                <span className="text-[8px] font-black text-slate-900 uppercase tracking-tighter">IMS PORTAL</span>
                                                            </div>
                                                        </div>
                                                        {/* Seal Accents */}
                                                        <div className="absolute -inset-2 border border-slate-200 rounded-full scale-110 opacity-50"></div>
                                                    </div>
                                                </div>

                                                {/* Bottom Ribbon Notch (CSS shape) */}
                                                <div className="absolute bottom-0 left-0 w-full h-8 overflow-hidden">
                                                    <div className="absolute bottom-0 left-0 w-1/2 h-16 bg-slate-100 origin-bottom-right -skew-y-12 border-l border-slate-200"></div>
                                                    <div className="absolute bottom-0 right-0 w-1/2 h-16 bg-slate-100 origin-bottom-left skew-y-12"></div>
                                                </div>
                                            </div>

                                            {/* Background Wavy Pattern (Subtle) */}
                                            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
                                                <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500" stroke="black" strokeWidth="2" fill="none" />
                                                    <path d="M0,550 C200,450 300,650 500,550 C700,450 800,650 1000,550" stroke="black" strokeWidth="2" fill="none" />
                                                    <path d="M0,450 C200,350 300,550 500,450 C700,350 800,550 1000,450" stroke="black" strokeWidth="2" fill="none" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {industryEvaluation.certificate?.url && (
                                        <div className="mt-8 text-center print:hidden">
                                            <a href={industryEvaluation.certificate.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors bg-indigo-50 py-3 px-6 rounded-xl">
                                                <FileText size={16} /> View manually uploaded equivalent
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternshipResult;
