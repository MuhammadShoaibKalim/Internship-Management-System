import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Reset link requested for:', email);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-[440px] animate-fade-in">
                {!submitted ? (
                    <>
                        <div className="text-center mb-10">
                            <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary-600 mb-8 transition-colors group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </Link>
                            <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Recover Password</h1>
                            <p className="text-slate-500 mt-2 font-medium px-6">
                                Enter your official email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        <div className="portal-card p-8 sm:p-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-secondary-800 mb-2 text-center">Your Official Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            placeholder="name@university.edu"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-center"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 group active:scale-95">
                                    Send Reset Link
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 text-success rounded-3xl mb-8">
                            <Send size={40} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Check Your Inbox</h1>
                        <p className="text-slate-500 mt-4 font-medium px-4 leading-relaxed">
                            We've sent a password reset link to <br />
                            <span className="text-secondary-900 font-bold">{email}</span>.
                        </p>
                        <div className="mt-10 space-y-4">
                            <button
                                onClick={() => setSubmitted(false)}
                                className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                            >
                                Try Wait, resend mail?
                            </button>
                            <Link
                                to="/auth/login"
                                className="block text-sm font-bold text-primary-600 hover:text-primary-700"
                            >
                                Return to Sign In
                            </Link>
                        </div>
                    </div>
                )}

                <div className="mt-12 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        Contact your University Admin if you haven't received official access yet.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
