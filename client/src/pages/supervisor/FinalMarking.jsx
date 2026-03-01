import React, { useState } from 'react';
import { Award, Star, ClipboardCheck, ArrowLeft, Save, AlertCircle, TrendingUp, BookOpen, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinalMarking = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);

    const students = [
        { id: 1, name: 'Ayesha Khan', idNumber: '2021-CS-123', company: 'TechFlow Solutions', progress: 100 },
        { id: 2, name: 'Ali Raza', idNumber: '2021-EE-456', company: 'DataScale Systems', progress: 85 },
        { id: 3, name: 'Zainab Ahmed', idNumber: '2021-SE-789', company: 'Creative Labs', progress: 100 }
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
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Final Marking & Assessment</h1>
                    <p className="text-slate-500 font-medium italic">Grade students based on industry evaluation and their internship performance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Students Toggle List */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Select Student for Grading</h3>
                    <div className="space-y-3">
                        {students.map(student => (
                            <button
                                key={student.id}
                                onClick={() => setSelectedStudent(student)}
                                className={`w-full p-5 rounded-[2rem] text-left transition-all duration-300 border-2 flex items-center justify-between group
                                    ${selectedStudent?.id === student.id
                                        ? 'bg-secondary-900 border-secondary-900 text-white shadow-2xl translate-x-3'
                                        : 'bg-white border-slate-50 text-secondary-900 hover:border-primary-100 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${selectedStudent?.id === student.id ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-100 text-slate-400'}`}>
                                        {student.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm leading-tight">{student.name}</p>
                                        <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${selectedStudent?.id === student.id ? 'text-slate-400' : 'text-slate-400'}`}>{student.idNumber}</p>
                                    </div>
                                </div>
                                {student.progress === 100 && (
                                    <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${selectedStudent?.id === student.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                        Ready
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grading Form */}
                <div className="lg:col-span-8">
                    {selectedStudent ? (
                        <div className="portal-card p-10 bg-white space-y-10 animate-fade-in border-t-8 border-t-primary-500">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-10 border-b border-slate-50">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-secondary-900 tracking-tight">{selectedStudent.name}</h2>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                            <TrendingUp size={14} /> Completion: {selectedStudent.progress}%
                                        </span>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">{selectedStudent.company}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-primary-50 rounded-[1.5rem] border border-primary-100 flex items-center gap-3">
                                    <Award className="text-primary-500" size={24} />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Industry GPA</p>
                                        <p className="text-xl font-black text-secondary-900">3.92/4.0</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Star size={14} className="text-amber-400" /> Evaluation Metrics
                                        </h4>
                                        {[
                                            { label: 'Technical Proficiency', icon: BookOpen },
                                            { label: 'Soft Skills & Communication', icon: Star },
                                            { label: 'Weekly Log Consistency', icon: ClipboardCheck },
                                            { label: 'Industry Feedback', icon: GraduationCap }
                                        ].map((metric, i) => (
                                            <div key={i} className="space-y-3">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-xs font-bold text-secondary-900 flex items-center gap-2">
                                                        <metric.icon size={12} className="text-slate-400" /> {metric.label}
                                                    </label>
                                                    <span className="text-xs font-black text-primary-600 italic">Excellent</span>
                                                </div>
                                                <input type="range" className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Overall Recommendation</label>
                                        <textarea
                                            placeholder="Write your final academic comments here..."
                                            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-medium text-secondary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all h-64 resize-none italic"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-50">
                                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100">
                                    <AlertCircle size={20} />
                                    <p className="text-xs font-bold italic">Once submitted, grades are final and sent to the HOD office.</p>
                                </div>
                                <button className="btn-primary py-5 px-12 flex items-center justify-center gap-3 shadow-2xl shadow-primary-200 hover:scale-105 active:scale-95 text-xs font-black uppercase tracking-widest">
                                    <Save size={20} /> Publish Final Grade
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="portal-card h-[600px] bg-slate-50/50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-12 space-y-4">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-sm">
                                <GraduationCap size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-400">No Student Selected</h3>
                                <p className="text-slate-300 text-sm italic font-medium">Choose a student from the sidebar to begin their final assessment.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinalMarking;
