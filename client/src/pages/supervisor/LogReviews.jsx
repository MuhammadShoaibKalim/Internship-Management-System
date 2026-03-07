import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ClipboardList,Building2 ,  CheckCircle2, XCircle, Clock, ArrowLeft, ArrowRight, Search, ShieldCheck, Filter, MessageSquare, Download, Loader2, AlertCircle, Calendar, X, Star } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

const LogReviews = () => {
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('student');
    const [logs, setLogs] = useState([]);
    const [student, setStudent] = useState(null);
    const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const [reviewModalLog, setReviewModalLog] = useState(null);
    const [reviewData, setReviewData] = useState({
        status: 'approved',
        marks: '',
        supervisorComments: ''
    });

    useEffect(() => {
        fetchLogs();
        if (studentId) fetchStudent();
    }, [studentId]);

    const fetchStudent = async () => {
        try {
            const response = await API.get(`/supervisor/students`);
            if (response.data.status === 'success') {
                const found = response.data.data.students.find(s => s._id === studentId);
                setStudent(found);
            }
        } catch (err) {
            console.error('Failed to load student context:', err);
        }
    };

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const endpoint = studentId ? `/logs?student=${studentId}` : '/logs';
            const response = await API.get(endpoint);

            if (response.data.status === 'success') {
                const allLogs = response.data.data.logs || [];
                setLogs(allLogs);

                const pending = allLogs.filter(l => l.status === 'submitted').length;
                const approved = allLogs.filter(l => l.status === 'approved').length;
                setStats({ pending, approved, total: allLogs.length });
            }
        } catch (err) {
            console.error('Failed to load logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const openReviewModal = (log, status) => {
        setReviewModalLog(log);
        setReviewData({
            status,
            marks: log.marks || '',
            supervisorComments: log.supervisorComments || ''
        });
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(reviewModalLog._id);
            const response = await API.patch(`/supervisor/logs/${reviewModalLog._id}`, reviewData);
            if (response.data.status === 'success') {
                const updatedLog = response.data.data.log;
                setLogs(prev => prev.map(l => l._id === reviewModalLog._id ? updatedLog : l));

                setStats(prev => {
                    const wasPending = logs.find(l => l._id === reviewModalLog._id)?.status === 'submitted';
                    const wasApproved = logs.find(l => l._id === reviewModalLog._id)?.status === 'approved';
                    let newApproved = prev.approved;
                    if (reviewData.status === 'approved' && !wasApproved) newApproved++;
                    if (wasApproved && reviewData.status !== 'approved') newApproved--;

                    return {
                        ...prev,
                        pending: wasPending ? prev.pending - 1 : prev.pending,
                        approved: newApproved
                    };
                });

                toast.success(`Log ${reviewData.status} successfully`);
                setReviewModalLog(null);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update log status');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <SectionHeader
                title="Log Reviews"
                subtitle="Supervisor Sub-Page"
                description="Weekly Log Verification & Feedback"
                icon={ArrowLeft}
                linkTo="/dashboard/supervisor/students"
                linkText="Back to Student List"
                gradientFrom="from-primary-600"
                gradientTo="to-indigo-600"
            />

            {/* Student Context Header */}
            {student && (
                <div className="glass-card p-10 bg-slate-900 text-white rounded-[3rem] border border-slate-800 shadow-4xl shadow-slate-900/20 relative overflow-hidden group mb-4">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-primary-500/20 transition-all duration-1000"></div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center font-black text-2xl shadow-2xl ring-4 ring-white/10 overflow-hidden shrink-0">
                                {student.avatar ? (
                                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="italic text-primary-400">{student.name?.charAt(0)}</span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-3xl font-black tracking-tighter uppercase italic">{student.name}</h3>
                                    <div className="px-3 py-1 bg-primary-500 text-white rounded-lg">
                                        <p className="text-[8px] font-black uppercase tracking-widest italic">{student.studentMeta?.universityId}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
                                    <span className="flex items-center gap-2"><Building2 size={12} className="text-primary-500" /> {student.studentMeta?.currentApplication?.internship?.companyName || 'N/A'}</span>
                                    <span className="flex items-center gap-2"><ShieldCheck size={12} className="text-primary-500" /> {student.status}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to={`/dashboard/supervisor/marking?student=${student._id}`} className="px-8 py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-primary-500 hover:text-white transition-all shadow-xl no-underline">
                                Go to Final Marking
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                    { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'amber', gradient: 'from-amber-50 to-orange-50', iconColor: 'text-amber-500' },
                    { label: 'Approved Logs', value: stats.approved, icon: CheckCircle2, color: 'emerald', gradient: 'from-emerald-50 to-teal-50', iconColor: 'text-emerald-500' },
                    { label: 'Total Logs', value: stats.total, icon: ClipboardList, color: 'primary', gradient: 'from-primary-50 to-indigo-50', iconColor: 'text-primary-500' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-10 bg-white/60 border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-4xl transition-all duration-700 rounded-[3rem]">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-all duration-700`}></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`p-3 rounded-xl bg-white shadow-inner group-hover:rotate-12 transition-transform duration-500 ${stat.iconColor}`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">{stat.label}</p>
                                </div>
                                <p className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">{stat.value.toString().padStart(2, '0')}</p>
                            </div>
                            <div className="h-24 w-24 bg-slate-900/5 rounded-full -mr-12 -mt-12 group-hover:bg-primary-500/10 transition-all duration-700 flex items-center justify-center p-6 blur-2xl"></div>
                        </div>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="glass-card p-32 flex flex-col items-center justify-center space-y-6 bg-white/40 border-dashed border-2 border-slate-200 rounded-[3rem]">
                    <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Loading Submission Data...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {logs.length > 0 ? (
                        logs.map(log => (
                            <div key={log._id} className="glass-card p-10 bg-white/60 border-slate-100 shadow-sm transition-all duration-700 hover:shadow-4xl hover:shadow-primary-500/10 rounded-[3rem] group overflow-hidden relative active:scale-[0.99]">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-primary-500/10 transition-all duration-1000"></div>

                                <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                                    <div className="lg:w-1/4 space-y-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-xl shadow-2xl ring-8 ring-white overflow-hidden shrink-0 transition-transform duration-700">
                                                {log.student?.avatar ? (
                                                    <img src={log.student.avatar} alt={log.student.name} className="w-full h-full object-cover transition-transform duration-700" />
                                                ) : (
                                                    <span className="italic text-primary-400">{log.student?.name?.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tighter italic">{log.student?.name}</h4>
                                                <div className="px-3 py-1 bg-slate-900 text-primary-400 rounded-lg inline-block">
                                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] italic">WEEK {log.weekNumber || 'XX'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-white/80 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 group-hover:bg-white transition-all duration-500">
                                            <div className="flex items-center justify-between px-1">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} className="text-slate-400" />
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Status</span>
                                                </div>
                                                <StatusBadge status={log.status === 'submitted' ? 'pending' : log.status} />
                                            </div>
                                            <div className="flex items-center justify-between px-1">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} className="text-slate-400" />
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Stamped</span>
                                                </div>
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">{new Date(log.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:w-1/2 space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-0.5 w-6 bg-primary-500"></div>
                                                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Tasks Performed</h5>
                                            </div>
                                            <div className="text-sm text-slate-600 font-black tracking-tight leading-relaxed bg-white/40 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner italic">
                                                {log.tasksPerformed || 'No operational data provided for this sector.'}
                                            </div>
                                        </div>
                                        {log.challenges && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-rose-500">
                                                    <div className="h-0.5 w-6 bg-rose-500"></div>
                                                    <h5 className="text-[9px] font-black uppercase tracking-[0.3em] italic">Challenges Faced</h5>
                                                </div>
                                                <p className="text-xs text-rose-500 font-black tracking-tight italic bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100">
                                                    {log.challenges}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="lg:w-1/4 flex flex-col justify-center gap-4">
                                        {log.status === 'submitted' ? (
                                            <div className="space-y-4">
                                                <button
                                                    onClick={() => openReviewModal(log, 'approved')}
                                                    className="w-full btn-premium py-5 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] italic active:scale-95 transition-all shadow-4xl shadow-primary-500/20"
                                                >
                                                    <CheckCircle2 size={18} className="text-primary-200" />
                                                    Grade & Approve
                                                </button>
                                                <button
                                                    onClick={() => openReviewModal(log, 'rejected')}
                                                    className="w-full py-5 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95 flex items-center justify-center gap-4 group/rej"
                                                >
                                                    <XCircle size={18} className="group-hover/rej:rotate-90 transition-transform duration-500" />
                                                    Reject Log
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="w-full py-5 bg-slate-900 text-primary-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic flex items-center justify-center gap-4 cursor-default border border-slate-800 shadow-inner">
                                                    <ShieldCheck size={20} className="text-emerald-400" /> Approved
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button className="flex-1 p-5 bg-white border-2 border-slate-100 text-slate-400 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-100 rounded-[1.5rem] transition-all duration-500 group/btn active:scale-90">
                                                        <MessageSquare size={20} className="mx-auto group-hover/btn:scale-125 transition-transform duration-500" />
                                                    </button>
                                                    <button className="flex-1 p-5 bg-white border-2 border-slate-100 text-slate-400 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-100 rounded-[1.5rem] transition-all duration-500 group/btn active:scale-90">
                                                        <Download size={20} className="mx-auto group-hover/btn:scale-125 transition-transform duration-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="glass-card p-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/40 border-dashed border-2 border-slate-200 rounded-[3rem] group">
                            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 shadow-xl group-hover:scale-110 transition-transform duration-700 border border-slate-100 relative">
                                <div className="absolute inset-0 bg-primary-500/5 rounded-[2rem] animate-pulse"></div>
                                <ClipboardList size={40} className="relative z-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">No Logs Found</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic max-w-xs mx-auto">No weekly logs have been submitted by the student yet.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-100">
                <Link to="/dashboard/supervisor/students" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary-600 transition-all no-underline flex items-center gap-4 group italic">
                    <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform duration-500" /> Student List
                </Link>
                <Link to="/dashboard/supervisor/marking" className="btn-premium from-slate-900 to-slate-800 py-5 px-12 text-[10px] font-black uppercase tracking-[0.3em] no-underline shadow-4xl shadow-slate-900/20 active:scale-95 flex items-center gap-4 group italic">
                    Final Assessment
                </Link>
            </div>

            {/* Review Modal */}
            {reviewModalLog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-4xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Grade Weekly Log</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Provide feedback and marks for week {reviewModalLog.weekNumber}</p>
                            </div>
                            <button onClick={() => setReviewModalLog(null)} className="p-3 bg-white text-slate-300 hover:text-rose-500 rounded-2xl shadow-xl transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="overflow-y-auto w-full">
                            <form onSubmit={submitReview} className="p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Verification Status</label>
                                        <select
                                            className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-3xl text-sm font-black outline-none transition-all"
                                            value={reviewData.status}
                                            onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
                                            required
                                        >
                                            <option value="approved">Approve & Grade</option>
                                            <option value="rejected">Flag / Reject</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Weekly Marks (/100)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="e.g. 85"
                                            className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-3xl text-sm font-black outline-none transition-all placeholder:text-slate-200"
                                            value={reviewData.marks}
                                            onChange={(e) => setReviewData({ ...reviewData, marks: e.target.value })}
                                            required={reviewData.status === 'approved'}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Supervisor Remarks</label>
                                    <textarea
                                        required
                                        rows="4"
                                        placeholder="Provide detailed feedback on the student's tasks and challenges this week..."
                                        className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-3xl text-sm font-black outline-none transition-all placeholder:text-slate-200 resize-none leading-relaxed"
                                        value={reviewData.supervisorComments}
                                        onChange={(e) => setReviewData({ ...reviewData, supervisorComments: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={actionLoading === reviewModalLog._id}
                                    className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] shadow-3xl shadow-slate-200 hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 transition-all"
                                >
                                    {actionLoading === reviewModalLog._id ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} className={reviewData.status === 'approved' ? "text-emerald-400" : "text-rose-400"} />}
                                    Confirm Validation
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogReviews;