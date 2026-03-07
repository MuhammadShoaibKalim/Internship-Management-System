import React from 'react';
import { FileText, Scale, Gavel, CheckCircle } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-24 px-6 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-16">
                <div className="space-y-6 text-right">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                        <Scale size={14} className="text-primary-400" /> Legal Framework
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Terms of <span className="text-primary-600 not-italic">Service</span></h1>
                    <p className="text-slate-500 font-medium italic text-lg text-right">Effective Date: March 2026</p>
                </div>

                <div className="glass-card p-12 space-y-16 bg-white border-l-8 border-primary-500">
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">User Conduct Nodes</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-8 bg-slate-50 rounded-[2rem] space-y-4">
                                <CheckCircle className="text-primary-500" />
                                <h4 className="font-black text-slate-900 uppercase italic text-sm">Valid Identity</h4>
                                <p className="text-xs text-slate-500 font-medium leading-loose italic">Users must provide authentic academic and professional credentials to enter the ecosystem.</p>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-[2rem] space-y-4">
                                <Gavel className="text-primary-500" />
                                <h4 className="font-black text-slate-900 uppercase italic text-sm">Professional Integrity</h4>
                                <p className="text-xs text-slate-500 font-medium leading-loose italic">Any falsification of internship logs or performance reviews will result in node termination.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Service Availability</h2>
                        <p className="text-slate-600 leading-relaxed font-medium italic text-lg">
                            We aim for 99.9% uptime for the internship bridge. However, we reserve the right to perform neural maintenance at any strategic interval without prior notice.
                        </p>
                    </section>

                    <section className="space-y-6 pt-12 border-t border-slate-100 text-center">
                        <p className="text-slate-400 text-sm font-medium italic">By accessing this platform, you agree to follow all institutional and industrial protocols defined within the system.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
