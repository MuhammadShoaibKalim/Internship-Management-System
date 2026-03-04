import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, Eye, Users, Calendar, X, Loader2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../services/api';

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
            const response = await API.get('/industry/internships');
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
            const response = await API.post('/industry/create-internship', formData);
            if (response.data.status === 'success') {
                setPostings([response.data.data.internship, ...postings]);
                setIsAddingNew(false);
                setFormData({ title: '', category: '', location: '', type: 'Full-time', duration: '', stipend: '', deadline: '', description: '' });
                alert('Internship posted successfully!');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to post internship');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this posting?')) return;
        setDeleteLoading(id);
        try {
            await API.delete(`/industry/internship/${id}`);
            setPostings(postings.filter(p => p._id !== id));
        } catch (err) {
            alert('Failed to delete posting');
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredPostings = postings.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Manage Postings</h1>
                    <p className="text-slate-500 font-medium">Create and oversee your internship opportunities.</p>
                </div>
                <button
                    onClick={() => setIsAddingNew(true)}
                    className="btn-primary flex items-center justify-center gap-2 group shadow-xl shadow-primary-200"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    Create New Posting
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: 'Total Postings', value: postings.length, color: 'indigo' },
                    { label: 'Open Postings', value: postings.filter(p => p.status === 'open').length, color: 'emerald' },
                    { label: 'Closed/Drafts', value: postings.filter(p => p.status !== 'open').length, color: 'slate' }
                ].map((stat, i) => (
                    <div key={i} className="portal-card p-6 border-l-4 border-l-primary-500">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-3xl font-black text-secondary-900 mt-2">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Table Section */}
            <div className="portal-card overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="font-bold text-secondary-900">Your Internship Postings</h2>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search postings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs w-full md:w-64 focus:bg-white focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center">
                            <Loader2 className="animate-spin text-primary-600" size={32} />
                            <p className="mt-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Fetching Active Nodes...</p>
                        </div>
                    ) : filteredPostings.length === 0 ? (
                        <div className="p-20 text-center">
                            <p className="text-slate-400 font-bold italic">No postings detected in system.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internship Title</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredPostings.map(post => (
                                    <tr key={post._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-secondary-900">{post.title}</p>
                                            <div className="flex items-center gap-3 mt-1 text-[10px] font-semibold text-slate-400">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-xs text-slate-500 font-medium">
                                            {post.location}
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={post.status === 'open' ? 'active' : post.status} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Delete"
                                                    disabled={deleteLoading === post._id}
                                                >
                                                    {deleteLoading === post._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
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

            {/* Creation Modal */}
            {isAddingNew && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !submitting && setIsAddingNew(false)}></div>
                    <form onSubmit={handleCreate} className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="text-xl font-black text-secondary-900 uppercase">New Internship Logic</h2>
                            <button type="button" onClick={() => setIsAddingNew(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Job Title</label>
                                    <input
                                        required
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        placeholder="e.g. Senior Backend Engineer"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</label>
                                    <input
                                        required
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        placeholder="e.g. Web Development"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Location</label>
                                    <input
                                        required
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        placeholder="e.g. Remote / Islamabad"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Type</label>
                                    <select
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Remote</option>
                                        <option>On-site</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Duration</label>
                                    <input
                                        required
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        placeholder="e.g. 3 Months"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Stipend</label>
                                    <input
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        placeholder="e.g. 25k/month or Unpaid"
                                        value={formData.stipend}
                                        onChange={e => setFormData({ ...formData, stipend: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Application Deadline</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        value={formData.deadline}
                                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Detailed Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        placeholder="Outline the responsibilities and requirements..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsAddingNew(false)}
                                className="flex-1 py-4 px-6 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-white transition-all uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-[2] btn-primary py-4 px-6 shadow-xl shadow-primary-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                Initiate Posting
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManagePostings;
