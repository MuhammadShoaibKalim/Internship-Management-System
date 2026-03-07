import React, { useState, useEffect } from 'react';
import {
    ClipboardList, Clock, Loader2, Plus,
    Star, MessageSquare, Send, X, Zap, FileText, Edit2, User, ChevronDown, ChevronUp, CheckCircle2
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';
import toast from 'react-hot-toast';

// ── Helpers ────────────────────────────────────────────────────────────────────
const hasGoals = (log) => typeof log.assignedTasks === 'string' && log.assignedTasks.trim().length > 0 && !log.assignedTasks.includes('Planned goals for week');
const isPendingStudent = (log) => log.status === 'pending_student';
const isReviewable = (log) => ['submitted', 'approved', 'rejected'].includes(log.status);

const weekBg = (log) => {
    if (log.status === 'approved') return 'bg-emerald-500 text-white';
    if (log.status === 'rejected') return 'bg-rose-500 text-white';
    if (log.status === 'pending_student') return 'bg-slate-100 text-slate-300 border-2 border-slate-200';
    return 'bg-indigo-600 text-white';
};

const statusPill = (log) => {
    if (log.status === 'approved') return 'bg-emerald-50 border-emerald-100 text-emerald-700 Approved';
    if (log.status === 'rejected') return 'bg-rose-50 border-rose-100 text-rose-700 Flagged';
    if (log.status === 'pending_student') return 'bg-slate-50 border-slate-200 text-slate-400 Pending';
    return 'bg-indigo-50 border-indigo-100 text-indigo-700 Submitted';
};
// ──────────────────────────────────────────────────────────────────────────────

// Single log row (used in both filtered and grouped views)
const LogRow = ({ log, onAction, locked }) => {
    const pill = statusPill(log).split(' ');
    const pillClass = pill.slice(0, 3).join(' ');
    const pillLabel = pill[3];

    return (
        <div className="glass-card bg-white/70 border-slate-100 rounded-[2.5rem] overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10">
            <div className="flex flex-col md:flex-row md:items-center gap-0">
                {/* status strip */}
                <div className={`md:w-2 w-full h-1.5 md:h-auto md:rounded-l-[2.5rem] ${log.status === 'approved' ? 'bg-emerald-400' :
                    log.status === 'rejected' ? 'bg-rose-400' :
                        log.status === 'pending_student' ? 'bg-slate-200' :
                            'bg-indigo-400'
                    } shrink-0`} />

                <div className="flex-1 p-7 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Week badge */}
                    <div className={`w-16 h-16 rounded-[1.2rem] flex flex-col items-center justify-center font-black shadow-lg shrink-0 ${weekBg(log)}`}>
                        <span className="text-[7px] uppercase tracking-widest opacity-60">Wk</span>
                        <span className="text-2xl tracking-tighter leading-none">{log.weekNumber}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${pillClass}`}>
                                {pillLabel}
                            </span>
                            {log.industryMarks !== undefined && log.industryMarks !== null && (
                                <span className="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-indigo-50 border border-indigo-100 text-indigo-700">
                                    ⭐ {log.industryMarks}/100
                                </span>
                            )}
                        </div>

                        {isPendingStudent(log) ? (
                            hasGoals(log) ? (
                                <p className="text-xs font-bold text-primary-600 italic leading-relaxed line-clamp-1">
                                    🎯 {log.assignedTasks.split('\n').filter(t => t.trim() !== '').length} goal{log.assignedTasks.split('\n').filter(t => t.trim() !== '').length !== 1 ? 's' : ''} assigned
                                </p>
                            ) : (
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                                    No goals assigned yet
                                </p>
                            )
                        ) : (
                            <p className="text-sm text-slate-600 font-bold italic leading-relaxed line-clamp-1">
                                "{log.summary || log.tasksPerformed}"
                            </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            {log.hoursWorked && (
                                <span className="flex items-center gap-1.5">
                                    <Clock size={11} className="text-primary-400" /> {log.hoursWorked} hrs
                                </span>
                            )}
                            {log.industryComments && (
                                <span className="flex items-center gap-1.5">
                                    <MessageSquare size={11} className="text-indigo-400" /> Feedback given
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action btn */}
                    {log.status === 'approved' ? (
                        <div className="shrink-0 py-3 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-2 shadow-sm">
                            <CheckCircle2 size={13} /> Reviewed
                        </div>
                    ) : locked && isPendingStudent(log) ? (
                        <div className="shrink-0 py-3 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-400 border border-slate-200 flex items-center gap-2 shadow-sm cursor-not-allowed" title="Previous week must be submitted and reviewed first">
                            <Zap size={13} className="opacity-50" /> Locked
                        </div>
                    ) : (
                        <button
                            onClick={() => onAction(log)}
                            className={`shrink-0 py-3 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 active:scale-95 ${isPendingStudent(log)
                                ? 'bg-primary-600 text-white hover:bg-primary-500'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                                }`}
                        >
                            {isPendingStudent(log)
                                ? hasGoals(log)
                                    ? <><Edit2 size={13} /> Edit Goals</>
                                    : <><Zap size={13} /> Assign Goals</>
                                : <><Star size={13} /> Review</>
                            }
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Collapsible student group (used when no student filter) 
const StudentGroup = ({ studentName, studentAvatar, dept, logs, onAction }) => {
    const [open, setOpen] = useState(true);
    const pendingLogs = logs.filter(l => isPendingStudent(l)).sort((a, b) => a.weekNumber - b.weekNumber);
    const submittedLogs = logs.filter(l => !isPendingStudent(l)).sort((a, b) => b.weekNumber - a.weekNumber);

    // Check if there are any un-approved past weeks (meaning industry needs to review them first)
    const hasUnapprovedPastWeeks = submittedLogs.some(l => l.status !== 'approved');

    const displayedLogs = [
        ...submittedLogs,
        ...(pendingLogs.length > 0 ? [pendingLogs[0]] : [])
    ];

    const hiddenPendingCount = pendingLogs.length > 1 ? pendingLogs.length - 1 : 0;

    const submitted = logs.filter(l => !isPendingStudent(l)).length;
    const pending = logs.filter(l => isPendingStudent(l)).length;

    return (
        <div className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
            {/* Group header */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between p-8 bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
            >
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shadow-lg shrink-0">
                        {studentAvatar
                            ? <img src={studentAvatar} alt={studentName} className="w-full h-full object-cover" />
                            : <User size={22} className="text-slate-400" />
                        }
                    </div>
                    <div className="text-left">
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tighter">{studentName}</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{dept || 'General'}</p>
                    </div>
                    <div className="flex gap-3 ml-4">
                        <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-xl">
                            {submitted} submitted
                        </span>
                        <span className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-xl">
                            {pending} pending
                        </span>
                        {hiddenPendingCount > 0 && (
                            <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-xl">
                                +{hiddenPendingCount} planned
                            </span>
                        )}
                    </div>
                </div>
                {open
                    ? <ChevronUp size={18} className="text-slate-400 shrink-0" />
                    : <ChevronDown size={18} className="text-slate-400 shrink-0" />
                }
            </button>

            {/* Log rows */}
            {open && (
                <div className="p-4 space-y-3 bg-white/40">
                    {displayedLogs.map(log => (
                        <LogRow
                            key={log._id}
                            log={log}
                            onAction={onAction}
                            locked={isPendingStudent(log) && hasUnapprovedPastWeeks}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const IndustryLogs = () => {
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('student');

    const [logs, setLogs] = useState([]);
    const [student, setStudent] = useState(null);
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);

    // Action modal state
    const [actionLog, setActionLog] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [assignedTasks, setAssignedTasks] = useState(['', '']);
    const [rating, setRating] = useState(100);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAll();
    }, [studentId]);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const [logsRes, internsRes] = await Promise.all([
                API.get(studentId ? `/logs?student=${studentId}` : '/logs'),
                API.get('/industry/interns')
            ]);

            if (logsRes.data.status === 'success') {
                setLogs((logsRes.data.data.logs || []).sort((a, b) => a.weekNumber - b.weekNumber));
            }
            if (internsRes.data.status === 'success') {
                setInterns(internsRes.data.data.interns || []);
                if (studentId) {
                    const found = internsRes.data.data.interns.find(i => i.student._id === studentId);
                    if (found) setStudent(found.student);
                }
            }
        } catch (err) {
            console.error('Failed to load logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const openAction = (log) => {
        setActionLog(log);
        setRemarks(log.industryComments || '');
        if (hasGoals(log)) {
            const tasksList = log.assignedTasks.split('\n').filter(t => t.trim() !== '');
            while (tasksList.length < 2) tasksList.push('');
            setAssignedTasks(tasksList);
        } else {
            setAssignedTasks(['', '']);
        }
        setRating(log.industryMarks ?? 100);
    };

    const closeAction = () => {
        setActionLog(null);
        setRemarks('');
        setAssignedTasks(['', '']);
        setRating(100);
    };

    const handleActionSubmit = async (e) => {
        e.preventDefault();
        if (!actionLog) return;

        const filledTasks = assignedTasks.map(t => t.trim()).filter(t => t !== '');
        if (isPendingStudent(actionLog) && filledTasks.length < 2) {
            toast.error('Please provide at least 2 specific tasks for the week.');
            return;
        }

        try {
            setSubmitting(true);
            const payload = {};
            if (isPendingStudent(actionLog) || filledTasks.length > 0) {
                payload.assignedTasks = filledTasks.join('\n');
            }
            if (isReviewable(actionLog)) {
                payload.industryRemarks = remarks;
                payload.industryMarks = rating;
            }
            await API.patch(`/logs/${actionLog._id}/grade`, payload);
            toast.success(isPendingStudent(actionLog) ? 'Goals saved!' : 'Review submitted!');
            closeAction();
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Build student-grouped map for multi-student view ────────────────────────
    const groupedByStudent = () => {
        const map = {};
        logs.forEach(log => {
            const sid = log.student?._id || log.student;
            if (!map[sid]) {
                const intern = interns.find(i => i.student?._id === sid);
                map[sid] = {
                    studentId: sid,
                    name: intern?.student?.name || 'Unknown Student',
                    avatar: intern?.student?.avatar || null,
                    dept: intern?.student?.studentMeta?.department || '',
                    logs: []
                };
            }
            map[sid].logs.push(log);
        });
        return Object.values(map);
    };

    // ── stats for single-student banner ─────────────────────────────────────────
    const totalLogs = logs.length;
    const submittedCount = logs.filter(l => !isPendingStudent(l)).length;
    const pendingCount = logs.filter(l => isPendingStudent(l)).length;
    const reviewedCount = logs.filter(l => l.industryMarks !== null && l.industryMarks !== undefined).length;

    // Filter logic for single student view
    const pendingSingleLogs = logs.filter(l => isPendingStudent(l)).sort((a, b) => a.weekNumber - b.weekNumber);
    const submittedSingleLogs = logs.filter(l => !isPendingStudent(l)).sort((a, b) => b.weekNumber - a.weekNumber);

    // Check if there are un-approved weeks for the single student view
    const hasUnapprovedSinglePastWeeks = submittedSingleLogs.some(l => l.status !== 'approved');

    const displayedSingleLogs = [
        ...submittedSingleLogs,
        ...(pendingSingleLogs.length > 0 ? [pendingSingleLogs[0]] : [])
    ];
    const hiddenSingleCount = pendingSingleLogs.length > 1 ? pendingSingleLogs.length - 1 : 0;

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <SectionHeader
                title="Log Monitoring"
                subtitle="Industry Sub-Page"
                description="Monitor student weekly progress and provide professional feedback"
                icon={ClipboardList}
                linkTo="/dashboard/industry/interns"
                linkText="Back to Interns"
                gradientFrom="from-slate-800"
                gradientTo="to-slate-950"
            />

            {/* ── Single student banner (only when filtered) ── */}
            {studentId && student && (
                <div className="glass-card p-10 bg-slate-900 hover:bg-slate-900 text-white rounded-[3rem] border border-slate-800 shadow-4xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-primary-500/20 transition-all duration-1000" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center font-black text-2xl shadow-2xl ring-4 ring-white/10 overflow-hidden shrink-0">
                                {student.avatar
                                    ? <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                                    : <User size={32} className="text-primary-400" />
                                }
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tighter uppercase italic">{student.name}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Active Intern — {student.studentMeta?.department}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {[
                                { label: 'Weeks', value: totalLogs, color: 'text-white' },
                                { label: 'Done', value: submittedCount, color: 'text-emerald-400' },
                                { label: 'Pending', value: pendingCount, color: 'text-amber-400' },
                                { label: 'Reviewed', value: reviewedCount, color: 'text-indigo-400' },
                            ].map(s => (
                                <div key={s.label} className="text-center px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
                                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Content ── */}
            {loading ? (
                <div className="glass-card p-32 flex flex-col items-center justify-center space-y-6 border-dashed border-2 border-slate-200 rounded-[3rem]">
                    <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Fetching Log Stream...</p>
                </div>
            ) : logs.length === 0 ? (
                <div className="glass-card p-32 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-2 border-slate-200 rounded-[3rem]">
                    <ClipboardList size={40} className="text-slate-200" />
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">No Logs Yet</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
                        {studentId ? 'No plan initialized. Go to Interns and click "Plan Weeks".' : 'No active interns have logs yet.'}
                    </p>
                    {studentId && (
                        <Link to="/dashboard/industry/interns" className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all no-underline">
                            Go to Interns
                        </Link>
                    )}
                </div>
            ) : studentId ? (
                /* ── Single student list ── */
                <div className="space-y-4">
                    {hiddenSingleCount > 0 && (
                        <div className="flex justify-end pr-4">
                            <span className="px-4 py-2 bg-primary-50 border border-primary-100 text-primary-600 text-[9px] font-black uppercase tracking-widest rounded-xl">
                                {hiddenSingleCount} future week{hiddenSingleCount > 1 ? 's' : ''} hidden
                            </span>
                        </div>
                    )}
                    {displayedSingleLogs.map(log => (
                        <LogRow
                            key={log._id}
                            log={log}
                            onAction={openAction}
                            locked={isPendingStudent(log) && hasUnapprovedSinglePastWeeks}
                        />
                    ))}
                </div>
            ) : (
                /* ── Multi-student grouped view ── */
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-6 w-1.5 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">
                            All Interns — {groupedByStudent().length} student{groupedByStudent().length !== 1 ? 's' : ''}
                        </h2>
                    </div>
                    {groupedByStudent().map(group => (
                        <StudentGroup
                            key={group.studentId}
                            studentName={group.name}
                            studentAvatar={group.avatar}
                            dept={group.dept}
                            logs={group.logs}
                            onAction={openAction}
                        />
                    ))}
                </div>
            )}

            {/* ── Action Modal ── */}
            {actionLog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-4xl overflow-hidden animate-slide-up">

                        {/* Header */}
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${isPendingStudent(actionLog) ? 'bg-primary-50 text-primary-600 border-primary-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                        }`}>
                                        Week {actionLog.weekNumber}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${isPendingStudent(actionLog) ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                        }`}>
                                        {isPendingStudent(actionLog) ? 'Pending Student' : 'Submitted'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                                    {isPendingStudent(actionLog)
                                        ? hasGoals(actionLog) ? 'Edit Weekly Goals' : 'Assign Weekly Goals'
                                        : 'Log Review & Rating'}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {isPendingStudent(actionLog)
                                        ? 'Define tasks and expectations for the student this week'
                                        : 'Rate and provide feedback on this submitted log'}
                                </p>
                            </div>
                            <button onClick={closeAction} className="p-3 bg-white text-slate-300 hover:text-rose-500 rounded-2xl shadow-xl transition-all hover:rotate-90">
                                <X size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleActionSubmit} className="p-10 space-y-7">
                            {/* Student report preview */}
                            {isReviewable(actionLog) && (
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Student Report</p>
                                    <p className="text-sm font-bold text-slate-700 italic leading-relaxed">
                                        "{actionLog.summary || actionLog.tasksPerformed}"
                                    </p>
                                    <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><Clock size={12} /> {actionLog.hoursWorked} hrs worked</span>
                                    </div>
                                </div>
                            )}

                            {/* Goals / tasks */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-3 flex justify-between">
                                    <span>{isPendingStudent(actionLog) ? 'This Week\'s Goals & Tasks (2-10 items)' : 'Assigned Weekly Goals'}</span>
                                    {isPendingStudent(actionLog) && (
                                        <span className="text-primary-500">{assignedTasks.length}/10</span>
                                    )}
                                </label>

                                <div className="space-y-3">
                                    {assignedTasks.map((task, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0 mt-2">
                                                {index + 1}
                                            </div>
                                            <div className="relative flex-1">
                                                <input
                                                    value={task}
                                                    onChange={(e) => {
                                                        const newTasks = [...assignedTasks];
                                                        newTasks[index] = e.target.value;
                                                        setAssignedTasks(newTasks);
                                                    }}
                                                    placeholder={index === 0 ? "E.g. Complete UI mockups for Dashboard" : index === 1 ? "E.g. Review pull requests for Auth module" : "Optional additional task..."}
                                                    required={isPendingStudent(actionLog) && index < 2}
                                                    readOnly={!isPendingStudent(actionLog)}
                                                    className={`w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-[1.5rem] text-sm font-bold outline-none transition-all placeholder:text-slate-300 shadow-inner ${!isPendingStudent(actionLog) ? 'opacity-80' : 'focus:bg-white'}`}
                                                />
                                                {isPendingStudent(actionLog) && index >= 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setAssignedTasks(tasks => tasks.filter((_, i) => i !== index))}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors p-2"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {isPendingStudent(actionLog) && assignedTasks.length < 10 && (
                                    <button
                                        type="button"
                                        onClick={() => setAssignedTasks(tasks => [...tasks, ''])}
                                        className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-600 transition-colors ml-11 px-4 py-2 bg-primary-50 rounded-xl w-fit"
                                    >
                                        <Plus size={14} /> Add Another Task
                                    </button>
                                )}
                            </div>

                            {/* Review fields */}
                            {isReviewable(actionLog) && (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-3">Feedback & Comments</label>
                                        <textarea
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            placeholder="Provide professional feedback on the intern's performance..."
                                            rows={3}
                                            className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[2.5rem] text-sm font-bold outline-none transition-all placeholder:text-slate-200 resize-none leading-relaxed shadow-inner italic"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-3 flex justify-between">
                                            <span>Performance Rating</span>
                                            <span className="text-primary-600">{rating}/100</span>
                                        </label>
                                        <div className="flex items-center gap-6">
                                            <input type="range" min="0" max="100" value={rating}
                                                onChange={(e) => setRating(parseInt(e.target.value))}
                                                className="flex-1 accent-slate-900 h-2" />
                                            <input type="number" min="0" max="100" value={rating}
                                                onChange={(e) => setRating(parseInt(e.target.value))}
                                                className="w-20 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-primary-600 text-center focus:outline-none focus:border-primary-500" />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={closeAction}
                                    className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting}
                                    className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50">
                                    {submitting
                                        ? <Loader2 size={18} className="animate-spin" />
                                        : isPendingStudent(actionLog)
                                            ? <><Zap size={18} className="text-primary-400" /> {hasGoals(actionLog) ? 'Update Goals' : 'Save Goals'}</>
                                            : <><Send size={18} className="text-primary-400" /> Submit Review</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndustryLogs;
