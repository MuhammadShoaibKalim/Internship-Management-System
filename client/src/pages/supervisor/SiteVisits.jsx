import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Phone, CheckCircle2, ArrowLeft, ArrowRight, Plus, Map, Loader2, AlertCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

const SiteVisits = () => {
    const [searchParams] = useSearchParams();
    const preselectedStudent = searchParams.get('student');

    const [visits, setVisits] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        student: preselectedStudent || '',
        plannedDate: '',
        plannedTime: '',
        notes: ''
    });

    useEffect(() => {
        fetchVisits();
        fetchStudents();
        if (preselectedStudent) setShowModal(true);
    }, [preselectedStudent]);

    const fetchStudents = async () => {
        try {
            const response = await API.get('/supervisor/students');
            if (response.data.status === 'success') {
                setStudents(response.data.data.students || []);
            }
        } catch (err) {
            console.error('Failed to load students:', err);
        }
    };

    const fetchVisits = async () => {
        try {
            setLoading(true);
            const response = await API.get('/supervisor/visits');
            if (response.data.status === 'success') {
                setVisits(response.data.data.visits || []);
            }
        } catch (err) {
            console.error('Failed to load visits:', err);
            setError('Failed to load itinerary from server.');
        } finally {
            setLoading(false);
        }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const response = await API.post('/supervisor/visits', formData);
            if (response.data.status === 'success') {
                toast.success('Site visit scheduled successfully');
                setShowModal(false);
                setFormData({ student: '', plannedDate: '', plannedTime: '', notes: '' });
                fetchVisits();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to schedule visit');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <SectionHeader
                title="Site Visits"
                subtitle="Supervisor Sub-Page"
                description="Student Site Visit Schedule"
                icon={ArrowLeft}
                linkTo="/dashboard/supervisor"
                linkText="Back to Dashboard"
                gradientFrom="from-primary-600"
                gradientTo="to-indigo-600"
            >
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-premium py-5 px-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] shadow-4xl shadow-primary-500/20 group hover:scale-105 active:scale-95 transition-all duration-500 italic"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500 text-primary-200" />
                    Schedule New Visit
                </button>
            </SectionHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visits List */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-sm font-black text-secondary-900 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={18} className="text-primary-500" /> Itinerary Schedule
                    </h3>

                    {loading ? (
                        <div className="glass-card p-32 flex flex-col items-center justify-center space-y-6 bg-white/40 border-dashed border-2 border-slate-200 rounded-[3rem]">
                            <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Loading Visit Schedule...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center bg-rose-50 rounded-[2.5rem] border border-rose-100 space-y-4">
                            <AlertCircle className="mx-auto text-rose-500" size={48} />
                            <p className="text-rose-900 font-bold">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {visits.length > 0 ? (
                                visits.map(visit => (
                                    <div key={visit._id} className={`glass-card p-10 bg-white/60 border-l-[12px] group transition-all duration-700 hover:shadow-4xl hover:shadow-primary-500/10 rounded-[3rem] overflow-hidden relative ${visit.status === 'upcoming' ? 'border-l-primary-500' : 'border-l-emerald-500 opacity-75'}`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-all duration-1000"></div>

                                        <div className="flex flex-col md:flex-row justify-between gap-10 relative z-10">
                                            <div className="space-y-6 flex-1">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white ${visit.status === 'upcoming' ? 'bg-primary-50 text-primary-600' : 'bg-emerald-50 text-emerald-600'} group-hover:scale-110 transition-transform duration-500`}>
                                                        {visit.status === 'upcoming' ? <Clock size={24} /> : <CheckCircle2 size={24} />}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="text-2xl font-black text-slate-900 leading-none uppercase tracking-tighter italic truncate max-w-[300px]">{visit.industry?.name || visit.industry?.companyName || 'Corporate Sector'}</h4>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full animate-pulse ${visit.status === 'upcoming' ? 'bg-primary-500' : 'bg-emerald-500'}`}></div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">{new Date(visit.plannedDate).toLocaleDateString()} • {visit.plannedTime}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 bg-white/80 rounded-[2rem] border border-slate-100 shadow-sm group-hover:bg-white transition-all duration-500">
                                                    <div className="space-y-2">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic flex items-center gap-2"><MapPin size={12} /> Visit Location</p>
                                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic leading-tight truncate">{visit.industry?.address || 'Site Address Redacted'}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic flex items-center gap-2"><User size={12} /> Assigned Student</p>
                                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic truncate pr-2">{visit.student?.name}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-between items-end gap-6">
                                                <div className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] shadow-sm border ${visit.status === 'upcoming' ? 'bg-primary-50 text-primary-600 border-primary-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                    {visit.status}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {visit.status === 'upcoming' ? (
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    const res = await API.patch(`/supervisor/visits/${visit._id}`, { status: 'completed' });
                                                                    if (res.data.status === 'success') {
                                                                        toast.success('Visit marked as completed');
                                                                        fetchVisits();
                                                                    }
                                                                } catch (err) {
                                                                    toast.error('Failed to update visit status');
                                                                }
                                                            }}
                                                            className="btn-premium from-primary-600 to-indigo-600 py-4 px-8 text-[10px] font-black uppercase tracking-[0.3em] italic active:scale-95 shadow-lg shadow-primary-200 transition-all"
                                                        >
                                                            Mark Completed
                                                        </button>
                                                    ) : (
                                                        <button className="py-4 px-8 bg-slate-900 text-primary-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-slate-800 shadow-inner flex items-center gap-3">
                                                            <CheckCircle2 size={16} className="text-emerald-400" /> Evaluated
                                                        </button>
                                                    )}
                                                    <button className="p-4 bg-white border-2 border-slate-100 text-slate-400 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-100 rounded-2xl transition-all duration-500 group/btn active:scale-90 shadow-sm">
                                                        <Phone size={20} className="mx-auto group-hover/btn:scale-110 transition-transform duration-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="glass-card p-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/40 border-dashed border-2 border-slate-200 rounded-[3rem] group">
                                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 shadow-xl group-hover:scale-110 transition-transform duration-700 border border-slate-100 relative">
                                        <div className="absolute inset-0 bg-primary-500/5 rounded-[2rem] animate-pulse"></div>
                                        <Map size={40} className="relative z-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">No Visits Scheduled</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic max-w-xs mx-auto">No upcoming or past site visits found.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Map/Context Panel */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-secondary-900 uppercase tracking-widest flex items-center gap-2">
                        <Map size={18} className="text-primary-500" /> Monitoring Context
                    </h3>
                    <div className="glass-card aspect-square bg-slate-900 border-[12px] border-white rounded-[4rem] overflow-hidden relative shadow-4xl group">
                        <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Karachi&zoom=11&size=600x600&sensor=false')] bg-cover opacity-30 grayscale contrast-125 group-hover:scale-110 transition-transform duration-[3000ms]"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-primary-400 gap-6">
                            <MapPin size={64} className="animate-bounce drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] italic text-center px-12 leading-relaxed">Evaluation Node Tracking Active</p>
                        </div>
                    </div>

                    <div className="glass-card p-10 bg-slate-900 text-white border-slate-800 rounded-[3rem] space-y-8 relative overflow-hidden group shadow-4xl shadow-slate-900/40">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
                        <div className="space-y-3">
                            <h4 className="text-lg font-black flex items-center gap-4 italic uppercase tracking-tighter">
                                <ShieldAlert size={24} className="text-amber-400 group-hover:scale-110 transition-transform duration-500" />
                                Protocol Guide
                            </h4>
                            <div className="h-0.5 w-12 bg-primary-500 rounded-full"></div>
                        </div>
                        <p className="text-[11px] text-slate-400 font-black tracking-tight leading-relaxed italic pr-4">
                            Site visits facilitate objective verification of internship deliverables. Ensure the on-site supervisor confirms student attendance.
                        </p>
                        <button className="w-full py-5 bg-white/5 hover:bg-primary-600 text-slate-300 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 active:scale-95 italic border border-white/10 group-hover:border-primary-500">
                            Download Protocol PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Nav */}
            <div className="pt-16 flex justify-center border-t border-slate-100 mt-12">
                <Link to="/dashboard/supervisor/marking" className="group flex items-center gap-5 text-slate-400 hover:text-primary-600 font-black text-[11px] uppercase tracking-[0.4em] no-underline transition-all italic">
                    Final Assessment & Grading
                    <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-700" />
                </Link>
            </div>

            {/* Scheduling Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-4xl overflow-hidden animate-slide-up">
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Schedule Site Visit</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Coordinate industry monitoring session</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 bg-white text-slate-300 hover:text-rose-500 rounded-2xl shadow-xl transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSchedule} className="p-10 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Assigned Student</label>
                                <select
                                    className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-3xl text-sm font-black outline-none transition-all appearance-none"
                                    value={formData.student}
                                    onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                                    required
                                >
                                    <option value="">Select Student...</option>
                                    {students.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} ({s.studentMeta?.universityId})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Scheduled Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-3xl text-sm font-black outline-none transition-all"
                                        value={formData.plannedDate}
                                        onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Scheduled Time</label>
                                    <input
                                        type="time"
                                        className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-3xl text-sm font-black outline-none transition-all"
                                        value={formData.plannedTime}
                                        onChange={(e) => setFormData({ ...formData, plannedTime: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Visit Objectives / Notes</label>
                                <textarea
                                    className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-3xl text-sm font-black outline-none transition-all resize-none h-32"
                                    placeholder="Briefly describe the purpose of the visit..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] shadow-3xl shadow-slate-200 hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 transition-all"
                            >
                                {submitting ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} className="text-emerald-400" />}
                                Confirm Itinerary
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Use Lucide icons
const ShieldAlert = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
);
const X = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const ShieldCheck = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
);

export default SiteVisits;
