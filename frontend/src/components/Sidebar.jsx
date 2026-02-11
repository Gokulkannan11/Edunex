import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Menu items based on role
    const menuItems = {
        student: [
            { path: '/student', label: 'Dashboard', icon: '🏠' },
            { path: '/student/courses', label: 'My Courses', icon: '📚' },
            { path: '/student/enroll', label: 'Enroll Course', icon: '➕' },
            { path: '/student/assignments', label: 'Assignments', icon: '📝' },
            { path: '/student/grades', label: 'Grades', icon: '📊' },
        ],
        teacher: [
            { path: '/teacher', label: 'Dashboard', icon: '🏠' },
            { path: '/teacher/courses', label: 'My Courses', icon: '📚' },
            { path: '/teacher/assignments/create', label: 'Create Assignment', icon: '➕' },
            { path: '/teacher/attendance', label: 'Mark Attendance', icon: '✅' },
        ],
        admin: [
            { path: '/admin', label: 'Dashboard', icon: '🏠' },
            { path: '/admin/users', label: 'User Management', icon: '👥' },
            { path: '/admin/courses', label: 'Course Management', icon: '📚' },
        ]
    };

    const currentMenu = menuItems[user?.role] || [];

    const roleColors = {
        student: 'var(--student-color)',
        teacher: 'var(--teacher-color)',
        admin: 'var(--admin-color)'
    };

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    🎓 EduNex
                </h1>
            </div>

            {/* User Info */}
            <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2rem'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.5rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: roleColors[user?.role],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        color: 'white'
                    }}>
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div>
                        <div style={{ fontWeight: '500', color: 'var(--white)' }}>
                            {user?.firstName} {user?.lastName}
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--gray-400)',
                            textTransform: 'capitalize'
                        }}>
                            {user?.role}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav>
                {currentMenu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === `/${user?.role}`}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            color: isActive ? 'var(--white)' : 'var(--gray-400)',
                            background: isActive ? 'var(--primary-600)' : 'transparent',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '0.25rem',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                        })}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '1.5rem',
                right: '1.5rem'
            }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--gray-300)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    🚪 Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
