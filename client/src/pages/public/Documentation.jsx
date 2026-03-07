import React from 'react';
import { Book, Code, Layers, Zap, Info, ArrowRight } from 'lucide-react';

const Documentation = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-24 px-6 animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-24">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-500/20">
                        <Book size={14} /> Knowledge Core
                    </div>
                    <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">System <span className="text-primary-600 not-italic">Documentation</span></h1>
                    <p className="text-slate-500 font-medium italic text-xl max-w-2xl mx-auto">Master the Internship Bridge architecture and workflows for students, supervisors, and industrial partners.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {[
                        { title: 'Student Node', icon: Zap, desc: 'How to apply, manage logs, and export certificates.', color: 'from-blue-500 to-indigo-500' },
                        { title: 'Supervisor Node', icon: Layers, desc: 'Monitoring intern progress and executing evaluations.', color: 'from-primary-500 to-emerald-500' },
                        { title: 'Industry Node', icon: Code, desc: 'Posting listings and managing the applicant matrix.', color: 'from-rose-500 to-orange-500' },
                    ].map((card, i) => (
                        <div key={i} className="glass-card p-12 bg-white space-y-8 group hover:-translate-y-4 transition-all duration-500 relative overflow-hidden">
                            <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-[1.5rem] flex items-center justify-center text-white shadow-lg`}>
                                <card.icon size={28} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase italic tracking-tight text-slate-900">{card.title}</h3>
                                <p className="text-slate-500 text-sm font-medium italic leading-relaxed">{card.desc}</p>
                            </div>
                            <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary-600 hover:gap-6 transition-all">
                                EXPLORE MATRIX <ArrowRight size={14} />
                            </button>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-50 rounded-full" />
                        </div>
                    ))}
                </div>

                <div className="glass-card p-12 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-4">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Need Real-time Support?</h3>
                        <p className="text-slate-400 font-medium italic">Our technical command is available for institutional onboarding.</p>
                    </div>
                    <button className="btn-premium from-white to-slate-200 text-slate-900 border-none px-12 py-6 text-sm">
                        ACCESS SUPPORT NODE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Documentation;
