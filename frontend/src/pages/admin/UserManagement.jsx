import { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams();
            if (filter) params.append('role', filter);
            if (search) params.append('search', search);

            const response = await api.get(`/admin/users?${params.toString()}`);
            setUsers(response.data.data.users);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            await api.put(`/admin/users/${userId}`, { isActive: !currentStatus });
            fetchUsers();
        } catch (err) {
            alert('Failed to update user status');
        }
    };

    const getRoleBadge = (role) => {
        const badges = {
            student: 'badge-student',
            teacher: 'badge-teacher',
            admin: 'badge-admin'
        };
        return <span className={`badge ${badges[role]}`}>{role}</span>;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="page-title">User Management 👥</h1>
                        <p className="page-subtitle">Manage system users and roles</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        ➕ Add User
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-error mb-4">{error}</div>}

            {/* Filters */}
            <div className="card mb-6">
                <div className="card-body">
                    <div className="flex gap-4 items-center">
                        <form onSubmit={handleSearch} className="flex gap-2" style={{ flex: 1 }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ maxWidth: '300px' }}
                            />
                            <button type="submit" className="btn btn-secondary">Search</button>
                        </form>

                        <div className="flex gap-2">
                            <button
                                className={`btn ${filter === '' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter('')}
                            >
                                All
                            </button>
                            <button
                                className={`btn ${filter === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter('student')}
                            >
                                Students
                            </button>
                            <button
                                className={`btn ${filter === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter('teacher')}
                            >
                                Teachers
                            </button>
                            <button
                                className={`btn ${filter === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter('admin')}
                            >
                                Admins
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card">
                <div className="card-header">
                    <span className="badge badge-primary">MySQL Table: users</span>
                    <span className="text-sm text-muted" style={{ marginLeft: '0.5rem' }}>
                        {users.length} users found
                    </span>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="text-muted">{user.id}</td>
                                    <td>
                                        <strong>{user.first_name} {user.last_name}</strong>
                                    </td>
                                    <td className="text-muted">{user.email}</td>
                                    <td>{getRoleBadge(user.role)}</td>
                                    <td>{user.department_name || '-'}</td>
                                    <td>
                                        <span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="text-muted text-sm">
                                        {format(new Date(user.created_at), 'MMM dd, yyyy')}
                                    </td>
                                    <td>
                                        <button
                                            className={`btn btn-sm ${user.is_active ? 'btn-danger' : 'btn-success'}`}
                                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                                        >
                                            {user.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchUsers();
                    }}
                />
            )}
        </div>
    );
};

// Create User Modal Component
const CreateUserModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'student'
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await api.post('/admin/users', formData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="card-header flex justify-between items-center">
                    <h3>Create New User</h3>
                    <button className="btn btn-sm btn-secondary" onClick={onClose}>✕</button>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-error mb-4">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select
                                className="form-input"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create User'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
