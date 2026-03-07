import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Clock, FileText, XCircle, RefreshCw, ChevronRight, Loader2, X, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';
import StatusBadge from '../../components/common/StatusBadge';

const StudentApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await API.get('/applications/my-applications');
                const apps = response.data.data.applications;
                setApplications(apps);

                // Calculate local stats
                const s = { pending: 0, approved: 0, rejected: 0 };
                apps.forEach(app => {
                    if (app.status === 'pending') s.pending++;
                    else if (['approved', 'industry_selected', 'completed'].includes(app.status)) s.approved++;
                    else if (app.status === 'rejected') s.rejected++;
                });
                setStats(s);
            } catch (err) {
                console.error('Error fetching applications:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    return (
        <>
            <div className="space-y-12 animate-fade-in pb-12">
                <SectionHeader
                    title="My Applications"
                    subtitle="Applications"
                    description="Track the status of your internship applications and career progress."
                    icon={FileText}
                    linkTo="/dashboard/student/hub"
                    linkText="New Application"
                    gradientFrom="from-primary-600"
                    gradientTo="to-indigo-500"
                />

                {/* Stats Grid - Premium Glass */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Pending', count: stats.pending, color: 'text-amber-600 bg-amber-50', icon: Clock, trend: 'Under Review' },
                        { label: 'Accepted', count: stats.approved, color: 'text-emerald-600 bg-emerald-50', icon: FileText, trend: 'Active' },
                        { label: 'Rejected', count: stats.rejected, color: 'text-rose-600 bg-rose-50', icon: XCircle, trend: 'Not Accepted' }
                    ].map((item) => (
                        <div key={item.label} className="glass-card p-10 flex flex-col justify-between group hover:border-slate-100 transition-all shadow-xl shadow-slate-200/30">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-4 rounded-2xl ${item.color} group-hover:scale-110 transition-transform shadow-inner`}>
                                    <item.icon size={28} />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                    {item.trend}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                                    {item.count.toString().padStart(2, '0')}
                                </h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 italic">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* History Table - Premium Glass */}
                <div className="glass-card overflow-hidden border-none shadow-3xl shadow-slate-200/50">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-slate-900 text-primary-400 rounded-xl">
                                <RefreshCw size={18} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Application History</h2>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">All your past and current applications</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40 space-y-6">
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-slate-100 rounded-full animate-spin border-t-primary-500"></div>
                                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-primary-500 animate-pulse" />
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] font-inter">Loading Applications...</p>
                            </div>
                        ) : applications.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Internship</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date Applied</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {applications.map(app => (
                                        <tr key={app._id} className="hover:bg-slate-50/40 transition-all group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-slate-900 text-primary-500 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform overflow-hidden border border-white/5 shrink-0">
                                                        {app.internship?.industry?.avatar ? (
                                                            <img src={app.internship.industry.avatar} alt={app.internship.companyName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            app.internship?.companyName?.charAt(0) || 'I'
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-black text-slate-900 leading-none uppercase tracking-tight group-hover:text-primary-600 transition-colors">{app.internship?.title}</p>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] mt-2 italic">{app.internship?.companyName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                    <span className="text-[9px] font-medium text-slate-300 uppercase tracking-widest mt-1">Submitted</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <StatusBadge status={app.status} />
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setSelectedApp(app)}
                                                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 hover:shadow-xl transition-all active:scale-95"
                                                    >
                                                        View Details
                                                        <ChevronRight size={14} className="text-primary-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-40 text-center group">
                                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-slate-200 mx-auto mb-8 group-hover:scale-110 transition-transform border border-slate-100 relative">
                                    <div className="absolute inset-0 bg-primary-500/5 rounded-[2rem] animate-pulse"></div>
                                    <FileText size={40} className="relative z-10" />
                                </div>
                                <h4 className="text-xl font-black text-slate-900 uppercase">No Applications Yet</h4>
                                <p className="text-slate-400 text-xs font-bold mt-3 uppercase tracking-widest italic">You haven't applied to any internships yet.</p>
                                <Link to="/dashboard/student/hub" className="btn-premium from-primary-600 to-indigo-500 py-4 px-10 mt-10 inline-flex group no-underline">
                                    Browse Internships <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Application Details Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
                    <div
                        className="relative bg-white rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.25)] w-full max-w-2xl p-10 md:p-12 animate-fade-in overflow-y-auto max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button onClick={() => setSelectedApp(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                            <X size={20} />
                        </button>

                        {/* Header */}
                        <div className="mb-10 flex items-start gap-6">
                            <div className="w-20 h-20 bg-slate-900 text-primary-500 rounded-[2rem] flex items-center justify-center font-black text-2xl shadow-xl shadow-slate-200 border border-white/5 shrink-0 overflow-hidden">
                                {selectedApp.internship?.industry?.avatar ? (
                                    <img src={selectedApp.internship.industry.avatar} alt={selectedApp.internship.companyName} className="w-full h-full object-cover" />
                                ) : (
                                    selectedApp.internship?.companyName?.charAt(0) || 'I'
                                )}
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full border border-primary-100 mb-2">
                                    <StatusBadge status={selectedApp.status} showLabel={false} />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-600">
                                        {selectedApp.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{selectedApp.internship?.title}</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2 italic">{selectedApp.internship?.companyName}</p>
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-8">
                            {/* Status Timeline / Info */}
                            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem]">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2 mb-4">
                                    <CheckCircle2 size={14} className="text-primary-500" />
                                    Application Status
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-600">Applied On</span>
                                        <span className="font-black text-slate-900 tracking-tighter">
                                            {new Date(selectedApp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-200/50">
                                        <span className="font-bold text-slate-600">Current Phase</span>
                                        <span className="font-black text-slate-900 tracking-tighter capitalize">
                                            {selectedApp.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Section */}
                            {selectedApp.feedback && (
                                <div className="p-8 bg-red-50 border border-red-100 rounded-[2rem]">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 flex items-center gap-2 mb-4">
                                        <AlertCircle size={14} />
                                        Supervisor Feedback
                                    </h4>
                                    <p className="text-sm text-red-700 leading-relaxed font-medium italic whitespace-pre-wrap">
                                        {selectedApp.feedback}
                                    </p>
                                </div>
                            )}

                            {/* Cover Letter */}
                            {selectedApp.coverLetter ? (
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2 mb-4 px-2">
                                        <MessageSquare size={14} className="text-primary-500" />
                                        Your Cover Letter
                                    </h4>
                                    <div className="p-8 bg-white border border-slate-200 shadow-sm rounded-[2rem] text-sm text-slate-600 leading-relaxed font-medium italic whitespace-pre-wrap">
                                        {selectedApp.coverLetter}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">No cover letter submitted.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentApplications;
