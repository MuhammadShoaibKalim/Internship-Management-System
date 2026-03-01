import { User, Mail, Phone, Calendar, CheckSquare, MessageSquare, ExternalLink, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndustryApplicants = () => {
    const applicants = [
        { id: 1, name: 'Shoaib Ahmed', email: 'shoaib@example.com', phone: '+92 300 1234567', university: 'Fast NUCES', gpa: '3.8', status: 'reviewing' },
        { id: 2, name: 'John Doe', email: 'john@example.com', phone: '+92 321 7654321', university: 'LUMS', gpa: '3.5', status: 'new' },
        { id: 3, name: 'Sarah Khan', email: 'sarah@example.com', phone: '+92 333 9876543', university: 'UET Lahore', gpa: '3.9', status: 'interviewed' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Applicant Tracking System</h1>
                <p className="text-slate-500 font-medium italic">Review and manage talent for your active internship roles.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {applicants.map(applicant => (
                    <div key={applicant.id} className="portal-card p-8 hover:border-primary-200 transition-all group shadow-sm hover:shadow-xl hover:shadow-primary-100/20">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex gap-6 items-start">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-inner">
                                    <User size={32} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <Link to="/dashboard/student/hub" className="text-xl font-bold text-secondary-900 hover:text-primary-600 transition-colors">{applicant.name}</Link>
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${applicant.status === 'new' ? 'bg-blue-100 text-blue-700' : applicant.status === 'reviewing' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {applicant.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-primary-600 transition-colors">{applicant.university}</p>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Mail size={14} />
                                            <span className="text-xs font-medium text-slate-500">{applicant.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Phone size={14} />
                                            <span className="text-xs font-medium text-slate-500">{applicant.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 border-l border-slate-100 pl-4 ml-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest">GPA:</span>
                                            <span className="text-xs font-black text-secondary-900">{applicant.gpa}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-50">
                                <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                                    <Download size={14} />
                                    Resume
                                </button>
                                <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-200 active:scale-95 transition-all">
                                    <CheckSquare size={14} />
                                    Take Action
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IndustryApplicants;
