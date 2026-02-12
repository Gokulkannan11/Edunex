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

    const stats = {
        activeCourses: data?.activeCourses || 6,
        totalStudents: data?.totalStudents || 184,
        pendingAssignments: data?.pendingAssignments || 42,
        classesThisWeek: data?.classesThisWeek || 12
    };

    const courses = [
        {
            code: 'PHY-201',
            title: 'Advanced Physics',
            students: 32,
            activity: '12 students submitted "Quantum Mechanics Basics"',
            time: '14:00 - 15:30',
            location: 'Room 402'
        },
        {
            code: 'MAT-405',
            title: 'Linear Algebra',
            students: 28,
            activity: 'New discussion thread: "Matrix Transformations"',
            time: '09:00 - 10:30',
            location: 'Lab 10-A'
        }
    ];

    const upcomingClasses = [
        { course: 'Linear Algebra (MAT-405)', time: '09:00 AM', location: 'Lecture Room 101 • 28 Students', status: 'COMPLETED' },
        { course: 'Advanced Physics (PHY-201)', time: '11:00 AM', location: 'Main Lab Hall • 34 Students', status: 'LIVE SOON' },
        { course: 'Research Methodology', time: '02:30 PM', location: 'Online Session via EduNex Video', status: 'SCHEDULED' }
    ];

    const activities = [
        { name: 'Marcus Chen', action: 'submitted Lab Report 4', time: 'Sep 10, 2025 • 10:24 AM', type: 'submission' },
        { name: 'Aaliyah Khan', action: 'posted a question in General Discussion', time: 'Sep 10, 2025 • 09:45 AM', type: 'question' },
        { name: 'James Wilson', action: 'completed the Weekly Quiz', time: 'Sep 10, 2025 • 08:30 AM', score: '92%', type: 'completion' }
    ];

    return (
        <div className="teacher-dashboard-stitch">
            {/* Header */}
            <div className="dashboard-header-teacher">
                <div>
                    <h1 className="dashboard-title-teacher">Welcome, Dr. {user?.lastName || 'Miller'}</h1>
                    <p className="dashboard-subtitle-teacher">
                        Academic Year 2025-2026 • Manage your courses and student activities
                    </p>
                </div>
                <div className="datetime-badge-teacher">
                    <span className="bell-icon-teacher">🔔</span>
                    <div>
                        <div className="date-text">Monday, Sep 10, 2025</div>
                        <div className="time-text">10:45 AM GMT+1</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-teacher">
                <Link to="/teacher/assignments/create" className="action-btn-teacher primary">
                    <span>✏️</span> Create Assignment
                </Link>
                <Link to="/teacher/attendance" className="action-btn-teacher secondary">
                    <span>✅</span> Mark Attendance
                </Link>
                <Link to="/teacher/analytics" className="action-btn-teacher secondary">
                    <span>📊</span> Course Analytics
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid-teacher">
                <div className="stat-card-teacher blue">
                    <div className="stat-label-teacher">Active Courses</div>
                    <div className="stat-value-teacher">0{stats.activeCourses}</div>
                    <div className="stat-meta-teacher success">+1 from sem 1</div>
                </div>
                <div className="stat-card-teacher teal">
                    <div className="stat-label-teacher">Total Students</div>
                    <div className="stat-value-teacher">{stats.totalStudents}</div>
                    <div className="stat-meta-teacher">Across all units</div>
                </div>
                <div className="stat-card-teacher orange">
                    <div className="stat-label-teacher">Pending Assignments</div>
                    <div className="stat-value-teacher">{stats.pendingAssignments}</div>
                    <div className="stat-meta-teacher warning">Needs grading</div>
                </div>
                <div className="stat-card-teacher purple">
                    <div className="stat-label-teacher">Classes This Week</div>
                    <div className="stat-value-teacher">{stats.classesThisWeek}</div>
                    <div className="stat-meta-teacher">Next in 2h</div>
                </div>
            </div>

            {/* Main Content - 2 Column Layout */}
            <div className="main-content-teacher">
                {/* Left Column - Active Courses + Upcoming Classes */}
                <div className="left-column-teacher">
                    {/* Active Courses */}
                    <div className="section-teacher">
                        <div className="section-header-teacher">
                            <h2>Active Courses</h2>
                            <Link to="/teacher/courses" className="view-all-link-teacher">View All</Link>
                        </div>
                        <div className="courses-grid-teacher">
                            {courses.map((course, index) => (
                                <div key={index} className="course-card-teacher">
                                    <div className="course-header-teacher">
                                        <span className="course-code-teacher">{course.code}</span>
                                        <span className="student-count-teacher">
                                            <span className="avatars-teacher">👤👤</span> +{course.students}
                                        </span>
                                    </div>
                                    <h3 className="course-title-teacher">{course.title}</h3>
                                    <div className="activity-box-teacher">
                                        <div className="activity-label-teacher">RECENT ACTIVITY</div>
                                        <div className="activity-text-teacher">{course.activity}</div>
                                    </div>
                                    <div className="course-meta-teacher">
                                        <span>🕐 {course.time}</span>
                                        <span>📍 {course.location}</span>
                                    </div>
                                    <div className="course-actions-teacher">
                                        <Link to={`/teacher/courses/${course.code}`} className="btn-course-teacher primary">View Course</Link>
                                        <Link to="/teacher/attendance" className="btn-course-teacher secondary">Attendance</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Classes */}
                    <div className="section-teacher">
                        <div className="section-header-teacher">
                            <h2>Upcoming Classes (Today)</h2>
                            <span className="date-badge-teacher">Sep 10, 2025</span>
                        </div>
                        <div className="classes-list-teacher">
                            {upcomingClasses.map((cls, index) => (
                                <div key={index} className="class-item-teacher">
                                    <div className="class-time-teacher">{cls.time}</div>
                                    <div className={`class-dot-teacher ${cls.status.toLowerCase().replace(' ', '-')}`}></div>
                                    <div className="class-details-teacher">
                                        <div className="class-name-teacher">{cls.course}</div>
                                        <div className="class-location-teacher">{cls.location}</div>
                                    </div>
                                    <span className={`class-status-teacher ${cls.status.toLowerCase().replace(' ', '-')}`}>
                                        {cls.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Recent Student Activity */}
                <div className="right-column-teacher">
                    <div className="activity-section-teacher">
                        <div className="section-header-teacher">
                            <h2>Recent Student Activity</h2>
                        </div>
                        <div className="activity-list-teacher">
                            {activities.map((activity, index) => (
                                <div key={index} className="activity-item-teacher">
                                    <div className="activity-avatar-teacher">👤</div>
                                    <div className="activity-content-teacher">
                                        <div className="activity-name-teacher">{activity.name}</div>
                                        <div className="activity-action-teacher">{activity.action}</div>
                                        <div className="activity-time-teacher">{activity.time}</div>
                                        {activity.score && <div className="activity-score-teacher">SCORE: {activity.score}</div>}
                                        {activity.type === 'submission' && <Link to="#" className="review-link-teacher">Review Now</Link>}
                                    </div>
                                </div>
                            ))}
                            <Link to="/teacher/activity" className="show-all-activity-teacher">Show All Activity</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
