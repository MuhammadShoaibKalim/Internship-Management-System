import React, { useState } from 'react';
import { Search, User, Mail, MapPin, Building2, ExternalLink, ArrowLeft, ArrowRight, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';

const AssignedStudents = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const students = [
        {
            id: 1,
            name: 'Ayesha Khan',
            idNumber: '2021-CS-123',
            email: 'ayesha.k@university.edu',
            company: 'TechFlow Solutions',
            status: 'active',
            progress: 75,
            lastvisit: 'Oct 15, 2023'
        },
        {
            id: 2,
            name: 'Ali Raza',
            idNumber: '2021-EE-456',
            email: 'ali.raza@university.edu',
            company: 'DataScale Systems',
            status: 'warning',
            progress: 40,
            lastvisit: 'Sep 28, 2023'
        },
        {
            id: 3,
            name: 'Zainab Ahmed',
            idNumber: '2021-SE-789',
            email: 'zainab.a@university.edu',
            company: 'Creative Labs',
            status: 'completed',
            progress: 100,
            lastvisit: 'Nov 02, 2023'
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
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

            {/* Students Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {students.map(student => (
                    <div key={student.id} className="portal-card p-6 group hover:border-primary-200 transition-all bg-white relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
                            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-black text-2xl border-4 border-slate-50 shrink-0">
                                {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex items-center justify-between w-full">
                                    <div>
                                        <h3 className="text-xl font-bold text-secondary-900 leading-none">{student.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {student.idNumber}</p>
                                    </div>
                                    <StatusBadge status={student.status} />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Building2 size={12} /> Placement
                                        </p>
                                        <p className="text-sm font-bold text-secondary-900">{student.company}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <MapPin size={12} /> Last Site Visit
                                        </p>
                                        <p className="text-sm font-bold text-secondary-900">{student.lastvisit}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Internship Progress</span>
                                        <span className="text-xs font-black text-primary-600">{student.progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${student.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <Link to={`/dashboard/supervisor/logs?student=${student.id}`} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest no-underline">
                                        <ClipboardList size={16} /> Review Logs
                                    </Link>
                                    <Link to={`/dashboard/supervisor/marking?student=${student.id}`} className="p-3 bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary-600 hover:bg-white hover:shadow-lg rounded-xl transition-all">
                                        <ExternalLink size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary-500/10 transition-colors"></div>
                    </div>
                ))}
            </div>

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
