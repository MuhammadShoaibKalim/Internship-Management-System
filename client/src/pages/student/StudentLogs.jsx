import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Info, CheckCircle2, FileText, Send, Loader2, X, Clock, Star } from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import API from '../../services/api';

const StudentLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newLog, setNewLog] = useState({
        weekNumber: '',
        hoursWorked: '',
        summary: '',
        learningOutcomes: '',
        attachment: null
    });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await API.get('/logs/my-logs');
            setLogs(response.data.data.logs || []);
        } catch (err) {
            console.error('Error fetching logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('weekNumber', newLog.weekNumber);
            formData.append('hoursWorked', newLog.hoursWorked);
            formData.append('summary', newLog.summary);
            formData.append('learningOutcomes', newLog.learningOutcomes);
            if (newLog.attachment) {
                formData.append('document', newLog.attachment);
            }

            await API.post('/logs/submit-log', formData);
            setShowModal(false);
            setNewLog({ weekNumber: '', hoursWorked: '', summary: '', learningOutcomes: '', attachment: null });
            fetchLogs();
            toast.success('Weekly log submitted successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit log');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Filter: show all submitted/reviewed logs + only the NEXT pending_student week IF assigned by industry ──
    const pendingLogs = logs.filter(l => l.status === 'pending_student').sort((a, b) => a.weekNumber - b.weekNumber);
    const submittedLogs = logs.filter(l => l.status !== 'pending_student').sort((a, b) => b.weekNumber - a.weekNumber);

    // Only show the next pending log IF industry has assigned tasks for it
    // Ignore legacy placeholders starting with "Planned goals"
    const activePendingLog = pendingLogs.length > 0 &&
        typeof pendingLogs[0].assignedTasks === 'string' &&
        pendingLogs[0].assignedTasks.trim() !== '' &&
        !pendingLogs[0].assignedTasks.includes('Planned goals for week')
        ? [pendingLogs[0]]
        : [];

    const displayedLogs = [...submittedLogs, ...activePendingLog];
    const hiddenPendingCount = pendingLogs.length - activePendingLog.length;

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            <SectionHeader
                title="Weekly Logs"
                subtitle="Weekly Logs"
                description="Document your weekly activities and track your internship progress."
                icon={FileText}
                gradientFrom="from-primary-600"
                gradientTo="to-indigo-500"
            />

            {/* Deadline Banner */}
            <div className="glass-card bg-slate-900 border-none p-10 text-white relative overflow-hidden shadow-3xl shadow-primary-500/20 group hover:bg-slate-900 transition-colors duration-500">
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                        <Info size={36} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Submission Deadline</h2>
                        <p className="text-primary-100/70 text-lg font-medium mt-2 leading-relaxed italic">
                            All weekly logs must be <span className="text-primary-400 font-bold">submitted</span> by Friday 17:00 for academic review.
                        </p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full -mr-40 -mt-40 blur-[80px]" />
            </div>

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-6 w-1.5 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Log History</h2>
                    </div>
                    {hiddenPendingCount > 0 && (
                        <span className="px-4 py-2 bg-primary-50 border border-primary-100 text-primary-600 text-[9px] font-black uppercase tracking-widest rounded-xl">
                            {hiddenPendingCount} more week{hiddenPendingCount > 1 ? 's' : ''} planned ahead
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-slate-100 rounded-full animate-spin border-t-primary-500"></div>
                                <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary-500 animate-pulse" />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Loading Logs...</p>
                        </div>
                    ) : displayedLogs.length > 0 ? (
                        displayedLogs.map(log => (
                            <div key={log._id} className="glass-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 border-transparent hover:border-primary-100 hover:shadow-4xl transition-all duration-500 group">
                                <div className="flex gap-8 flex-1">
                                    {/* Week badge */}
                                    <div className={`w-20 h-20 rounded-[1.5rem] flex flex-col items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 ${log.status === 'approved' ? 'bg-emerald-500 text-white' :
                                        log.status === 'rejected' ? 'bg-rose-500 text-white' :
                                            log.status === 'pending_student' ? 'bg-white border-2 border-slate-100 text-slate-300' :
                                                'bg-slate-900 text-primary-400'
                                        }`}>
                                        <span className="text-[9px] font-black leading-none uppercase tracking-widest opacity-80">Week</span>
                                        <span className="text-3xl font-black leading-none mt-1 tracking-tighter">{log.weekNumber}</span>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                                {log.status === 'pending_student'
                                                    ? `Week ${log.weekNumber} — Assigned`
                                                    : `Submitted: ${new Date(log.createdAt).toLocaleDateString()}`}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${log.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                log.status === 'rejected' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                                    log.status === 'pending_student' ? 'bg-primary-50 border-primary-100 text-primary-500' :
                                                        'bg-slate-50 border-slate-100 text-slate-500'
                                                }`}>
                                                {log.status === 'approved' ? 'Verified' :
                                                    log.status === 'rejected' ? 'Flagged' :
                                                        log.status === 'pending_student' ? 'Fill Now' :
                                                            'Reviewing'}
                                            </span>
                                        </div>

                                        {/* Summary / assigned tasks */}
                                        {log.status === 'pending_student' ? (
                                            log.assignedTasks ? (
                                                <div className="mt-4 p-5 bg-primary-50 border border-primary-100 rounded-2xl">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary-400 mb-3 flex items-center gap-2">
                                                        <FileText size={12} /> This Week's Tasks
                                                    </p>
                                                    <ul className="space-y-2">
                                                        {log.assignedTasks.split('\n').filter(t => t.trim() !== '').map((task, idx) => (
                                                            <li key={idx} className="text-sm font-bold text-primary-700 leading-relaxed italic flex items-start gap-2">
                                                                <span className="text-primary-300 mt-0.5 shrink-0">•</span>
                                                                <span>{task}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <p className="text-slate-400 text-xs mt-3 italic font-bold uppercase tracking-widest">Awaiting task assignment from industry...</p>
                                            )
                                        ) : (
                                            <p className="text-slate-500 text-sm mt-3 line-clamp-1 italic font-medium leading-relaxed">"{log.summary}"</p>
                                        )}

                                        <div className="flex items-center gap-4 mt-4">
                                            {log.status !== 'pending_student' && (
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100/50">
                                                    <Clock size={14} className="text-primary-500" /> {log.hoursWorked} Hours
                                                </div>
                                            )}
                                            {log.marks !== undefined && log.marks !== null && (
                                                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100/50">
                                                    <Star size={14} className="text-emerald-500" /> Grade: {log.marks}/100
                                                </div>
                                            )}
                                        </div>

                                        {/* Feedback sections */}
                                        {log.status !== 'pending_student' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                                {log.supervisorComments && (
                                                    <div className={`p-4 rounded-2xl border flex flex-col gap-2 ${log.status === 'rejected' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Faculty Insight</p>
                                                        </div>
                                                        <p className="text-[12px] font-semibold leading-relaxed italic">"{log.supervisorComments}"</p>
                                                    </div>
                                                )}
                                                {log.industryComments && (
                                                    <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 text-indigo-700 flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <Star size={14} className="text-indigo-500 fill-indigo-500" />
                                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Industry Review {log.industryMarks && `(${log.industryMarks}/100)`}</p>
                                                        </div>
                                                        <p className="text-[12px] font-semibold leading-relaxed italic">"{log.industryComments}"</p>
                                                    </div>
                                                )}
                                                {log.assignedTasks && (
                                                    <div className="p-4 rounded-2xl border border-primary-100 bg-primary-50/30 text-primary-700 flex flex-col gap-2 md:col-span-2">
                                                        <div className="flex items-center gap-2">
                                                            <Plus size={14} className="text-primary-500" />
                                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Next Week's Directive</p>
                                                        </div>
                                                        <p className="text-[12px] font-bold leading-relaxed italic">"{log.assignedTasks}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action col */}
                                <div className="flex flex-col gap-3 min-w-[120px]">
                                    {log.status === 'pending_student' ? (
                                        <button
                                            onClick={() => {
                                                setNewLog({ ...newLog, weekNumber: log.weekNumber });
                                                setShowModal(true);
                                            }}
                                            className="py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary-500 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Send size={16} /> Fill Now
                                        </button>
                                    ) : (
                                        log.attachment?.url && (
                                            <a
                                                href={`http://localhost:4000${log.attachment.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 flex items-center justify-center bg-primary-50 text-primary-500 border border-primary-100 rounded-xl hover:bg-primary-500 hover:text-white transition-all shadow-sm active:scale-95 mx-auto"
                                                title="View Attachment"
                                            >
                                                <FileText size={20} />
                                            </a>
                                        )
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-32 text-center glass-card border-dashed group rounded-[3rem]">
                            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto mb-8 group-hover:scale-110 transition-transform shadow-xl border border-slate-100 relative">
                                <div className="absolute inset-0 bg-primary-500/5 rounded-[2rem] animate-pulse"></div>
                                <Send size={40} className="relative z-10" />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 uppercase">No Logs Yet</h4>
                            <p className="text-slate-400 text-xs font-bold mt-3 uppercase tracking-widest italic">You haven't submitted any weekly logs yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Submission Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-4xl overflow-hidden animate-slide-up">
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Submit Weekly Log</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Send your weekly progress report to your supervisor</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 bg-white text-slate-300 hover:text-rose-500 rounded-2xl shadow-xl transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Week Number</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="e.g. 1"
                                        className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-3xl text-sm font-black outline-none transition-all placeholder:text-slate-200"
                                        value={newLog.weekNumber}
                                        onChange={(e) => setNewLog({ ...newLog, weekNumber: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Hours Worked (Max 40)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="40"
                                        placeholder="e.g. 40"
                                        className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-3xl text-sm font-black outline-none transition-all placeholder:text-slate-200"
                                        value={newLog.hoursWorked}
                                        onChange={(e) => {
                                            const val = Math.min(Math.max(0, e.target.value), 40);
                                            setNewLog({ ...newLog, hoursWorked: val === 0 && e.target.value === '' ? '' : val });
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Activity Summary</label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Describe your weekly activities and tasks..."
                                    className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-3xl text-sm font-black outline-none transition-all placeholder:text-slate-200 resize-none leading-relaxed"
                                    value={newLog.summary}
                                    onChange={(e) => setNewLog({ ...newLog, summary: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Learning Outcomes</label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Document growth and specialized achievements..."
                                    className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-3xl text-sm font-black outline-none transition-all placeholder:text-slate-200 resize-none leading-relaxed"
                                    value={newLog.learningOutcomes}
                                    onChange={(e) => setNewLog({ ...newLog, learningOutcomes: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-2">
                                    <FileText size={12} /> Optional Attachment (PDF/Image)
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,image/jpeg,image/png,image/jpg,.doc,.docx"
                                    className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-3xl text-sm cursor-pointer file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 transition-all font-medium text-slate-500"
                                    onChange={(e) => setNewLog({ ...newLog, attachment: e.target.files[0] })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] shadow-3xl shadow-slate-200 hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 transition-all"
                            >
                                {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="text-primary-400" />}
                                Submit Log
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentLogs;
