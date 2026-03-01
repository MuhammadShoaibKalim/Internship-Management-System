import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import LoadingBar from './components/common/LoadingBar';

// Layouts
import StudentLayout from './components/layout/StudentLayout';
import IndustryLayout from './components/layout/IndustryLayout';
import SupervisorLayout from './components/layout/SupervisorLayout';
import AdminLayout from './components/layout/AdminLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard Components
import StudentDashboard from './pages/dashboard/StudentDashboard';
import InternshipHub from './pages/hub/InternshipHub';
import StudentApplications from './pages/student/StudentApplications';
import StudentLogs from './pages/student/StudentLogs';
import StudentCertificates from './pages/student/StudentCertificates';
import StudentCVBuilder from './pages/student/StudentCVBuilder';
import StudentSettings from './pages/student/StudentSettings';
import SupervisorSettings from './pages/supervisor/SupervisorSettings';

// Industry Pages
import IndustryDashboard from './pages/dashboard/IndustryDashboard';
import ManagePostings from './pages/industry/ManagePostings';
import IndustryApplicants from './pages/industry/IndustryApplicants';
import IndustryInterns from './pages/industry/IndustryInterns';
import IndustryEvaluations from './pages/industry/IndustryEvaluations';
import IndustryProfile from './pages/industry/IndustryProfile';
import IndustrySettings from './pages/industry/IndustrySettings';

// Supervisor & Admin Components
import SupervisorDashboard from './pages/dashboard/SupervisorDashboard';
import AssignedStudents from './pages/supervisor/AssignedStudents';
import LogReviews from './pages/supervisor/LogReviews';
import SiteVisits from './pages/supervisor/SiteVisits';
import FinalMarking from './pages/supervisor/FinalMarking';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import VerifyIndustry from './pages/admin/VerifyIndustry';
import AdminDepartments from './pages/admin/AdminDepartments';
import GlobalReports from './pages/admin/GlobalReports';
import AdminSettings from './pages/admin/AdminSettings';

const App = () => {
  return (
    <>
      <ScrollToTop />
      <LoadingBar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/student" />} />

        {/* Student Protected Routes */}
        <Route path="/dashboard/student" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
        <Route path="/dashboard/student/hub" element={<StudentLayout><InternshipHub /></StudentLayout>} />
        <Route path="/dashboard/student/applications" element={<StudentLayout><StudentApplications /></StudentLayout>} />
        <Route path="/dashboard/student/logs" element={<StudentLayout><StudentLogs /></StudentLayout>} />
        <Route path="/dashboard/student/certificates" element={<StudentLayout><StudentCertificates /></StudentLayout>} />
        <Route path="/dashboard/student/cv-builder" element={<StudentLayout><StudentCVBuilder /></StudentLayout>} />

        {/* Industry Protected Routes */}
        <Route path="/dashboard/industry" element={<IndustryLayout><IndustryDashboard /></IndustryLayout>} />
        <Route path="/dashboard/industry/manage" element={<IndustryLayout><ManagePostings /></IndustryLayout>} />
        <Route path="/dashboard/industry/applicants" element={<IndustryLayout><IndustryApplicants /></IndustryLayout>} />
        <Route path="/dashboard/industry/interns" element={<IndustryLayout><IndustryInterns /></IndustryLayout>} />
        <Route path="/dashboard/industry/evaluations" element={<IndustryLayout><IndustryEvaluations /></IndustryLayout>} />
        <Route path="/dashboard/industry/profile" element={<IndustryLayout><IndustryProfile /></IndustryLayout>} />

        {/* Supervisor Protected Routes */}
        <Route path="/dashboard/supervisor" element={<SupervisorLayout><SupervisorDashboard /></SupervisorLayout>} />
        <Route path="/dashboard/supervisor/students" element={<SupervisorLayout><AssignedStudents /></SupervisorLayout>} />
        <Route path="/dashboard/supervisor/logs" element={<SupervisorLayout><LogReviews /></SupervisorLayout>} />
        <Route path="/dashboard/supervisor/visits" element={<SupervisorLayout><SiteVisits /></SupervisorLayout>} />
        <Route path="/dashboard/supervisor/marking" element={<SupervisorLayout><FinalMarking /></SupervisorLayout>} />

        {/* Admin Protected Routes */}
        <Route path="/dashboard/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/dashboard/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
        <Route path="/dashboard/admin/industry" element={<AdminLayout><VerifyIndustry /></AdminLayout>} />
        <Route path="/dashboard/admin/departments" element={<AdminLayout><AdminDepartments /></AdminLayout>} />
        <Route path="/dashboard/admin/reports" element={<AdminLayout><GlobalReports /></AdminLayout>} />

        {/* Shared Features (Role Specific) */}
        <Route path="/dashboard/student/settings" element={<StudentLayout><StudentSettings /></StudentLayout>} />
        <Route path="/dashboard/supervisor/settings" element={<SupervisorLayout><SupervisorSettings /></SupervisorLayout>} />
        <Route path="/dashboard/industry/settings" element={<IndustryLayout><IndustrySettings /></IndustryLayout>} />
        <Route path="/dashboard/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

        {/* Auth Flow */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/verify-otp" element={<VerifyOTP />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </>
  );
};

export default App;
