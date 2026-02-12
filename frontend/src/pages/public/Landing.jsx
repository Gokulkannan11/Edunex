import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-exact">
            {/* Navigation */}
            <nav className="nav-exact">
                <div className="nav-content">
                    <div className="nav-left">
                        <span className="nav-logo">🎓 EduNex</span>
                    </div>
                    <div className="nav-center">
                        <a href="#features">Features</a>
                        <a href="#students">Students</a>
                        <a href="#teachers">Teachers</a>
                        <a href="#pricing">Pricing</a>
                    </div>
                    <div className="nav-right">
                        <Link to="/login" className="nav-signin">Sign in</Link>
                        <Link to="/register" className="nav-cta">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-exact">
                <div className="hero-content">
                    <div className="hero-badge">🎓 TRUSTED LEARNING PLATFORM</div>
                    <h1 className="hero-heading">
                        Professional learning<br />
                        <span className="gradient-text">reimagined</span>
                    </h1>
                    <p className="hero-text">
                        Empower your students with a truly intelligent and LMS backed by the<br />
                        latest standards in education, analytics, and student success.
                    </p>
                    <Link to="/register" className="hero-button">Get Started</Link>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="stats-bar">
                <div className="stats-content">
                    <div className="stat">
                        <div className="stat-number">500+</div>
                        <div className="stat-text">Institutions</div>
                    </div>
                    <div className="stat">
                        <div className="stat-number">25+</div>
                        <div className="stat-text">Countries</div>
                    </div>
                    <div className="stat">
                        <div className="stat-number">80+</div>
                        <div className="stat-text">Integrations</div>
                    </div>
                    <div className="stat">
                        <div className="stat-number">95%</div>
                        <div className="stat-text">Satisfaction</div>
                    </div>
                </div>
            </section>

            {/* Tailored Experiences */}
            <section className="experiences-exact">
                <div className="section-container">
                    <h2 className="section-heading">Tailored Experiences</h2>
                    <p className="section-text">Custom-built solutions for every role in your educational ecosystem</p>

                    <div className="cards-grid">
                        <div className="exp-card">
                            <div className="card-icon-box blue-bg">🎓</div>
                            <h3 className="card-heading">Student Portal</h3>
                            <ul className="card-list">
                                <li>✓ Personalized Dashboard</li>
                                <li>✓ Assignment Tracker</li>
                                <li>✓ Grade Analytics</li>
                                <li>✓ Course Enrollment</li>
                            </ul>
                            <a href="#" className="card-link-text">Explore Portal →</a>
                        </div>

                        <div className="exp-card">
                            <div className="card-icon-box purple-bg">👨‍🏫</div>
                            <h3 className="card-heading">Teacher Suite</h3>
                            <ul className="card-list">
                                <li>✓ Course Management</li>
                                <li>✓ Grading Tools</li>
                                <li>✓ Analytics Dashboard</li>
                                <li>✓ Communication Hub</li>
                            </ul>
                            <a href="#" className="card-link-text">Manage Classes →</a>
                        </div>

                        <div className="exp-card">
                            <div className="card-icon-box green-bg">⚙️</div>
                            <h3 className="card-heading">Administrator</h3>
                            <ul className="card-list">
                                <li>✓ User Management</li>
                                <li>✓ System Analytics</li>
                                <li>✓ Course Oversight</li>
                                <li>✓ Reporting Tools</li>
                            </ul>
                            <a href="#" className="card-link-text">Open Console →</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Capabilities */}
            <section className="capabilities-exact">
                <div className="section-container">
                    <h2 className="section-heading">Core Capabilities</h2>
                    <p className="section-text">Enterprise-grade features built for modern education</p>

                    <div className="capabilities-grid">
                        <div className="cap-item">
                            <div className="cap-icon">📊</div>
                            <h4 className="cap-title">Data Analytics</h4>
                            <p className="cap-desc">Real-time insights into student performance and engagement</p>
                        </div>
                        <div className="cap-item">
                            <div className="cap-icon">📝</div>
                            <h4 className="cap-title">Assignments</h4>
                            <p className="cap-desc">Streamlined assignment creation, submission, and grading</p>
                        </div>
                        <div className="cap-item">
                            <div className="cap-icon">🔗</div>
                            <h4 className="cap-title">Integrations</h4>
                            <p className="cap-desc">Connect with your favorite tools and platforms seamlessly</p>
                        </div>
                        <div className="cap-item">
                            <div className="cap-icon">🎯</div>
                            <h4 className="cap-title">Goals</h4>
                            <p className="cap-desc">Set and track learning objectives with precision</p>
                        </div>
                        <div className="cap-item">
                            <div className="cap-icon">🔐</div>
                            <h4 className="cap-title">Access Control</h4>
                            <p className="cap-desc">Role-based permissions and enterprise-grade security</p>
                        </div>
                        <div className="cap-item">
                            <div className="cap-icon">📱</div>
                            <h4 className="cap-title">Responsive UI</h4>
                            <p className="cap-desc">Beautiful, intuitive interface that works on any device</p>
                        </div>
                    </div>
                </div>
            </section>



            {/* CTA Section */}
            <section className="cta-exact">
                <div className="cta-content">
                    <h2 className="cta-heading">Ready to Transform Your Institution?</h2>
                    <p className="cta-text">
                        Join EduNex to deliver world-class education with a platform built for the future of learning.
                    </p>
                    <div className="cta-buttons">
                        <Link to="/register" className="cta-btn-primary">Getting Started</Link>
                        <a href="#demo" className="cta-btn-secondary">Explore Demo</a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-exact">
                <div className="footer-main">
                    <div className="footer-brand">
                        <div className="footer-logo">🎓 EduNex</div>
                        <p className="footer-tagline">
                            A professional educational platform for modern institutions.
                        </p>
                    </div>
                    <div className="footer-columns">
                        <div className="footer-col">
                            <h4>Features</h4>
                            <a href="#">Students</a>
                            <a href="#">Teachers</a>
                            <a href="#">Administrators</a>
                            <a href="#">Analytics</a>
                        </div>
                        <div className="footer-col">
                            <h4>Resources</h4>
                            <a href="#">Documentation</a>
                            <a href="#">API</a>
                            <a href="#">Support</a>
                            <a href="#">Blog</a>
                        </div>
                        <div className="footer-col">
                            <h4>Company</h4>
                            <a href="#">About</a>
                            <a href="#">Careers</a>
                            <a href="#">Contact</a>
                            <a href="#">Press</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 EduNex LMS. All rights reserved.</p>
                    <div className="footer-legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Settings</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
