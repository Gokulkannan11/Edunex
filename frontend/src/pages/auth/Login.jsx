import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, error, setError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await login(email, password);

        if (result.success) {
            // Navigate based on role (handled by App.jsx redirect)
            navigate('/');
        }

        setLoading(false);
    };

    // Quick login buttons for demo
    const quickLogin = async (role) => {
        const credentials = {
            student: { email: 'arjun@student.lms.edu', password: 'student123' },
            teacher: { email: 'dr.sharma@lms.edu', password: 'teacher123' },
            admin: { email: 'admin@lms.edu', password: 'admin123' }
        };

        setEmail(credentials[role].email);
        setPassword(credentials[role].password);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <h1>🎓 EduNex</h1>
                    <p className="text-muted" style={{ marginTop: '0.5rem' }}>
                        Learning Management System
                    </p>
                </div>

                <div className="auth-title">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Quick Login for Demo */}
                <div style={{ marginTop: '1.5rem' }}>
                    <p className="text-sm text-muted text-center mb-2">Quick Demo Login:</p>
                    <div className="flex gap-2" style={{ justifyContent: 'center' }}>
                        <button
                            type="button"
                            className="btn btn-sm"
                            style={{ background: 'var(--student-color)', color: 'white' }}
                            onClick={() => quickLogin('student')}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm"
                            style={{ background: 'var(--teacher-color)', color: 'white' }}
                            onClick={() => quickLogin('teacher')}
                        >
                            Teacher
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm"
                            style={{ background: 'var(--admin-color)', color: 'white' }}
                            onClick={() => quickLogin('admin')}
                        >
                            Admin
                        </button>
                    </div>
                </div>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
