import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Search, MoreVertical, Edit2, Trash2, Eye, Users, Calendar, X, Loader2, MapPin, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

const ManagePostings = () => {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        location: '',
        type: 'Full-time',
        duration: '',
        stipend: '',
        deadline: '',
        description: ''
    });

    useEffect(() => {
        fetchPostings();
    }, []);

    const fetchPostings = async () => {
        try {
            const response = await API.get('/industry/postings');
            if (response.data.status === 'success') {
                setPostings(response.data.data.internships);
            }
        } catch (err) {
            console.error('Failed to sync postings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await API.post('/industry/postings', formData);
            if (response.data.status === 'success') {
                setPostings([response.data.data.internship, ...postings]);
                setIsAddingNew(false);
                setFormData({ title: '', category: '', location: '', type: 'Full-time', duration: '', stipend: '', deadline: '', description: '' });
                toast.success('Internship posted successfully!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post internship');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this posting?')) return;
        setDeleteLoading(id);
        try {
            await API.delete(`/industry/postings/${id}`);
            setPostings(postings.filter(p => p._id !== id));
            toast.success('Posting deleted successfully');
        } catch (err) {
            toast.error('Failed to delete posting');
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredPostings = postings.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-fade-in relative pb-20">
            <SectionHeader
                title="Manage Postings"
                subtitle="Industry Sub-Page"
                description="Create, edit and manage your internship postings"
                icon={Layout}
                gradientFrom="from-primary-600"
                gradientTo="to-indigo-600"
            >
                <button
                    onClick={() => setIsAddingNew(true)}
                    className="btn-premium from-primary-600 to-indigo-600 py-5 px-10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-4xl shadow-primary-500/20 group hover:scale-105 active:scale-95 transition-all duration-500"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500 text-primary-200" />
                    Post New Internship
                </button>
            </SectionHeader>

            {/* Industrial Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                    { label: 'Total Deployments', value: postings.length, color: 'primary', icon: Users },
                    { label: 'Open', value: postings.filter(p => p.status === 'open').length, color: 'emerald', icon: Calendar },
                    { label: 'Closed', value: postings.filter(p => p.status !== 'open').length, color: 'slate', icon: MoreVertical }
                ].map((stat, i) => (
                    <div key={i} className="glass-card group p-10 bg-white/50 border-slate-100 hover:border-primary-200 transition-all duration-700 relative overflow-hidden">
                        <div className="relative z-10 flex items-start justify-between">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">{stat.label}</p>
                                <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                            </div>
                            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-700`}>
                                <stat.icon size={28} strokeWidth={1.5} />
                            </div>
                        </div>
                        <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl group-hover:bg-${stat.color}-500/10 transition-all duration-700`}></div>
                    </div>
                ))}
            </div>

            {/* Premium Table Section */}
            <div className="glass-card bg-white/40 border-slate-100 overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">All Postings</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Your published internship listings</p>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search postings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-14 pr-6 py-4 bg-white/50 border border-slate-200 rounded-2xl text-xs font-bold w-full md:w-80 focus:bg-white focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center justify-center space-y-6">
                            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse italic">Loading Postings...</p>
                        </div>
                    ) : filteredPostings.length === 0 ? (
                        <div className="p-32 text-center group">
                            <div className="inline-flex w-24 h-24 bg-slate-50 rounded-[2rem] items-center justify-center text-slate-200 mb-6 group-hover:scale-110 transition-transform duration-700 shadow-inner">
                                <Users size={40} />
                            </div>
                            <p className="text-sm font-black text-slate-400 uppercase tracking-tighter italic">No postings found. Click "Post New Internship" to get started.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Title / Date</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Category</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Location</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredPostings.map(post => (
                                    <tr key={post._id} className="hover:bg-primary-50/30 transition-all duration-500 group">
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter group-hover:text-primary-600 transition-colors">
                                                {post.title}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                                                <Calendar size={12} className="text-primary-400" />
                                                Initiated: {new Date(post.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="px-4 py-2 bg-white text-slate-600 text-[9px] font-black rounded-xl uppercase tracking-[0.2em] shadow-sm border border-slate-100 group-hover:border-primary-200 transition-all duration-500">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                                <MapPin size={12} className="text-slate-300" />
                                                {post.location}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <StatusBadge status={post.status === 'open' ? 'active' : post.status} />
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    className="w-12 h-12 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl shadow-slate-100 border border-slate-50 hover:border-rose-100 group-hover:scale-110"
                                                    disabled={deleteLoading === post._id}
                                                >
                                                    {deleteLoading === post._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={20} strokeWidth={1.5} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Premium Deployment Modal */}
            {isAddingNew && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-2xl animate-fade-in">
                    <form onSubmit={handleCreate} className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-[0_0_100px_rgba(37,99,235,0.15)] overflow-hidden animate-slide-up border border-white/10 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-10 border-b border-slate-100 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-primary-600 text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-primary-500/20">
                                    <Plus size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">New <span className="text-primary-600 italic">Internship Posting</span></h2>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Fill in the details below</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddingNew(false)}
                                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border-2 border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all duration-500 shadow-xl group"
                            >
                                <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    {/* Column 1 */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Position Title</label>
                                        <input
                                            required
                                            className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none shadow-sm"
                                            placeholder="e.g. Backend Developer Intern"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Category</label>
                                            <input
                                                required
                                                className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none shadow-sm"
                                                placeholder="e.g. Web Dev"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Location</label>
                                            <input
                                                required
                                                className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none shadow-sm"
                                                placeholder="e.g. Remote"
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Work Type</label>
                                            <select
                                                className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none appearance-none cursor-pointer shadow-sm"
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option>Full-time</option>
                                                <option>Part-time</option>
                                                <option>Remote</option>
                                                <option>On-site</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Duration</label>
                                            <input
                                                required
                                                className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none shadow-sm"
                                                placeholder="e.g. 6 Weeks"
                                                value={formData.duration}
                                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* Column 2 */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Monthly Stipend</label>
                                            <input
                                                className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none shadow-sm"
                                                placeholder="e.g. PKR 15,000"
                                                value={formData.stipend}
                                                onChange={e => setFormData({ ...formData, stipend: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Application Deadline</label>
                                            <input
                                                required
                                                type="date"
                                                className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none cursor-pointer shadow-sm"
                                                value={formData.deadline}
                                                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Short Title</label>
                                        <input
                                            className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none shadow-sm"
                                            placeholder="Brief operation objective..."
                                            value={formData.tagline || ''}
                                            onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Description</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold text-slate-900 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none shadow-sm resize-none custom-scrollbar"
                                            placeholder="Describe the role and responsibilities..."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-6">
                            <button
                                type="button"
                                onClick={() => setIsAddingNew(false)}
                                className="flex-1 py-5 px-6 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all uppercase tracking-[0.3em] text-[10px] shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-[2] btn-premium from-primary-600 to-indigo-600 py-5 px-6 shadow-2xl shadow-primary-500/20 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} className="text-primary-200" />}
                                Post Internship
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManagePostings;
