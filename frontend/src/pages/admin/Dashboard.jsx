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
            const response = await api.get('/admin/dashboard');
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
                <h1 className="page-title">Admin Dashboard 🔧</h1>
                <p className="page-subtitle">System overview and management</p>
            </div>

            {/* User Stats */}
            <h3 className="mb-4">👥 User Statistics</h3>
            <div className="grid grid-cols-4 mb-8">
                <div className="stat-card">
                    <div className="stat-value">{data?.users?.total || 0}</div>
                    <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card student">
                    <div className="stat-value">{data?.users?.students || 0}</div>
                    <div className="stat-label">Students</div>
                </div>
                <div className="stat-card teacher">
                    <div className="stat-value">{data?.users?.teachers || 0}</div>
                    <div className="stat-label">Teachers</div>
                </div>
                <div className="stat-card admin">
                    <div className="stat-value">{data?.users?.admins || 0}</div>
                    <div className="stat-label">Admins</div>
                </div>
            </div>

            {/* Course & Content Stats */}
            <h3 className="mb-4">📚 Course & Content</h3>
            <div className="grid grid-cols-4 mb-8">
                <div className="stat-card success">
                    <div className="stat-value">{data?.courses?.active || 0}</div>
                    <div className="stat-label">Active Courses</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{data?.enrollments || 0}</div>
                    <div className="stat-label">Enrollments</div>
                </div>
                <div className="stat-card warning">
                    <div className="stat-value">{data?.assignments || 0}</div>
                    <div className="stat-label">Assignments (MongoDB)</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{data?.submissions || 0}</div>
                    <div className="stat-label">Submissions</div>
                </div>
            </div>

            {/* Database Info */}
            <h3 className="mb-4">🗄️ Database Architecture</h3>
            <div className="grid grid-cols-2 mb-6">
                <div className="card">
                    <div className="card-header" style={{ background: 'var(--primary-50)' }}>
                        <h4>🐬 MySQL (Relational)</h4>
                    </div>
                    <div className="card-body">
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li className="mb-2">✓ Users, Roles, Authentication</li>
                            <li className="mb-2">✓ Courses & Departments</li>
                            <li className="mb-2">✓ Enrollments (ACID Transactions)</li>
                            <li className="mb-2">✓ Attendance Records</li>
                            <li className="mb-2">✓ Grades (Foreign Key Relations)</li>
                        </ul>
                        <div className="mt-4">
                            <span className="badge badge-primary">{data?.departments || 0} Departments</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" style={{ background: 'var(--success-light)' }}>
                        <h4>🍃 MongoDB (Document)</h4>
                    </div>
                    <div className="card-body">
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li className="mb-2">✓ Assignments (Flexible Schema)</li>
                            <li className="mb-2">✓ Submissions (Variable Content)</li>
                            <li className="mb-2">✓ Course Content</li>
                            <li className="mb-2">✓ Notifications</li>
                            <li className="mb-2">✓ System Logs (High Write Volume)</li>
                        </ul>
                        <div className="mt-4">
                            <span className="badge badge-success">{data?.assignments || 0} Assignments</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <div className="card-header">
                    <h4>⚡ Quick Actions</h4>
                </div>
                <div className="card-body">
                    <div className="flex gap-4">
                        <a href="/admin/users" className="btn btn-primary">
                            👥 Manage Users
                        </a>
                        <a href="/admin/courses" className="btn btn-secondary">
                            📚 Manage Courses
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
