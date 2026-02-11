import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get('/teacher/dashboard');
            setData(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Welcome, {user?.firstName}! 🎓</h1>
                <p className="page-subtitle">Manage your courses and students</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 mb-8">
                <div className="stat-card teacher">
                    <div className="stat-value">{data?.totalCourses || 0}</div>
                    <div className="stat-label">Courses Teaching</div>
                </div>

                <div className="stat-card success">
                    <div className="stat-value">{data?.totalStudents || 0}</div>
                    <div className="stat-label">Total Students</div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-value">{data?.pendingSubmissions || 0}</div>
                    <div className="stat-label">Pending Reviews</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card mb-6">
                <div className="card-header">
                    <h3>⚡ Quick Actions</h3>
                </div>
                <div className="card-body">
                    <div className="flex gap-4">
                        <a href="/teacher/assignments/create" className="btn btn-primary">
                            ➕ Create Assignment
                        </a>
                        <a href="/teacher/attendance" className="btn btn-secondary">
                            ✅ Mark Attendance
                        </a>
                        <a href="/teacher/courses" className="btn btn-secondary">
                            📚 View Courses
                        </a>
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="grid grid-cols-2">
                <div className="card">
                    <div className="card-header">
                        <h4>📝 Assignments</h4>
                    </div>
                    <div className="card-body">
                        <p className="text-muted">
                            Create and manage assignments for your courses.
                            Assignments are stored in MongoDB for flexible schema support.
                        </p>
                        <div className="mt-4">
                            <span className="badge badge-primary">MongoDB Collection</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h4>📊 Attendance</h4>
                    </div>
                    <div className="card-body">
                        <p className="text-muted">
                            Track student attendance for each class session.
                            Attendance data is stored in MySQL for relational integrity.
                        </p>
                        <div className="mt-4">
                            <span className="badge badge-success">MySQL Table</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
