import React from 'react';
import { Award, Download, Share2, ShieldCheck, Star } from 'lucide-react';

const StudentCertificates = () => {
    const certificates = [
        { id: 1, title: 'Internship Completion', issuer: 'TechFlow Solutions', date: 'Jan 15, 2024', grade: 'A+', id_token: 'IMS-TECH-123', type: 'Main' },
        { id: 2, title: 'Best Performer Award', issuer: 'DataScale Systems', date: 'Dec 02, 2023', grade: 'Gold', id_token: 'IMS-AWD-007', type: 'Recognition' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Academic Rewards</h1>
                    <p className="text-slate-500 font-medium">A hall of fame for your professional accomplishments.</p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 rounded-2xl px-4 py-2 border border-amber-100">
                    <Star className="text-amber-500 fill-amber-500" size={18} />
                    <span className="text-sm font-black text-amber-700">Top 5% Performer</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {certificates.map(cert => (
                    <div key={cert.id} className="portal-card p-1 relative group overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                        <div className="bg-white m-[1.5px] p-8 rounded-[1.4rem] relative z-10">
                            <div className="flex items-start justify-between">
                                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:rotate-12 transition-transform">
                                    <Award size={32} />
                                </div>
                                <ShieldCheck className="text-emerald-500" size={24} />
                            </div>

                            <h2 className="text-2xl font-black text-secondary-900 uppercase tracking-tight">{cert.title}</h2>
                            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest mt-1">{cert.issuer}</p>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification ID</p>
                                    <p className="text-sm font-black text-secondary-800 font-mono mt-1">{cert.id_token}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</p>
                                    <p className="text-lg font-black text-emerald-600 mt-0.5">{cert.grade}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button className="flex-1 btn-primary py-4 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-primary-200">
                                    <Download size={18} />
                                    Download PDF
                                </button>
                                <button className="p-4 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-2xl transition-colors">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                        {/* Decorative Patterns */}
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-slate-100 rounded-full -mb-16 -mr-16 opacity-30"></div>
                    </div>
                ))}

                {/* Empty State / Coming Soon */}
                <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center opacity-60">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                        <Award size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-400">Complete your active internship <br />to unlock your next certificate.</p>
                </div>
            </div>
        </div>
    );
};

export default StudentCertificates;
