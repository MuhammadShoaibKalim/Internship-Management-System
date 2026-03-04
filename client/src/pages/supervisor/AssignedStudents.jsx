import React, { useState, useEffect } from 'react';
import { Search, User, Mail, MapPin, Building2, ExternalLink, ArrowLeft, ArrowRight, ClipboardList, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../services/api';

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
        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header omitted */}
            {/* Same header as before, just adding back context-specific parts */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link to="/dashboard/supervisor" className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-[10px] uppercase tracking-widest mb-2 no-underline transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Assigned Students</h1>
                    <p className="text-slate-500 font-medium italic">Monitor and manage the students under your academic supervision.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search students or IDs..."
                            className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm w-full md:w-80 shadow-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="portal-card p-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Assigned Nodes...</p>
                </div>
            ) : error ? (
                <div className="p-12 text-center bg-rose-50 rounded-[2.5rem] border border-rose-100 space-y-4">
                    <AlertCircle className="mx-auto text-rose-500" size={48} />
                    <p className="text-rose-900 font-bold">{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <div key={student._id} className="portal-card p-6 group hover:border-primary-200 transition-all bg-white relative overflow-hidden">
                                <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
                                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-black text-2xl border-4 border-slate-50 shrink-0">
                                        {student.name?.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 space-y-4 w-full">
                                        <div className="flex items-center justify-between w-full">
                                            <div>
                                                <h3 className="text-xl font-bold text-secondary-900 leading-none">{student.name}</h3>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {student.rollNumber || 'N/A'}</p>
                                            </div>
                                            <StatusBadge status={student.status || 'active'} />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Building2 size={12} /> Placement
                                                </p>
                                                <p className="text-sm font-bold text-secondary-900 truncate">{student.currentPlacement?.company || 'Pending Placement'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <MapPin size={12} /> Email
                                                </p>
                                                <p className="text-sm font-bold text-secondary-900 truncate">{student.email}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Logs Submitted</span>
                                                <span className="text-xs font-black text-primary-600">{student.totalLogs || 0}</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${Math.min((student.totalLogs / 12) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2">
                                            <Link to={`/dashboard/supervisor/logs?student=${student._id}`} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest no-underline active:scale-95 transition-transform">
                                                <ClipboardList size={16} /> Review Logs
                                            </Link>
                                            <Link to={`/dashboard/supervisor/marking?student=${student._id}`} className="p-3 bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary-600 hover:bg-white hover:shadow-lg rounded-xl transition-all">
                                                <ExternalLink size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary-500/10 transition-colors"></div>
                            </div>
                        ))
                    ) : (
                        <div className="xl:col-span-2 p-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                                <p className="text-sm font-bold text-slate-400 italic">No assigned students matching your search.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Secondary CTA */}
            <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30 text-center">
                <p className="text-slate-400 text-sm font-bold italic">Planning an evaluation cycle?</p>
                <Link to="/dashboard/supervisor/visits" className="inline-flex items-center gap-2 text-primary-600 font-black text-[10px] uppercase tracking-widest mt-2 hover:translate-x-1 transition-transform no-underline">
                    Schedule Site Visits <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
};

export default AssignedStudents;

            {/* Secondary CTA */}
            <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30 text-center">
                <p className="text-slate-400 text-sm font-bold italic">Planning an evaluation cycle?</p>
                <Link to="/dashboard/supervisor/visits" className="inline-flex items-center gap-2 text-primary-600 font-black text-[10px] uppercase tracking-widest mt-2 hover:translate-x-1 transition-transform no-underline">
                    Schedule Site Visits <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
};

export default AssignedStudents;
