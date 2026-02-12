import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Assignments.css';

const Assignments = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('dueDate');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await api.get('/student/assignments');
            setAssignments(response.data.data || sampleAssignments);
        } catch (err) {
            setAssignments(sampleAssignments);
        } finally {
            setLoading(false);
        }
    };

    const sampleAssignments = [
        {
            id: 1,
            title: 'Advanced Algorithms Research Paper',
            course: 'CS302 - Computer Science Foundations',
            dueDate: 'Aug 10, 2025',
            points: 100,
            status: 'overdue',
            type: 'PROJECT',
            submitted: false
        },
        {
            id: 2,
            title: 'Differential Equations Problem Set 4',
            course: 'MATH204 - Calculus III',
            dueDate: 'Sep 15, 2025',
            points: 50,
            status: 'due-soon',
            type: 'HOMEWORK',
            submitted: false
        },
        {
            id: 3,
            title: 'UI/UX Design Case Study',
            course: 'DSN101 - Intro to Digital Design',
            dueDate: 'Oct 05, 2025',
            points: 75,
            status: 'on-track',
            type: 'HOMEWORK',
            submitted: true
        },
        {
            id: 4,
            title: 'Quarterly Physics Assessment',
            course: 'PHYS102 - Applied Mechanics',
            dueDate: 'Nov 20, 2025',
            points: 200,
            status: 'on-track',
            type: 'EXAM',
            submitted: false
        }
    ];

    const filteredAssignments = assignments.filter(a => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !a.submitted;
        if (filter === 'submitted') return a.submitted;
        if (filter === 'graded') return a.graded;
        return true;
    });

    return (
        <div className="assignments-page-stitch">
            {/* Header */}
            <div className="assignments-header-stitch">
                <div>
                    <h1 className="page-title-stitch">My Assignments</h1>
                    <p className="page-subtitle-stitch">
                        Track and submit your course assignments for the 2025-2026 Academic Year.
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs-stitch">
                <button
                    className={`filter-tab-stitch ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`filter-tab-stitch ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending
                </button>
                <button
                    className={`filter-tab-stitch ${filter === 'submitted' ? 'active' : ''}`}
                    onClick={() => setFilter('submitted')}
                >
                    Submitted
                </button>
                <button
                    className={`filter-tab-stitch ${filter === 'graded' ? 'active' : ''}`}
                    onClick={() => setFilter('graded')}
                >
                    Graded
                </button>
            </div>

            {/* Search and Sort */}
            <div className="search-sort-stitch">
                <div className="search-box-stitch">
                    <span className="search-icon-stitch">🔍</span>
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="sort-select-stitch"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="dueDate">Sort by Due Date</option>
                    <option value="title">Sort by Title</option>
                    <option value="points">Sort by Points</option>
                </select>
            </div>

            {/* Assignment Cards */}
            <div className="assignments-list-stitch">
                {filteredAssignments.map((assignment) => (
                    <div key={assignment.id} className={`assignment-card-stitch ${assignment.status}`}>
                        <div className="assignment-badges-stitch">
                            {assignment.status === 'overdue' && (
                                <span className="status-badge-stitch overdue">OVERDUE</span>
                            )}
                            {assignment.status === 'due-soon' && (
                                <span className="status-badge-stitch due-soon">DUE SOON</span>
                            )}
                            {assignment.status === 'on-track' && (
                                <span className="status-badge-stitch on-track">ON TRACK</span>
                            )}
                            <span className={`type-badge-stitch ${assignment.type.toLowerCase()}`}>
                                {assignment.type}
                            </span>
                        </div>

                        <h3 className="assignment-title-card">{assignment.title}</h3>
                        <p className="assignment-course-card">{assignment.course}</p>

                        <div className="assignment-meta-card">
                            <span>📅 Due {assignment.dueDate}</span>
                            <span>⭐ {assignment.points} Points</span>
                        </div>

                        <div className="assignment-footer-card">
                            <span className={`submission-status-stitch ${assignment.submitted ? 'submitted' : 'not-submitted'}`}>
                                {assignment.submitted ? 'SUBMITTED' : 'NOT SUBMITTED'}
                            </span>
                            {assignment.submitted ? (
                                <Link to={`/student/assignments/${assignment.id}`} className="btn-view-details-stitch">
                                    View Details
                                </Link>
                            ) : (
                                <Link to={`/student/assignments/${assignment.id}/submit`} className="btn-submit-stitch">
                                    Submit Now
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination-stitch">
                <p className="pagination-info-stitch">Showing {filteredAssignments.length} of 28 assignments</p>
                <div className="pagination-buttons-stitch">
                    <button className="page-btn-stitch">‹</button>
                    <button className="page-btn-stitch active">1</button>
                    <button className="page-btn-stitch">2</button>
                    <button className="page-btn-stitch">3</button>
                    <button className="page-btn-stitch">›</button>
                </div>
            </div>
        </div>
    );
};

export default Assignments;
