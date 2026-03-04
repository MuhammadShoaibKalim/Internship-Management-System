import React, { useState, useEffect } from 'react';
import { Plus, Info, CheckCircle2, AlertCircle, FileText, Send, Loader2, X } from 'lucide-react';
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
        learningOutcomes: ''
    });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await API.get('/logs/my-logs');
            setLogs(response.data.data.logs);
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
            await API.post('/logs/submit-log', newLog);
            setShowModal(false);
            setNewLog({ weekNumber: '', hoursWorked: '', summary: '', learningOutcomes: '' });
            fetchLogs();
            alert('Log submitted successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit log');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight text-uppercase">Weekly Internship Logs</h1>
                    <p className="text-slate-500 font-medium">Document your daily activities and learning progress.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2 px-8 py-4 shadow-2xl shadow-primary-200"
                >
                    <Plus size={20} />
                    Submit New Log
                </button>
            </div>

            {/* ... Deadline Banner ... */}
            <div className="bg-primary-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary-200">
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                        <Info size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Submission Deadline</h2>
                        <p className="text-primary-100 mt-1 opacity-90">Please ensure all logs are submitted by every Friday before 5:00 PM for evaluation.</p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            </div>

            <div className="space-y-6">
                <h2 className="text-lg font-bold text-secondary-900 border-l-4 border-primary-500 pl-4">Record History</h2>

                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Syncing Log Nodes...</p>
                        </div>
                    ) : logs.length > 0 ? (
                        logs.map(log => (
                            <div key={log._id} className="portal-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-transparent hover:border-slate-200 transition-all">
                                <div className="flex gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${log.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : log.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
                                        <span className="text-[10px] font-black leading-none uppercase tracking-tighter">Week</span>
                                        <span className="text-lg font-black leading-none mt-1">{log.weekNumber}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-secondary-900 uppercase tracking-tight">Verified on {new Date(log.createdAt).toLocaleDateString()}</h3>
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${log.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : log.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {log.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm mt-2 line-clamp-1 italic">"{log.summary}"</p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
                                                <Clock size={12} /> {log.hoursWorked} Hours
                                            </div>
                                        </div>
                                        {log.supervisorFeedback && (
                                            <div className={`flex items-start gap-2 mt-4 p-3 rounded-xl border ${log.status === 'rejected' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Supervisor Feedback</p>
                                                    <p className="text-[11px] font-medium leading-relaxed italic">"{log.supervisorFeedback}"</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary-600 rounded-xl transition-colors">
                                        <FileText size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center portal-card border-dashed">
                            <p className="text-slate-400 font-bold italic">No log entries recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Submission Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-xl font-black text-secondary-900 uppercase tracking-tight">Submit Weekly Log</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Week Number</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="e.g. 1"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500/10 outline-none"
                                        value={newLog.weekNumber}
                                        onChange={(e) => setNewLog({ ...newLog, weekNumber: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hours Worked</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="e.g. 40"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500/10 outline-none"
                                        value={newLog.hoursWorked}
                                        onChange={(e) => setNewLog({ ...newLog, hoursWorked: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Work Summary</label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Describe your activities this week..."
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500/10 outline-none resize-none"
                                    value={newLog.summary}
                                    onChange={(e) => setNewLog({ ...newLog, summary: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Learning Outcomes</label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="What did you learn or achieve?"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500/10 outline-none resize-none"
                                    value={newLog.learningOutcomes}
                                    onChange={(e) => setNewLog({ ...newLog, learningOutcomes: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary-200 hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
                            >
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                Transmit Log Data
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const Edit2 = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
);

export default StudentLogs;
