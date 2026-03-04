import React, { useState, useEffect } from 'react';
import {
    LayoutGrid,
    Users,
    BookOpen,
    Building2,
    ArrowRight,
    ChevronRight,
    MoreHorizontal,
    Plus,
    GraduationCap,
    Library,
    Edit,
    Trash2,
    X,
    Loader2,
    Activity,
    RefreshCw,
    Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const AdminDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDept, setCurrentDept] = useState({ name: '', code: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await API.get('/admin/departments');
            setDepartments(response.data.data.departments);
        } catch (err) {
            console.error('Failed to fetch departments', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await API.patch(`/admin/departments/${currentDept._id}`, currentDept);
            } else {
                await API.post('/admin/departments', currentDept);
            }
            fetchDepartments();
            closeModal();
        } catch (err) {
            alert('Failed to save department');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to decommission this academic unit?')) return;
        try {
            await API.delete(`/admin/departments/${id}`);
            fetchDepartments();
        } catch (err) {
            alert('Failed to delete department');
        }
    };

    const openModal = (dept = { name: '', code: '', description: '' }) => {
        setCurrentDept(dept);
        setIsEditing(!!dept._id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentDept({ name: '', code: '', description: '' });
        setIsEditing(false);
    };

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-fade-in pb-12 relative">
            {/* Clean Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100/50">
                        <GraduationCap size={14} className="text-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">Academic Hierarchy</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            University <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-primary-500">Departments</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium mt-3 max-w-2xl leading-relaxed">
                            Organize academic units, manage faculty appointments, and monitor <span className="font-bold text-slate-900 px-1">department-wide quota</span> and internship metrics.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 no-underline"
                >
                    <Plus size={20} className="text-indigo-400" /> Create New Unit
                </button>
            </div>

            {/* Quick Filter */}
            <div className="portal-card p-6 bg-white border-none shadow-xl shadow-slate-100/50 flex flex-col md:flex-row gap-6 items-center">
                <div className="relative group w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={24} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by department name or unit code..."
                        className="w-full pl-16 pr-10 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-50 focus:border-indigo-500/30 outline-none transition-all placeholder:text-slate-300"
                    />
                </div>
                <button onClick={fetchDepartments} className="p-5 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                    <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Mapping Academic Grid...</p>
                    </div>
                ) : filteredDepartments.length > 0 ? (
                    filteredDepartments.map(dept => (
                        <div key={dept._id} className="portal-card p-10 bg-white border-2 border-slate-50 shadow-2xl shadow-slate-100/50 group hover:border-indigo-100 transition-all flex flex-col justify-between relative overflow-hidden">
                            <div className="flex items-start justify-between mb-10 pb-6 border-b border-slate-50 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-slate-900 text-primary-400 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        {dept.code}
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">{dept.name}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(dept)} className="p-4 text-slate-300 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all">
                                        <Edit size={24} />
                                    </button>
                                    <button onClick={() => handleDelete(dept._id)} className="p-4 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mb-10 relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled</p>
                                    <p className="text-xl font-bold text-slate-900">0</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty</p>
                                    <p className="text-xl font-bold text-slate-900">0</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internships</p>
                                    <p className="text-xl font-bold text-primary-600">0</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50 relative z-10">
                                <div className="flex -space-x-3 overflow-hidden">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-10 w-10 rounded-xl bg-slate-900 text-white text-[10px] font-black border-4 border-white flex items-center justify-center ring-2 ring-slate-100">
                                            F{i}
                                        </div>
                                    ))}
                                </div>
                                <Link to="/dashboard/admin/users" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-slate-900 transition-all no-underline">
                                    View Faculty List <ChevronRight size={16} />
                                </Link>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-110 group-hover:bg-indigo-500/10" />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
                            <GraduationCap size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase">Unit Registry Empty</h3>
                        <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest italic">Initialize academic infrastructure by constructing first unit</p>
                    </div>
                )}
            </div>

            {/* Department Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight">{isEditing ? 'Reconfigure Unit' : 'Construct Academic Unit'}</h2>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">System Infrastructure Protocol</p>
                            </div>
                            <button onClick={closeModal} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Unit Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={currentDept.name}
                                        onChange={(e) => setCurrentDept({ ...currentDept, name: e.target.value })}
                                        placeholder="Department of Computer Science..."
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-50 focus:border-indigo-500/30 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Identification Code</label>
                                    <input
                                        required
                                        type="text"
                                        value={currentDept.code}
                                        onChange={(e) => setCurrentDept({ ...currentDept, code: e.target.value })}
                                        placeholder="CS01"
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-50 focus:border-indigo-500/30 outline-none transition-all uppercase"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Technical Scope</label>
                                <textarea
                                    value={currentDept.description}
                                    onChange={(e) => setCurrentDept({ ...currentDept, description: e.target.value })}
                                    rows="4"
                                    placeholder="Enter department scope and academic focus..."
                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-[12px] focus:ring-slate-50 focus:border-indigo-500/30 outline-none transition-all"
                                />
                            </div>
                            <div className="pt-8 flex gap-4">
                                <button type="button" onClick={closeModal} className="flex-1 px-8 py-5 bg-slate-50 text-slate-400 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Abort Protocol</button>
                                <button type="submit" className="flex-[2] px-8 py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">Commit Infrastructure</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="p-12 border-2 border-slate-100 rounded-[3rem] bg-indigo-900 text-white flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="relative z-10 flex items-center gap-8">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-indigo-400 border border-white/10 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-2xl">
                        <GraduationCap size={40} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-extrabold uppercase tracking-tight">Quota Synchronization</h4>
                        <p className="text-indigo-300 text-sm font-medium italic mt-2 opacity-80 leading-relaxed max-w-lg">
                            Institutional data shows <span className="text-white font-bold">{departments.length > 0 ? '92%' : '0%'} resource allocation</span> across all registered departments.
                        </p>
                    </div>
                </div>
                <button onClick={fetchDepartments} className="relative z-10 px-10 py-5 bg-white text-indigo-900 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl active:scale-95">
                    Process Global Sync
                </button>
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/20 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 group-hover:bg-primary-500/40" />
            </div>
        </div>
    );
};

export default AdminDepartments;
