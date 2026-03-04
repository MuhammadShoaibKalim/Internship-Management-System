import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary-100 rounded-full blur-2xl opacity-50 scale-150"></div>
                    <div className="relative bg-white p-8 rounded-full shadow-xl">
                        <AlertCircle size={80} className="text-secondary-500 mx-auto" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-9xl font-black text-secondary-900 tracking-tighter">404</h1>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight italic">Page Not Found</h2>
                    <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
                        Oops! The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track.
                    </p>
                </div>

                <div className="pt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:scale-105 active:scale-95 no-underline"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>
                </div>

                <div className="pt-12 text-slate-300 text-[10px] font-bold tracking-[0.2em] uppercase">
                    Internship Management System
                </div>
            </div>
        </div>
    );
};

export default NotFound;
