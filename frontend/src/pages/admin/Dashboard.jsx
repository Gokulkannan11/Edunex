import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Dashboard.css';

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

    const stats = {
        totalUsers: data?.totalUsers || 12450,
        activeCourses: data?.activeCourses || 482,
        departments: data?.departments || 12
    };

    const userStats = [
        { label: 'TOTAL USERS', value: 9 },
        { label: 'STUDENTS', value: 5 },
        { label: 'TEACHERS', value: 3 },
        { label: 'ADMINS', value: 1 }
    ];

    const courseStats = [
        { label: 'ACTIVE COURSES', value: 5 },
        { label: 'ENROLLMENTS', value: 11 },
        { label: 'ASSIGNMENTS\n(MONGODB)', value: 2 },
        { label: 'SUBMISSIONS', value: 0 }
    ];

    return (
        <div className="admin-dashboard-stitch">
            {/* Header */}
            <div className="admin-header-stitch">
                <div>
                    <h1 className="admin-title-stitch">Admin Dashboard</h1>
                    <p className="admin-subtitle-stitch">
                        Overview of your academic ecosystem for Academic Year 2025.
                    </p>
                </div>
                <div className="admin-actions-stitch">
                    <input
                        type="text"
                        placeholder="Search analytics..."
                        className="search-input-stitch"
                    />
                    <span className="bell-icon-admin">🔔</span>
                    <button className="quick-action-btn-stitch">
                        ⚡ Quick Action
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="top-stats-stitch">
                <div className="top-stat-card-stitch">
                    <div className="stat-label-admin">TOTAL USERS</div>
                    <div className="stat-value-admin">{stats.totalUsers.toLocaleString()}</div>
                    <div className="stat-change-admin positive">↑ 12.5% increase</div>
                </div>
                <div className="top-stat-card-stitch">
                    <div className="stat-label-admin">ACTIVE COURSES</div>
                    <div className="stat-value-admin">{stats.activeCourses}</div>
                    <div className="stat-meta-admin">Currently published</div>
                </div>
                <div className="top-stat-card-stitch">
                    <div className="stat-label-admin">DEPARTMENTS</div>
                    <div className="stat-value-admin">{stats.departments}</div>
                    <div className="stat-meta-admin">Core faculties</div>
                </div>
            </div>

            {/* User Statistics */}
            <div className="section-admin">
                <h2 className="section-title-admin">
                    <span className="section-icon-admin">👥</span> User Statistics
                </h2>
                <div className="stats-grid-admin">
                    {userStats.map((stat, index) => (
                        <div key={index} className="stat-box-admin">
                            <div className="stat-box-value">{stat.value}</div>
                            <div className="stat-box-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Course & Content */}
            <div className="section-admin">
                <h2 className="section-title-admin">
                    <span className="section-icon-admin">📚</span> Course & Content
                </h2>
                <div className="stats-grid-admin">
                    {courseStats.map((stat, index) => (
                        <div key={index} className="stat-box-admin">
                            <div className="stat-box-value">{stat.value}</div>
                            <div className="stat-box-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section-stitch">
                <div className="chart-card-stitch">
                    <h3 className="chart-title-stitch">
                        <span>📊</span> Course Growth 2025
                    </h3>
                    <div className="chart-placeholder-stitch">
                        <div className="chart-axis-stitch">
                            <span>JAN</span>
                            <span>FEB</span>
                            <span>MAR</span>
                            <span>APR</span>
                            <span>MAY</span>
                            <span>JUN</span>
                        </div>
                    </div>
                    <div className="chart-footer-stitch">
                        EDUNEX INTERNAL PLATFORM V4.0
                    </div>
                </div>

                <div className="chart-card-stitch">
                    <h3 className="chart-title-stitch">
                        <span>🔄</span> User Distribution
                    </h3>
                    <div className="donut-chart-stitch">
                        <div className="donut-circle-stitch">
                            <div className="donut-value-stitch">12.4k</div>
                            <div className="donut-label-stitch">USERS</div>
                        </div>
                    </div>
                    <div className="chart-legend-stitch">
                        <div className="legend-item-stitch">
                            <span className="legend-dot-stitch purple"></span>
                            <span className="legend-text-stitch">Students</span>
                            <span className="legend-percent-stitch">70%</span>
                        </div>
                    </div>
                    <div className="chart-footer-stitch">
                        COPYRIGHT 2025 EDUNEX LEARNING MANAGEMENT SYSTEMS
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
