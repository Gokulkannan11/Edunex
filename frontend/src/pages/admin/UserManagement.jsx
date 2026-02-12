import { useState, useEffect } from 'react';
import api from '../../services/api';
import './UserManagement.css';

const sampleUsers = [
    { id: 1, name: 'Arjun Mehta', email: 'arjun.mehta@example.com', role: 'student', status: 'active', joinDate: 'Aug 15, 2025' },
    { id: 2, name: 'Dr. Priya Sharma', email: 'priya.sharma@example.com', role: 'teacher', status: 'active', joinDate: 'Aug 01, 2025' },
    { id: 3, name: 'Kavya Reddy', email: 'kavya.reddy@example.com', role: 'student', status: 'active', joinDate: 'Sep 10, 2025' },
    { id: 4, name: 'Prof. Rajesh Kumar', email: 'rajesh.kumar@example.com', role: 'teacher', status: 'active', joinDate: 'Jul 28, 2025' }
];

const UserManagement = () => {
    const [users, setUsers] = useState(sampleUsers);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.users || sampleUsers);
        } catch (err) {
            console.error('Error fetching users:', err);
            setUsers(sampleUsers);
        }
    };

    const filteredUsers = users.filter(u => {
        if (filter !== 'all' && u.role !== filter) return false;
        if (searchTerm && !u.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !`${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        console.log('Submitting user data:', formData);

        try {
            const response = await api.post('/admin/users', formData);
            console.log('✅ User created successfully:', response.data);

            // Show success and close modal
            setSuccess('User created successfully!');
            setShowModal(false);
            setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'student' });

            // Refresh the user list immediately
            console.log('Refreshing user list...');
            await fetchUsers();
            console.log('User list refreshed');

        } catch (err) {
            console.error('❌ Error creating user:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
            setError(err.response?.data?.message || err.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-management-page">
            <div className="page-header-stitch">
                <div>
                    <h1 className="page-title-stitch">User Management</h1>
                    <p className="page-subtitle-stitch">Manage all users, roles, and permissions.</p>
                </div>
                <button className="btn-add-user" onClick={() => setShowModal(true)}>+ Add User</button>
            </div>

            <div className="controls-row-stitch">
                <div className="search-box-admin">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-buttons-admin">
                    <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
                    <button className={filter === 'student' ? 'active' : ''} onClick={() => setFilter('student')}>Students</button>
                    <button className={filter === 'teacher' ? 'active' : ''} onClick={() => setFilter('teacher')}>Teachers</button>
                    <button className={filter === 'admin' ? 'active' : ''} onClick={() => setFilter('admin')}>Admins</button>
                </div>
            </div>

            <div className="users-table-stitch">
                <div className="table-header-admin">
                    <div>USER</div>
                    <div>EMAIL</div>
                    <div>ROLE</div>
                    <div>STATUS</div>
                    <div>JOIN DATE</div>
                    <div>ACTIONS</div>
                </div>
                {filteredUsers.map((user) => (
                    <div key={user.id} className="table-row-admin">
                        <div className="user-cell">
                            <div className="user-avatar">👤</div>
                            <span className="user-name">
                                {user.first_name || user.name?.split(' ')[0]} {user.last_name || user.name?.split(' ')[1]}
                            </span>
                        </div>
                        <div className="email-cell">{user.email}</div>
                        <div>
                            <span className={`role-badge ${user.role}`}>{user.role}</span>
                        </div>
                        <div>
                            <span className={`status-badge ${user.is_active !== undefined ? (user.is_active ? 'active' : 'inactive') : user.status}`}>
                                {user.is_active !== undefined ? (user.is_active ? 'active' : 'inactive') : user.status}
                            </span>
                        </div>
                        <div className="date-cell">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : user.joinDate}
                        </div>
                        <div className="actions-cell">
                            <button className="btn-action">Edit</button>
                            <button className="btn-action danger">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New User</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddUser}>
                            {error && <div className="alert-error">{error}</div>}
                            {success && <div className="alert-success">{success}</div>}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
