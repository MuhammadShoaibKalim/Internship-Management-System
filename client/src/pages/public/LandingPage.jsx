import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, BookOpen, Shield, ChevronRight,Home , Globe, Users, TrendingUp, Sparkles, Search, MapPin, Loader2, X } from 'lucide-react';
import API from '../../services/api';
import { MdOutlineViewTimeline } from "react-icons/md";


const LandingPage = () => {
    const [stats, setStats] = useState({ interns: 120, companies: 45, positions: 15 });
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedJob, setSelectedJob] = useState(null);

    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await API.get('/internships');
                setFeaturedJobs(res.data.data.internships.slice(0, 3));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    return (
        <div className="animate-fade-in relative">
            {/* Internship Detail Modal (Global Scope) */}
            {selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedJob(null)}>
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"></div>
                    <div
                        className="relative bg-white rounded-[3rem] shadow-[0_48px_144px_rgba(0,0,0,0.5)] w-full max-w-5xl max-h-[70vh] overflow-hidden animate-fade-in flex flex-col md:row"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={() => setSelectedJob(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all z-20 shadow-xl">
                            <ArrowRight className="rotate-180" size={24} />
                        </button>

                        <div className="md:w-[40%] bg-slate-900 p-8 text-white space-y-6 shrink-0 relative overflow-hidden flex flex-col justify-between">
                            <div className="relative z-10 space-y-6">
                                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-primary-600 font-black text-2xl shadow-xl overflow-hidden">
                                    {selectedJob.industry?.avatar ? <img src={selectedJob.industry.avatar} className="w-full h-full object-cover" /> : selectedJob.companyName.charAt(0)}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-primary-500">{selectedJob.companyName}</h4>
                                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                        <MapPin size={12} className="text-primary-400" />
                                        {selectedJob.location} | {selectedJob.type}
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase text-slate-500 italic">Stipend</p>
                                            <p className="text-2xl font-black italic">{selectedJob.stipend}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase text-slate-500 italic">Period</p>
                                            <p className="text-xl font-black italic uppercase">{selectedJob.duration}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to={`/internships`}
                                className="relative z-10 w-full flex items-center justify-center gap-3 bg-primary-500 hover:bg-primary-400 text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] py-5 px-8 rounded-2xl transition-all shadow-xl shadow-primary-500/30 no-underline group"
                            >
                                PROCEED TO APPLY <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />
                        </div>

                        <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-slate-50/50 space-y-8">
                            <div className="space-y-8">
                                <span className="inline-block px-5 py-2 bg-primary-100 text-primary-600 text-[10px] font-black rounded-xl uppercase tracking-[0.3em]">
                                    {selectedJob.category} Node
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-slate-900 italic tracking-tighter uppercase leading-[0.85]">{selectedJob.title}</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-6">
                                    <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-900 border-l-4 border-primary-500 pl-6 italic">Strategic Objective</h5>
                                    <div className="text-slate-600 text-lg font-medium leading-[2.2] italic whitespace-pre-wrap">
                                        {selectedJob.description}
                                    </div>
                                </div>

                                {selectedJob.skillsRequired?.length > 0 && (
                                    <div className="space-y-6">
                                        <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-900 border-l-4 border-primary-500 pl-6 italic">Competency Matrix</h5>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedJob.skillsRequired.map(skill => (
                                                <span key={skill} className="px-6 py-3 bg-white border border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl italic shadow-sm">
                                                    #{skill}
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
            {/* Hero Section */}
            <section className="relative px-6 py-12 md:py-24">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
                    <div className="flex-1 space-y-12">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-50 rounded-full border border-primary-100 shadow-sm animate-slide-right">
                            <Briefcase size={14} className="text-primary-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">The Future of Internships</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase italic grayscale hover:grayscale-0 transition-all duration-700">
                            Digital <br />
                            <span className="text-primary-600 not-italic">Bridge</span> <br />
                            to Careers
                        </h1>

                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl italic">
                            Elevating the academic internship lifecycle through automated vetting, real-time industrial monitoring, and premium UX.
                        </p>

                        <div className="flex flex-wrap gap-6 pt-4">
                            {user ? (
                                <Link to={`/dashboard/${user.role}`} className="px-10 py-6 bg-slate-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-4xl shadow-slate-900/40 hover:bg-primary-600 transition-all no-underline flex items-center gap-4 group">
                                    <Home size={18} className="group-hover:scale-110 transition-transform" />
                                    MY DASHBOARD <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <>
                                    <Link to="/internships" className="px-10 py-6 bg-slate-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-4xl shadow-slate-900/40 hover:bg-primary-600 transition-all no-underline flex items-center gap-4 group">
                                        EXPLORE HUB <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link to="/auth/register" className="px-10 py-6 bg-white border-2 border-slate-100 text-slate-900 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] hover:border-primary-500 transition-all no-underline flex items-center gap-4 group">
                                        JOIN TODAY
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-12 pt-12 border-t border-slate-100">
                            {[
                                { label: 'Active Interns', val: stats.interns, icon: Users },
                                { label: 'Partner Firms', val: stats.companies, icon: Globe },
                                { label: 'Live Spots', val: stats.positions, icon: TrendingUp },
                            ].map((s, i) => (
                                <div key={i} className="space-y-2">
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{s.val}+</p>
                                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                        <s.icon size={10} className="text-primary-500" /> {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 relative md:block hidden">
                        <div className="relative z-10 w-full aspect-square bg-slate-100 rounded-[4rem] overflow-hidden group shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" alt="Collaboration" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s] grayscale hover:grayscale-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 flex flex-col justify-end p-12">
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Unified Workflow</h3>
                                <p className="text-slate-300 text-xs mt-3 uppercase tracking-widest font-bold">Academia meets Industry in a premium ecosystem.</p>
                            </div>
                        </div>
                        {/* Decorative floating cards */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary-500 rounded-[3rem] -z-10 blur-3xl opacity-20 animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500 rounded-full -z-10 blur-3xl opacity-20" />
                    </div>
                </div>
            </section>

            {/* Featured Internships */}
            <section className="bg-slate-50 py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-20">
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em]">Curated Listings</h2>
                            <h3 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic">Featured Positions</h3>
                        </div>
                        <Link to="/internships" className="hidden md:flex items-center gap-3 text-sm font-black text-slate-400 hover:text-slate-900 no-underline group transition-all">
                            View Global Hub <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {loading ? (
                            [1, 2].map(i => (
                                <div key={i} className="h-48 bg-slate-100 rounded-[3rem] animate-pulse" />
                            ))
                        ) : featuredJobs.map(job => (
                            <div
                                key={job._id}
                                onClick={() => setSelectedJob(job)}
                                className="glass-card p-10 bg-white border-transparent hover:border-primary-100 shadow-3xl shadow-slate-200/50 hover:shadow-primary-500/10 cursor-pointer group transition-all duration-700 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
                            >
                                <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-primary-500 shadow-2xl group-hover:rotate-6 transition-transform relative z-10 overflow-hidden shrink-0">
                                    {job.industry?.avatar ? <img src={job.industry.avatar} className="w-full h-full object-cover" alt="" /> : <span className="text-2xl font-black italic">{job.companyName?.charAt(0)}</span>}
                                </div>

                                <div className="flex-1 space-y-4 relative z-10 text-center md:text-left w-full">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        <span className="px-4 py-1.5 bg-primary-50 text-primary-600 text-[9px] font-black uppercase tracking-widest rounded-xl border border-primary-100/50">
                                            {job.category || 'General'}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                            Posted in {job.location}
                                        </span>
                                    </div>
                                    <h4 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none group-hover:text-primary-600 transition-colors">
                                        {job.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-2"><Briefcase size={14} className="text-primary-500" /> {job.companyName}</span>
                                        <span className="flex items-center gap-2"><MapPin size={14} className="text-primary-500" /> {job.type}</span>
                                    </div>
                                </div>

                                <div className="md:pl-10 md:border-l border-slate-100 flex flex-col items-center md:items-end gap-3 shrink-0 relative z-10">
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-1 italic">Stipend Node</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{job.stipend}</p>
                                    <div className="mt-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 group-hover:translate-x-2 transition-transform">
                                        View Details <MdOutlineViewTimeline size={16} />
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Insights Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto text-center space-y-24">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                            <BookOpen size={12} className="text-primary-400" /> Knowledge Center
                        </div>
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
                            Latest Career <span className="text-primary-600 not-italic">Insights</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[
                            { title: 'The Future of Remote Academic Internships', cat: 'Industry Tips', date: 'Mar 15, 2026', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600' },
                            { title: 'Designing a Standout CV for Global Placements', cat: 'Career Advice', date: 'Mar 12, 2026', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600' },
                        ].map((b, i) => (
                            <Link key={i} to="/blogs" className="group relative aspect-[16/9] rounded-[3rem] overflow-hidden no-underline border border-slate-100 flex items-end p-12 text-left">
                                <img src={b.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                                <div className="relative z-10 space-y-4">
                                    <span className="px-3 py-1 bg-primary-500 text-slate-900 text-[8px] font-black uppercase tracking-widest rounded-lg">{b.cat}</span>
                                    <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none italic">{b.title}</h4>
                                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{b.date}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative py-40 bg-slate-900 overflow-hidden text-center text-white">
                <div className="max-w-4xl mx-auto px-6 space-y-12 relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none uppercase">
                        Ready to Begin Your <br /> <span className="text-primary-500 not-italic">Node Transition?</span>
                    </h2>
                    <p className="text-slate-400 text-lg font-medium italic">Join thousands of students and companies in the most advanced academic ecosystem.</p>
                    <div className="flex justify-center gap-6 pt-6">
                        {user ? (
                            <Link to={`/dashboard/${user.role}`} className="px-12 py-6 bg-primary-500 text-slate-900 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-4xl shadow-primary-500/20 no-underline">
                                GO TO DASHBOARD
                            </Link>
                        ) : (
                            <Link to="/auth/register" className="px-12 py-6 bg-primary-500 text-slate-900 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-4xl shadow-primary-500/20 no-underline">
                                CREATE ACCOUNT
                            </Link>
                        )}
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary-500/10 rounded-full blur-[150px]" />
            </section>
        </div>
    );
};

export default LandingPage;
