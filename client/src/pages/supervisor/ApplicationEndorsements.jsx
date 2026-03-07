import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CheckCircle2, ClipboardList, Loader2, User, Briefcase, X, ThumbsUp, ThumbsDown, MessageSquare, AlertCircle } from 'lucide-react';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { Link } from 'react-router-dom';

const ApplicationEndorsements = () => {
    const [applications, setApplications] = useState([]);
    const [endorsedStudents, setEndorsedStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [rejectModalApp, setRejectModalApp] = useState(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        fetchApplications();
        fetchEndorsedStudents();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await API.get('/supervisor/pending-applications');
            if (response.data.status === 'success') {
                setApplications(response.data.data.applications);
            }
        } catch (err) {
            console.error('Failed to fetch pending applications:', err);
            toast.error('Failed to load pending applications');
        } finally {
            setLoading(false);
        }
    };

    const fetchEndorsedStudents = async () => {
        try {
            const response = await API.get('/supervisor/students');
            if (response.data.status === 'success') {
                setEndorsedStudents(response.data.data.students || []);
            }
        } catch (err) {
            console.error('Failed to fetch endorsed students:', err);
        }
    };

    const handleEndorse = async (id, status) => {
        setActionLoading(id + status);
        try {
            await API.patch(`/supervisor/applications/${id}/endorse`, { status, feedback });
            const label = status === 'supervisor_endorsed' ? 'endorsed' : 'rejected';
            toast.success(`Application ${label} successfully!`);
            setSelectedApp(null);
            setRejectModalApp(null);
            setFeedback('');
            fetchApplications();
            fetchEndorsedStudents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-primary-600" size={40} />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loading Applications...</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-12 animate-fade-in pb-20">
                <SectionHeader
                    title="Endorsements"
                    subtitle="Supervisor Sub-Page"
                    description="Review and endorse student internship applications"
                    icon={CheckCircle2}
                    gradientFrom="from-primary-600"
                    gradientTo="to-indigo-600"
                >
                    <div className="px-8 py-5 bg-slate-900 border border-slate-800 rounded-[2rem] text-white text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 shadow-4xl shadow-slate-900/20">
                        <ClipboardList size={20} className="text-primary-400" />
                        Pending: <span className="text-primary-400 text-sm tracking-tighter italic">{applications.length.toString().padStart(2, '0')}</span>
                    </div>
                </SectionHeader>

                <div className="glass-card overflow-hidden bg-white/40 border-none rounded-[3rem] shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-1000"></div>

                    <table className="w-full text-left relative z-10">
                        <thead>
                            <tr className="bg-slate-900 text-white/70 uppercase text-[9px] font-black tracking-widest border-b border-white/5">
                                <th className="py-8 px-10">Student Profile</th>
                                <th className="py-8 px-10">Internship Placement</th>
                                <th className="py-8 px-10">Endorsement Status</th>
                                <th className="py-8 px-10 text-right">Action Required</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50">
                            {/* 1. Pending Applications */}
                            {applications.map(app => (
                                <tr key={app._id} className="group hover:bg-white/80 transition-all duration-300">
                                    <td className="py-8 px-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
                                                {app.student?.avatar ? (
                                                    <img src={app.student.avatar} alt={app.student.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-white text-lg font-black italic">{app.student?.name?.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-base font-black text-slate-900 uppercase tracking-tighter block">{app.student?.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-1">{app.student?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-10">
                                        <span className="text-sm font-black text-slate-700 uppercase tracking-tight block italic">{app.internship?.title}</span>
                                        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em] block mt-1">{app.internship?.companyName}</span>
                                    </td>
                                    <td className="py-8 px-10">
                                        <div className="flex items-center gap-4">
                                            <StatusBadge status="applied" />
                                            {app.coverLetter && (
                                                <button
                                                    onClick={() => setSelectedApp(selectedApp?._id === app._id ? null : app)}
                                                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                                                    title="View Statement"
                                                >
                                                    <MessageSquare size={14} />
                                                </button>
                                            )}
                                        </div>
                                        {selectedApp?._id === app._id && (
                                            <div className="mt-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-100 text-[11px] font-semibold text-primary-800 italic animate-slide-down">
                                                "{app.coverLetter}"
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-8 px-10 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleEndorse(app._id, 'supervisor_endorsed')}
                                                disabled={actionLoading === app._id + 'supervisor_endorsed'}
                                                className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
                                            >
                                                {actionLoading === app._id + 'supervisor_endorsed' ? <Loader2 size={12} className="animate-spin" /> : <ThumbsUp size={12} />}
                                                Endorse
                                            </button>
                                            <button
                                                onClick={() => setRejectModalApp(app)}
                                                disabled={actionLoading === app._id + 'rejected'}
                                                className="w-10 h-10 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-inner disabled:opacity-50"
                                            >
                                                <ThumbsDown size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {/* 2. Endorsed History */}
                            {endorsedStudents.map((student) => (
                                <tr key={student._id} className="group hover:bg-emerald-50/30 transition-all duration-300">
                                    <td className="py-8 px-10 opacity-70 group-hover:opacity-100">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                                {student.avatar ? (
                                                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={20} className="text-slate-300" />
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-sm font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-tighter block">{student.name}</span>
                                                <span className="text-[9px] font-bold text-slate-300 group-hover:text-slate-400 uppercase tracking-widest block mt-1 italic">Verified Intern</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-10 opacity-70 group-hover:opacity-100">
                                        <span className="text-[11px] font-black text-slate-400 group-hover:text-slate-600 uppercase tracking-tight block italic">
                                            {student.studentMeta?.currentApplication?.internship?.title || 'Placement Confirmed'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-300 group-hover:text-primary-400 uppercase tracking-widest mt-1">
                                            {student.studentMeta?.currentApplication?.internship?.companyName || 'IMS Partner'}
                                        </span>
                                    </td>
                                    <td className="py-8 px-10">
                                        <StatusBadge status={student.status} />
                                    </td>
                                    <td className="py-8 px-10 text-right">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                            <CheckCircle2 size={12} className="text-emerald-500" /> Endorsed
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {applications.length === 0 && endorsedStudents.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <ClipboardList size={40} className="text-slate-100" />
                                            <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] italic">No Student Records Found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rejection Modal */}
            {rejectModalApp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-4xl overflow-hidden animate-slide-up border border-white/20">
                        <div className="p-12 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Decline Application</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Provide professional feedback</p>
                            </div>
                            <button onClick={() => setRejectModalApp(null)} className="p-4 bg-white text-slate-300 hover:text-rose-500 rounded-2xl shadow-xl transition-all hover:rotate-90">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-12 space-y-8">
                            <div className="flex items-center gap-6 p-6 bg-rose-50/50 rounded-[2rem] border border-rose-100/50">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                                    <AlertCircle size={28} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-rose-400 tracking-widest">Notice</p>
                                    <p className="text-[11px] font-bold text-slate-600 italic leading-tight">Your feedback will be shared directly with {rejectModalApp.student?.name} for their improvement.</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-4 italic">Reason for Rejection</label>
                                <textarea
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-[2.5rem] p-8 text-sm text-slate-700 font-bold focus:outline-none focus:border-slate-900 focus:bg-white transition-all h-40 resize-none shadow-inner"
                                    placeholder="Explain the decision professionally..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-5 pt-4">
                                <button
                                    onClick={() => setRejectModalApp(null)}
                                    className="flex-1 py-5 bg-white text-slate-400 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-100 italic"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleEndorse(rejectModalApp._id, 'rejected')}
                                    disabled={!feedback.trim() || actionLoading === rejectModalApp._id + 'rejected'}
                                    className="flex-[2] py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all flex items-center justify-center gap-3 shadow-4xl shadow-slate-900/20 disabled:opacity-50 italic group/confirm"
                                >
                                    {actionLoading === rejectModalApp._id + 'rejected' ? <Loader2 size={18} className="animate-spin" /> : <ThumbsDown size={18} className="text-rose-400 group-hover/confirm:text-white transition-colors" />}
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Spacer */}
            <div className="h-10"></div>
        </>
    );
};

export default ApplicationEndorsements;
