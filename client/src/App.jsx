import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import ResetPassword from './pages/auth/ResetPassword';
import RoleBasedRedirect from './components/auth/RoleBasedRedirect';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import NotFound from './pages/NotFound';
import PublicLayout from './components/layout/PublicLayout';
import LandingPage from './pages/public/LandingPage';
import BlogList from './pages/public/BlogList';
import BlogDetail from './pages/public/BlogDetail';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';
import Documentation from './pages/public/Documentation';

// Dashboard Components
import StudentDashboard from './pages/dashboard/StudentDashboard';
import InternshipHub from './pages/hub/InternshipHub';
import StudentApplications from './pages/student/StudentApplications';
import StudentLogs from './pages/student/StudentLogs';
import StudentCertificates from './pages/student/StudentCertificates';
import StudentCVBuilder from './pages/student/StudentCVBuilder';
import StudentSettings from './pages/student/StudentSettings';
import InternshipResult from './pages/student/InternshipResult';
import SupervisorSettings from './pages/supervisor/SupervisorSettings';

// Industry Pages
import IndustryDashboard from './pages/dashboard/IndustryDashboard';
import ManagePostings from './pages/industry/ManagePostings';
import IndustryApplicants from './pages/industry/IndustryApplicants';
import IndustryInterns from './pages/industry/IndustryInterns';
import IndustryEvaluations from './pages/industry/IndustryEvaluations';
import IndustryProfile from './pages/industry/IndustryProfile';
import IndustrySettings from './pages/industry/IndustrySettings';
import IndustryLogs from './pages/industry/IndustryLogs';

// Supervisor & Admin Components
import SupervisorDashboard from './pages/dashboard/SupervisorDashboard';
import AssignedStudents from './pages/supervisor/AssignedStudents';
import LogReviews from './pages/supervisor/LogReviews';
import SiteVisits from './pages/supervisor/SiteVisits';
import FinalMarking from './pages/supervisor/FinalMarking';
import ApplicationEndorsements from './pages/supervisor/ApplicationEndorsements';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminProfile from './pages/admin/AdminProfile';
import VerifyIndustry from './pages/admin/VerifyIndustry';
import AdminDepartments from './pages/admin/AdminDepartments';
import GlobalReports from './pages/admin/GlobalReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminBlogs from './pages/admin/AdminBlogs';

const App = () => {
  return (
    <>
      <ScrollToTop />
      <LoadingBar />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f172a',
            color: '#fff',
            borderRadius: '1rem',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '16px 24px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#fff',
            },
          }
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
        <Route path="/internships" element={<PublicLayout><InternshipHub /></PublicLayout>} />
        <Route path="/blogs" element={<PublicLayout><BlogList /></PublicLayout>} />
        <Route path="/blogs/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><TermsOfService /></PublicLayout>} />
        <Route path="/docs" element={<PublicLayout><Documentation /></PublicLayout>} />

        {/* Root Redirect based on Role (Legacy/Direct access) */}
        <Route path="/home" element={<RoleBasedRedirect />} />

        {/* Student Protected Routes */}
        <Route path="/dashboard/student/*" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout>
              <Routes>
                <Route index element={<StudentDashboard />} />
                <Route path="hub" element={<InternshipHub />} />
                <Route path="applications" element={<StudentApplications />} />
                <Route path="logs" element={<StudentLogs />} />
                <Route path="certificates" element={<StudentCertificates />} />
                <Route path="cv-builder" element={<StudentCVBuilder />} />
                <Route path="result" element={<InternshipResult />} />
                <Route path="settings" element={<StudentSettings />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </StudentLayout>
          </ProtectedRoute>
        } />

        {/* Industry Protected Routes */}
        <Route path="/dashboard/industry/*" element={
          <ProtectedRoute allowedRoles={['industry']}>
            <IndustryLayout>
              <Routes>
                <Route index element={<IndustryDashboard />} />
                <Route path="manage" element={<ManagePostings />} />
                <Route path="applicants" element={<IndustryApplicants />} />
                <Route path="interns" element={<IndustryInterns />} />
                <Route path="evaluations" element={<IndustryEvaluations />} />
                <Route path="logs" element={<IndustryLogs />} />
                <Route path="profile" element={<IndustryProfile />} />
                <Route path="settings" element={<IndustrySettings />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </IndustryLayout>
          </ProtectedRoute>
        } />

        {/* Supervisor Protected Routes */}
        <Route path="/dashboard/supervisor/*" element={
          <ProtectedRoute allowedRoles={['supervisor']}>
            <SupervisorLayout>
              <Routes>
                <Route index element={<SupervisorDashboard />} />
                <Route path="students" element={<AssignedStudents />} />
                <Route path="logs" element={<LogReviews />} />
                <Route path="visits" element={<SiteVisits />} />
                <Route path="marking" element={<FinalMarking />} />
                <Route path="endorsements" element={<ApplicationEndorsements />} />
                <Route path="settings" element={<SupervisorSettings />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </SupervisorLayout>
          </ProtectedRoute>
        } />

        {/* Admin Protected Routes */}
        <Route path="/dashboard/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="industry" element={<VerifyIndustry />} />
                <Route path="departments" element={<AdminDepartments />} />
                <Route path="reports" element={<GlobalReports />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />


        {/* Auth Flow */}
        <Route path="/auth/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/auth/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/auth/verify-otp" element={<GuestRoute><VerifyOTP /></GuestRoute>} />
        <Route path="/auth/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/auth/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />

        {/* 404 Route */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
};

export default App;
