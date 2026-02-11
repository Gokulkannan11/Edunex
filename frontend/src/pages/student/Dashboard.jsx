import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { format } from 'date-fns';

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
            const response = await api.get('/student/dashboard');
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
        return (
            <div className="alert alert-error">
                {error}
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Welcome back, {user?.firstName}! 👋</h1>
                <p className="page-subtitle">Here's what's happening with your courses today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 mb-8">
                <div className="stat-card student">
                    <div className="stat-value">{data?.enrolledCourses || 0}</div>
                    <div className="stat-label">Enrolled Courses</div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-value">{data?.pendingAssignments || 0}</div>
                    <div className="stat-label">Pending Assignments</div>
                </div>

                <div className="stat-card success">
                    <div className="stat-value">{data?.attendance?.rate || 0}%</div>
                    <div className="stat-label">Attendance Rate</div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">{data?.averageGrade || 0}%</div>
                    <div className="stat-label">Average Grade</div>
                </div>
            </div>

            {/* Upcoming Assignments */}
            <div className="card">
                <div className="card-header">
                    <h3>📝 Upcoming Assignments</h3>
                </div>
                <div className="card-body">
                    {data?.upcomingAssignments?.length > 0 ? (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Type</th>
                                        <th>Due Date</th>
                                        <th>Max Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.upcomingAssignments.map((assignment) => (
                                        <tr key={assignment._id}>
                                            <td>
                                                <strong>{assignment.title}</strong>
                                            </td>
                                            <td>
                                                <span className={`badge badge-${assignment.type === 'exam' ? 'danger' :
                                                        assignment.type === 'project' ? 'warning' :
                                                            'primary'
                                                    }`}>
                                                    {assignment.type}
                                                </span>
                                            </td>
                                            <td>
                                                {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                                            </td>
                                            <td>{assignment.maxScore} pts</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">🎉</div>
                            <p>No upcoming assignments! You're all caught up.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 mt-6">
                <div className="card">
                    <div className="card-header">
                        <h4>📊 Attendance Summary</h4>
                    </div>
                    <div className="card-body">
                        <div className="flex gap-6">
                            <div className="text-center">
                                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--success)' }}>
                                    {data?.attendance?.present || 0}
                                </div>
                                <div className="text-sm text-muted">Present</div>
                            </div>
                            <div className="text-center">
                                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--error)' }}>
                                    {data?.attendance?.absent || 0}
                                </div>
                                <div className="text-sm text-muted">Absent</div>
                            </div>
                            <div className="text-center">
                                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--gray-600)' }}>
                                    {data?.attendance?.total || 0}
                                </div>
                                <div className="text-sm text-muted">Total Classes</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h4>💡 Quick Tip</h4>
                    </div>
                    <div className="card-body">
                        <p className="text-muted">
                            Stay on top of your assignments by checking this dashboard regularly.
                            Your attendance and grades are updated in real-time as teachers record them.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
