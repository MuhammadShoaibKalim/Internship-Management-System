import React, { useState, useEffect } from 'react';
import {
    Newspaper,
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Loader2,
    RefreshCw,
    Eye,
    EyeOff,
    Calendar,
    Clock,
    Tag,
    ChevronRight,
    BookOpen,
    Filter,
    Upload,
    Maximize,
    Minimize,
    Move
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

const CATEGORIES = ['Career Advice', 'Technical Skills', 'Company Spotlight', 'Internship Tips', 'General', 'Programming', 'Tutorial'];

const emptyForm = {
    title: '',
    excerpt: '',
    content: '',
    category: 'General',
    tags: '',
    readTime: 5,
    status: 'draft',
    coverImage: '',
    coverImageWidth: '100%',
    coverImageHeight: '400px',
    coverImageFit: 'cover',
    contentImage: '',
    contentImageWidth: '100%',
    contentImageHeight: 'auto',
    contentImageFit: 'cover',
    allowSuggestions: false,
    allowComments: true,
    showEngagement: true,
    relatedTopics: []
};

const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest ${status === 'published'
        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        : 'bg-amber-50 text-amber-600 border border-amber-100'
        }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'published' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
        {status}
    </span>
);

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await API.get('/blogs/admin/all');
            setBlogs(res.data.data.blogs);
        } catch (err) {
            toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setCurrentBlog(emptyForm);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEdit = (blog) => {
        setCurrentBlog({
            ...blog,
            tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '',
            relatedTopics: blog.relatedTopics || []
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentBlog(emptyForm);
        setIsEditing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImageUpload = async (e, type = 'cover') => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(type);
        try {
            const res = await API.post('/blogs/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (type === 'cover') {
                setCurrentBlog({ ...currentBlog, coverImage: res.data.data.url });
            } else {
                setCurrentBlog({ ...currentBlog, contentImage: res.data.data.url });
            }
            toast.success('Image uploaded successfully');
        } catch (err) {
            toast.error('Image upload failed');
        } finally {
            setUploading(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...currentBlog,
                tags: currentBlog.tags
                    ? currentBlog.tags.split(',').map(t => t.trim()).filter(Boolean)
                    : [],
                lastUpdated: new Date()
            };

            if (isEditing) {
                await API.patch(`/blogs/${currentBlog._id}`, payload);
                toast.success('Blog updated successfully');
            } else {
                await API.post('/blogs', payload);
                toast.success('Blog created successfully');
            }
            fetchBlogs();
            closeModal();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save blog');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog post?')) return;
        setDeletingId(id);
        try {
            await API.delete(`/blogs/${id}`);
            toast.success('Blog deleted');
            setBlogs(prev => prev.filter(b => b._id !== id));
        } catch (err) {
            toast.error('Failed to delete blog');
        } finally {
            setDeletingId(null);
        }
    };

    const handleQuickToggle = async (blog) => {
        const newStatus = blog.status === 'published' ? 'draft' : 'published';
        try {
            await API.patch(`/blogs/${blog._id}`, { status: newStatus });
            toast.success(`Blog ${newStatus === 'published' ? 'published' : 'moved to draft'}`);
            setBlogs(prev => prev.map(b => b._id === blog._id ? { ...b, status: newStatus } : b));
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const filtered = blogs.filter(b => {
        const matchSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'all' || b.status === statusFilter;
        const matchCat = categoryFilter === 'All' || b.category === categoryFilter;
        return matchSearch && matchStatus && matchCat;
    });

    const published = blogs.filter(b => b.status === 'published').length;
    const drafts = blogs.filter(b => b.status === 'draft').length;

    return (
        <div className="space-y-10 animate-fade-in pb-12 relative">
            <SectionHeader
                title="Blog Management"
                subtitle="Content Hub"
                description="Create, edit, and publish articles. Manage your knowledge base and academic insights portal."
                icon={Newspaper}
                gradientFrom="from-violet-600"
                gradientTo="to-primary-500"
            >
                <button
                    onClick={openCreate}
                    className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                >
                    <Plus size={20} className="text-violet-400" /> New Post
                </button>
            </SectionHeader>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 gap-6">
                {[
                    { label: 'Total Posts', value: blogs.length, color: 'text-slate-900' },
                    { label: 'Published', value: published, color: 'text-emerald-600' },
                    { label: 'Drafts', value: drafts, color: 'text-amber-600' }
                ].map(stat => (
                    <div key={stat.label} className="portal-card p-8 bg-white border-none shadow-xl shadow-slate-100/50 text-center">
                        <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="portal-card p-6 bg-white border-none shadow-xl shadow-slate-100/50 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative group flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search blog posts..."
                        className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-50 focus:border-violet-500/30 outline-none transition-all placeholder:text-slate-300"
                    />
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <Filter size={16} className="text-slate-300" />
                    {['all', 'published', 'draft'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-900'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <button onClick={fetchBlogs} className="p-4 text-slate-400 hover:text-violet-600 bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 flex-shrink-0">
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-3">
                {['All', ...CATEGORIES].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat
                            ? 'bg-violet-600 text-white shadow-xl shadow-violet-200'
                            : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Blog Table */}
            <div className="portal-card bg-white border-none shadow-xl shadow-slate-100/50 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 size={48} className="text-violet-600 animate-spin" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Posts...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</th>
                                    <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Category</th>
                                    <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Date</th>
                                    <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Read Time</th>
                                    <th className="text-right p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((blog, i) => (
                                    <tr
                                        key={blog._id}
                                        className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors group ${i === filtered.length - 1 ? 'border-b-0' : ''}`}
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-violet-50 rounded-2xl overflow-hidden flex items-center justify-center text-violet-400 flex-shrink-0">
                                                    {blog.author?.avatar ? (
                                                        <img
                                                            src={blog.author.avatar}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                                                            }}
                                                        />
                                                    ) : (
                                                        <BookOpen size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm uppercase tracking-tight line-clamp-1">{blog.title}</p>
                                                    {blog.excerpt && <p className="text-[11px] text-slate-400 font-medium mt-0.5 line-clamp-1 italic">{blog.excerpt}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 hidden md:table-cell">
                                            <span className="px-4 py-2 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-xl">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <StatusBadge status={blog.status} />
                                        </td>
                                        <td className="p-6 hidden lg:table-cell">
                                            <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                <Calendar size={12} className="text-violet-400" />
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="p-6 hidden lg:table-cell">
                                            <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                <Clock size={12} className="text-violet-400" />
                                                {blog.readTime || 5} min
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleQuickToggle(blog)}
                                                    title={blog.status === 'published' ? 'Move to Draft' : 'Publish'}
                                                    className="p-3 text-slate-300 hover:text-violet-600 hover:bg-violet-50 rounded-2xl transition-all"
                                                >
                                                    {blog.status === 'published' ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                                {blog.status === 'published' && (
                                                    <Link
                                                        to={`/blogs/${blog.slug}`}
                                                        target="_blank"
                                                        className="p-3 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all no-underline"
                                                    >
                                                        <ChevronRight size={18} />
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => openEdit(blog)}
                                                    className="p-3 text-slate-300 hover:text-violet-600 hover:bg-violet-50 rounded-2xl transition-all"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog._id)}
                                                    disabled={deletingId === blog._id}
                                                    className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all disabled:opacity-50"
                                                >
                                                    {deletingId === blog._id
                                                        ? <Loader2 size={18} className="animate-spin" />
                                                        : <Trash2 size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center text-violet-200 mb-6">
                            <Newspaper size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase">No Posts Found</h3>
                        <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest italic">
                            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'All'
                                ? 'No posts match your filters'
                                : 'Click "New Post" to write your first article'}
                        </p>
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white flex-shrink-0">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight">
                                    {isEditing ? 'Edit Blog Post' : 'Create New Post'}
                                </h2>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                                    {isEditing ? 'Update the details below' : 'Fill in the details to publish or save as draft'}
                                </p>
                            </div>
                            <button onClick={closeModal} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto flex-1">
                            {/* Title */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Title *</label>
                                <input
                                    required
                                    type="text"
                                    value={currentBlog.title}
                                    onChange={e => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                                    placeholder="Enter a compelling blog title..."
                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-50 focus:border-violet-500/30 outline-none transition-all"
                                />
                            </div>

                            {/* Excerpt */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Excerpt (Short Description)</label>
                                <textarea
                                    rows={2}
                                    value={currentBlog.excerpt}
                                    onChange={e => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                                    placeholder="Brief summary shown on the blog list page..."
                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-50 focus:border-violet-500/30 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Content * (HTML supported)</label>
                                <textarea
                                    required
                                    rows={10}
                                    value={currentBlog.content}
                                    onChange={e => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                                    placeholder="<p>Write your blog content here. HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;strong&gt; are supported...</p>"
                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-50 focus:border-violet-500/30 outline-none transition-all resize-y"
                                />
                            </div>

                            {/* Cover Image Upload & Settings */}
                            <div className="space-y-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic flex items-center gap-2">
                                    <Upload size={14} /> Global Banner Settings
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Image Source</span>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="px-6 py-3 bg-violet-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-violet-700 transition-all flex items-center gap-2"
                                            >
                                                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                                {uploading ? 'Uploading...' : 'Upload Image'}
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </div>
                                        <input
                                            type="url"
                                            value={currentBlog.coverImage}
                                            onChange={e => setCurrentBlog({ ...currentBlog, coverImage: e.target.value })}
                                            placeholder="Or enter image URL..."
                                            className="w-full px-6 py-4 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:border-violet-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Width</label>
                                                <input
                                                    type="text"
                                                    value={currentBlog.coverImageWidth}
                                                    onChange={e => setCurrentBlog({ ...currentBlog, coverImageWidth: e.target.value })}
                                                    placeholder="100% or 800px"
                                                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:border-violet-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Height</label>
                                                <input
                                                    type="text"
                                                    value={currentBlog.coverImageHeight}
                                                    onChange={e => setCurrentBlog({ ...currentBlog, coverImageHeight: e.target.value })}
                                                    placeholder="auto or 500px"
                                                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:border-violet-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Object Fit (Scale Mode)</label>
                                            <div className="flex gap-2">
                                                {['cover', 'contain', 'fill'].map(fit => (
                                                    <button
                                                        key={fit}
                                                        type="button"
                                                        onClick={() => setCurrentBlog({ ...currentBlog, coverImageFit: fit })}
                                                        className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${currentBlog.coverImageFit === fit ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-100'
                                                            }`}
                                                    >
                                                        {fit}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Area */}
                                {currentBlog.coverImage && (
                                    <div className="mt-6 flex flex-col items-center gap-4">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Live Preview in Layout</p>
                                        <div
                                            className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100 bg-slate-200"
                                            style={{
                                                width: currentBlog.coverImageWidth,
                                                height: currentBlog.coverImageHeight,
                                                maxWidth: '100%'
                                            }}
                                        >
                                            <img
                                                src={currentBlog.coverImage}
                                                className="w-full h-full"
                                                style={{ objectFit: currentBlog.coverImageFit }}
                                                alt="Preview"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Secondary Content Image Settings */}
                            <div className="space-y-6 p-8 bg-violet-50/30 rounded-[2.5rem] border border-violet-100/50">
                                <label className="text-[10px] font-black text-violet-600 uppercase tracking-widest ml-1 italic flex items-center gap-2">
                                    <Move size={14} /> Optional content Image Slot
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Image Source</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e) => handleImageUpload(e, 'content');
                                                    input.click();
                                                }}
                                                disabled={uploading === 'content'}
                                                className="px-6 py-3 bg-violet-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-violet-700 transition-all flex items-center gap-2"
                                            >
                                                {uploading === 'content' ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                                {uploading === 'content' ? 'Uploading...' : 'Upload Image'}
                                            </button>
                                        </div>
                                        <input
                                            type="url"
                                            value={currentBlog.contentImage}
                                            onChange={e => setCurrentBlog({ ...currentBlog, contentImage: e.target.value })}
                                            placeholder="Content image URL..."
                                            className="w-full px-6 py-4 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:border-violet-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Width</label>
                                                <input
                                                    type="text"
                                                    value={currentBlog.contentImageWidth}
                                                    onChange={e => setCurrentBlog({ ...currentBlog, contentImageWidth: e.target.value })}
                                                    placeholder="100% or 600px"
                                                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:border-violet-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Height</label>
                                                <input
                                                    type="text"
                                                    value={currentBlog.contentImageHeight}
                                                    onChange={e => setCurrentBlog({ ...currentBlog, contentImageHeight: e.target.value })}
                                                    placeholder="auto or 400px"
                                                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:border-violet-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Object Fit</label>
                                            <div className="flex gap-2">
                                                {['cover', 'contain', 'fill'].map(fit => (
                                                    <button
                                                        key={fit}
                                                        type="button"
                                                        onClick={() => setCurrentBlog({ ...currentBlog, contentImageFit: fit })}
                                                        className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${currentBlog.contentImageFit === fit ? 'bg-violet-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
                                                    >
                                                        {fit}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {currentBlog.contentImage && (
                                    <div className="mt-6 flex flex-col items-center gap-4">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic text-center">In-Content Preview</p>
                                        <div
                                            className="rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-slate-100 bg-slate-200"
                                            style={{
                                                width: currentBlog.contentImageWidth,
                                                height: currentBlog.contentImageHeight,
                                                maxWidth: '100%'
                                            }}
                                        >
                                            <img
                                                src={currentBlog.contentImage}
                                                className="w-full h-full"
                                                style={{ objectFit: currentBlog.contentImageFit }}
                                                alt="Content Preview"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Row: Category + Read Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Category</label>
                                    <select
                                        value={currentBlog.category}
                                        onChange={e => setCurrentBlog({ ...currentBlog, category: e.target.value })}
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-50 focus:border-violet-500/30 outline-none transition-all"
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Read Time (minutes)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={60}
                                        value={currentBlog.readTime}
                                        onChange={e => setCurrentBlog({ ...currentBlog, readTime: Number(e.target.value) })}
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-50 focus:border-violet-500/30 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic flex items-center gap-2">
                                    <Tag size={12} /> Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={currentBlog.tags}
                                    onChange={e => setCurrentBlog({ ...currentBlog, tags: e.target.value })}
                                    placeholder="internship, career, skills, AI"
                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-50 focus:border-violet-500/30 outline-none transition-all"
                                />
                            </div>

                            {/* Tutorial Engagement Settings */}
                            <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 space-y-6">
                                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] ml-1 italic flex items-center gap-2">
                                    Interactive Node Settings
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { id: 'allowSuggestions', label: 'Suggestions', icon: Eye },
                                        { id: 'allowComments', label: 'Comments', icon: BookOpen },
                                        { id: 'showEngagement', label: 'Engagement Bar', icon: Tag }
                                    ].map(toggle => (
                                        <button
                                            key={toggle.id}
                                            type="button"
                                            onClick={() => setCurrentBlog({ ...currentBlog, [toggle.id]: !currentBlog[toggle.id] })}
                                            className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${currentBlog[toggle.id]
                                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                                                : 'bg-white/5 border-white/10 text-slate-500'}`}
                                        >
                                            <toggle.icon size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{toggle.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Related Topics (Explorer) */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Related Concept Explorer</label>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentBlog({
                                            ...currentBlog,
                                            relatedTopics: [...(currentBlog.relatedTopics || []), { title: '', link: '', isCompleted: false }]
                                        })}
                                        className="text-[9px] font-black text-violet-600 uppercase tracking-widest hover:underline"
                                    >
                                        + Add Topic Link
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {(currentBlog.relatedTopics || []).map((topic, idx) => (
                                        <div key={idx} className="flex gap-3 animate-in slide-in-from-left duration-300">
                                            <input
                                                type="text"
                                                placeholder="Topic Title (e.g. JVM Intro)"
                                                value={topic.title}
                                                onChange={(e) => {
                                                    const newTopics = [...currentBlog.relatedTopics];
                                                    newTopics[idx].title = e.target.value;
                                                    setCurrentBlog({ ...currentBlog, relatedTopics: newTopics });
                                                }}
                                                className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-violet-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Link URL"
                                                value={topic.link}
                                                onChange={(e) => {
                                                    const newTopics = [...currentBlog.relatedTopics];
                                                    newTopics[idx].link = e.target.value;
                                                    setCurrentBlog({ ...currentBlog, relatedTopics: newTopics });
                                                }}
                                                className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-violet-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newTopics = currentBlog.relatedTopics.filter((_, i) => i !== idx);
                                                    setCurrentBlog({ ...currentBlog, relatedTopics: newTopics });
                                                }}
                                                className="p-3 text-rose-300 hover:text-rose-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {(currentBlog.relatedTopics || []).length === 0 && (
                                        <p className="text-[10px] text-slate-400 italic text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">No related topics mapped yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Publication Status */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Publication Status</label>
                                <div className="flex gap-4">
                                    {['draft', 'published'].map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setCurrentBlog({ ...currentBlog, status: s })}
                                            className={`flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${currentBlog.status === s
                                                ? s === 'published' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                                }`}
                                        >
                                            {s === 'published' ? '🌐 Published' : '📝 Draft'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-8 py-5 bg-slate-50 text-slate-400 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-[2] px-8 py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                                >
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : null}
                                    {saving ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlogs;
