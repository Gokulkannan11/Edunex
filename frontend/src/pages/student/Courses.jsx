import { useState, useEffect } from 'react';
import api from '../../services/api';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/student/courses');
            setCourses(response.data.data.courses);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading courses...</p>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">My Courses 📚</h1>
                <p className="page-subtitle">View your enrolled courses and progress</p>
            </div>

            {courses.length > 0 ? (
                <div className="grid grid-cols-2">
                    {courses.map((course) => (
                        <div key={course.id} className="card">
                            <div className="card-header" style={{ background: 'var(--primary-50)' }}>
                                <div className="flex justify-between items-center">
                                    <span className="badge badge-primary">{course.code}</span>
                                    <span className="text-sm text-muted">{course.credits} Credits</span>
                                </div>
                                <h3 style={{ marginTop: '0.75rem', marginBottom: '0' }}>{course.name}</h3>
                            </div>
                            <div className="card-body">
                                <p className="text-muted text-sm" style={{ marginBottom: '1rem' }}>
                                    {course.description || 'No description available'}
                                </p>

                                <div className="flex gap-4 text-sm">
                                    <div>
                                        <span className="text-muted">Instructor:</span>
                                        <span style={{ marginLeft: '0.25rem', fontWeight: '500' }}>
                                            {course.teacher_name || 'TBA'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted">Department:</span>
                                        <span style={{ marginLeft: '0.25rem', fontWeight: '500' }}>
                                            {course.department_name || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <span className="badge badge-success">
                                        {course.semester} {course.year}
                                    </span>
                                    <span className="badge badge-primary">
                                        {course.enrollment_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <h3>No Courses Yet</h3>
                            <p className="text-muted">
                                You haven't enrolled in any courses yet.
                                Contact your administrator to get started.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Courses;
