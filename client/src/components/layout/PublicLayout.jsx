import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, BookOpen, LogIn, UserPlus, Shield, Globe, Menu, X, ArrowRight, ChevronRight, Home } from 'lucide-react';

const GuestHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Internships', path: '/internships', icon: Briefcase },
        { name: 'Insights / Blogs', path: '/blogs', icon: BookOpen },
    ];

    const [LeftIcon, RightIcon] = navLinks.map(l => l.icon);

    const handleLogoClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50' : 'py-8 bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo - Left */}
                <Link
                    to="/"
                    onClick={handleLogoClick}
                    className="flex items-center gap-3 no-underline group scale-100 hover:scale-105 transition-transform"
                >
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-primary-500 shadow-2xl group-hover:rotate-12 transition-transform">
                        <Shield size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">IMS</h1>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Academic Hub</p>
                    </div>
                </Link>

                {/* Center: Nav Links */}
                <nav className="hidden md:flex items-center gap-10">
                    <Link
                        to={navLinks[0].path}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest no-underline transition-all ${location.pathname === navLinks[0].path ? 'text-primary-600' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        <LeftIcon size={14} className={location.pathname === navLinks[0].path ? 'text-primary-500' : 'text-slate-300'} />
                        {navLinks[0].name}
                    </Link>
                    <Link
                        to={navLinks[1].path}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest no-underline transition-all ${location.pathname === navLinks[1].path ? 'text-primary-600' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        <RightIcon size={14} className={location.pathname === navLinks[1].path ? 'text-primary-500' : 'text-slate-300'} />
                        {navLinks[1].name}
                    </Link>
                </nav>

                {/* Auth Actions - Right */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <Link
                            to={`/dashboard/${user.role}`}
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary-600 transition-all no-underline flex items-center gap-2 group"
                        >
                            <Home size={14} className="group-hover:scale-110 transition-transform" />
                            Go to Dashboard <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <>
                            <Link to="/auth/login" className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all no-underline">
                                Sign In
                            </Link>
                            <Link to="/auth/register" className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary-600 transition-all no-underline flex items-center gap-2 group">
                                Join Platform <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile: Logo + Toggle */}
                <div className="flex md:hidden items-center gap-3">
                    <Link
                        to="/"
                        onClick={handleLogoClick}
                        className="flex items-center gap-2 no-underline group"
                    >
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary-500 shadow-xl group-hover:rotate-12 transition-transform">
                            <Shield size={20} fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase italic leading-none">IMS</h1>
                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.25em]">Academic Hub</p>
                        </div>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileMenu(!mobileMenu)}
                    className="md:hidden p-3 bg-slate-50 text-slate-900 rounded-2xl"
                >
                    {mobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
                <div className="md:hidden fixed inset-0 top-[88px] bg-white z-[90] p-6 animate-fade-in">
                    <div className="space-y-4">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setMobileMenu(false)}
                                className="block p-6 bg-slate-50 rounded-3xl text-sm font-black uppercase tracking-widest text-slate-900 no-underline"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="grid grid-cols-1 gap-4 pt-4">
                            {user ? (
                                <Link
                                    to={`/dashboard/${user.role}`}
                                    onClick={() => setMobileMenu(false)}
                                    className="p-6 bg-slate-900 rounded-3xl font-black uppercase text-[10px] text-center no-underline text-white flex items-center justify-center gap-2"
                                >
                                    <Home size={14} /> My Dashboard
                                </Link>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/auth/login" className="p-6 bg-slate-100 rounded-3xl font-black uppercase text-[10px] text-center no-underline text-slate-900">Sign In</Link>
                                    <Link to="/auth/register" className="p-6 bg-slate-900 rounded-3xl font-black uppercase text-[10px] text-center no-underline text-white">Join Now</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

const PublicLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#fafbfc] selection:bg-primary-100 selection:text-primary-900">
            <GuestHeader />
            <main className="pt-32 min-h-[calc(100vh-400px)]">
                {children}
            </main>

            <footer className="bg-slate-900 text-white py-24 mt-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
                        <div className="md:col-span-2 space-y-8">
                            <Link to="/" className="flex items-center gap-3 no-underline">
                                <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-2xl">
                                    <Shield size={28} fill="currentColor" />
                                </div>
                                <h1 className="text-3xl font-black tracking-tighter uppercase italic">IMS</h1>
                            </Link>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm italic">
                                Bridging the gap between academia and industry with a premium, enterprise-grade internship management ecosystem.
                            </p>
                            <div className="flex gap-4">
                                {[Globe, Briefcase, BookOpen].map((Icon, i) => (
                                    <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary-400 transition-colors cursor-pointer">
                                        <Icon size={18} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500">Platform</h4>
                            <ul className="space-y-4 list-none p-0">
                                <li><Link to="/internships" className="text-slate-400 hover:text-white transition-colors no-underline text-xs font-bold">Browse Jobs</Link></li>
                                <li><Link to="/blogs" className="text-slate-400 hover:text-white transition-colors no-underline text-xs font-bold">Insights</Link></li>
                                <li><Link to="/auth/login" className="text-slate-400 hover:text-white transition-colors no-underline text-xs font-bold">Partner Login</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500">Legal</h4>
                            <ul className="space-y-4 list-none p-0">
                                <li><span className="text-slate-400 text-xs font-bold">Privacy Policy</span></li>
                                <li><span className="text-slate-400 text-xs font-bold">Terms of Service</span></li>
                                <li><span className="text-slate-400 text-xs font-bold">Documentation</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                        <p>© 2026 Academic Internship Management System (IMS).</p>
                        <p>Designed for Continuous Excellence</p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
            </footer>
        </div>
    );
};

export default PublicLayout;
