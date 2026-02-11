import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="landing-container">
                    <div className="nav-content">
                        <div className="nav-logo">
                            <span className="logo-text">EduNex</span>
                        </div>
                        <div className="nav-links">
                            <Link to="/login" className="nav-link">Sign in</Link>
                            <Link to="/register" className="btn-primary-nav">Get started</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="landing-container">
                    <div className="hero-content">
                        <div className="hero-badge">Modern Learning Platform</div>
                        <h1 className="hero-title">
                            Education management<br />
                            <span className="hero-title-accent">reimagined</span>
                        </h1>
                        <p className="hero-subtitle">
                            A unified platform connecting students, educators, and administrators.
                            Streamline coursework, track progress, and foster academic excellence.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/register" className="btn-hero-primary">
                                Get started
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </Link>
                            <Link to="/login" className="btn-hero-secondary">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Role Cards Section */}
            <section className="roles-section">
                <div className="landing-container">
                    <h2 className="section-title">One Platform, Three Experiences</h2>
                    <div className="roles-grid">
                        {/* Student Card */}
                        <div className="role-card student-card">
                            <div className="role-icon">📚</div>
                            <h3>For Students</h3>
                            <ul className="role-features">
                                <li>Track your courses</li>
                                <li>Submit assignments</li>
                                <li>View grades & progress</li>
                                <li>Monitor attendance</li>
                            </ul>
                            <Link to="/login" className="role-link">
                                Student Portal →
                            </Link>
                        </div>

                        {/* Teacher Card */}
                        <div className="role-card teacher-card">
                            <div className="role-icon">👨‍🏫</div>
                            <h3>For Teachers</h3>
                            <ul className="role-features">
                                <li>Manage classes</li>
                                <li>Create assignments</li>
                                <li>Mark attendance</li>
                                <li>Grade submissions</li>
                            </ul>
                            <Link to="/login" className="role-link">
                                Teacher Portal →
                            </Link>
                        </div>

                        {/* Admin Card */}
                        <div className="role-card admin-card">
                            <div className="role-icon">⚙️</div>
                            <h3>For Administrators</h3>
                            <ul className="role-features">
                                <li>User management</li>
                                <li>Course analytics</li>
                                <li>System monitoring</li>
                                <li>Department control</li>
                            </ul>
                            <Link to="/login" className="role-link">
                                Admin Portal →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="landing-container">
                    <h2 className="section-title">Everything You Need for Academic Excellence</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h4>Real-time Analytics</h4>
                            <p>Track student performance and course progress with comprehensive dashboards</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✅</div>
                            <h4>Attendance Management</h4>
                            <p>Automated attendance tracking with detailed reports and analytics</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📝</div>
                            <h4>Assignment System</h4>
                            <p>Create, submit, and grade assignments with flexible rubrics</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h4>Grade Tracking</h4>
                            <p>Comprehensive grade management with automatic calculations</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔐</div>
                            <h4>Role-Based Access</h4>
                            <p>Secure authentication with student, teacher, and admin roles</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h4>Responsive Design</h4>
                            <p>Access from any device with a seamless experience</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Database Architecture Section */}
            <section className="architecture-section">
                <div className="landing-container">
                    <h2 className="section-title">Built on Modern Database Architecture</h2>
                    <p className="section-subtitle">Polyglot persistence for optimal performance</p>

                    <div className="db-cards">
                        <div className="db-card mysql-card">
                            <div className="db-icon">🗄️</div>
                            <h4>MySQL</h4>
                            <p className="db-label">Relational Data</p>
                            <ul className="db-features">
                                <li>Users & Authentication</li>
                                <li>Courses & Enrollments</li>
                                <li>Grades & Attendance</li>
                            </ul>
                        </div>

                        <div className="db-card mongodb-card">
                            <div className="db-icon">📄</div>
                            <h4>MongoDB</h4>
                            <p className="db-label">Flexible Documents</p>
                            <ul className="db-features">
                                <li>Assignments & Content</li>
                                <li>Submissions & Files</li>
                                <li>Activity Logs</li>
                            </ul>
                        </div>
                    </div>

                    <div className="architecture-note">
                        <p>
                            <strong>Polyglot Persistence:</strong> Using the right database for the right job.
                            MySQL for ACID transactions and relational integrity, MongoDB for flexible schemas and high-write workloads.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="landing-container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Students Enrolled</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">25+</div>
                            <div className="stat-label">Active Courses</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">80+</div>
                            <div className="stat-label">Faculty Members</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">95%</div>
                            <div className="stat-label">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="landing-container">
                    <div className="cta-content">
                        <h2>Ready to Transform Your Institution?</h2>
                        <p>Join leading colleges using EduNex for modern learning management</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary-700)' }}>
                                Get Started Free
                            </Link>
                            <Link to="/login" className="btn btn-lg btn-secondary" style={{ borderColor: 'white', color: 'white' }}>
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h3>🎓 EduNex</h3>
                            <p>Connecting learning journeys</p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-column">
                                <h5>Product</h5>
                                <Link to="/login">Features</Link>
                                <Link to="/login">Pricing</Link>
                                <Link to="/login">Documentation</Link>
                            </div>
                            <div className="footer-column">
                                <h5>Company</h5>
                                <Link to="/login">About</Link>
                                <Link to="/login">Contact</Link>
                                <Link to="/login">Privacy</Link>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 EduNex. Built for MDBMS Project.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
