import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Phone, CheckCircle2, ArrowLeft, ArrowRight, Plus, Map, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const SiteVisits = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVisits();
    }, []);

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

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header omitted */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link to="/dashboard/supervisor" className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-[10px] uppercase tracking-widest mb-2 no-underline transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">On-site Visits</h1>
                    <p className="text-slate-500 font-medium italic">Schedule and monitor physical industry inspections and student evaluations.</p>
                </div>
                <button className="btn-primary py-4 px-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary-100">
                    <Plus size={18} /> Schedule New Visit
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visits List */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-sm font-black text-secondary-900 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={18} className="text-primary-500" /> Itinerary Schedule
                    </h3>

                    {loading ? (
                        <div className="portal-card p-20 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Itinerary Nodes...</p>
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
                                    <div key={visit._id} className={`portal-card p-6 bg-white group hover:shadow-2xl transition-all border-l-8 ${visit.status === 'upcoming' ? 'border-l-primary-500' : 'border-l-emerald-500 opacity-75'}`}>
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${visit.status === 'upcoming' ? 'bg-primary-50 text-primary-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                        {visit.status === 'upcoming' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-secondary-900 text-lg leading-tight truncate max-w-[250px]">{visit.industry?.name || 'Industry Node'}</h4>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(visit.plannedDate).toLocaleDateString()} • {visit.plannedTime}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <MapPin size={16} className="text-slate-300 mt-0.5" />
                                                        <p className="text-xs font-bold text-slate-500 leading-relaxed truncate max-w-[200px]">{visit.industry?.address || 'Site Address Unavailable'}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <User size={16} className="text-slate-300" />
                                                        <p className="text-xs font-bold text-slate-500">Student: {visit.student?.name}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-between items-end gap-4 text-right">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${visit.status === 'upcoming' ? 'bg-primary-50 text-primary-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {visit.status}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary-600 rounded-xl transition-all active:scale-95">
                                                        <Phone size={18} />
                                                    </button>
                                                    <button className="btn-primary py-3 px-6 text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-lg shadow-primary-50">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                                     <p className="text-sm font-bold text-slate-400 italic">No site visits scheduled in the local itinerary.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Map/Context Panel omitted */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-secondary-900 uppercase tracking-widest flex items-center gap-2">
                        <Map size={18} className="text-primary-500" /> Map Preview
                    </h3>
                    <div className="portal-card aspect-square bg-slate-100 rounded-[3rem] overflow-hidden relative border-8 border-white shadow-inner flex flex-col items-center justify-center text-slate-400 gap-4">
                        <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Karachi&zoom=11&size=600x600&sensor=false')] bg-cover opacity-20"></div>
                        <MapPin size={48} className="animate-bounce" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Interactive Map Initializing</p>
                    </div>

                    <div className="portal-card p-6 bg-secondary-900 text-white border-none space-y-4">
                        <h4 className="font-bold text-sm flex items-center gap-2 capitalize">
                            <ShieldAlert size={16} className="text-amber-400" /> Supervisor Protocol
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                            Site visits are mandatory for at least 30% of your assigned students. Ensure you carry your official faculty identification and evaluation forms.
                        </p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                            Download Official Form
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Nav */}
            <div className="pt-8 flex justify-center">
                <Link to="/dashboard/supervisor/marking" className="group flex items-center gap-4 text-slate-400 hover:text-primary-600 font-black text-[10px] uppercase tracking-widest no-underline transition-all">
                    Proceed to Final Marking Assessment
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

// Use Lucide ShieldAlert in this scope
const ShieldAlert = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
);

export default SiteVisits;

                {/* Map/Context Panel */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-secondary-900 uppercase tracking-widest flex items-center gap-2">
                        <Map size={18} className="text-primary-500" /> Map Preview
                    </h3>
                    <div className="portal-card aspect-square bg-slate-100 rounded-[3rem] overflow-hidden relative border-8 border-white shadow-inner flex flex-col items-center justify-center text-slate-400 gap-4">
                        <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Karachi&zoom=11&size=600x600&sensor=false')] bg-cover opacity-20"></div>
                        <MapPin size={48} className="animate-bounce" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Interactive Map Initializing</p>
                    </div>

                    <div className="portal-card p-6 bg-secondary-900 text-white border-none space-y-4">
                        <h4 className="font-bold text-sm flex items-center gap-2">
                            <ShieldAlert size={16} className="text-amber-400" /> Supervisor Protocol
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                            Site visits are mandatory for at least 30% of your assigned students. Ensure you carry your official faculty identification and evaluation forms.
                        </p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                            Download Official Form
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Nav */}
            <div className="pt-8 flex justify-center">
                <Link to="/dashboard/supervisor/marking" className="group flex items-center gap-4 text-slate-400 hover:text-primary-600 font-black text-[10px] uppercase tracking-widest no-underline transition-all">
                    Proceed to Final Marking Assessment
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

// Use Lucide ShieldAlert in this scope
const ShieldAlert = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
);

export default SiteVisits;
