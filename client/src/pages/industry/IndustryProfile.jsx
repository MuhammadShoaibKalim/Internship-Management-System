import React from 'react';
import { Mail, Phone, MapPin, Globe, Edit2, ShieldCheck, Briefcase, Award } from 'lucide-react';

const IndustryProfile = () => {
    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="portal-card overflow-hidden p-0 border-none shadow-2xl relative">
                {/* Banner */}
                <div className="h-48 bg-gradient-to-r from-secondary-900 via-secondary-800 to-primary-800 relative">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
                    <div className="absolute -bottom-16 left-12">
                        <div className="w-32 h-32 bg-white rounded-[2.5rem] p-4 shadow-2xl border-4 border-white flex items-center justify-center">
                            <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center font-black text-4xl text-secondary-900">
                                TF
                            </div>
                        </div>
                    </div>
                    <button className="absolute bottom-4 right-8 px-6 py-2.5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                        <Edit2 size={14} /> Edit Banner
                    </button>
                </div>

                {/* Info Block */}
                <div className="pt-20 px-12 pb-12 bg-white">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black text-secondary-900 tracking-tighter">TechFlow Solutions</h1>
                                <ShieldCheck className="text-primary-500" size={28} />
                            </div>
                            <p className="text-slate-500 font-medium text-lg italic">Innovating the future of digital connectivity.</p>
                        </div>
                        <button className="btn-primary py-4 px-10 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-100 group">
                            Public Preview
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                        {[
                            { icon: Mail, label: "Business Email", value: "hr@techflow.io" },
                            { icon: Phone, label: "Direct Phone", value: "+971 4 123 4567" },
                            { icon: Globe, label: "Official Website", value: "www.techflow.io" },
                            { icon: MapPin, label: "Global HQ", value: "Dubai, UAE" }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-center px-4">
                                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-xs font-bold text-secondary-900 mt-0.5">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-lg font-black text-secondary-900 uppercase tracking-tight flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-primary-600 rounded-full"></div>
                                    Company Story
                                </h3>
                                <p className="text-slate-600 font-medium leading-relaxed mt-4 italic">
                                    TechFlow is a pioneering software agency specializing in AI transformation and high-performance cloud architectures. Founded in 2018, we have nurtured over 50+ interns into successful software professionals across the globe.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <Briefcase className="text-primary-600 mb-4" size={24} />
                                    <h4 className="font-black text-secondary-900 uppercase text-xs tracking-widest">Open Roles</h4>
                                    <p className="text-3xl font-black text-secondary-900 mt-2">08</p>
                                </div>
                                <div className="p-6 bg-primary-600 rounded-3xl border border-primary-500 shadow-xl shadow-primary-200">
                                    <Award className="text-white mb-4" size={24} />
                                    <h4 className="font-black text-white/80 uppercase text-xs tracking-widest">Industry Ranking</h4>
                                    <p className="text-3xl font-black text-white mt-2">#12</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="portal-card p-8 bg-slate-900 text-white border-none text-center">
                                <h3 className="font-black tracking-widest uppercase text-xs opacity-60">Verified Partners</h3>
                                <div className="mt-6 flex flex-wrap justify-center gap-6">
                                    {['GS', 'IBM', 'META'].map(logo => (
                                        <span key={logo} className="font-black text-xl italic opacity-30 cursor-not-allowed">{logo}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndustryProfile;
