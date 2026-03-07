import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, ChevronRight, Filter, Loader2, Calendar, User } from 'lucide-react';
import API from '../../services/api';
import SectionHeader from '../../components/common/SectionHeader';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Career Advice', 'Technical Skills', 'Company Spotlight', 'Internship Tips'];

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await API.get('/blogs');
                if (response.data.status === 'success') {
                    setBlogs(response.data.data.blogs);
                }
            } catch (err) {
                console.error('Failed to fetch blogs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = selectedCategory === 'All' || blog.category === selectedCategory;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-fade-in">
            <SectionHeader
                title="Academic Insights"
                subtitle="Knowledge Hub"
                description="Expert perspectives on career growth, technical excellence, and industry trends."
                icon={BookOpen}
                gradientFrom="from-slate-800"
                gradientTo="to-slate-950"
            />

            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="flex flex-wrap gap-3">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                                    ? 'bg-slate-900 text-white shadow-xl scale-105'
                                    : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm font-bold shadow-xl shadow-slate-100 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <Loader2 size={48} className="text-primary-600 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Knowledge Base...</p>
                </div>
            ) : filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredBlogs.map(blog => (
                        <Link
                            key={blog._id}
                            to={`/blogs/${blog.slug}`}
                            className="glass-card p-0 overflow-hidden group shadow-3xl shadow-slate-200/50 hover:shadow-primary-500/10 no-underline transition-all hover:-translate-y-4"
                        >
                            <div className="aspect-[16/10] overflow-hidden relative">
                                <img src={blog.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] grayscale group-hover:grayscale-0" />
                                <div className="absolute top-6 left-6 px-4 py-2 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-xl">
                                    {blog.category}
                                </div>
                            </div>
                            <div className="p-10 space-y-6">
                                <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    <span className="flex items-center gap-2"><Calendar size={12} className="text-primary-500" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-2"><Clock size={12} className="text-primary-500" /> {blog.readTime || 5} Min Read</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary-600 transition-colors uppercase italic tracking-tighter line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3 italic">
                                    {blog.excerpt || 'Explore professional insights and industry perspectives tailored for the academic-industrial transition.'}
                                </p>
                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400 uppercase italic overflow-hidden">
                                            {blog.author?.avatar ? <img src={blog.author.avatar} className="w-full h-full object-cover" /> : blog.author?.name?.charAt(0) || 'A'}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{blog.author?.name || 'Admin Node'}</span>
                                    </div>
                                    <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="py-40 text-center glass-card border-dashed">
                    <BookOpen size={48} className="mx-auto text-slate-100 mb-6" />
                    <h3 className="text-xl font-black text-slate-900 uppercase">No Insights Found</h3>
                    <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest italic text-center">We couldn't find any articles matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default BlogList;
