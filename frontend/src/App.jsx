import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Landing Page
import Landing from './pages/Landing';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentAssignments from './pages/student/Assignments';
import StudentGrades from './pages/student/Grades';
import StudentEnrollCourse from './pages/student/EnrollCourse';

import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherCourses from './pages/teacher/Courses';
import CreateAssignment from './pages/teacher/CreateAssignment';
import MarkAttendance from './pages/teacher/MarkAttendance';

import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';

// Components
import Sidebar from './components/Sidebar';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="loading-container" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const dashboardRoutes = {
            student: '/student',
            teacher: '/teacher',
            admin: '/admin'
        };
        return <Navigate to={dashboardRoutes[user.role] || '/login'} replace />;
    }

    return children;
};

// Dashboard Layout
const DashboardLayout = ({ children }) => {
    return (
        <div className="page">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

function App() {
    const { isAuthenticated, user } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to={`/${user?.role}`} /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to={`/${user?.role}`} /> : <Register />}
            />

            {/* Student Routes */}
            <Route path="/student" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <DashboardLayout><StudentDashboard /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/student/courses" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <DashboardLayout><StudentCourses /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/student/enroll" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <DashboardLayout><StudentEnrollCourse /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/student/assignments" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <DashboardLayout><StudentAssignments /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/student/grades" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <DashboardLayout><StudentGrades /></DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Teacher Routes */}
            <Route path="/teacher" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                    <DashboardLayout><TeacherDashboard /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/teacher/courses" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                    <DashboardLayout><TeacherCourses /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/teacher/assignments/create" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                    <DashboardLayout><CreateAssignment /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/teacher/attendance" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                    <DashboardLayout><MarkAttendance /></DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout><AdminDashboard /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout><UserManagement /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout><CourseManagement /></DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Default Redirects */}
            <Route path="/" element={
                isAuthenticated
                    ? <Navigate to={`/${user?.role}`} replace />
                    : <Landing />
            } />

            {/* 404 */}
            <Route path="*" element={
                <div className="auth-page">
                    <div className="auth-card text-center">
                        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--gray-300)' }}>404</h1>
                        <h2>Page Not Found</h2>
                        <p className="text-muted">The page you're looking for doesn't exist.</p>
                        <a href="/" className="btn btn-primary mt-4">Go Home</a>
                    </div>
                </div>
            } />
        </Routes>
    );
}

export default App;
