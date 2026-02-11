import { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, submitted, overdue

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await api.get('/student/assignments');
            setAssignments(response.data.data.assignments);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    const filteredAssignments = assignments.filter(a => {
        if (filter === 'pending') return !a.isSubmitted && !a.isPastDue;
        if (filter === 'submitted') return a.isSubmitted;
        if (filter === 'overdue') return !a.isSubmitted && a.isPastDue;
        return true;
    });

    const getStatusBadge = (assignment) => {
        if (assignment.isSubmitted) {
            return <span className="badge badge-success">Submitted</span>;
        }
        if (assignment.isPastDue) {
            return <span className="badge badge-danger">Overdue</span>;
        }
        return <span className="badge badge-warning">Pending</span>;
    };

    const getTypeBadge = (type) => {
        const colors = {
            quiz: 'badge-primary',
            homework: 'badge-success',
            project: 'badge-warning',
            exam: 'badge-danger'
        };
        return <span className={`badge ${colors[type] || 'badge-primary'}`}>{type}</span>;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading assignments...</p>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    return (
        <div>
            <div className="page-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="page-title">Assignments 📝</h1>
                        <p className="page-subtitle">Track your assignments and submissions</p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {['all', 'pending', 'submitted', 'overdue'].map((f) => (
                    <button
                        key={f}
                        className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter(f)}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {filteredAssignments.length > 0 ? (
                <div className="card">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Assignment</th>
                                    <th>Course</th>
                                    <th>Type</th>
                                    <th>Due Date</th>
                                    <th>Max Score</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssignments.map((assignment) => (
                                    <tr key={assignment._id}>
                                        <td>
                                            <strong>{assignment.title}</strong>
                                            <div className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                                                {assignment.description?.substring(0, 60)}...
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-primary">{assignment.courseCode}</span>
                                            <div className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                                                {assignment.courseName}
                                            </div>
                                        </td>
                                        <td>{getTypeBadge(assignment.type)}</td>
                                        <td>
                                            <div>{format(new Date(assignment.dueDate), 'MMM dd, yyyy')}</div>
                                            <div className="text-sm text-muted">
                                                {format(new Date(assignment.dueDate), 'hh:mm a')}
                                            </div>
                                        </td>
                                        <td>{assignment.maxScore} pts</td>
                                        <td>{getStatusBadge(assignment)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div className="empty-state">
                            <div className="empty-state-icon">📋</div>
                            <h3>No Assignments Found</h3>
                            <p className="text-muted">
                                {filter === 'all'
                                    ? 'You have no assignments at the moment.'
                                    : `No ${filter} assignments.`}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assignments;
