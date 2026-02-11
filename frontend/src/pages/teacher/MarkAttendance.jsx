import { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';

const MarkAttendance = () => {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/teacher/courses');
            setCourses(response.data.data.courses);
        } catch (err) {
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = async (courseId) => {
        setSelectedCourse(courseId);
        if (!courseId) {
            setStudents([]);
            return;
        }

        setLoadingStudents(true);
        try {
            const response = await api.get(`/teacher/courses/${courseId}/students`);
            const studentList = response.data.data.students;
            setStudents(studentList);

            // Initialize attendance with all present
            const initialAttendance = {};
            studentList.forEach(s => {
                initialAttendance[s.enrollment_id] = 'present';
            });
            setAttendance(initialAttendance);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleAttendanceChange = (enrollmentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [enrollmentId]: status
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const attendanceRecords = Object.entries(attendance).map(([enrollmentId, status]) => ({
                enrollmentId: parseInt(enrollmentId),
                status
            }));

            await api.post('/teacher/attendance', {
                courseId: parseInt(selectedCourse),
                date: selectedDate,
                attendanceRecords
            });

            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to mark attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const presentCount = Object.values(attendance).filter(s => s === 'present').length;
    const absentCount = Object.values(attendance).filter(s => s === 'absent').length;
    const lateCount = Object.values(attendance).filter(s => s === 'late').length;

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Mark Attendance ✅</h1>
                <p className="page-subtitle">Record student attendance for your classes</p>
            </div>

            <div className="card mb-6">
                <div className="card-header">
                    <div className="flex items-center gap-2">
                        <span className="badge badge-success">MySQL Table</span>
                        <span className="text-sm text-muted">Attendance is stored in MySQL</span>
                    </div>
                </div>
                <div className="card-body">
                    <div className="grid grid-cols-2" style={{ gap: '1rem', maxWidth: '500px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Select Course</label>
                            <select
                                className="form-input"
                                value={selectedCourse}
                                onChange={(e) => handleCourseChange(e.target.value)}
                            >
                                <option value="">Choose a course</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.code} - {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-error mb-4">{error}</div>}
            {success && <div className="alert alert-success mb-4">✅ Attendance marked successfully!</div>}

            {loadingStudents ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading students...</p>
                </div>
            ) : students.length > 0 ? (
                <form onSubmit={handleSubmit}>
                    {/* Summary */}
                    <div className="flex gap-4 mb-4">
                        <div className="badge badge-success" style={{ padding: '0.5rem 1rem' }}>
                            Present: {presentCount}
                        </div>
                        <div className="badge badge-danger" style={{ padding: '0.5rem 1rem' }}>
                            Absent: {absentCount}
                        </div>
                        <div className="badge badge-warning" style={{ padding: '0.5rem 1rem' }}>
                            Late: {lateCount}
                        </div>
                    </div>

                    <div className="card">
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.enrollment_id}>
                                            <td>
                                                <strong>{student.first_name} {student.last_name}</strong>
                                            </td>
                                            <td className="text-muted">{student.email}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    {['present', 'absent', 'late'].map((status) => (
                                                        <button
                                                            key={status}
                                                            type="button"
                                                            className={`btn btn-sm ${attendance[student.enrollment_id] === status
                                                                    ? status === 'present' ? 'btn-success' :
                                                                        status === 'absent' ? 'btn-danger' : ''
                                                                    : 'btn-secondary'
                                                                }`}
                                                            style={
                                                                attendance[student.enrollment_id] === status && status === 'late'
                                                                    ? { background: 'var(--warning)', color: 'white' }
                                                                    : {}
                                                            }
                                                            onClick={() => handleAttendanceChange(student.enrollment_id, status)}
                                                        >
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>
                </form>
            ) : selectedCourse ? (
                <div className="card">
                    <div className="card-body text-center text-muted">
                        No students enrolled in this course.
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="card-body text-center text-muted">
                        Select a course to mark attendance.
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarkAttendance;
