import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronLeft, ChevronRight, LogOut, User, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const Header = ({ role, toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'Admin Node', role: 'root' });
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifs, setLoadingNotifs] = useState(false);

    // Global Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                handleSearch(searchQuery);
            } else {
                setSearchResults([]);
                setIsSearchOpen(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = async (query) => {
        try {
            setIsSearchLoading(true);
            setIsSearchOpen(true);
            const response = await API.get(`/admin/search?query=${query}`);
            if (response.data.status === 'success') {
                setSearchResults(response.data.data.results);
            }
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setIsSearchLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const userObj = storedUser ? JSON.parse(storedUser) : null;

                if (userObj) {
                    if (userObj.role === 'student') {
                        const response = await API.get('/student/profile');
                        if (response.data.status === 'success') {
                            const userData = response.data.data.student;
                            setUser({ ...userData, role: userObj.role });
                        } else {
                            setUser(userObj);
                        }
                    } else if (userObj.role === 'supervisor') {
                        const response = await API.get('/supervisor/stats');
                        if (response.data.status === 'success') {
                            const { stats } = response.data.data;
                            setUser({ ...userObj, name: userObj.name || 'Supervisor Node', role: 'supervisor', stats });
                        } else {
                            setUser(userObj);
                        }
                    } else {
                        setUser(userObj);
                    }
                }
            } catch (err) {
                console.error('Failed to sync user node:', err);
                const storedUser = localStorage.getItem('user');
                if (storedUser) setUser(JSON.parse(storedUser));
            }
        };

        fetchUserData();
        fetchNotifications();
    }, [role]);

    const fetchNotifications = async () => {
        try {
            setLoadingNotifs(true);
            const storedUser = localStorage.getItem('user');
            const userObj = storedUser ? JSON.parse(storedUser) : null;
            const userRole = role || (userObj && userObj.role);

            if (userRole === 'admin') {
                const response = await API.get('/admin/stats');
                if (response.data.status === 'success') {
                    const { securityFeed, institutionalVetting } = response.data.data;
                    const activeNotifications = [
                        ...(institutionalVetting || []).map(v => ({
                            id: v._id,
                            type: 'VETTING',
                            message: `New industry node pending: ${v.name}`,
                            time: v.createdAt,
                            icon: ShieldAlert,
                            color: 'text-amber-500'
                        })),
                        ...(securityFeed || []).map(s => ({
                            id: s.id,
                            type: s.type,
                            message: s.message,
                            time: s.timestamp,
                            icon: AlertCircle,
                            color: 'text-rose-500'
                        }))
                    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
                    setNotifications(activeNotifications);
                }
            } else if (userRole === 'student') {
                // Fetch student applications to use as notifications (status changes)
                const response = await API.get('/applications/my-applications');
                if (response.data.status === 'success') {
                    const apps = response.data.data.applications;
                    const recentApps = apps
                        .filter(app => app.status !== 'pending')
                        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                        .slice(0, 5)
                        .map(app => ({
                            id: app._id,
                            type: 'APPLICATION',
                            message: `Application for ${app.internship.role} at ${app.internship.company.name} is now ${app.status.replace('_', ' ')}`,
                            time: app.updatedAt,
                            icon: Sparkles,
                            color: 'text-primary-500'
                        }));
                    setNotifications(recentApps);
                }
            } else if (userRole === 'supervisor') {
                const response = await API.get('/supervisor/stats');
                if (response.data.status === 'success') {
                    const { stats } = response.data.data;
                    const mockNotifs = [
                        {
                            id: 'n1',
                            type: 'ASSIGNMENT',
                            message: `You have ${stats.assignedStudents} students under surveillance.`,
                            time: new Date(),
                            icon: User,
                            color: 'text-primary-500'
                        },
                        {
                            id: 'n2',
                            type: 'LOGS',
                            message: `${stats.pendingLogs} logs require immediate review.`,
                            time: new Date(),
                            icon: AlertCircle,
                            color: 'text-amber-500'
                        }
                    ];
                    setNotifications(mockNotifs);
                }
            }
        } catch (err) {
            console.error('Failed to sync notification nodes:', err);
        } finally {
            setLoadingNotifs(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
    };

    return (
        <header className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleSidebar}
                    className="p-2.5 -ml-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all active:scale-90 group border border-transparent hover:border-slate-100"
                    title={isSidebarOpen ? "Collapse Matrix" : "Expand Matrix"}
                >
                    {isSidebarOpen ? <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" /> : <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />}
                </button>

                <div className="hidden lg:flex items-center relative">
                    <div className="flex items-center bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-2 w-80 shadow-inner focus-within:ring-4 focus-within:ring-primary-500/5 focus-within:border-primary-500/30 transition-all group">
                        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search system nodes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery && setIsSearchOpen(true)}
                            className="bg-transparent border-none focus:ring-0 text-xs ml-3 w-full text-slate-600 font-bold placeholder:text-slate-300 placeholder:font-medium tracking-tight"
                        />
                        {isSearchLoading && (
                            <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {isSearchOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)} />
                            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 py-3 z-50 animate-slide-up origin-top overflow-hidden">
                                <div className="max-h-[350px] overflow-y-auto px-2 space-y-1 custom-scrollbar">
                                    {searchResults.length === 0 ? (
                                        <div className="py-6 text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No nodes found</p>
                                        </div>
                                    ) : (
                                        searchResults.map((result) => (
                                            <div
                                                key={`${result.type}-${result.id}`}
                                                onClick={() => {
                                                    let path = '/dashboard/admin';
                                                    if (result.type === 'USER') {
                                                        path = result.role === 'industry' ? '/dashboard/admin/industry' : '/dashboard/admin/users';
                                                    } else if (result.type === 'INTERNSHIP') {
                                                        path = '/dashboard/admin/industry'; // Closest match for now
                                                    } else if (result.type === 'DEPARTMENT') {
                                                        path = '/dashboard/admin/departments';
                                                    }
                                                    navigate(path);
                                                    setIsSearchOpen(false);
                                                    setSearchQuery('');
                                                }}
                                                className="p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group flex items-start justify-between gap-3"
                                            >
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[8px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                            {result.type}
                                                        </span>
                                                        <h4 className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">{result.title}</h4>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-medium truncate">{result.subtitle}</p>
                                                </div>
                                                {result.status && (
                                                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${result.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                        }`}>
                                                        {result.status}
                                                    </span>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 mr-2">
                    <div className="relative">
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className={`p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all relative group border border-transparent hover:border-slate-100 ${isNotifOpen ? 'bg-slate-100 text-slate-900' : ''}`}
                        >
                            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                            {notifications.length > 0 && (
                                <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-4 ring-rose-500/10 animate-pulse"></span>
                            )}
                        </button>

                        {/* Simplified Notification Dropdown */}
                        {isNotifOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                                <div className="absolute right-0 mt-4 w-72 bg-white rounded-[1.5rem] shadow-2xl shadow-slate-200 border border-slate-100 py-4 px-2 z-50 animate-slide-up origin-top-right overflow-hidden">
                                    <div className="max-h-[300px] overflow-y-auto px-2 space-y-1 custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="py-8 text-center bg-slate-50/50 rounded-2xl">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No notifications</p>
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div key={n.id} className="p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group flex items-start gap-3">
                                                    <div className={`shrink-0 mt-0.5 ${n.color}`}>
                                                        <n.icon size={14} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] font-medium text-slate-700 leading-tight">{n.message}</p>
                                                        <p className="text-[9px] text-slate-300 font-bold uppercase mt-1">
                                                            {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="h-8 w-px bg-slate-100 mx-2"></div>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl transition-all duration-300 group ${isProfileOpen ? 'bg-slate-100 shadow-inner' : 'hover:bg-slate-50'}`}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-[11px] font-black text-slate-900 leading-none uppercase tracking-tighter group-hover:text-primary-600 transition-colors">{user.name}</p>
                            <p className="text-[9px] text-slate-400 mt-1 capitalize font-bold tracking-[0.2em] opacity-60">Global {role || user.role}</p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-slate-200 transition-all shadow-lg border-2 border-white ring-1 ring-slate-100">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                    </button>

                    {/* Professional Dropdown */}
                    {isProfileOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsProfileOpen(false)}
                            />
                            <div className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 py-6 px-6 z-50 animate-slide-up origin-top-right">
                                <div className="flex items-center gap-4 pb-6 border-b border-slate-50 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black shadow-xl shadow-slate-200 uppercase">
                                        {user.name ? user.name.charAt(0) : 'A'}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-xs font-black text-secondary-900 uppercase tracking-tight truncate">{user.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{role || user.role}</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <button
                                        onClick={() => {
                                            const path = (role === 'admin' || user.role === 'admin')
                                                ? '/dashboard/admin/profile'
                                                : `/dashboard/${role || user.role}/settings`;
                                            navigate(path);
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all font-bold text-xs group"
                                    >
                                        <User size={18} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                                        My Profile
                                    </button>

                                    <div className="pt-2 mt-2 border-t border-slate-50">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-black text-xs group"
                                        >
                                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
