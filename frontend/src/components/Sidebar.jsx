import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Multi-role navigation structure (as per Stitch Admin Dashboard design)
    const allMenuSections = {
        studentPortal: {
            title: 'STUDENT PORTAL',
            items: [
                { path: '/student', label: 'Dashboard', icon: '📊', roles: ['student', 'admin'] },
                { path: '/student/courses', label: 'Courses', icon: '📚', roles: ['student', 'admin'] },
                { path: '/student/assignments', label: 'Assignments', icon: '📝', roles: ['student', 'admin'] },
                { path: '/student/grades', label: 'Grades', icon: '⭐', roles: ['student', 'admin'] },
                { path: '/student/enroll', label: 'Enroll', icon: '➕', roles: ['student', 'admin'] },
            ]
        },
        teacherTools: {
            title: 'TEACHER TOOLS',
            items: [
                { path: '/teacher', label: 'Class Dashboard', icon: '📈', roles: ['teacher', 'admin'] },
                { path: '/teacher/assignments/create', label: 'Create Assignment', icon: '✏️', roles: ['teacher', 'admin'] },
                { path: '/teacher/attendance', label: 'Attendance', icon: '✅', roles: ['teacher', 'admin'] },
            ]
        },
        administration: {
            title: 'ADMINISTRATION',
            items: [
                { path: '/admin', label: 'Dashboard', icon: '🎯', roles: ['admin'] },
                { path: '/admin/users', label: 'Users', icon: '👥', roles: ['admin'] },
                { path: '/admin/courses', label: 'Courses', icon: '📚', roles: ['admin'] },
                { path: '/admin/reports', label: 'Reports', icon: '📄', roles: ['admin'] },
            ]
        }
    };

    // Filter sections based on user role
    const getVisibleSections = () => {
        const sections = [];

        Object.entries(allMenuSections).forEach(([key, section]) => {
            const visibleItems = section.items.filter(item =>
                item.roles.includes(user?.role)
            );

            if (visibleItems.length > 0) {
                sections.push({
                    ...section,
                    items: visibleItems
                });
            }
        });

        return sections;
    };

    const visibleSections = getVisibleSections();

    // Get user display name (Indian name format)
    const getUserDisplayName = () => {
        if (!user) return '';
        return `${user.firstName} ${user.lastName}`;
    };

    // Get user ID
    const getUserId = () => {
        if (!user) return '';
        // Format: ID: 248012 (from Stitch design)
        return user.userId || user.id || '248012';
    };

    return (
        <aside className="sidebar-new">
            {/* Logo Section */}
            <div className="sidebar-logo">
                <div className="logo-icon">🎓</div>
                <span className="logo-text">EduNex</span>
            </div>

            {/* Navigation Sections */}
            <nav className="sidebar-nav">
                {visibleSections.map((section, index) => (
                    <div key={index} className="nav-section">
                        <div className="nav-section-title">{section.title}</div>
                        {section.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === `/${user?.role}` || item.path === '/admin'}
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? 'nav-item-active' : ''}`
                                }
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* User Profile Section (Bottom) */}
            <div className="sidebar-user">
                <div className="user-info">
                    <div className="user-avatar">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div className="user-details">
                        <div className="user-name">{getUserDisplayName()}</div>
                        <div className="user-id">ID: {getUserId()}</div>
                    </div>
                </div>

                {/* Logout Button */}
                <button onClick={handleLogout} className="logout-btn">
                    <span className="logout-icon">🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
