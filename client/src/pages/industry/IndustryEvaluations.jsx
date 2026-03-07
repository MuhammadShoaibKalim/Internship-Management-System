import React, { useState, useEffect, } from 'react';
import { ClipboardCheck, Star, TrendingUp, ShieldCheck, AlertCircle, FileText, CheckCircle2, Loader2, Award, AlertTriangle, X, Clock, ClipboardList } from 'lucide-react';
import API from '../../services/api';
import { format } from 'date-fns';
import SectionHeader from '../../components/common/SectionHeader';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';


const IndustryEvaluations = () => {
    const [searchParams] = useSearchParams();
    const preselectApp = searchParams.get('application');
    const [loading, setLoading] = useState(true);
    const [evaluations, setEvaluations] = useState([]);
    const [interns, setInterns] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [studentStats, setStudentStats] = useState(null);

    const [formData, setFormData] = useState({
        application: '',
        period: 'Final',
        comments: '',
        metrics: {
            professionalism: 8,
            technicalSkills: 8,
            communication: 8,
            punctuality: 8,
            learningAgility: 8
        }
    });
    const [certificate, setCertificate] = useState(null);

    useEffect(() => {
        fetchEvaluations();
        fetchInterns();
        if (preselectApp) {
            handleOpenModal(preselectApp);
        }
    }, [preselectApp]);

    const handleOpenModal = async (appId) => {
        setIsModalOpen(true);
        setFormData(prev => ({ ...prev, application: appId }));

        if (appId) {
            try {
                // Fetch logs to auto-calculate average rating for this student
                const response = await API.get(`/logs`);
                const allLogs = response.data.data.logs || [];
                const studentLogs = allLogs.filter(log =>
                    log.application === appId &&
                    log.status === 'approved' &&
                    typeof log.industryMarks === 'number'
                );

                if (studentLogs.length > 0) {
                    let tHours = 0;
                    let tTasks = 0;
                    let tDocs = 0;

                    studentLogs.forEach(l => {
                        tHours += (l.hoursWorked || 0);
                        if (l.tasksPerformed) tTasks += l.tasksPerformed.split('\n').filter(t => t.trim() !== '').length;
                        if (l.attachment && l.attachment.url) tDocs += 1;
                    });

                    setStudentStats({ totalHours: tHours, totalTasks: tTasks, totalDocs: tDocs });

                    const avgScore = studentLogs.reduce((acc, log) => acc + log.industryMarks, 0) / studentLogs.length;
                    const scale10 = Math.round(avgScore / 10) || 1; // Convert 100 scale to 10 scale

                    setFormData(prev => ({
                        ...prev,
                        application: appId,
                        metrics: {
                            professionalism: scale10,
                            technicalSkills: scale10,
                            communication: scale10,
                            punctuality: scale10,
                            learningAgility: scale10
                        }
                    }));
                } else {
                    setStudentStats(null);
                }
            } catch (err) {
                console.error("Failed to auto-calculate metrics from logs:", err);
                setStudentStats(null);
            }
        }
    };

    const fetchEvaluations = async () => {
        try {
            setLoading(true);
            const response = await API.get('/industry/evaluations');
            if (response.data.status === 'success') {
                setEvaluations(response.data.data.evaluations);
            }
        } catch (err) {
            console.error('Failed to fetch evaluations:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchInterns = async () => {
        try {
            const response = await API.get('/industry/interns');
            if (response.data.status === 'success') {
                setInterns(response.data.data.interns);
            }
        } catch (err) {
            console.error('Failed to fetch interns:', err);
        }
    };

    const handleMetricChange = (metric, value) => {
        setFormData(prev => ({
            ...prev,
            metrics: { ...prev.metrics, [metric]: parseInt(value) }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const data = new FormData();
            data.append('application', formData.application);
            data.append('period', formData.period);
            data.append('comments', formData.comments);
            data.append('metrics', JSON.stringify(formData.metrics));
            if (certificate) data.append('certificate', certificate);

            const response = await API.post('/industry/evaluations', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status === 'success') {
                toast.success('Evaluation submitted successfully!');
                setIsModalOpen(false);
                fetchEvaluations();
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to submit evaluation';
            // Show actionable toast for guard errors
            if (msg.toLowerCase().includes('pending')) {
                toast.error(`🚫 ${msg}`, { duration: 6000 });
            } else {
                toast.error(msg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-primary-600" size={40} />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Accessing Performance Records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <SectionHeader
                title="Talent Assessment"
                subtitle="Industry Sub-Page"
                description="Final performance audit and certification"
                icon={TrendingUp}
                gradientFrom="from-slate-800"
                gradientTo="to-slate-950"
            >
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-premium from-indigo-600 to-indigo-900 py-5 px-10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-4xl shadow-indigo-500/20 group hover:scale-105 active:scale-95 transition-all duration-500"
                >
                    <ClipboardCheck size={20} className="group-hover:rotate-12 transition-transform duration-500 text-indigo-200" />
                    New Evaluation
                </button>
            </SectionHeader>

            {evaluations.length === 0 ? (
                <div className="glass-card p-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/40 border-dashed border-2 border-slate-200 rounded-[3rem]">
                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 shadow-xl group-hover:scale-110 transition-transform duration-700 border border-slate-100 relative">
                        <div className="absolute inset-0 bg-primary-500/5 rounded-[2rem] animate-pulse"></div>
                        <Award size={40} className="relative z-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">No Evaluations Filed</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic max-w-xs mx-auto">Initialize your first intern assessment to begin certification.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {evaluations.map(evalu => (
                        <div key={evalu._id} className="glass-card p-10 bg-white/60 border-slate-100 transition-all duration-700 hover:shadow-4xl hover:shadow-primary-500/10 rounded-[3rem] group overflow-hidden relative active:scale-[0.99]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-all duration-1000"></div>

                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className="space-y-4">
                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border ${evalu.period === 'Final' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                        {evalu.period} Assessment
                                    </span>
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter italic">{evalu.student?.name}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Hired internally — {format(new Date(evalu.createdAt), 'MMM yyyy')}</p>
                                    </div>
                                </div>
                                <div className={`w-20 h-20 rounded-[1.8rem] flex flex-col items-center justify-center font-black shadow-2xl group-hover:scale-110 transition-transform duration-700 border-4 border-white ${evalu.period === 'Final' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-emerald-600 text-white shadow-emerald-500/20'}`}>
                                    <TrendingUp size={28} className="mb-1" />
                                    <span className="text-[10px] uppercase tracking-tighter leading-none italic">{Math.round(evalu.overallScore)}%</span>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {evalu.period === 'Final' && (typeof evalu.totalHours !== 'undefined') && (
                                    <div className="grid grid-cols-4 gap-4 p-5 bg-white/70 rounded-[1.5rem] border border-slate-100 shadow-sm mt-4">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Total Hours</p>
                                            <p className="text-lg font-black text-slate-900 leading-none">{evalu.totalHours}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Tasks</p>
                                            <p className="text-lg font-black text-slate-900 leading-none">{evalu.totalTasksCompleted}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-primary-400">Docs</p>
                                            <p className="text-lg font-black text-slate-900 leading-none">{evalu.totalDocsUploaded}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-amber-500">Tier</p>
                                            <p className={`text-sm font-black uppercase tracking-widest mt-1 ${evalu.gradeTier === 'Distinction' ? 'text-amber-500' : evalu.gradeTier === 'Merit' ? 'text-indigo-500' : 'text-emerald-500'}`}>{evalu.gradeTier || 'Pass'}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 bg-white/80 rounded-[1.8rem] border border-slate-100 shadow-sm group-hover:bg-white transition-all duration-500 italic text-xs text-slate-500 leading-relaxed font-bold">
                                    "{evalu.comments || 'Direct performance review submitted to academic council.'}"
                                </div>

                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex items-center gap-3 py-2 px-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Certified</span>
                                    </div>
                                    {evalu.certificate?.url && (
                                        <div className="flex items-center gap-3 py-2 px-4 bg-primary-50/50 rounded-xl border border-primary-100">
                                            <Award size={16} className="text-primary-500" />
                                            <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest leading-none">Doc Attached</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-100 flex gap-4 relative z-10">
                                {evalu.certificate?.url && (
                                    <a
                                        href={evalu.certificate.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-5 px-6 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95 no-underline"
                                    >
                                        <FileText size={18} /> View Certificate
                                    </a>
                                )}
                                <button className={`flex-1 py-5 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800`}>
                                    Export Result
                                    <Star size={16} className="fill-current text-primary-400 animate-pulse" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Evaluation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
                    <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-4xl overflow-hidden animate-slide-up my-auto">
                        <div className="p-12 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">Performance Audit</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Final Internship Assessment & Certification</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white text-slate-300 hover:text-rose-500 rounded-2xl shadow-xl transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Select Intern</label>
                                    <select
                                        className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-3xl text-sm font-black outline-none transition-all appearance-none"
                                        value={formData.application}
                                        onChange={(e) => handleOpenModal(e.target.value)}
                                        required
                                        disabled={!!preselectApp}
                                    >
                                        <option value="">Choose Active Intern...</option>
                                        {interns.map(i => (
                                            <option key={i._id} value={i._id}>{i.student?.name} — {i.internship?.title}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Removed Assessment Period select. It is now always 'Final' */}
                                {/* Guard hint & Stats summary for Final */}
                                {formData.period === 'Final' && (
                                    <>
                                        {studentStats && (
                                            <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4 mb-4">
                                                <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-[1.5rem] flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                                        <Clock size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Total Hours</p>
                                                        <p className="text-xl font-black text-indigo-700 leading-none mt-1">{studentStats.totalHours}</p>
                                                    </div>
                                                </div>
                                                <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-[1.5rem] flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                                        <ClipboardList size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Tasks Completed</p>
                                                        <p className="text-xl font-black text-emerald-700 leading-none mt-1">{studentStats.totalTasks}</p>
                                                    </div>
                                                </div>
                                                <div className="p-5 bg-primary-50/50 border border-primary-100 rounded-[1.5rem] flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                                                        <FileText size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary-400">Docs Uploaded</p>
                                                        <p className="text-xl font-black text-primary-700 leading-none mt-1">{studentStats.totalDocs}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="col-span-1 md:col-span-2 flex items-start gap-4 p-6 bg-amber-50 border border-amber-100 rounded-[2rem]">
                                            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
                                                <strong>Important:</strong> Final evaluation will be blocked if the student still has unsubmitted weekly logs. Ensure all weeks are completed first. The final grade certificate will be auto-generated based on these metrics.
                                            </p>
                                        </div>
                                    </>
                                )}

                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-4 flex items-center gap-3">
                                    <TrendingUp size={16} className="text-primary-500" /> Performance Metrics (1 - 10)
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(formData.metrics).map(([key, val]) => (
                                        <div key={key} className="p-6 bg-slate-50 rounded-[2rem] border border-transparent hover:border-slate-200 transition-all group">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[9px] font-black tracking-widest text-slate-400 group-hover:text-primary-600 transition-colors uppercase whitespace-nowrap overflow-hidden text-ellipsis mr-2">
                                                    {key.replace(/([A-Z])/g, ' $1')}
                                                </span>
                                                <span className="text-sm font-black text-slate-900 italic">{val}</span>
                                            </div>
                                            <input
                                                type="range" min="1" max="10" step="1"
                                                value={val}
                                                onChange={(e) => handleMetricChange(key, e.target.value)}
                                                className="w-full accent-slate-900"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Executive Summary & Feedback</label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Summarize the intern's contribution, growth, and areas for improvement..."
                                    className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-[2.5rem] text-sm font-bold outline-none transition-all placeholder:text-slate-200 resize-none leading-relaxed shadow-inner italic"
                                    value={formData.comments}
                                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Completion Certificate (PDF/Image)</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            onChange={(e) => setCertificate(e.target.files[0])}
                                            className="hidden"
                                            id="cert-upload"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <label htmlFor="cert-upload" className="flex items-center gap-4 px-8 py-5 bg-white border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all group-active:scale-95">
                                            <Award size={20} className="text-slate-300 group-hover:text-primary-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary-600">
                                                {certificate ? certificate.name : 'Choose Digital Certificate'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] shadow-3xl shadow-slate-200 hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 transition-all italic h-[64px]"
                                >
                                    {submitting ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} className="text-emerald-400" />}
                                    Finalize Certification
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndustryEvaluations;
