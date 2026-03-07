import React from 'react';
import { Shield, Lock, Eye, FileText, Bell } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-24 px-6 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-16">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100">
                        <Shield size={14} /> Security Protocol
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Privacy <span className="text-primary-600 not-italic">Policy</span></h1>
                    <p className="text-slate-500 font-medium italic text-lg">Last Updated: March 2026</p>
                </div>

                <div className="glass-card p-12 space-y-12 bg-white">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 flex items-center gap-4">
                            <span className="w-8 h-8 bg-slate-900 text-primary-500 rounded-lg flex items-center justify-center text-xs">01</span>
                            Data Collection Matrix
                        </h2>
                        <p className="text-slate-600 leading-[1.8] font-medium italic">
                            We collect professional and academic data necessary for the synchronization of the internship lifecycle. This includes your name, academic records, CVs, and industrial performance logs.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 flex items-center gap-4">
                            <span className="w-8 h-8 bg-slate-900 text-primary-500 rounded-lg flex items-center justify-center text-xs">02</span>
                            Processing Layers
                        </h2>
                        <ul className="space-y-4 text-slate-600 font-medium italic">
                            <li className="flex gap-4">
                                <Lock size={18} className="text-primary-500 shrink-0" />
                                All data is encrypted via industry-leading protocols before entering our neural hub.
                            </li>
                            <li className="flex gap-4">
                                <Eye size={18} className="text-primary-500 shrink-0" />
                                Access is restricted to authorized supervisors, industry partners, and system admins.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 flex items-center gap-4">
                            <span className="w-8 h-8 bg-slate-900 text-primary-500 rounded-lg flex items-center justify-center text-xs">03</span>
                            Your Node Rights
                        </h2>
                        <p className="text-slate-600 leading-[1.8] font-medium italic">
                            You retain full ownership of your academic data. You can request a data purge or export your performance history at any strategic interval.
                        </p>
                    </section>
                </div>

                <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Questions regarding the Matrix?</h3>
                        <p className="text-slate-400 font-medium italic">Reach out to our security command at legal@node.io</p>
                        <button className="btn-premium from-primary-500 to-indigo-500 text-slate-900 border-none px-12 py-5 text-[10px]">
                            CONTACT LEGAL NODE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
