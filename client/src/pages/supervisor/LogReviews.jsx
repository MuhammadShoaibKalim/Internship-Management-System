import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, XCircle, Clock, ArrowLeft, Search, Filter, MessageSquare, Download, Loader2, AlertCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../services/api';

const LogReviews = () => {
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('student');
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // ID of log being processed

    useEffect(() => {
        fetchLogs();
    }, [studentId]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const endpoint = studentId ? `/logs?student=${studentId}` : '/supervisor/stats'; // Logs usually tied to student or general stats
            const response = await API.get('/logs'); // Assuming a general logs endpoint exists or supervisor can see all
            
            if (response.data.status === 'success') {
                let allLogs = response.data.data.logs || [];
                
                // If studentId filter is present in URL
                if (studentId) {
                    allLogs = allLogs.filter(l => l.student._id === studentId);
                }

                setLogs(allLogs);
                
                // Calculate basic stats locally from fetched data
                const pending = allLogs.filter(l => l.status === 'pending').length;
                const approved = allLogs.filter(l => l.status === 'approved').length;
                setStats({ pending, approved, total: allLogs.length });
            }
        } catch (err) {
            console.error('Failed to load logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (id, status) => {
        try {
            setActionLoading(id);
            const response = await API.patch(`/supervisor/logs/${id}`, { status });
            if (response.data.status === 'success') {
                setLogs(prev => prev.map(l => l._id === id ? { ...l, status } : l));
                // Update stats
                setStats(prev => ({
                    ...prev,
                    pending: status === 'approved' ? prev.pending - 1 : prev.pending,
                    approved: status === 'approved' ? prev.approved + 1 : prev.approved
                }));
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update log status');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header omitted */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link to="/dashboard/supervisor" className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-[10px] uppercase tracking-widest mb-2 no-underline transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Weekly Log Reviews</h1>
                    <p className="text-slate-500 font-medium italic">Validate and provide feedback on student weekly progress reports.</p>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="portal-card p-6 bg-white border-l-4 border-l-amber-400">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Waiting Review</p>
                    <p className="text-3xl font-black text-secondary-900">{stats.pending}</p>
                </div>
                <div className="portal-card p-6 bg-white border-l-4 border-l-emerald-500">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Approved Records</p>
                    <p className="text-3xl font-black text-secondary-900">{stats.approved}</p>
                </div>
                <div className="portal-card p-6 bg-white border-l-4 border-l-primary-500">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Logs Synced</p>
                    <p className="text-3xl font-black text-secondary-900">{stats.total}</p>
                </div>
            </div>

            {loading ? (
                <div className="portal-card p-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Accessing Weekly Logs Repository...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {logs.length > 0 ? (
                        logs.map(log => (
                            <div key={log._id} className="portal-card p-8 bg-white group hover:border-primary-100 transition-all">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    <div className="lg:w-1/4 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center font-black">
                                                {log.student?.name?.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-secondary-900 leading-tight">{log.student?.name}</h4>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WEEK {log.weekNumber} • {new Date(log.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-50">
                                            <Clock size={16} className="text-slate-400" />
                                            <span className="text-xs font-bold text-secondary-900">{log.hoursWorked || 0} Hours Logged</span>
                                        </div>
                                        <StatusBadge status={log.status} />
                                    </div>

                                    <div className="lg:w-1/2 space-y-4">
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Work Accomplished</h5>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4">
                                            "{log.content}"
                                        </p>
                                    </div>

                                    <div className="lg:w-1/4 flex flex-col justify-center gap-3">
                                        {log.status === 'pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleReview(log._id, 'approved')}
                                                    disabled={actionLoading === log._id}
                                                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
                                                >
                                                    {actionLoading === log._id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                                    Approve Log
                                                </button>
                                                <button 
                                                    onClick={() => handleReview(log._id, 'rejected')}
                                                    disabled={actionLoading === log._id}
                                                    className="w-full py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
                                                >
                                                    <XCircle size={18} className="inline mr-2" /> Request Revision
                                                </button>
                                            </>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-default border border-slate-100">
                                                    <CheckCircle2 size={18} /> Processed
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="flex-1 p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary-600 rounded-xl transition-all">
                                                        <MessageSquare size={18} className="mx-auto" />
                                                    </button>
                                                    <button className="flex-1 p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary-600 rounded-xl transition-all">
                                                        <Download size={18} className="mx-auto" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                             <ClipboardList className="mx-auto text-slate-200 mb-4" size={48} />
                             <p className="text-sm font-bold text-slate-400 italic">No weekly logs found in the repository.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Navigation CTA omitted */}
            <div className="flex justify-between items-center pt-6">
                <Link to="/dashboard/supervisor/students" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors no-underline flex items-center gap-2 uppercase tracking-widest font-black">
                    <ArrowLeft size={14} /> Back to Student List
                </Link>
                <Link to="/dashboard/supervisor/marking" className="btn-primary py-4 px-10 text-[10px] font-black uppercase tracking-widest no-underline shadow-xl shadow-primary-50">
                    Final Assessments
                </Link>
            </div>
        </div>
    );
};

export default LogReviews;

            {/* Navigation CTA */}
            <div className="flex justify-between items-center pt-6">
                <Link to="/dashboard/supervisor/students" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors no-underline flex items-center gap-2">
                    <ArrowLeft size={14} /> Back to Student List
                </Link>
                <Link to="/dashboard/supervisor/marking" className="btn-primary py-4 px-10 text-[10px] font-black uppercase tracking-widest no-underline shadow-xl shadow-primary-50">
                    Final Assessments
                </Link>
            </div>
        </div>
    );
};

export default LogReviews;
