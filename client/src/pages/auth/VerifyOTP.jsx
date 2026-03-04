import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import API from '../../services/api';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!email) {
            navigate('/auth/register');
        }
    }, [email, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.value !== '' && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        const data = e.clipboardData.getData('text');
        if (!data || data.length !== 6 || isNaN(data)) return;

        const otpArray = data.split('');
        setOtp(otpArray);

        // Focus the last input
        inputs.current[5].focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
            inputs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length < 6) return;

        setLoading(true);
        setError('');

        try {
            const response = await API.post('/auth/verifyOTP', {
                email,
                otp: otpCode
            });

            if (response.data.status === 'success') {
                const { token, data } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect based on role
                const role = data.user.role;
                navigate(`/dashboard/${role}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-[440px] animate-fade-in text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl shadow-sm mb-8">
                    <ShieldCheck size={32} />
                </div>

                <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Verify Account</h1>
                <p className="text-slate-500 mt-3 font-medium px-4">
                    We've sent a 6-digit verification code to <span className="font-bold text-secondary-900">{email}</span>. Enter it below to secure your account.
                </p>

                <div className="portal-card p-8 sm:p-10 text-left mt-10">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl animate-shake">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex justify-between gap-2">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    ref={(el) => (inputs.current[index] = el)}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-xl text-center text-xl font-bold text-secondary-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.join('').length < 6}
                            className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    Verify & Proceed
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-400 font-medium">Didn't receive the code?</p>
                        <button className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                            <RefreshCw size={14} />
                            Resend Code
                        </button>
                    </div>
                </div>

                <button onClick={() => navigate('/auth/login')} className="mt-8 text-sm font-bold text-slate-500 hover:text-secondary-900 transition-colors">
                    Back to Sign In
                </button>
            </div>
        </div>
    );
};

export default VerifyOTP;
