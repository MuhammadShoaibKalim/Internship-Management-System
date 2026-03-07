import React, { useState, useEffect } from 'react';
import { Award, Download, Share2, ShieldCheck, Star, Loader2 } from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import API from '../../services/api';


const StudentCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await API.get('/student/certificates');
                setCertificates(response.data.data.certificates);
            } catch (err) {
                console.error('Error fetching certificates:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificates();
    }, []);

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            <SectionHeader
                title="My Certifications"
                subtitle="Academic Distinction"
                description="A curated archive of your professional milestones and certified achievements."
                icon={Award}
                gradientFrom="from-amber-500"
                gradientTo="to-orange-400"
                badgeColor="bg-slate-100"
                badgeTextColor="text-slate-700"
            >
                <div className="flex items-center gap-4 bg-slate-900 rounded-3xl px-8 py-5 border border-white/5 shadow-2xl group overflow-hidden relative">
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:rotate-12 transition-transform">
                            <Star size={24} fill="currentColor" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] block">Status</span>
                            <span className="text-lg font-black text-white italic tracking-tight">Top 5% Performer</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-amber-500/20 transition-all duration-1000" />
                </div>
            </SectionHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {loading ? (
                    <div className="lg:col-span-2 py-40 flex flex-col items-center justify-center space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-slate-100 rounded-full animate-spin border-t-amber-500"></div>
                            <Award className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-amber-500 animate-pulse" />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Loading Certificates...</p>
                    </div>
                ) : certificates.length > 0 ? (
                    certificates.map(cert => (
                        <div key={cert._id} className="glass-card bg-slate-900 p-1 relative group overflow-hidden border-none shadow-3xl shadow-slate-200/50">
                            <div className="bg-slate-900 m-[2px] p-10 rounded-[2.8rem] relative z-10 h-full flex flex-col justify-between border border-white/5">
                                <div className="space-y-8">
                                    <div className="flex items-start justify-between">
                                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                            <Award size={40} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 shadow-inner">
                                                <ShieldCheck size={28} />
                                            </div>
                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-2">Verified Authenticated</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-amber-400 transition-colors">
                                            {cert.internship?.title || 'Internship Mastery'}
                                        </h2>
                                        <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em] mt-3 italic flex items-center gap-2">
                                            <span className="w-6 h-[1px] bg-slate-700"></span>
                                            {cert.internship?.companyName || 'Host Organization'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-12 space-y-10">
                                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Certificate ID</p>
                                            <p className="text-sm font-black text-white font-mono mt-1 tracking-wider bg-white/5 px-3 py-1 rounded-lg">IMS-{cert._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Issued On</p>
                                            <p className="text-xl font-black text-amber-500 mt-1">{new Date(cert.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <a
                                            href={cert.certificate?.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 btn-premium from-amber-500 to-orange-400 py-5 flex items-center justify-center gap-3 no-underline shadow-2xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            <Download size={20} className="text-slate-900" />
                                            <span className="text-slate-900 font-black uppercase tracking-[0.2em] text-[10px]">Download Merit</span>
                                        </a>
                                        <button className="w-16 h-16 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-3xl transition-all border border-white/5 flex items-center justify-center group-hover:border-white/20">
                                            <Share2 size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Visual Accents */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-amber-500/10 transition-all duration-1000" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/5 rounded-full -ml-24 -mb-24 blur-[80px]" />
                        </div>
                    ))
                ) : (
                    <div className="lg:col-span-2 glass-card py-40 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner">
                            <Award size={48} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No Certificates Yet</h4>
                        <p className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-[0.2em] italic max-w-sm leading-relaxed">
                            Complete your <span className="text-slate-900">internship</span> to receive your certificate.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCertificates;
