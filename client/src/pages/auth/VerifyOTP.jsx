import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);
    const navigate = useNavigate();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.value !== '' && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
            inputs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Verifying OTP:', otp.join(''));
        // Redirect to success or dashboard
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-[440px] animate-fade-in text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl shadow-sm mb-8">
                    <ShieldCheck size={32} />
                </div>

                <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Verify Account</h1>
                <p className="text-slate-500 mt-3 font-medium px-4">
                    We've sent a 6-digit verification code to your email. Enter it below to secure your account.
                </p>

                <div className="portal-card p-8 sm:p-10 text-left mt-10">
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
                                />
                            ))}
                        </div>

                        <button type="submit" className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 group active:scale-95">
                            Verify & Proceed
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
