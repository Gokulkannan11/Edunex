import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { format } from 'date-fns';
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
        return <div className="alert alert-error">{error}</div>;
    }

    // Sample data matching Stitch design
    const stats = {
        enrolledCourses: data?.enrolledCourses || 12,
        pendingAssignments: data?.pendingAssignments || 4,
        attendanceRate: data?.attendanceRate || 94,
        averageGrade: data?.averageGrade || 3.8
    };

    const assignments = [
        {
            title: 'Advanced Calculus - Week 4',
            subtitle: 'Unit 2: Differentiation',
            type: 'Exam',
            dueDate: 'Aug 15, 2025',
            maxScore: 100
        },
        {
            title: 'UX Design Principles',
            subtitle: 'Interaction Design Case Study',
            type: 'Project',
            dueDate: 'Aug 22, 2025',
            maxScore: 50
        },
        {
            title: 'Macroeconomics Quiz',
            subtitle: 'Chapter 5: Inflation Patterns',
            type: 'Homework',
            dueDate: 'Sep 05, 2025',
            maxScore: 20
        }
    ];

    const attendance = {
        present: data?.attendance?.present || 45,
        absent: data?.attendance?.absent || 3,
        total: data?.attendance?.total || 48
    };

    return (
        <div className="student-dashboard-stitch">
            {/* Header */}
            <div className="dashboard-header-stitch">
                <div>
                    <h1 className="dashboard-title-stitch">
                        Welcome back, {user?.firstName || 'Alex'}! 👋
                    </h1>
                    <p className="dashboard-subtitle-stitch">
                        Here's what's happening with your academic progress today.
                    </p>
                </div>
                <div className="term-badge-stitch">
                    <span className="bell-icon-stitch">🔔</span>
                    <span>Term: Fall 2025</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid-stitch">
                <div className="stat-card-stitch purple-border">
                    <div className="stat-label-stitch">Enrolled Courses</div>
                    <div className="stat-value-stitch">{stats.enrolledCourses}</div>
                    <div className="stat-meta-stitch success">+2 this term</div>
                </div>

                <div className="stat-card-stitch orange-border">
                    <div className="stat-label-stitch">Pending Assignments</div>
                    <div className="stat-value-stitch orange">{String(stats.pendingAssignments).padStart(2, '0')}</div>
                    <div className="stat-icon-stitch">⏰</div>
                </div>

                <div className="stat-card-stitch green-border">
                    <div className="stat-label-stitch">Attendance Rate</div>
                    <div className="stat-value-stitch green">{stats.attendanceRate}%</div>
                    <div className="stat-icon-stitch">✅</div>
                </div>

                <div className="stat-card-stitch blue-border">
                    <div className="stat-label-stitch">Average Grade</div>
                    <div className="stat-value-stitch blue">{stats.averageGrade}</div>
                    <div className="stat-meta-stitch info">Top 5%</div>
                </div>
            </div>

            {/* Upcoming Assignments */}
            <div className="assignments-section-stitch">
                <div className="section-header-stitch">
                    <h2>Upcoming Assignments</h2>
                    <Link to="/student/assignments" className="view-all-link-stitch">View All</Link>
                </div>

                <div className="assignments-table-stitch">
                    <div className="table-header-stitch">
                        <div className="col-title">TITLE</div>
                        <div className="col-type">TYPE</div>
                        <div className="col-date">DUE DATE</div>
                        <div className="col-score">MAX SCORE</div>
                        <div className="col-action">ACTION</div>
                    </div>

                    {assignments.map((assignment, index) => (
                        <div key={index} className="table-row-stitch">
                            <div className="col-title">
                                <div className="assignment-title-stitch">{assignment.title}</div>
                                <div className="assignment-subtitle-stitch">{assignment.subtitle}</div>
                            </div>
                            <div className="col-type">
                                <span className={`type-badge-stitch ${assignment.type.toLowerCase()}`}>
                                    {assignment.type}
                                </span>
                            </div>
                            <div className="col-date">{assignment.dueDate}</div>
                            <div className="col-score">{assignment.maxScore}</div>
                            <div className="col-action">
                                <button className="details-btn-stitch">Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bottom-section-stitch">
                {/* Attendance Summary */}
                <div className="attendance-card-stitch">
                    <div className="card-header-stitch">
                        <span className="card-icon-stitch">📅</span>
                        <h3>Attendance Summary</h3>
                    </div>

                    <div className="attendance-circles-stitch">
                        <div className="attendance-circle-item">
                            <div className="circle-stitch green">
                                <span className="circle-value">{attendance.present}</span>
                            </div>
                            <div className="circle-label">PRESENT</div>
                        </div>

                        <div className="attendance-circle-item">
                            <div className="circle-stitch red">
                                <span className="circle-value">{String(attendance.absent).padStart(2, '0')}</span>
                            </div>
                            <div className="circle-label">ABSENT</div>
                        </div>
                    </div>

                    <div className="attendance-message-stitch">
                        Your attendance is within the top percentile for your cohort. Keep it up!
                    </div>
                </div>

                {/* Quick Tip */}
                <div className="tip-card-stitch">
                    <div className="tip-icon-stitch">💡</div>
                    <h3 className="tip-title-stitch">Quick Tip</h3>
                    <p className="tip-text-stitch">
                        Did you know you can sync your EduNex academic calendar with your Google Calendar or Outlook?
                        Just head over to the <strong>Settings</strong> panel to get your unique sync URL!
                    </p>
                    <Link to="/student/settings" className="tip-link-stitch">
                        Go to Settings <span>›</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
