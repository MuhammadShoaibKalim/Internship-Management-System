import React, { useState, useEffect } from 'react';
import { Search, MapPin, ArrowLeft, ArrowRight, Loader2, AlertCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

const AssignedStudents = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await API.get('/supervisor/students');
                if (response.data.status === 'success') {
                    setStudents(response.data.data.students || []);
                }
            } catch (err) {
                console.error('Failed to load students:', err);
                setError('Failed to load assigned students database.');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentMeta?.universityId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <SectionHeader
                title="Student Roster"
                subtitle="Supervisor Sub-Page"
                description="Student Monitoring & Status"
                icon={ArrowLeft}
                linkTo="/dashboard/supervisor"
                linkText="Back to Dashboard"
                gradientFrom="from-primary-600"
                gradientTo="to-indigo-600"
            >
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-all duration-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search for student..."
                        className="pl-14 pr-8 py-4 bg-white/60 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest w-full md:w-80 shadow-sm focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all duration-500 backdrop-blur-md italic"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </SectionHeader>

            {loading ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center space-y-6">
                    <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Synchronizing Student Roster...</p>
                </div>
            ) : error ? (
                <div className="p-20 text-center bg-rose-50/50 rounded-[4rem] border-2 border-dashed border-rose-100 space-y-6 max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-rose-500 shadow-xl mx-auto">
                        <AlertCircle size={32} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">System Error</h3>
                        <p className="text-sm text-slate-500 font-semibold italic">{error}</p>
                    </div>
                </div>
            ) : filteredStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredStudents.map((student) => (
                        <div key={student._id} className="glass-card group hover:shadow-4xl hover:shadow-primary-500/10 transition-all duration-700 rounded-[3rem] overflow-hidden border-slate-100/50 bg-white/60 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-all duration-1000"></div>

                            <div className="p-10 space-y-8 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-[2rem] bg-slate-900 border-4 border-white shadow-2xl overflow-hidden group-hover:scale-110 transition-transform duration-700 ">
                                        <img
                                            src={student.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                            alt={student.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">{student.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{student.studentMeta?.universityId || 'ID-PENDING'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-colors group-hover:bg-white text-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Placement</p>
                                        <p className="text-[11px] font-black text-slate-900 uppercase truncate italic">
                                            {student.studentMeta?.currentApplication?.internship?.companyName || 'Corporate Sector'}
                                        </p>
                                    </div>
                                    <div className="p-5 bg-primary-50/30 rounded-2xl border border-primary-100/30 transition-colors group-hover:bg-white text-center">
                                        <p className="text-[9px] font-black text-primary-400 uppercase tracking-widest mb-1 italic">Log Monitoring</p>
                                        <p className="text-[11px] font-black text-primary-600 uppercase italic">
                                            {student.stats?.pendingLogs || 0} PENDING / {student.stats?.totalLogs || 0} TOTAL
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <Link
                                        to={`/dashboard/supervisor/logs?student=${student._id}`}
                                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary-600 transition-all text-center no-underline italic active:scale-95"
                                    >
                                        Review Logs
                                    </Link>
                                    <Link
                                        to={`/dashboard/supervisor/visits?student=${student._id}`}
                                        className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-primary-600 hover:border-primary-100 rounded-2xl shadow-sm transition-all active:scale-90"
                                        title="Schedule Site Visit"
                                    >
                                        <MapPin size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-32 flex flex-col items-center justify-center text-center space-y-10 bg-white/40 border-dashed border-2 border-slate-200 rounded-[4rem] group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                    <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-200 shadow-2xl group-hover:scale-110 transition-transform duration-700 border border-slate-50 relative z-10">
                        <div className="absolute inset-4 bg-primary-500/5 rounded-[1.5rem] animate-pulse"></div>
                        <Users size={56} className="relative z-10 text-slate-300 group-hover:text-primary-400 transition-colors duration-700" />
                    </div>

                    <div className="space-y-4 relative z-10">
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Empty Roster</h3>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic max-w-sm mx-auto leading-relaxed">
                            No students are currently assigned to your supervision. Pending student applications are waiting for your <span className="text-primary-600 underline underline-offset-4 decoration-2">Academic Endorsement</span>.
                        </p>
                    </div>

                    <Link
                        to="/dashboard/supervisor/endorsements"
                        className="btn-premium py-6 px-12 text-[10px] font-black uppercase tracking-[0.4em] shadow-4xl shadow-primary-500/20 active:scale-95 transition-all italic relative z-10 flex items-center gap-4 group/btn no-underline"
                    >
                        Review Pending Applications
                        <ArrowRight size={18} className="group-hover/btn:translate-x-3 transition-transform duration-500" />
                    </Link>
                </div>
            )}

            {/* Bottom Insight Section */}
            <div className="p-16 border-2 border-dashed border-slate-200 rounded-[4rem] bg-white/40 text-center backdrop-blur-md group hover:bg-white hover:border-primary-200 transition-all duration-1000 mt-12 relative overflow-hidden">
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all duration-1000"></div>

                <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] italic relative z-10 mb-8">Planning an evaluation cycle?</p>
                <Link to="/dashboard/supervisor/visits" className="inline-flex items-center gap-6 text-slate-900 font-black text-[13px] uppercase tracking-[0.5em] hover:text-primary-600 transition-all duration-500 no-underline group/link relative z-10">
                    Schedule Site Visits
                    <div className="p-3 bg-white shadow-xl rounded-xl group-hover/link:translate-x-4 transition-transform duration-500">
                        <ArrowRight size={20} className="text-primary-500" />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AssignedStudents;
