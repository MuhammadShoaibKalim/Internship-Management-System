import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, Filter, Briefcase, MapPin, Calendar, ArrowRight, Sparkles, Globe, Bookmark, ArrowLeft, Loader2, X, FileText, Send } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

const InternshipHub = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(null);
    const [detailModal, setDetailModal] = useState(null); // { job }
    const [bookmarks, setBookmarks] = useState([]);
    const [studentCvUrl, setStudentCvUrl] = useState(null);
    const [applyModal, setApplyModal] = useState(null); // { id, title, company }
    const [coverLetter, setCoverLetter] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInternships();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [searchTerm, selectedTypes]);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchInternships = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (selectedTypes.length > 0) params.append('type', selectedTypes.join(','));

            const response = await API.get(`/internships?${params.toString()}`);
            setInternships(response.data.data.internships);
        } catch (err) {
            console.error('Error fetching internships:', err);
            toast.error('Failed to sync internships');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await API.get('/student/profile');
            const student = response.data.data.student;
            setBookmarks(student.bookmarks || []);
            setStudentCvUrl(student.cvUrl || student.cv?.url || null);
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };

    const handleApply = (internshipId, title, companyName) => {
        const user = localStorage.getItem('user');
        if (!user) {
            toast.error('Please login to apply for internships.');
            navigate('/auth/login', { state: { from: { pathname: '/internships' } } });
            return;
        }

        // Check live profile data (not stale localStorage)
        if (!studentCvUrl) {
            toast.error('Please upload your CV/Resume in Settings before applying.');
            return;
        }
        // Open the cover letter modal
        setApplyModal({ id: internshipId, title, company: companyName });
        setCoverLetter('');
    };

    const handleSubmitApplication = async () => {
        if (!applyModal) return;
        setApplying(applyModal.id);
        try {
            await API.post('/applications/apply', {
                internshipId: applyModal.id,
                coverLetter: coverLetter.trim()
            });
            toast.success('Application submitted successfully!');
            setApplyModal(null);
            setCoverLetter('');
            fetchInternships();
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to submit application';
            toast.error(message);
        } finally {
            setApplying(null);
        }
    };

    const handleBookmark = async (id) => {
        try {
            const response = await API.post(`/student/toggle-bookmark/${id}`);
            setBookmarks(response.data.data.bookmarks);
            toast.success(response.data.message || 'Bookmark updated!');
        } catch (err) {
            toast.error('Failed to update bookmark');
            console.error('Error toggling bookmark:', err);
        }
    };

    const toggleType = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-6 space-y-12 animate-fade-in pb-12">
                {/* Premium Header Section */}
                <div className="space-y-6">
                    {localStorage.getItem('user') && (
                        <Link to="/dashboard/student" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 font-black text-[10px] uppercase tracking-widest no-underline transition-all group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>
                    )}
                    <SectionHeader
                        title="Internship Hub"
                        subtitle="Opportunities"
                        description="Browse available internships and apply to kickstart your career."
                        icon={Briefcase}
                        gradientFrom="from-primary-600"
                        gradientTo="to-indigo-500"
                    >
                        <div className="flex items-center gap-5">
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by title or company..."
                                    className="pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm w-full md:w-96 shadow-2xl shadow-slate-100 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 font-bold"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="p-5 bg-white border border-slate-100 rounded-3xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all shadow-xl shadow-slate-100 active:scale-95">
                                <Filter size={24} />
                            </button>
                        </div>
                    </SectionHeader>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Filters Sidebar - Premium Glass */}
                    <div className="hidden lg:block space-y-10">
                        <div className="glass-card p-10 border-none shadow-3xl shadow-slate-200/50">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                                <Filter size={18} className="text-primary-500" />
                                <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-900">Filters</h3>
                            </div>
                            <div className="space-y-6">
                                {['Full-time', 'Part-time', 'Remote', 'On-site'].map(type => (
                                    <label key={type} className="flex items-center gap-4 cursor-pointer group">
                                        <div className="relative w-6 h-6 rounded-lg border-2 border-slate-100 group-hover:border-primary-500 transition-all flex items-center justify-center bg-white group-hover:shadow-lg">
                                            <input
                                                type="checkbox"
                                                className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                                                checked={selectedTypes.includes(type)}
                                                onChange={() => toggleType(type)}
                                            />
                                            <div className={`w-2.5 h-2.5 bg-primary-500 rounded-sm transition-transform ${selectedTypes.includes(type) ? 'scale-100' : 'scale-0'}`}></div>
                                        </div>
                                        <span className={`text-sm font-bold transition-colors ${selectedTypes.includes(type) ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-10 bg-slate-900 text-white border-none text-center relative overflow-hidden group shadow-3xl shadow-primary-500/20">
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-2xl mx-auto mb-6 group-hover:rotate-12 transition-transform">
                                    <Sparkles size={32} />
                                </div>
                                <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em]">Quick Tip</p>
                                <p className="text-sm font-medium mt-4 leading-relaxed italic opacity-70 hover:text-black transition-colors">"Upload your CV in Settings before applying to internships."</p>
                                <Link to="/dashboard/student/settings" className="btn-primary border-none bg-white text-slate-900 py-3.5 px-8 mt-8 text-[9px] group no-underline inline-flex">
                                    Sync Settings <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-primary-500/20 transition-all duration-1000" />
                        </div>
                    </div>

                    {/* Internship Listings */}
                    <div className="lg:col-span-3 space-y-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40 space-y-6">
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-slate-100 rounded-full animate-spin border-t-primary-500"></div>
                                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-primary-500 animate-pulse" />
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] font-inter">Loading Internships...</p>
                            </div>
                        ) : internships.length > 0 ? (
                            internships.map(job => (
                                <div key={job._id} className="glass-card p-10 border-transparent hover:border-primary-100 hover:shadow-4xl hover:shadow-primary-100/30 transition-all duration-700 group relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                                    <div className="w-24 h-24 bg-slate-900 border border-white/10 rounded-[2.5rem] flex items-center justify-center text-primary-500 font-black text-3xl shadow-2xl shrink-0 group-hover:rotate-6 transition-transform relative z-10 overflow-hidden">
                                        {job.industry?.avatar ? (
                                            <img src={job.industry.avatar} alt={job.companyName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="italic">{job.companyName.charAt(0)}</span>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                            <span className="px-4 py-1.5 bg-primary-50 text-primary-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-primary-100/50">
                                                {job.category || 'General'}
                                            </span>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                                                <MapPin size={12} className="text-primary-500" />
                                                {job.location} | {job.type}
                                            </div>
                                        </div>

                                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 group-hover:text-primary-600 transition-colors uppercase italic tracking-tighter leading-none">{job.title}</h3>

                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 border-t border-slate-50 pt-6">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Industry Node</p>
                                                <p className="text-xs font-black text-slate-500 uppercase tracking-tight">{job.companyName}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Duration</p>
                                                <p className="text-xs font-black text-slate-500 uppercase tracking-tight">{job.duration}</p>
                                            </div>
                                            <div className="space-y-1 text-center md:text-left">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Stipend</p>
                                                <p className="text-lg font-black text-slate-900 tracking-tighter uppercase">{job.stipend}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center justify-center gap-4 shrink-0 relative z-10 w-full md:w-auto md:pl-12 md:border-l border-slate-100">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleBookmark(job._id); }}
                                            className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center ${bookmarks.includes(job._id) ? 'text-primary-600 bg-primary-50 border border-primary-200 shadow-xl' : 'text-slate-300 bg-slate-50 hover:text-primary-600 hover:bg-white border border-transparent hover:border-primary-100'}`}
                                        >
                                            <Bookmark size={24} fill={bookmarks.includes(job._id) ? "currentColor" : "none"} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setDetailModal(job); }}
                                            className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-100 transition-all shadow-xl shadow-slate-100/50"
                                        >
                                            <Sparkles size={24} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleApply(job._id, job.title, job.companyName); }}
                                            disabled={applying === job._id}
                                            className="flex-1 md:flex-none btn-premium from-primary-600 to-indigo-600 text-[10px] py-5 px-12 group no-underline disabled:opacity-50 shadow-4xl shadow-primary-500/10"
                                        >
                                            {applying === job._id ? <Loader2 size={18} className="animate-spin" /> : 'APPLY NODE'}
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-500/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                </div>
                            ))
                        ) : (
                            <div className="p-32 text-center glass-card border-dashed transition-all hover:bg-slate-50/50 group">
                                <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-200 mx-auto mb-8 group-hover:scale-110 transition-transform">
                                    <Search size={40} />
                                </div>
                                <h4 className="text-xl font-black text-slate-900 uppercase">No Results Found</h4>
                                <p className="text-slate-400 text-xs font-bold mt-3 uppercase tracking-widest italic">No internships match your search.</p>
                            </div>
                        )}

                        <div className="p-12 glass-card border-none bg-primary-50/30 flex items-center justify-between group mt-12">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary-500 group-hover:rotate-12 transition-transform">
                                    <Globe size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">View Applications</h4>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Check the status of your applications.</p>
                                </div>
                            </div>
                            <Link to="/dashboard/student/applications" className="btn-premium from-slate-900 to-slate-800 py-3 px-8 text-[9px] group no-underline">
                                Track Applications <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cover Letter Modal */}
            {
                applyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setApplyModal(null)}>
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
                        <div
                            className="relative bg-white rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.25)] w-full max-w-2xl p-12 animate-fade-in"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close */}
                            <button onClick={() => setApplyModal(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                <X size={20} />
                            </button>

                            {/* Header */}
                            <div className="mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full border border-primary-100 mb-4">
                                    <FileText size={12} className="text-primary-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">New Application</span>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{applyModal.title}</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2 italic">{applyModal.company}</p>
                            </div>

                            {/* Cover Letter Textarea */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                                    Cover Letter <span className="text-slate-300">(Optional but recommended)</span>
                                </label>
                                <textarea
                                    className="w-full h-48 p-8 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-medium text-slate-700 leading-relaxed resize-none focus:outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 focus:bg-white transition-all placeholder:text-slate-300 italic"
                                    placeholder="Tell the company why you're a great fit for this role..."
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    autoFocus
                                />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">{coverLetter.length} / 1000 characters</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 mt-10">
                                <button
                                    onClick={() => setApplyModal(null)}
                                    className="flex-1 py-5 bg-slate-50 border border-slate-200 text-slate-400 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:text-slate-900 hover:border-slate-300 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitApplication}
                                    disabled={applying === applyModal?.id}
                                    className="flex-1 py-5 btn-premium from-primary-600 to-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-4xl shadow-primary-500/20 active:scale-95 disabled:opacity-50"
                                >
                                    {applying === applyModal?.id ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Send size={16} className="text-primary-200" />
                                    )}
                                    Submit Application
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {/* Internship Detail Modal */}
            {detailModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setDetailModal(null)}>
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"></div>
                    <div
                        className="relative bg-white rounded-[4rem] shadow-[0_40px_120px_rgba(0,0,0,0.4)] w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in flex flex-col md:flex-row"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sidebar Info */}
                        <div className="md:w-1/3 bg-slate-900 p-12 text-white space-y-10 overflow-y-auto border-r border-white/5">
                            <div className="w-24 h-24 bg-white border border-white/10 rounded-[2.5rem] flex items-center justify-center text-primary-600 font-black text-3xl shadow-2xl mx-auto overflow-hidden">
                                {detailModal.industry?.avatar ? <img src={detailModal.industry.avatar} className="w-full h-full object-cover" /> : detailModal.companyName.charAt(0)}
                            </div>

                            <div className="text-center space-y-2">
                                <h4 className="text-xl font-black uppercase italic tracking-tighter text-primary-500">{detailModal.companyName}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{detailModal.location} | {detailModal.type}</p>
                            </div>

                            <div className="space-y-8 pt-8 border-t border-white/10">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Compensation</p>
                                    <p className="text-2xl font-black italic">{detailModal.stipend}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Duration</p>
                                    <p className="text-sm font-black italic uppercase">{detailModal.duration}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Deadline</p>
                                    <p className="text-sm font-black italic uppercase text-rose-400">{new Date(detailModal.deadline).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => { handleApply(detailModal._id, detailModal.title, detailModal.companyName); setDetailModal(null); }}
                                className="w-full btn-premium from-primary-500 to-indigo-500 text-slate-900 border-none py-6 text-sm group no-underline"
                            >
                                APPLY FOR NODE <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-12 md:p-16 overflow-y-auto space-y-12 bg-slate-50/30">
                            <button onClick={() => setDetailModal(null)} className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all z-10">
                                <X size={20} />
                            </button>

                            <div className="space-y-6">
                                <span className="px-5 py-2 bg-primary-50 text-primary-600 text-[10px] font-black rounded-xl uppercase tracking-[0.2em] border border-primary-100">
                                    {detailModal.category} Node
                                </span>
                                <h2 className="text-5xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">{detailModal.title}</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 border-l-4 border-primary-500 pl-4 italic">Mission Description</h5>
                                    <div className="text-slate-500 text-sm font-medium leading-[2] italic whitespace-pre-wrap">
                                        {detailModal.description}
                                    </div>
                                </div>

                                {detailModal.skillsRequired?.length > 0 && (
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 border-l-4 border-primary-500 pl-4 italic">Required Matrix</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {detailModal.skillsRequired.map(skill => (
                                                <span key={skill} className="px-4 py-2 bg-white border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl italic">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InternshipHub;
