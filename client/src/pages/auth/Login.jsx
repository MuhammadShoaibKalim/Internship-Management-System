import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github, Chrome, Eye, EyeOff, Loader2 } from 'lucide-react';
import API from '../../services/api';

const Login = () => {
    const location = useLocation();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState(location.state?.message || '');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('sessionExpired') === 'true') {
            toast.error('Your session has expired. Please log in again.', { duration: 5000 });
            // Remove the query param from URL so it doesn't keep toasting on refresh
            window.history.replaceState({}, document.title, '/auth/login');
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setInfoMessage('');

        try {
            const response = await API.post('/auth/login', { identifier, password });

            if (response.data.status === 'success') {
                const { token, data } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(data.user));

                const user = data.user;
                const role = user.role;

                // Check if profile is incomplete (no name set)
                // Redirect to settings if name is missing
                if (!user.name) {
                    navigate(`/dashboard/${role}/settings`, {
                        state: {
                            incompleteProfile: true,
                            message: 'Welcome! Please complete your profile to continue.'
                        }
                    });
                } else {
                    toast.success('Welcome back! Login successful.');
                    const from = location.state?.from?.pathname || `/dashboard/${role}`;
                    navigate(from);
                }
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid email/ID or password';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-[440px] animate-fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl shadow-xl shadow-primary-200 mb-6 text-white">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 mt-2 font-medium">Log in to your Academic IMS Portal</p>
                </div>

                <div className="portal-card p-8 sm:p-10">
                    {infoMessage && (
                        <div className="mb-6 p-4 bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium rounded-xl animate-fade-in flex items-center gap-3">
                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                            {infoMessage}
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl animate-shake">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-secondary-800 mb-2">Email Address or University ID</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="bsf21... or email"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-secondary-800">Password</label>
                                <Link to="/auth/forgot-password" size={18} className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot Password?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="remember" className="w-4 h-4 text-primary-600 border-slate-200 rounded focus:ring-primary-500 transition-colors cursor-pointer" />
                            <label htmlFor="remember" className="ml-2 text-sm text-slate-500 font-medium cursor-pointer">Remember me</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                </div>

                <p className="text-center mt-8 text-sm text-slate-500 font-medium">
                    Don't have an account? {' '}
                    <Link to="/auth/register" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
