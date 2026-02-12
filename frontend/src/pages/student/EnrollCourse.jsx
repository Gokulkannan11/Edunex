import { useState, useEffect } from 'react';
import api from '../../services/api';

const EnrollCourse = () => {
    const [availableCourses, setAvailableCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            // Get enrolled courses
            const enrolledRes = await api.get('/student/courses');
            const enrolled = enrolledRes.data.data.courses;
            setEnrolledCourses(enrolled);

            // Get all available courses
            const allCoursesRes = await api.get('/student/available-courses');
            const all = allCoursesRes.data.data.courses;

            // Filter out already enrolled courses
            const enrolledIds = enrolled.map(c => c.id);
            const available = all.filter(c => !enrolledIds.includes(c.id));
            setAvailableCourses(available);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        try {
            setError(null);
            setSuccess(null);

            // CREATE operation - Insert into MySQL enrollments table
            await api.post(`/student/enroll/${courseId}`);

            setSuccess('✅ Successfully enrolled! This created a new record in MySQL enrollments table.');

            // Refresh the lists
            setTimeout(() => {
                fetchCourses();
                setSuccess(null);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Enrollment failed');
        }
    };

    const handleUnenroll = async (courseId) => {
        if (!confirm('Are you sure you want to drop this course?')) return;

        try {
            setError(null);
            setSuccess(null);

            // DELETE operation - Remove from MySQL enrollments table
            await api.delete(`/student/unenroll/${courseId}`);

            setSuccess('✅ Course dropped! This deleted the record from MySQL enrollments table.');

            // Refresh the lists
            setTimeout(() => {
                fetchCourses();
                setSuccess(null);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to drop course');
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

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Enroll in Courses 📚</h1>
                <p className="page-subtitle">Browse and enroll in available courses</p>
            </div>



            {error && <div className="alert alert-error mb-4">{error}</div>}
            {success && <div className="alert alert-success mb-4">{success}</div>}

            {/* Currently Enrolled Courses */}
            <h3 className="mb-4">📖 My Enrolled Courses ({enrolledCourses.length})</h3>
            {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-2 mb-8">
                    {enrolledCourses.map((course) => (
                        <div key={course.id} className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                            <div className="card-header" style={{ background: 'var(--success-light)' }}>
                                <div className="flex justify-between items-center">
                                    <span className="badge badge-success">{course.code}</span>
                                    <span className="text-sm text-muted">{course.credits} Credits</span>
                                </div>
                                <h4 style={{ marginTop: '0.75rem', marginBottom: '0' }}>{course.name}</h4>
                            </div>
                            <div className="card-body">
                                <p className="text-muted text-sm mb-4">
                                    {course.description || 'No description available'}
                                </p>

                                <div className="flex justify-between items-center">
                                    <div className="text-sm">
                                        <div className="text-muted">Instructor: <strong>{course.teacher_name || 'TBA'}</strong></div>
                                        <div className="text-muted">Status: <span className="badge badge-success">{course.enrollment_status}</span></div>
                                    </div>

                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleUnenroll(course.id)}
                                    >
                                        Drop Course
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card mb-8">
                    <div className="card-body text-center text-muted">
                        You haven't enrolled in any courses yet. Browse available courses below.
                    </div>
                </div>
            )}

            {/* Available Courses */}
            <h3 className="mb-4">🌟 Available Courses ({availableCourses.length})</h3>
            {availableCourses.length > 0 ? (
                <div className="grid grid-cols-2">
                    {availableCourses.map((course) => (
                        <div key={course.id} className="card">
                            <div className="card-header" style={{ background: 'var(--primary-50)' }}>
                                <div className="flex justify-between items-center">
                                    <span className="badge badge-primary">{course.code}</span>
                                    <span className="text-sm text-muted">{course.credits} Credits</span>
                                </div>
                                <h4 style={{ marginTop: '0.75rem', marginBottom: '0' }}>{course.name}</h4>
                            </div>
                            <div className="card-body">
                                <p className="text-muted text-sm mb-4">
                                    {course.description || 'No description available'}
                                </p>

                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-sm">
                                        <div className="text-muted">Department: <strong>{course.department_name || 'N/A'}</strong></div>
                                        <div className="text-muted">Semester: <strong>{course.semester} {course.year}</strong></div>
                                    </div>
                                    <div className="text-sm text-center">
                                        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary-600)' }}>
                                            {course.enrolled_count || 0}/{course.max_students}
                                        </div>
                                        <div className="text-muted">Seats</div>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                    onClick={() => handleEnroll(course.id)}
                                    disabled={course.enrolled_count >= course.max_students}
                                >
                                    {course.enrolled_count >= course.max_students ? '🔒 Course Full' : '➕ Enroll Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <div className="card-body text-center text-muted">
                        🎉 You're enrolled in all available courses!
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnrollCourse;
