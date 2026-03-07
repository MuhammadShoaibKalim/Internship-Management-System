import React, { useState, useEffect } from 'react';
import { UserCheck, Star, Calendar, MessageSquare, Download, ShieldCheck, Loader2, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { format } from 'date-fns';
import SectionHeader from '../../components/common/SectionHeader';
import toast from 'react-hot-toast';

const IndustryInterns = () => {
    const [loading, setLoading] = useState(true);
    const [interns, setInterns] = useState([]);
    const [initModalIntern, setInitModalIntern] = useState(null);
    const [initWeeks, setInitWeeks] = useState(8);
    const [initLoading, setInitLoading] = useState(false);
    const [existingWeeksCount, setExistingWeeksCount] = useState(0);

    useEffect(() => {
        fetchInterns();
    }, []);

    const fetchInterns = async () => {
        try {
            setLoading(true);
            const response = await API.get('/industry/interns');
            if (response.data.status === 'success') {
                setInterns(response.data.data.interns);
            }
        } catch (err) {
            console.error('Failed to fetch interns:', err);
        } finally {
            setLoading(false);
        }
    };

    const openPlanModal = async (intern) => {
        setInitModalIntern(intern);
        setInitWeeks(8);
        try {
            const res = await API.get(`/logs?student=${intern.student?._id}`);
            setExistingWeeksCount(res.data.data.logs?.length || 0);
        } catch {
            setExistingWeeksCount(0);
        }
    };

    const handleInitializePlan = async () => {
        if (!initModalIntern) return;
        try {
            setInitLoading(true);
            const response = await API.post('/industry/initialize-plan', {
                applicationId: initModalIntern._id,
                totalWeeks: initWeeks
            });
            if (response.data.status === 'success') {
                toast.success(response.data.message || 'Plan updated!');
                setInitModalIntern(null);
                fetchInterns();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to initialize plan');
        } finally {
            setInitLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-primary-600" size={40} />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loading Interns...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <SectionHeader
                title="Active Cohort"
                subtitle="Industry Sub-Page"
                description="Your currently active interns"
                icon={UserCheck}
                gradientFrom="from-primary-600"
                gradientTo="to-indigo-600"
            >
                <div className="px-8 py-5 bg-slate-900 border border-slate-800 rounded-[2rem] text-white text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 shadow-4xl shadow-slate-900/20 group">
                    <UserCheck size={20} className="text-primary-400 group-hover:scale-110 transition-transform duration-500" />
                    Total Interns: <span className="text-primary-400 text-sm tracking-tighter italic">{interns.length.toString().padStart(2, '0')}</span>
                </div>
            </SectionHeader>

            {interns.length === 0 ? (
                <div className="glass-card p-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/40 border-dashed border-2 border-slate-200">
                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 shadow-xl group-hover:scale-110 transition-transform duration-700 border border-slate-100 relative">
                        <div className="absolute inset-0 bg-primary-500/5 rounded-[2rem] animate-pulse"></div>
                        <Users size={40} className="relative z-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No Active Interns</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic max-w-xs mx-auto">No interns are currently active in your organization.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {interns.map(intern => (
                        <div key={intern._id} className="glass-card p-10 bg-white/60 border-slate-100 shadow-sm hover:shadow-4xl hover:shadow-primary-500/10 transition-all duration-700 group overflow-hidden relative rounded-[3rem]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-all duration-1000"></div>

                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center font-black text-2xl shadow-xl overflow-hidden shrink-0 transition-transform duration-700 relative">
                                        <div className="absolute inset-0 bg-primary-500/5 animate-pulse"></div>
                                        {intern.student?.avatar ? (
                                            <img src={intern.student.avatar} alt={intern.student.name} className="w-full h-full object-cover relative z-10" />
                                        ) : (
                                            <span className="text-slate-400 font-black italic relative z-10">{intern.student?.name?.charAt(0) || 'S'}</span>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-900 leading-none uppercase tracking-tighter italic">{intern.student?.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></div>
                                            <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] italic">{intern.student?.university || 'Partner University'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-all duration-700">
                                    <ShieldCheck size={28} />
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center bg-white/80 p-6 rounded-[1.8rem] border border-slate-100 shadow-sm group-hover:bg-white transition-all duration-500">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Internship Title</p>
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tighter italic">{intern.internship?.title}</p>
                                    </div>
                                    <div className="px-5 py-2 bg-emerald-100 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-200">
                                        Active
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 border border-slate-100 rounded-[1.8rem] bg-white/40 backdrop-blur-sm group-hover:bg-white/60 transition-all duration-500">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 italic">Department</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">
                                                {intern.student?.studentMeta?.department || 'General'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 border border-slate-100 rounded-[1.8rem] bg-white/40 backdrop-blur-sm group-hover:bg-white/60 transition-all duration-500">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 italic">Duration</p>
                                        <div className="flex items-center gap-3">
                                            <Calendar size={16} className="text-primary-500 shrink-0" />
                                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">
                                                {intern.internship?.duration || '8 Weeks'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-4 relative z-10">
                                <Link
                                    to={`/dashboard/industry/logs?student=${intern.student?._id}`}
                                    className="flex-1 py-5 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95 no-underline shadow-sm"
                                >
                                    <MessageSquare size={18} /> View Logs
                                </Link>
                                <button
                                    onClick={() => openPlanModal(intern)}
                                    className="flex-1 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                                >
                                    <Calendar size={18} className="text-primary-400" /> Plan Weeks
                                </button>
                                <Link
                                    to={`/dashboard/industry/evaluations?application=${intern._id}`}
                                    className="flex-1 min-w-[120px] py-5 btn-premium from-indigo-800 to-indigo-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-900/20 flex items-center justify-center gap-3 active:scale-95 no-underline"
                                >
                                    <Star size={18} className="text-amber-400 fill-amber-400" /> Evaluate
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Initialization Modal */}
            {initModalIntern && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-4xl overflow-hidden animate-slide-up border border-white/20">
                        <div className="p-12 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Plan Internship</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
                                    {existingWeeksCount > 0
                                        ? `${existingWeeksCount} weeks already exist — add more below`
                                        : 'Setup weekly logging structure'}
                                </p>
                            </div>
                            <button onClick={() => setInitModalIntern(null)} className="p-4 bg-white text-slate-300 hover:text-rose-500 rounded-2xl shadow-xl transition-all hover:rotate-90">
                                <X size={22} />
                            </button>
                        </div>
                        <div className="p-12 space-y-8">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Number of Weeks</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        min="1"
                                        max="24"
                                        value={initWeeks}
                                        onChange={(e) => setInitWeeks(parseInt(e.target.value))}
                                        className="flex-1 p-6 bg-slate-50 border-2 border-transparent rounded-[2.5rem] text-2xl font-black text-primary-600 focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-center"
                                    />
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest italic py-2">
                                    {existingWeeksCount > 0
                                        ? <>Current: <strong>{existingWeeksCount}</strong> weeks. Entering {initWeeks} will add weeks {existingWeeksCount + 1} → {initWeeks} (new ones only).</>
                                        : <>This will create {initWeeks} placeholder logs for {initModalIntern.student?.name}.</>}
                                </p>
                            </div>

                            <div className="flex items-center gap-5 pt-4">
                                <button
                                    onClick={() => setInitModalIntern(null)}
                                    className="flex-1 py-5 bg-white text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-100 italic"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleInitializePlan}
                                    disabled={initLoading}
                                    className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all flex items-center justify-center gap-3 shadow-4xl shadow-slate-900/20 disabled:opacity-50 italic group"
                                >
                                    {initLoading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} className="text-primary-400 group-hover:text-white transition-colors" />}
                                    Create Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndustryInterns;
