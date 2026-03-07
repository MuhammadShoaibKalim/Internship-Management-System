import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, Clock, Calendar, User, Share2, Bookmark, Loader2,
    BookOpen, ChevronRight, ThumbsUp, MessageCircle, Flag, Copy,
    Check, RotateCcw, MessageSquarePlus, Sparkles, ChevronDown, ChevronUp,
    ExternalLink, MapPin, Award
} from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showExplorer, setShowExplorer] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await API.get(`/blogs/${slug}`);
                if (response.data.status === 'success') {
                    const data = response.data.data.blog;
                    setBlog(data);
                    setLikeCount(data.likes || 0);
                }
            } catch (err) {
                console.error('Failed to fetch blog:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to neuro-link!");
    };

    const handleLike = () => {
        if (!isLiked) {
            setLikeCount(prev => prev + 1);
            setIsLiked(true);
            toast.success("Insight Node Liked!");
            // Optional: API.post(`/blogs/${blog._id}/like`);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
            <Loader2 size={64} className="text-primary-600 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 font-mono">Deciphering Insight Node...</p>
        </div>
    );

    if (!blog) return (
        <div className="max-w-2xl mx-auto px-6 py-40 text-center space-y-8">
            <div className="w-40 h-40 bg-rose-50 rounded-[3rem] flex items-center justify-center text-rose-500 mx-auto shadow-2xl animate-pulse">
                <BookOpen size={64} />
            </div>
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Insight Node Not Found</h2>
            <Link to="/blogs" className="btn-premium inline-flex py-5 px-12 no-underline rounded-3xl">Back to Knowledge Hub</Link>
        </div>
    );

    return (
        <article className="animate-fade-in pb-40 min-h-screen bg-slate-50/50 selection:bg-primary-500 selection:text-white">
            {/* Header */}
            <div className="relative pt-32 pb-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <span className="px-5 py-2 bg-slate-900 text-primary-500 text-[9px] font-black uppercase tracking-widest rounded-2xl shadow-xl border border-slate-800">
                                {blog.category}
                            </span>
                            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-2">
                                    <Calendar size={12} className="text-primary-500" /> {new Date(blog.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-2">
                                    <RotateCcw size={12} className="text-violet-500" /> Updated: {new Date(blog.lastUpdated || blog.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight leading-snug">
                            {blog.title}
                        </h1>

                        <p className="text-sm md:text-base font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed border-l-2 border-primary-500 pl-4">
                            {blog.excerpt}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto px-6 space-y-20">
                {/* Hero Stage */}
                <div
                    className="rounded-[4rem] overflow-hidden shadow-3xl border-[12px] border-white ring-1 ring-slate-100 bg-slate-50 relative group"
                    style={{
                        width: blog.coverImageWidth || '100%',
                        height: blog.coverImageHeight || 'auto',
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        margin: '0 auto'
                    }}
                >
                    <img
                        src={blog.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200'}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-[3000ms]"
                        style={{ objectFit: blog.coverImageFit || 'cover' }}
                        alt={blog.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none" />

                    {/* Badge */}
                    <div className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-3xl px-8 py-4 rounded-3xl border border-white/20 flex items-center gap-4 text-white">
                        <Clock size={20} className="text-primary-400" />
                        <span className="text-sm font-black uppercase tracking-widest">{blog.readTime || 5} Min Read</span>
                    </div>
                </div>

                {/* Tutorial Body Layout */}
                <div className="relative bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-slate-100">
                    {/* Engagement Bar (Static) */}
                    {blog.showEngagement && (
                        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-50">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isLiked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                            >
                                <ThumbsUp size={16} className={isLiked ? 'fill-rose-600' : ''} />
                                <span className="text-xs font-bold">{likeCount}</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl hover:bg-slate-100 transition-all">
                                <MessageCircle size={16} />
                                <span className="text-xs font-bold">Comments</span>
                            </button>
                        </div>
                    )}

                    {/* Topic Explorer Accordion */}
                    {blog.relatedTopics && blog.relatedTopics.length > 0 && (
                        <div className="mb-20 bg-slate-50 border border-slate-100 rounded-[3rem] overflow-hidden">
                            <button
                                onClick={() => setShowExplorer(!showExplorer)}
                                className="w-full p-10 flex items-center justify-between text-left hover:bg-slate-100/50 transition-all"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary-500 shadow-xl">
                                        <Sparkles size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 italic">Tutorial Roadmap Explorer</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Navigate relevant intellectual nodes</p>
                                    </div>
                                </div>
                                {showExplorer ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                            </button>

                            {showExplorer && (
                                <div className="p-10 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
                                    {blog.relatedTopics.map((topic, i) => (
                                        <a
                                            key={i}
                                            href={topic.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-primary-500 hover:shadow-2xl hover:translate-x-2 transition-all no-underline group"
                                        >
                                            <div className="flex items-center gap-5 text-slate-900">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                                                <span className="text-sm font-black uppercase tracking-tight italic group-hover:text-primary-600 transition-colors">{topic.title}</span>
                                            </div>
                                            <ExternalLink size={16} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="prose prose-slate prose-xl max-w-none">
                        <div
                            className="text-slate-700 font-medium leading-[2] text-xl first-letter:text-8xl first-letter:font-black first-letter:text-slate-900 first-letter:mr-4 first-letter:float-left first-letter:uppercase drop-cap-premium selection:bg-primary-500 selection:text-white"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </div>

                    {/* Secondary Content Image Slot */}
                    {blog.contentImage && (
                        <div className="mt-20 flex justify-center">
                            <div
                                className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100 bg-slate-50 group hover:rotate-1 hover:scale-[1.02] transition-all duration-700"
                                style={{
                                    width: blog.contentImageWidth || '100%',
                                    height: blog.contentImageHeight || 'auto',
                                    maxWidth: '100%'
                                }}
                            >
                                <img
                                    src={blog.contentImage}
                                    style={{ objectFit: blog.contentImageFit || 'cover' }}
                                    className="w-full h-full"
                                    alt="Technical Content Detail"
                                />
                            </div>
                        </div>
                    )}

                    {/* Mobile Engagement Bar */}
                    {blog.showEngagement && (
                        <div className="lg:hidden flex items-center justify-between gap-4 mt-20 p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest ${isLiked ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                                >
                                    <ThumbsUp size={16} /> {likeCount}
                                </button>
                                <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                                    <MessageCircle size={16} /> 24
                                </button>
                            </div>
                            <button className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl">
                                <Share2 size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Section: Simple Author & Tags */}
                <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                            {blog.author?.avatar ?
                                <img
                                    src={blog.author.avatar}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                                    }}
                                /> :
                                <div className="w-full h-full flex items-center justify-center font-black text-primary-500 text-lg">{blog.author?.name?.charAt(0)}</div>
                            }
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Written By</p>
                            <h4 className="text-base font-bold text-slate-800 tracking-tight">
                                {blog.author?.name || 'Admin Node'}
                            </h4>
                        </div>
                    </div>

                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map(tag => (
                                <span key={tag} className="px-4 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-100 italic">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export default BlogDetail;
