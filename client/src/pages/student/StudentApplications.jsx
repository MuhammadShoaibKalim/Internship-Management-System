import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Clock, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../services/api';

const StudentApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await API.get('/applications/my-applications');
                const apps = response.data.data.applications;
                setApplications(apps);

                // Calculate local stats
                const s = { pending: 0, approved: 0, rejected: 0 };
                apps.forEach(app => {
                    if (app.status === 'pending') s.pending++;
                    else if (['approved', 'industry_selected', 'completed'].includes(app.status)) s.approved++;
                    else if (app.status === 'rejected') s.rejected++;
                });
                setStats(s);
            } catch (err) {
                console.error('Error fetching applications:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">My Applications</h1>
                    <p className="text-slate-500 font-medium italic">Track the status of your potential internship journeys.</p>
                </div>
                <button className="btn-primary flex items-center gap-2 px-6">
                    <Plus size={20} />
                    New Application
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Pending', count: stats.pending, color: 'amber' },
                    { label: 'Approved', count: stats.approved, color: 'emerald' },
                    { label: 'Rejected', count: stats.rejected, color: 'rose' }
                ].map((item) => (
                    <div key={item.label} className="portal-card p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label} Apps</p>
                            <h3 className="text-3xl font-black text-secondary-900 mt-1">
                                {item.count.toString().padStart(2, '0')}
                            </h3>
                        </div>
                        <div className={`p-4 rounded-2xl bg-${item.color}-50 text-${item.color}-600`}>
                            <Clock size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="portal-card overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h2 className="font-bold text-secondary-900">Application History</h2>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Tracing Application Nodes...</p>
                        </div>
                    ) : applications.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opportunity</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applied On</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {applications.map(app => (
                                    <tr key={app._id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                                                    {app.internship?.companyName?.charAt(0) || 'I'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-secondary-900 leading-none uppercase tracking-tight">{app.internship?.title}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5">{app.internship?.companyName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-semibold text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={app.status} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-secondary-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all">
                                                    Details
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-slate-400 font-bold italic">You haven't applied to any internships yet.</p>
                            <Link to="/dashboard/student/hub" className="text-primary-600 font-black uppercase text-xs tracking-widest mt-4 inline-block hover:underline">Browse Internships</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentApplications;
