import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, MapPin, Calendar, ArrowRight, Bookmark, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../services/api';

const InternshipHub = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        fetchInternships();
        fetchUserData();
    }, []);

    const fetchInternships = async () => {
        try {
            const response = await API.get('/internships');
            setInternships(response.data.data.internships);
        } catch (err) {
            console.error('Error fetching internships:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await API.get('/student/profile');
            setBookmarks(response.data.data.student.bookmarks || []);
        } catch (err) {
            console.error('Error fetching bookmarks:', err);
        }
    };

    const handleApply = async (internshipId) => {
        setApplying(internshipId);
        try {
            await API.post('/applications/apply', { internshipId });
            alert('Application submitted successfully!');
            // Ideally, we'd update the UI to show 'Applied' status
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(null);
        }
    };

    const handleBookmark = async (id) => {
        try {
            const response = await API.post(`/student/toggle-bookmark/${id}`);
            setBookmarks(response.data.data.bookmarks);
        } catch (err) {
            console.error('Error toggling bookmark:', err);
        }
    };

    const filteredInternships = internships.filter(i =>
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link to="/dashboard/student" className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-[10px] uppercase tracking-widest mb-2 no-underline transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Internship Hub</h1>
                    <p className="text-slate-500 font-medium italic">Explore and apply for the best career opportunities.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search job titles or companies..."
                            className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm w-full md:w-80 shadow-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="hidden lg:block space-y-6">
                    <div className="portal-card p-6">
                        <h3 className="font-bold text-secondary-900 mb-4">Job Type</h3>
                        <div className="space-y-3">
                            {['Full-time', 'Part-time', 'Remote', 'On-site'].map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-primary-600 focus:ring-primary-500" />
                                    <span className="text-sm text-slate-600 group-hover:text-secondary-900 transition-colors">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="portal-card p-6 bg-slate-900 text-white border-none text-center">
                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Quick Tip</p>
                        <p className="text-xs font-medium mt-3 leading-relaxed italic opacity-80">"Make sure your CV is updated in Settings before applying!"</p>
                        <Link to="/dashboard/student/cv-builder" className="inline-flex items-center gap-2 text-primary-400 font-black text-[10px] uppercase tracking-widest mt-4 hover:translate-x-1 transition-transform no-underline">
                            Upload Now <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Internship Listings */}
                <div className="lg:col-span-3 space-y-4">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs font-inter">Scoping Global Nodes...</p>
                        </div>
                    ) : filteredInternships.length > 0 ? (
                        filteredInternships.map(job => (
                            <div key={job._id} className="portal-card p-6 group hover:border-primary-200 transition-all cursor-pointer relative">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-5">
                                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-primary-600 font-black text-xl shadow-sm group-hover:bg-primary-50 transition-colors">
                                            {job.companyName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-1">
                                                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                                    <Briefcase size={14} className="text-slate-400" />
                                                    {job.companyName}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                                    <MapPin size={14} className="text-slate-400" />
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {job.duration}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-4">
                                                <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-tighter">
                                                    {job.category || 'General'}
                                                </span>
                                                <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-tighter">
                                                    Engineering
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{job.type}</p>
                                            <p className="text-sm font-black text-secondary-900 mt-1">{job.stipend}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleBookmark(job._id)}
                                                className={`p-2.5 rounded-xl transition-all ${bookmarks.includes(job._id) ? 'text-primary-600 bg-primary-50' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'}`}
                                            >
                                                <Bookmark size={20} fill={bookmarks.includes(job._id) ? "currentColor" : "none"} />
                                            </button>
                                            <button
                                                onClick={() => handleApply(job._id)}
                                                disabled={applying === job._id}
                                                className="px-5 py-2.5 bg-secondary-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-secondary-800 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                            >
                                                {applying === job._id ? <Loader2 size={16} className="animate-spin" /> : 'Apply Now'}
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center portal-card border-dashed">
                            <p className="text-slate-400 font-bold italic">No internships found matching your criteria.</p>
                        </div>
                    )}

                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] text-center bg-slate-50/30">
                        <p className="text-slate-400 text-xs font-bold italic">Can't find what you're looking for?</p>
                        <Link to="/dashboard/student/applications" className="inline-flex items-center gap-2 text-primary-500 font-black text-[10px] uppercase tracking-widest mt-2 hover:translate-x-1 transition-transform no-underline">
                            Track existing applications <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternshipHub;
