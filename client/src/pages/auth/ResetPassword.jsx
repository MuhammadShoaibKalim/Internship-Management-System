import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import API from '../../services/api';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = location.state?.token;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/auth/forgot-password');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await API.patch(`/auth/resetPassword/${token}`, {
                password,
                passwordConfirm: confirmPassword
            });

            if (response.data.status === 'success') {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/auth/login');
                }, 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-[440px] animate-fade-in">
                {!success ? (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Set New Password</h1>
                            <p className="text-slate-500 mt-2 font-medium">
                                Create a strong, unique password to secure your account.
                            </p>
                        </div>

                        <div className="portal-card p-8 sm:p-10">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-secondary-800 mb-2">New Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-secondary-800 mb-2">Confirm Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70">
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                        <>
                                            Reset Password
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 text-success rounded-3xl mb-8">
                            <CheckCircle2 size={40} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Password Reset!</h1>
                        <p className="text-slate-500 mt-4 font-medium px-4 leading-relaxed">
                            Your password has been successfully updated. <br />
                            Redirecting you to Login...
                        </p>
                        <Link
                            to="/auth/login"
                            className="inline-flex items-center gap-2 mt-10 text-primary-600 font-bold hover:text-primary-700"
                        >
                            Return to Login Now
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
