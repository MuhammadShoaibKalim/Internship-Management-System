import React, { useState, useEffect } from 'react';
import { Award, Star, ClipboardCheck, ArrowLeft, ArrowRight, Save, AlertCircle, TrendingUp, BookOpen, GraduationCap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { toast } from 'react-hot-toast';
import SectionHeader from '../../components/common/SectionHeader';

const FinalMarking = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [metrics, setMetrics] = useState({
        technicalProficiency: 0,
        softSkills: 0,
        logConsistency: 0,
        industryFeedback: 0
    });
    const [industryGpa, setIndustryGpa] = useState(0);
    const [recommendation, setRecommendation] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent?.performanceEvaluation) {
            // Convert 0-100 score to 0-4.0 GPA
            const rawScore = selectedStudent.performanceEvaluation.overallScore || 0;
            const calculatedGpa = (rawScore / 100) * 4;
            setIndustryGpa(parseFloat(calculatedGpa.toFixed(1)));

            // Auto-fill industry feedback metric
            setMetrics(prev => ({
                ...prev,
                industryFeedback: Math.round(rawScore)
            }));

            if (selectedStudent.performanceEvaluation.comments) {
                toast.success('Industry evaluation synced.', { icon: '🏢' });
            }
        } else {
            setIndustryGpa(0);
            setMetrics(prev => ({ ...prev, industryFeedback: 0 }));
        }
    }, [selectedStudent]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await API.get('/supervisor/students');
            if (response.data.status === 'success') {
                const assignees = response.data.data.students || [];
                setStudents(assignees);
            }
        } catch (err) {
            console.error('Failed to load students:', err);
            toast.error('Failed to sync student roster.');
        } finally {
            setLoading(false);
        }
    };

    const handleMetricChange = (key, value) => {
        setMetrics(prev => ({ ...prev, [key]: parseInt(value) }));
    };

    const handleSubmitMarking = async () => {
        if (!selectedStudent || !selectedStudent.studentMeta?.currentApplication?._id) {
            toast.error('Invalid student selection or application missing.');
            return;
        }

        try {
            setSubmitting(true);
            const response = await API.post('/supervisor/marking', {
                studentId: selectedStudent._id,
                applicationId: selectedStudent.studentMeta.currentApplication._id,
                metrics,
                recommendation,
                industryGpa
            });

            if (response.data.status === 'success') {
                toast.success(`Assessment Published for ${selectedStudent.name}`);
                setSelectedStudent(null);
                setRecommendation('');
                setIndustryGpa(0);
                setMetrics({
                    technicalProficiency: 0,
                    softSkills: 0,
                    logConsistency: 0,
                    industryFeedback: 0
                });
                fetchStudents();
            }
        } catch (err) {
            console.error('Submission failed:', err);
            toast.error(err.response?.data?.message || 'Failed to publish marking.');
        } finally {
            setSubmitting(false);
        }
    };

    const getMetricLabel = (value) => {
        if (value < 40) return 'Needs Improvement';
        if (value < 60) return 'Fair';
        if (value < 80) return 'Good';
        if (value < 90) return 'Very Good';
        return 'Excellent';
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <SectionHeader
                title="Final Marking"
                subtitle="Supervisor Sub-Page"
                description="Final Performance Grading & Submission"
                icon={ArrowLeft}
                linkTo="/dashboard/supervisor"
                linkText="Back to Dashboard"
                gradientFrom="from-primary-600"
                gradientTo="to-indigo-600"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center gap-3 ml-4">
                        <div className="h-0.5 w-6 bg-primary-500"></div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Student Selection</h3>
                    </div>
                    {loading ? (
                        <div className="glass-card p-20 flex justify-center bg-white/40 border-slate-100 rounded-[3rem]">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {students.length > 0 ? (
                                students.map(student => (
                                    <button
                                        key={student._id}
                                        onClick={() => setSelectedStudent(student)}
                                        className={`w-full p-6 bg-white/60 border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-4xl hover:shadow-primary-500/10 rounded-[2.5rem] group relative overflow-hidden active:scale-[0.98] ${selectedStudent?._id === student._id ? 'ring-8 ring-primary-500/5 bg-white border-primary-500' : ''}`}
                                    >
                                        {selectedStudent?._id === student._id && (
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
                                        )}
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-xl ring-4 ring-white transition-all duration-500 ${selectedStudent?._id === student._id ? 'bg-slate-900 text-primary-400' : 'bg-slate-100 text-slate-400'}`}>
                                                    {student.avatar ? (
                                                        <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="italic">{student.name?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className={`font-black text-sm uppercase tracking-tighter italic transition-colors ${selectedStudent?._id === student._id ? 'text-slate-900' : 'text-slate-600'}`}>{student.name}</p>
                                                    <p className={`text-[9px] font-black uppercase tracking-[0.2em] italic ${selectedStudent?._id === student._id ? 'text-primary-600' : 'text-slate-400'}`}>
                                                        {student.studentMeta?.universityId || 'XXXX-XXX'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`p-2 rounded-xl transition-all duration-500 ${selectedStudent?._id === student._id ? 'bg-primary-500 text-white rotate-90 scale-110 shadow-lg shadow-primary-500/30' : 'bg-slate-50 text-slate-300 group-hover:translate-x-2'}`}>
                                                <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="glass-card p-12 text-center bg-white/40 border-dashed border-2 border-slate-200 rounded-[2.5rem]">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">No Students Found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-8">
                    {selectedStudent ? (
                        <div className="glass-card p-12 bg-white/60 border-slate-100 shadow-sm transition-all duration-700 hover:shadow-4xl hover:shadow-primary-500/10 rounded-[3rem] group overflow-hidden relative animate-fade-in active:scale-[0.995]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary-500/10 transition-all duration-1000"></div>

                            <div className="flex flex-col md:flex-row justify-between items-start gap-10 pb-12 border-b border-slate-100 relative z-10">
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">{selectedStudent.name}</h2>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Sector: {selectedStudent.studentMeta?.department || 'Operation CS'}</p>
                                        </div>
                                        <div className="px-4 py-1.5 bg-slate-900 text-primary-400 rounded-xl">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">{selectedStudent.studentMeta?.universityId}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 group/badge hover:scale-105 transition-all duration-500">
                                    <div className="p-4 bg-primary-50 rounded-2xl text-primary-500 shadow-inner group-hover/badge:rotate-12 transition-transform duration-500">
                                        <Award size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic leading-none">Grading Status</p>
                                        <p className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Pending</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 pt-12 relative z-10">
                                <div className="space-y-12">
                                    <div className="flex items-center gap-4">
                                        <div className="h-0.5 w-8 bg-primary-500"></div>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic flex items-center gap-3">
                                            <Star size={16} className="text-amber-400" /> Evaluation Metrics
                                        </h4>
                                    </div>
                                    <div className="space-y-10">
                                        {[
                                            { id: 'technicalProficiency', label: 'Technical Proficiency', icon: BookOpen },
                                            { id: 'softSkills', label: 'Communication Skills', icon: Star },
                                            { id: 'logConsistency', label: 'Log Consistency', icon: ClipboardCheck },
                                            { id: 'industryFeedback', label: 'Industry Performance', icon: GraduationCap }
                                        ].map((metric) => (
                                            <div key={metric.id} className="group/metric space-y-4">
                                                <div className="flex justify-between items-end px-1">
                                                    <label className="text-[11px] font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-3 group-hover/metric:translate-x-2 transition-transform duration-500">
                                                        <metric.icon size={16} className="text-primary-500 opacity-50" /> {metric.label}
                                                    </label>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-[10px] font-black text-primary-600 italic uppercase tracking-widest leading-none">
                                                            {metrics[metric.id]}%
                                                        </span>
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none opacity-60">
                                                            {getMetricLabel(metrics[metric.id])}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Premium Progress Bar */}
                                                <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                                                    <div
                                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-indigo-600 transition-all duration-700 ease-out rounded-full shadow-lg"
                                                        style={{ width: `${metrics[metric.id]}%` }}
                                                    >
                                                        <div className="absolute top-0 right-0 w-8 h-full bg-white/20 skew-x-12 translate-x-4 animate-shimmer"></div>
                                                    </div>
                                                </div>

                                                <div className="px-1">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        step="1"
                                                        value={metrics[metric.id]}
                                                        onChange={(e) => handleMetricChange(metric.id, e.target.value)}
                                                        className="w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-primary-600 hover:accent-primary-500 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <div className="group/metric space-y-4 pt-4">
                                            <div className="flex justify-between items-center mb-0 px-1">
                                                <label className="text-[11px] font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-3">
                                                    <TrendingUp size={16} className="text-primary-500 opacity-50" /> Industry GPA (/4.0)
                                                </label>
                                                <div className="px-5 py-2 bg-slate-900 text-primary-400 rounded-2xl shadow-xl shadow-slate-200/50">
                                                    <span className="text-sm font-black italic">{industryGpa.toFixed(1)}</span>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="4"
                                                    step="0.1"
                                                    value={industryGpa}
                                                    onChange={(e) => setIndustryGpa(parseFloat(e.target.value) || 0)}
                                                    className="w-full px-10 py-6 bg-white border-2 border-slate-100 focus:border-primary-500 focus:ring-8 focus:ring-primary-500/5 rounded-[2.5rem] text-sm font-black outline-none transition-all placeholder:text-slate-200 shadow-sm italic"
                                                    placeholder="Enter Industry GPA..."
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none pr-4">
                                                    <div className="h-2 w-2 bg-primary-500 rounded-full animate-pulse"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-0.5 w-8 bg-primary-500"></div>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic flex items-center gap-3">Comments & Feedback</h4>
                                    </div>
                                    <div className="relative group/text">
                                        <textarea
                                            placeholder="Enter final comments and feedback for the student..."
                                            value={recommendation}
                                            onChange={(e) => setRecommendation(e.target.value)}
                                            className="w-full p-10 bg-white/40 border border-slate-100 rounded-[3rem] text-sm font-black text-slate-900 tracking-tight focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all h-[380px] resize-none italic leading-relaxed shadow-inner"
                                        ></textarea>
                                        <div className="absolute bottom-10 right-10 flex items-center gap-3 text-slate-300 group-focus-within/text:text-primary-500 transition-colors">
                                            <span className="text-[10px] font-black uppercase tracking-widest italic">Ready to Submit</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col xl:flex-row items-center justify-between gap-10 pt-16 border-t border-slate-100 mt-12 relative z-10">
                                <div className="flex-1 flex items-center gap-6 p-6 bg-slate-900 text-white rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group/notice">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                                    <AlertCircle size={28} className="text-primary-400 shrink-0 animate-pulse" />
                                    <p className="text-[10px] font-black italic tracking-tight leading-relaxed uppercase pr-4">
                                        Note: Final grades are permanent once submitted and will be sent to the Head of Department for official recording.
                                    </p>
                                </div>
                                <button
                                    onClick={handleSubmitMarking}
                                    disabled={submitting}
                                    className="btn-premium from-slate-900 to-slate-800 py-6 px-14 text-[11px] font-black uppercase tracking-[0.4em] italic no-underline shadow-4xl shadow-slate-900/30 active:scale-95 flex items-center gap-5 transition-all duration-500 w-full xl:w-auto"
                                >
                                    {submitting ? <Loader2 className="animate-spin text-primary-400" /> : <Save size={20} className="text-primary-400" />}
                                    Submit Grades
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card h-[800px] bg-white/40 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12 space-y-8 rounded-[4rem] group hover:bg-white hover:border-primary-100 transition-all duration-1000">
                            <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center text-slate-200 shadow-inner border-4 border-white group-hover:scale-110 transition-transform duration-700">
                                <GraduationCap size={64} className="group-hover:rotate-12 transition-transform duration-1000" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Select a Student</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic max-w-xs mx-auto leading-loose">Please select a student from the list to begin the final evaluation and grading process.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinalMarking;

