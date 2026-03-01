import React from 'react';
import { ClipboardCheck, Star, TrendingUp, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const IndustryEvaluations = () => {
    const evaluations = [
        { id: 1, intern: 'Shoaib Ahmed', period: 'Mid-term', score: '92/100', status: 'completed', date: 'Oct 25, 2023' },
        { id: 2, intern: 'Jane Smith', period: 'First Month', score: 'Pending', status: 'due', date: 'In 3 days' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Performance Evaluations</h1>
                    <p className="text-slate-500 font-medium italic">Objective marking based on internship progress and deliverables.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <ClipboardCheck size={20} />
                    New Evaluation
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {evaluations.map(evalu => (
                    <div key={evalu.id} className={`portal-card p-8 border-l-8 transition-all hover:scale-[1.02] ${evalu.status === 'completed' ? 'border-l-emerald-500' : 'border-l-amber-500 shadow-xl shadow-amber-50'}`}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${evalu.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {evalu.status} Assessment
                                </span>
                                <h3 className="text-2xl font-black text-secondary-900 mt-3">{evalu.intern}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{evalu.period} Review</p>
                            </div>
                            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black ${evalu.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                <TrendingUp size={24} className="mb-1" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Performance Score</p>
                                <span className="text-lg font-black text-secondary-900">{evalu.score}</span>
                            </div>

                            <div className="flex items-center gap-4 text-slate-500 text-xs">
                                <div className="flex items-center gap-1.5 font-bold">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                    {evalu.status === 'completed' ? 'Evaluation Verified' : 'Awaiting Inputs'}
                                </div>
                                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                                <div className="font-medium italic">Deadline: {evalu.date}</div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex gap-4">
                            <button className="flex-1 py-3 px-4 bg-white border border-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                <FileText size={16} /> View Rubric
                            </button>
                            <button className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${evalu.status === 'completed' ? 'bg-secondary-900 text-white hover:bg-secondary-800' : 'bg-primary-500 text-white hover:bg-primary-600 shadow-primary-200'}`}>
                                {evalu.status === 'completed' ? 'Download Result' : 'Start Evolution'}
                                <Star size={14} className={evalu.status === 'completed' ? 'fill-current' : ''} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IndustryEvaluations;
