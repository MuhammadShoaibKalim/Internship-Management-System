import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark, Loader2, BookOpen, ChevronRight } from 'lucide-react';
import API from '../../services/api';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await API.get(`/blogs/${slug}`);
                if (response.data.status === 'success') {
                    setBlog(response.data.data.blog);
                }
            } catch (err) {
                console.error('Failed to fetch blog:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
            <Loader2 size={64} className="text-primary-600 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Deciphering Insight Node...</p>
        </div>
    );

    if (!blog) return (
        <div className="max-w-2xl mx-auto px-6 py-40 text-center space-y-8">
            <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 mx-auto">
                <BookOpen size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Insight Node Not Found</h2>
            <Link to="/blogs" className="btn-premium inline-flex py-4 px-10 no-underline">Back to Knowledge Hub</Link>
        </div>
    );

    return (
        <article className="animate-fade-in pb-40">
            {/* Header / Hero */}
            <div className="max-w-4xl mx-auto px-6 pt-12 space-y-12">
                <Link to="/blogs" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors no-underline group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Knowledge Hub
                </Link>

                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="px-4 py-2 bg-primary-500 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl">
                            {blog.category}
                        </span>
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-2"><Calendar size={14} className="text-primary-500" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-2"><Clock size={14} className="text-primary-500" /> {blog.readTime || 5} Min Read</span>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">
                        {blog.title}
                    </h1>

                    <div className="flex items-center justify-between py-10 border-y border-slate-100">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                                {blog.author?.avatar ? <img src={blog.author.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-primary-500 text-lg">{blog.author?.name?.charAt(0)}</div>}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Published By</p>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{blog.author?.name || 'Admin Node'}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl hover:text-primary-600 transition-colors flex items-center justify-center">
                                <Share2 size={20} />
                            </button>
                            <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl hover:text-primary-600 transition-colors flex items-center justify-center">
                                <Bookmark size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="aspect-[21/9] rounded-[4rem] overflow-hidden shadow-4xl grayscale hover:grayscale-0 transition-all duration-1000 border border-slate-100">
                    <img src={blog.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover" alt="" />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6">
                <div className="prose prose-slate prose-lg lg:prose-xl max-w-none">
                    <div className="text-slate-600 font-medium leading-[2] italic text-lg" dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-20 pt-10 border-t border-slate-100">
                        {blog.tags.map(tag => (
                            <span key={tag} className="px-6 py-3 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Next Article CTA */}
                <div className="mt-40 p-16 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative group">
                    <div className="relative z-10 flex items-center justify-between gap-10">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Continue Reading</p>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter max-w-md leading-none">Explore more career navigation strategies</h3>
                        </div>
                        <Link to="/blogs" className="w-16 h-16 bg-primary-500 text-slate-900 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform no-underline">
                            <ChevronRight size={28} />
                        </Link>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                </div>
            </div>
        </article>
    );
};

export default BlogDetail;
