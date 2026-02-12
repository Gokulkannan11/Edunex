import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'student',
        agreeToTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState('');
    const { register, error, setError } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setValidationError('');
    };

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');
        setError(null);

        // Validation
        if (formData.password.length < 8) {
            setValidationError('Password must be at least 8 characters');
            return;
        }

        if (!formData.agreeToTerms) {
            setValidationError('Please agree to the Terms & Conditions');
            return;
        }

        setLoading(true);

        const result = await register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: formData.role
        });

        if (result.success) {
            navigate('/');
        }

        setLoading(false);
    };

    return (
        <div className="register-page-exact">
            <div className="register-container-exact">
                {/* Logo Section */}
                <div className="register-logo-section">
                    <div className="logo-icon-exact">🎓</div>
                    <h1 className="logo-title-exact">EduNex</h1>
                    <p className="logo-subtitle-exact">LEARNING MANAGEMENT SYSTEM</p>
                </div>

                {/* Form Section */}
                <div className="register-form-section">
                    <h2 className="form-title-exact">Create Account</h2>
                    <p className="form-subtitle-exact">Join EduNex to start your learning journey</p>

                    {(error || validationError) && (
                        <div className="error-alert-exact">
                            {error || validationError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="register-form-exact">
                        {/* Name Fields */}
                        <div className="name-row-exact">
                            <div className="form-field-exact">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div className="form-field-exact">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-field-exact">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="form-field-exact">
                            <label htmlFor="password">
                                Password
                                <span className="password-hint">MIN. 8 CHARACTERS</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="form-field-exact">
                            <label>I am a...</label>
                            <div className="role-buttons-exact">
                                <button
                                    type="button"
                                    className={`role-btn-exact ${formData.role === 'student' ? 'active' : ''}`}
                                    onClick={() => handleRoleSelect('student')}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    className={`role-btn-exact ${formData.role === 'teacher' ? 'active' : ''}`}
                                    onClick={() => handleRoleSelect('teacher')}
                                >
                                    Teacher
                                </button>
                                <button
                                    type="button"
                                    className={`role-btn-exact ${formData.role === 'admin' ? 'active' : ''}`}
                                    onClick={() => handleRoleSelect('admin')}
                                >
                                    Admin
                                </button>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="terms-checkbox-exact">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                            />
                            <label htmlFor="agreeToTerms">
                                I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="submit-btn-exact"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account →'}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className="register-footer-exact">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
