import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import API from '../../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await API.post('/auth/forgotPassword', { email });
            if (response.data.status === 'success') {
                setStep(2);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email not found');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length < 6) return;

        setLoading(true);
        setError('');

        try {
            const response = await API.post('/auth/verifyResetOTP', { email, otp: otpCode });
            if (response.data.status === 'success') {
                // Redirect to reset password with the token
                navigate('/auth/reset-password', { state: { token: response.data.resetToken } });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (val, index) => {
        if (isNaN(val)) return;
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);
        if (val && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-[440px] animate-fade-in">
                {step === 1 ? (
                    <>
                        <div className="text-center mb-10">
                            <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary-600 mb-8 transition-colors group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </Link>
                            <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Recover Password</h1>
                            <p className="text-slate-500 mt-2 font-medium px-6">
                                Enter your official email address and we'll send you an OTP to reset your password.
                            </p>
                        </div>

                        <div className="portal-card p-8 sm:p-10">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleEmailSubmit} className="space-y-6">
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

                                <button type="submit" disabled={loading} className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-70">
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                        <>
                                            Send OTP
                                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 text-success rounded-3xl mb-8">
                            <ShieldCheck size={40} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Verify Identity</h1>
                        <p className="text-slate-500 mt-4 font-medium px-4 leading-relaxed">
                            A 6-digit reset code has been sent to <br />
                            <span className="text-secondary-900 font-bold">{email}</span>.
                        </p>

                        <div className="portal-card p-8 sm:p-10 text-left mt-10">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleOTPSubmit} className="space-y-8">
                                <div className="flex justify-between gap-2">
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength="1"
                                            className="w-full h-12 bg-slate-50 border-2 border-slate-100 rounded-xl text-center text-xl font-bold text-secondary-900 focus:border-primary-500 outline-none"
                                            value={data}
                                            onChange={(e) => handleOtpChange(e.target.value, index)}
                                        />
                                    ))}
                                </div>

                                <button type="submit" disabled={loading || otp.join('').length < 6} className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70">
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                        <>
                                            Verify OTP
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        <button onClick={() => setStep(1)} className="mt-8 text-sm font-bold text-slate-400 hover:text-primary-600">
                            Change Email Address
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
