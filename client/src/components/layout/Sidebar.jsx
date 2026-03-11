import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../services/api';
import {
    LayoutDashboard,
    Globe,
    FileText,
    ClipboardList,
    UserCircle,
    Award,
    Building2,
    Users,
    PlusCircle,
    CheckSquare,
    BarChart3,
    Settings,
    LogOut,
    ShieldCheck,
    MapPin,
    GraduationCap,
    Newspaper
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active = false, isOpen = true }) => (
    <Link to={path} title={!isOpen ? label : ""} className={`
    flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 group no-underline
    ${active
            ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200 scale-[1.02]'
            : 'text-slate-500 hover:bg-primary-50 hover:text-primary-600'}
    ${!isOpen && 'justify-center'}
  `}>
        <Icon size={20} className={`${active ? 'text-primary-400' : 'text-slate-300 group-hover:text-primary-500 transition-colors'} shrink-0`} />
        {isOpen && <span className="font-bold text-[11px] uppercase tracking-widest animate-fade-in whitespace-nowrap">{label}</span>}
    </Link>
);

const Sidebar = ({ role = 'student', isOpen = true }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const menuItems = {
        student: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/student" },
            { icon: Globe, label: "Internship Hub", path: "/dashboard/student/hub" },
            { icon: FileText, label: "My Applications", path: "/dashboard/student/applications" },
            { icon: ClipboardList, label: "Weekly Logs", path: "/dashboard/student/logs" },
            { icon: UserCircle, label: "Upload CV", path: "/dashboard/student/cv-builder" },
            { icon: Award, label: "Result & Certificate", path: "/dashboard/student/result" },
            { icon: FileText, label: "My Certificates", path: "/dashboard/student/certificates" },
        ],
        industry: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/industry" },
            { icon: PlusCircle, label: "Manage Postings", path: "/dashboard/industry/manage" },
            { icon: Users, label: "Applicant Review", path: "/dashboard/industry/applicants" },
            { icon: UserCircle, label: "Active Interns", path: "/dashboard/industry/interns" },
            { icon: ClipboardList, label: "Weekly Logs", path: "/dashboard/industry/logs" },
            { icon: CheckSquare, label: "Evaluations", path: "/dashboard/industry/evaluations" },
            { icon: Building2, label: "Company Profile", path: "/dashboard/industry/profile" },
        ],
        supervisor: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/supervisor" },
            { icon: Users, label: "Assigned Students", path: "/dashboard/supervisor/students" },
            { icon: CheckSquare, label: "Endorsements", path: "/dashboard/supervisor/endorsements" },
            { icon: ClipboardList, label: "Weekly Logs", path: "/dashboard/supervisor/logs" },
            { icon: MapPin, label: "On-site Visits", path: "/dashboard/supervisor/visits" },
            { icon: Award, label: "Final Marking", path: "/dashboard/supervisor/marking" },
        ],
        admin: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/admin" },
            { icon: UserCircle, label: "My Profile", path: "/dashboard/admin/profile" },
            { icon: ShieldCheck, label: "User Management", path: "/dashboard/admin/users" },
            { icon: Building2, label: "Verify Industry", path: "/dashboard/admin/industry" },
            { icon: GraduationCap, label: "Departments", path: "/dashboard/admin/departments" },
            { icon: BarChart3, label: "Global Reports", path: "/dashboard/admin/reports" },
            { icon: Newspaper, label: "Blog Posts", path: "/dashboard/admin/blogs" },
        ]
    };

    const currentMenu = menuItems[role] || menuItems.student;

    return (
        <aside className={`h-screen bg-white border-r border-slate-100/50 sticky top-0 overflow-y-auto z-40 lg:flex flex-col shrink-0 transition-all duration-500 ${isOpen ? 'w-72' : 'w-24'}`}>
            <div className="p-8">
                <div className={`flex items-center gap-4 ${!isOpen && 'justify-center'}`}>
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl shadow-slate-200 shrink-0 border border-white/10 group">
                        <svg className="w-7 h-7 group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    {isOpen && (
                        <div className="animate-fade-in whitespace-nowrap">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">IMS</h1>
                            <p className="text-[9px] text-primary-600 font-black tracking-[0.3em] mt-1.5 uppercase opacity-60">Academic Portal</p>
                        </div>
                    )}
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                {currentMenu.map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        path={item.path}
                        isOpen={isOpen}
                        active={currentPath === item.path}
                    />
                ))}

                <div className="my-4 border-t border-slate-50 mx-4"></div>

                <SidebarItem
                    icon={Settings}
                    label="Settings"
                    path={`/dashboard/${role}/settings`}
                    isOpen={isOpen}
                    active={currentPath === `/dashboard/${role}/settings`}
                />
            </nav>

            <div className={`p-4 mt-auto border-t border-slate-50 ${!isOpen && 'flex flex-col items-center'}`}>
                <button
                    onClick={logout}
                    className={`w-full flex items-center gap-2 text-rose-500 font-bold text-sm py-3 hover:bg-rose-50 rounded-xl transition-colors ${!isOpen ? 'justify-center' : 'px-4'}`}
                >
                    <LogOut size={20} className="shrink-0" />
                    {isOpen && <span className="animate-fade-in">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
