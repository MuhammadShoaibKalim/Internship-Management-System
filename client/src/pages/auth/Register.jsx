
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building2, GraduationCap, Users2, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import API from '../../services/api';

const Register = () => {
    const [role, setRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        organization: ''
    });
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                passwordConfirm: formData.confirmPassword,
                role: role,
            };

            // Add role-specific meta
            if (role === 'student') {
                payload.universityId = formData.organization;
            } else if (role === 'industry') {
                payload.companyName = formData.organization;
            } else if (role === 'supervisor') {
                payload.universityId = formData.organization;
            }

            const response = await API.post('/auth/signup', payload);

            if (response.data.status === 'success') {
                // Redirect to OTP verification with email in state
                navigate('/auth/verify-otp', { state: { email: formData.email } });
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { id: 'student', label: 'Student', icon: <GraduationCap size={20} />, description: 'I want to apply for internships' },
        { id: 'industry', label: 'Industry', icon: <Building2 size={20} />, description: 'I want to post opportunities' },
        { id: 'supervisor', label: 'Supervisor', icon: <Users2 size={20} />, description: 'I am a faculty monitor' }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-[500px] animate-fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl shadow-xl shadow-primary-200 mb-6 text-white">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Create Account</h1>
                    <p className="text-slate-500 mt-2 font-medium">Join the Academic IMS Portal</p>
                </div>

                <div className="portal-card p-8 sm:p-10">
                    <label className="block text-sm font-bold text-secondary-800 mb-4 text-center">Select Your Role</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                        {roles.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setRole(r.id)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all group ${role === r.id
                                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                                    : 'border-slate-50 bg-slate-50/50 text-slate-500 hover:border-slate-100 hover:bg-slate-100'
                                    } `}
                            >
                                <span className={role === r.id ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-500'}>
                                    {r.icon}
                                </span>
                                <span className="text-xs font-bold mt-2">{r.label}</span>
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-secondary-800 mb-1.5">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500">
                                        <User size={16} />
                                    </div>
                                    <input
                                        type="text" required placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-secondary-800 mb-1.5">{role === 'industry' ? 'Company' : 'University ID'}</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500">
                                        {role === 'industry' ? <Building2 size={16} /> : <GraduationCap size={16} />}
                                    </div>
                                    <input
                                        type="text" required placeholder={role === 'industry' ? 'Org Name' : '2024-UR-001'}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                        value={formData.organization}
                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-secondary-800 mb-1.5">Official Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500">
                                    <Mail size={16} />
                                </div>
                                <input
                                    type="email" required placeholder="name@domain.edu"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-secondary-800 mb-1.5">Password</label>
                                <div className="relative group text-left">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-secondary-800 mb-1.5">Confirm</label>
                                <div className="relative group text-left">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary-500 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <p className="text-[10px] text-slate-400 text-center px-4 leading-relaxed mt-2">
                            By clicking Sign Up, you agree to our Terms and that you have read our Data Policy.
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-secondary-900 text-white rounded-xl font-bold hover:bg-secondary-800 transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-sm text-slate-500 font-medium font-inter">
                    Already have an account? {' '}
                    <Link to="/auth/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
