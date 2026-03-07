import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, Calendar, Users, CheckSquare, MessageSquare, ExternalLink, Download, Loader2, Sparkles, Filter, X, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { format } from 'date-fns';
import SectionHeader from '../../components/common/SectionHeader';

const IndustryApplicants = () => {
    const [loading, setLoading] = useState(true);
    const [applicants, setApplicants] = useState([]);
    const [filter, setFilter] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const response = await API.get('/industry/applicants');
            if (response.data.status === 'success') {
                setApplicants(response.data.data.applicants);
            }
        } catch (err) {
            console.error('Failed to fetch applicants:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            setActionLoading(id);
            const response = await API.patch(`/industry/applicants/${id}/status`, { status });
            if (response.data.status === 'success') {
                setApplicants(applicants.map(app => app._id === id ? { ...app, status } : app));
                toast.success(`Application ${status} successfully!`);
            }
        } catch (err) {
            console.error('Failed to update status:', err);
            toast.error('Failed to update applicant status');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredApplicants = applicants.filter(app =>
        app.student?.name?.toLowerCase().includes(filter.toLowerCase()) ||
        app.internship?.title?.toLowerCase().includes(filter.toLowerCase()) ||
        app.student?.university?.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-primary-600" size={40} />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loading Applicants...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <SectionHeader
                title="Talent Tracking"
                subtitle="Industry Sub-Page"
                description="Review and manage student applications"
                icon={Users}
                gradientFrom="from-primary-600"
                gradientTo="to-indigo-600"
            >
                <div className="relative group">
                    <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search talent database..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-14 pr-6 py-4 bg-white/50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all w-64 md:w-80 shadow-sm"
                    />
                </div>
            </SectionHeader>

            {filteredApplicants.length === 0 ? (
                <div className="glass-card p-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/40 border-dashed border-2 border-slate-200">
                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 shadow-xl group-hover:scale-110 transition-transform duration-700 border border-slate-100 relative">
                        <div className="absolute inset-0 bg-primary-500/5 rounded-[2rem] animate-pulse"></div>
                        <Sparkles size={40} className="relative z-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No Applicants Found</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic max-w-xs mx-auto">No applicants match your search criteria.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-10">
                    {filteredApplicants.map(applicant => (
                        <div key={applicant._id} className="glass-card p-10 hover:border-primary-200 transition-all duration-700 group shadow-sm hover:shadow-4xl hover:shadow-primary-500/10 bg-white/60 relative overflow-hidden rounded-[3rem]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-primary-50 transition-all duration-1000"></div>

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
                                <div className="flex gap-8 items-start">
                                    <div className="w-24 h-24 relative shrink-0 group/avatar">
                                        {/* Simple Circle Frame */}
                                        <div className="absolute inset-0 z-10 bg-white rounded-full p-1 shadow-2xl border-2 border-white overflow-hidden transition-transform duration-700">
                                            <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center overflow-hidden relative">
                                                <div className="absolute inset-0 bg-primary-500/5 animate-pulse"></div>
                                                {applicant.student?.avatar ? (
                                                    <img src={applicant.student.avatar} alt={applicant.student.name} className="w-full h-full object-cover relative z-10" />
                                                ) : (
                                                    <User size={32} className="text-slate-300 relative z-10" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{applicant.student?.name}</h3>
                                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border ${applicant.status === 'supervisor_endorsed' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    applicant.status === 'shortlisted' ? 'bg-primary-50 text-primary-600 border-primary-100' :
                                                        applicant.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            'bg-slate-50 text-slate-600 border-slate-100'
                                                    }`}>
                                                    {applicant.status === 'supervisor_endorsed' ? 'Academic Endorsed' :
                                                        applicant.status === 'approved' ? 'Hired' :
                                                            applicant.status}
                                                </span>
                                            </div>
                                            <p className="text-xs font-black text-primary-600 uppercase tracking-[0.1em]">{applicant.student?.studentMeta?.department || 'Partner Institute'}</p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
                                            <div className="flex items-center gap-3 text-slate-400 group/link">
                                                <Mail size={16} className="shrink-0 group-hover/link:text-primary-500 transition-colors" />
                                                <span className="text-[11px] font-bold text-slate-500 tracking-tight">{applicant.student?.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-400 group/link">
                                                <Briefcase size={16} className="shrink-0 group-hover/link:text-primary-500 transition-colors" />
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{applicant.internship?.title}</span>
                                            </div>
                                            {applicant.student?.studentMeta?.supervisor && (
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <User size={16} className="shrink-0 text-amber-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Endorsed by Faculty</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 text-slate-400 lg:border-l lg:border-slate-100 lg:pl-8">
                                                <Calendar size={16} className="shrink-0" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                                    Applied on: {format(new Date(applicant.createdAt), 'MMM dd, yyyy')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 pt-8 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto">
                                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm active:scale-95">
                                        <Download size={18} /> Download CV
                                    </button>

                                    {(applicant.status === 'supervisor_endorsed' || applicant.status === 'shortlisted') && (
                                        <div className="flex gap-4 w-full lg:w-auto">
                                            {applicant.status === 'supervisor_endorsed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(applicant._id, 'shortlisted')}
                                                    disabled={actionLoading === applicant._id}
                                                    className="flex-1 lg:flex-none px-8 py-4 bg-primary-50 text-primary-600 border-2 border-primary-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary-100 transition-all shadow-sm disabled:opacity-50 active:scale-95 flex items-center gap-3"
                                                >
                                                    {actionLoading === applicant._id ? <Loader2 size={16} className="animate-spin" /> : <CheckSquare size={16} />}
                                                    Shortlist
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleStatusUpdate(applicant._id, 'approved')}
                                                disabled={actionLoading === applicant._id}
                                                className="flex-1 lg:flex-none px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-700 hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                                            >
                                                {actionLoading === applicant._id ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                                Hire Intern
                                            </button>

                                            <button
                                                onClick={() => handleStatusUpdate(applicant._id, 'rejected')}
                                                disabled={actionLoading === applicant._id}
                                                className="p-4 bg-rose-50 text-rose-500 border-2 border-rose-100 rounded-2xl hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50 active:scale-95"
                                                title="Decline Application"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}

                                    {(applicant.status === 'approved' || applicant.status === 'rejected') && (
                                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed animate-pulse">
                                            {applicant.status === 'approved' ? 'Successfully Hired' : 'Decision Finalized'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IndustryApplicants;
