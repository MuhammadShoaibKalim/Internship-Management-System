import React, { useState } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, Eye, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';

const ManagePostings = () => {
    const [isAddingNew, setIsAddingNew] = useState(false);

    const postings = [
        {
            id: 1,
            title: 'Frontend Developer Intern',
            applicants: 45,
            status: 'active',
            postedDate: 'Oct 12, 2023',
            expiryDate: 'Nov 12, 2023',
            category: 'Engineering'
        },
        {
            id: 2,
            title: 'UI/UX Design Trainee',
            applicants: 28,
            status: 'closed',
            postedDate: 'Sep 05, 2023',
            expiryDate: 'Oct 05, 2023',
            category: 'Design'
        },
        {
            id: 3,
            title: 'Digital Marketing Intern',
            applicants: 12,
            status: 'draft',
            postedDate: 'Pending',
            expiryDate: 'N/A',
            category: 'Marketing'
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tight">Manage Postings</h1>
                    <p className="text-slate-500 font-medium">Create and oversee your internship opportunities.</p>
                </div>
                <button
                    onClick={() => setIsAddingNew(true)}
                    className="btn-primary flex items-center justify-center gap-2 group shadow-xl shadow-primary-200"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    Create New Posting
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: 'Active Postings', value: '12', color: 'indigo' },
                    { label: 'Total Applicants', value: '348', color: 'slate' },
                    { label: 'Views Today', value: '1.2k', color: 'emerald' }
                ].map((stat, i) => (
                    <div key={i} className="portal-card p-6 border-l-4 border-l-primary-500">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-3xl font-black text-secondary-900 mt-2">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Table Section */}
            <div className="portal-card overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="font-bold text-secondary-900">Your Internship Postings</h2>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search postings..."
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs w-full md:w-64 focus:bg-white focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internship Title</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Applicants</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {postings.map(post => (
                                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-secondary-900">{post.title}</p>
                                        <div className="flex items-center gap-3 mt-1 text-[10px] font-semibold text-slate-400">
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {post.postedDate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <Link to="/dashboard/industry/applicants" className="flex flex-col items-center hover:bg-primary-50 rounded-xl p-2 transition-colors">
                                            <span className="text-sm font-black text-secondary-900">{post.applicants}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-5">
                                        <StatusBadge status={post.status} />
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Link to="/dashboard/industry/applicants" className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="View Details">
                                                <Eye size={18} />
                                            </Link>
                                            <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit Posting">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-danger hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManagePostings;
