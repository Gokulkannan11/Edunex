import { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';

const Grades = () => {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        try {
            const response = await api.get('/student/grades');
            setGrades(response.data.data.grades);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load grades');
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (percentage) => {
        if (percentage >= 90) return 'var(--success)';
        if (percentage >= 75) return 'var(--info)';
        if (percentage >= 60) return 'var(--warning)';
        return 'var(--error)';
    };

    const getGradeLetter = (percentage) => {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    };

    // Calculate overall average
    const overallAverage = grades.length > 0
        ? Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length)
        : 0;

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading grades...</p>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Grades 📊</h1>
                <p className="page-subtitle">View your academic performance</p>
            </div>

            {/* Overall Summary */}
            <div className="grid grid-cols-3 mb-8">
                <div className="stat-card">
                    <div className="stat-value" style={{ color: getGradeColor(overallAverage) }}>
                        {overallAverage}%
                    </div>
                    <div className="stat-label">Overall Average</div>
                </div>

                <div className="stat-card success">
                    <div className="stat-value">{getGradeLetter(overallAverage)}</div>
                    <div className="stat-label">Grade Letter</div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">{grades.length}</div>
                    <div className="stat-label">Graded Assignments</div>
                </div>
            </div>

            {/* Grades Table */}
            {grades.length > 0 ? (
                <div className="card">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Assignment</th>
                                    <th>Course</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                    <th>Grade</th>
                                    <th>Graded On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map((grade) => (
                                    <tr key={grade.id}>
                                        <td>
                                            <strong>{grade.assignmentTitle}</strong>
                                            <span className={`badge badge-${grade.assignmentType === 'exam' ? 'danger' :
                                                    grade.assignmentType === 'project' ? 'warning' : 'primary'
                                                }`} style={{ marginLeft: '0.5rem' }}>
                                                {grade.assignmentType}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge badge-primary">{grade.course_code}</span>
                                            <div className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                                                {grade.course_name}
                                            </div>
                                        </td>
                                        <td>
                                            <strong>{grade.score}</strong> / {grade.max_score}
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    fontWeight: '600',
                                                    color: getGradeColor(grade.percentage)
                                                }}
                                            >
                                                {grade.percentage}%
                                            </div>
                                            {/* Mini progress bar */}
                                            <div style={{
                                                width: '60px',
                                                height: '4px',
                                                background: 'var(--gray-200)',
                                                borderRadius: '2px',
                                                marginTop: '0.25rem',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${grade.percentage}%`,
                                                    height: '100%',
                                                    background: getGradeColor(grade.percentage),
                                                    borderRadius: '2px'
                                                }} />
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    background: getGradeColor(grade.percentage),
                                                    color: 'white',
                                                    fontSize: '1rem',
                                                    padding: '0.25rem 0.75rem'
                                                }}
                                            >
                                                {getGradeLetter(grade.percentage)}
                                            </span>
                                        </td>
                                        <td className="text-muted">
                                            {format(new Date(grade.graded_at), 'MMM dd, yyyy')}
                                        </td>
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
                            <div className="empty-state-icon">📝</div>
                            <h3>No Grades Yet</h3>
                            <p className="text-muted">
                                Your grades will appear here once your assignments are graded.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Grade Scale Reference */}
            <div className="card mt-6">
                <div className="card-header">
                    <h4>📖 Grading Scale</h4>
                </div>
                <div className="card-body">
                    <div className="flex gap-6">
                        <div><span style={{ color: 'var(--success)', fontWeight: '600' }}>A</span>: 90-100%</div>
                        <div><span style={{ color: 'var(--info)', fontWeight: '600' }}>B</span>: 80-89%</div>
                        <div><span style={{ color: 'var(--warning)', fontWeight: '600' }}>C</span>: 70-79%</div>
                        <div><span style={{ color: 'var(--warning)', fontWeight: '600' }}>D</span>: 60-69%</div>
                        <div><span style={{ color: 'var(--error)', fontWeight: '600' }}>F</span>: Below 60%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grades;
