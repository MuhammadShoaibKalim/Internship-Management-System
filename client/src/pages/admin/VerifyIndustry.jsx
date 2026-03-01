import React from 'react';
import {
    CheckCircle,
    XCircle,
    FileText,
    ExternalLink,
    ShieldCheck,
    Building2,
    Clock,
    Search,
    Filter,
    ArrowRight,
    MapPin,
    Globe,
    FileCheck
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const VerifyIndustry = () => {
    const industries = [
        {
            id: 1,
            name: 'TechFlow Solutions',
            location: 'Islamabad, PK',
            regNo: 'REG-2023-991',
            status: 'pending',
            appliedDate: 'Oct 20, 2023',
            documents: ['Company Profile', 'Tax Certificate', 'MoU Draft']
        },
        {
            id: 2,
            name: 'Nexus Dynamics',
            location: 'Lahore, PK',
            regNo: 'REG-2023-452',
            status: 'pending',
            appliedDate: 'Oct 22, 2023',
            documents: ['Registration Docs', 'Security Clearance']
        },
        {
            id: 3,
            name: 'Urban Softystems',
            location: 'Karachi, PK',
            regNo: 'REG-2023-118',
            status: 'approved',
            appliedDate: 'Sep 15, 2023',
            documents: ['Full Audit Report', 'MoU Signed']
        },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Clean Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-100/50">
                        <FileCheck size={14} className="text-amber-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Verification Engine</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            Industry <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">Vetting Hub</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium mt-3 max-w-2xl leading-relaxed">
                            Audit institutional credentials, verify registration documentation, and finalize <span className="font-bold text-slate-900 italic px-1">Memorandums of Understanding</span> for corporate partners.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 no-underline">
                        <ShieldCheck size={20} className="text-amber-400" /> Initialize Audit
                    </button>
                </div>
            </div>

            {/* Quick Action Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative group w-full max-w-xl">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={24} />
                    <input
                        type="text"
                        placeholder="Search by registration key or organization name..."
                        className="w-full pl-16 pr-10 py-5 bg-white border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:ring-[12px] focus:ring-slate-50 focus:border-amber-500/30 outline-none transition-all placeholder:text-slate-300"
                    />
                </div>
                <div className="flex gap-4 p-2 bg-slate-50 rounded-3xl border border-slate-100">
                    {['Awaiting Audit', 'Approved Partners', 'Flagged'].map((tab, i) => (
                        <button key={i} className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-white text-slate-900 shadow-xl border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Industry Cards */}
            <div className="grid grid-cols-1 gap-10">
                {industries.map(industry => (
                    <div key={industry.id} className="portal-card p-10 bg-white border-none shadow-2xl shadow-slate-100/50 group overflow-hidden relative">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
                            <div className="flex items-start gap-8">
                                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center border border-slate-100 group-hover:bg-amber-50 group-hover:text-amber-500 group-hover:border-amber-100 transition-all font-black text-2xl shadow-inner">
                                    <Building2 size={40} />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">{industry.name}</h3>
                                        <div className="flex flex-wrap items-center gap-6 mt-3">
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                                                <MapPin size={14} /> {industry.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                                                <FileText size={14} /> {industry.regNo}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs italic">
                                                <Clock size={14} /> Applied: {industry.appliedDate}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {industry.documents.map((doc, idx) => (
                                            <div key={idx} className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-amber-600 hover:border-amber-200 transition-all cursor-pointer flex items-center gap-2">
                                                <FileCheck size={12} /> {doc}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <StatusBadge status={industry.status} />
                                <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>
                                <div className="flex gap-4">
                                    <button className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                        <CheckCircle size={28} />
                                    </button>
                                    <button className="p-5 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                                        <XCircle size={28} />
                                    </button>
                                </div>
                                <button className="p-5 bg-slate-900 text-white rounded-2xl hover:bg-amber-500 transition-all shadow-xl shadow-slate-200">
                                    <ArrowRight size={28} />
                                </button>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 h-full w-2 bg-slate-50 group-hover:bg-amber-500 group-hover:opacity-10 transition-all" />
                    </div>
                ))}
            </div>

            <div className="p-12 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-amber-500">
                        <Globe size={36} />
                    </div>
                    <div>
                        <h4 className="text-xl font-extrabold text-slate-900 uppercase tracking-tighter">Institutional Synchronization</h4>
                        <p className="text-slate-400 text-[11px] font-medium mt-1 leading-relaxed">
                            Awaiting verification from university registrar. <span className="font-bold text-slate-900 italic">4 Partner Nodes Pending.</span>
                        </p>
                    </div>
                </div>
                <button className="px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all">
                    System Refresh
                </button>
            </div>
        </div>
    );
};

export default VerifyIndustry;
