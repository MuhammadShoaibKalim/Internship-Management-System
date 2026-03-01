import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    GraduationCap
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active = false, isOpen = true }) => (
    <Link to={path} title={!isOpen ? label : ""} className={`
    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group no-underline
    ${active
            ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
            : 'text-slate-500 hover:bg-primary-50 hover:text-primary-600'}
    ${!isOpen && 'justify-center'}
  `}>
        <Icon size={20} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-primary-500 transition-colors'} shrink-0`} />
        {isOpen && <span className="font-medium text-sm animate-fade-in whitespace-nowrap">{label}</span>}
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
            { icon: Award, label: "Certificates", path: "/dashboard/student/certificates" },
            { icon: UserCircle, label: "Upload CV", path: "/dashboard/student/cv-builder" },
        ],
        industry: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/industry" },
            { icon: PlusCircle, label: "Manage Postings", path: "/dashboard/industry/manage" },
            { icon: Users, label: "Applicant Review", path: "/dashboard/industry/applicants" },
            { icon: UserCircle, label: "Active Interns", path: "/dashboard/industry/interns" },
            { icon: CheckSquare, label: "Evaluations", path: "/dashboard/industry/evaluations" },
            { icon: Building2, label: "Company Profile", path: "/dashboard/industry/profile" },
        ],
        supervisor: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/supervisor" },
            { icon: GraduationCap, label: "Assigned Students", path: "/dashboard/supervisor/students" },
            { icon: ClipboardList, label: "Log Reviews", path: "/dashboard/supervisor/logs" },
            { icon: MapPin, label: "On-site Visits", path: "/dashboard/supervisor/visits" },
            { icon: BarChart3, label: "Final Marking", path: "/dashboard/supervisor/marking" },
        ],
        admin: [
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/admin" },
            { icon: ShieldCheck, label: "User Management", path: "/dashboard/admin/users" },
            { icon: Building2, label: "Verify Industry", path: "/dashboard/admin/industry" },
            { icon: GraduationCap, label: "Departments", path: "/dashboard/admin/departments" },
            { icon: BarChart3, label: "Global Reports", path: "/dashboard/admin/reports" },
        ]
    };

    const currentMenu = menuItems[role] || menuItems.student;

    return (
        <aside className={`h-screen bg-white border-r border-slate-100 sticky top-0 overflow-y-auto z-40 lg:flex flex-col shrink-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-22'}`}>
            <div className="p-6">
                <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    {isOpen && (
                        <div className="animate-fade-in whitespace-nowrap">
                            <h1 className="text-xl font-bold text-secondary-900 tracking-tight leading-none uppercase">IMS</h1>
                            <p className="text-[10px] text-slate-500 font-semibold tracking-widest mt-1 uppercase">Academic Portal</p>
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
                <button className={`w-full flex items-center gap-2 text-rose-500 font-bold text-sm py-3 hover:bg-rose-50 rounded-xl transition-colors ${!isOpen ? 'justify-center' : 'px-4'}`}>
                    <LogOut size={20} className="shrink-0" />
                    {isOpen && <span className="animate-fade-in">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
