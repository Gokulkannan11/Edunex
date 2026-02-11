import { useState, useEffect } from 'react';
import api from '../../services/api';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/teacher/courses');
            setCourses(response.data.data.courses);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async (courseId) => {
        setLoadingStudents(true);
        try {
            const response = await api.get(`/teacher/courses/${courseId}/students`);
            setStudents(response.data.data.students);
            setSelectedCourse(courses.find(c => c.id === courseId));
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingStudents(false);
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
                <p className="page-subtitle">View your assigned courses and enrolled students</p>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                {/* Courses List */}
                <div>
                    <h3 className="mb-4">Courses ({courses.length})</h3>
                    {courses.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="card"
                                    style={{
                                        cursor: 'pointer',
                                        border: selectedCourse?.id === course.id
                                            ? '2px solid var(--teacher-color)'
                                            : '1px solid var(--gray-200)'
                                    }}
                                    onClick={() => fetchStudents(course.id)}
                                >
                                    <div className="card-body">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="badge badge-teacher">{course.code}</span>
                                            <span className="text-sm text-muted">{course.credits} Credits</span>
                                        </div>
                                        <h4 style={{ marginBottom: '0.5rem' }}>{course.name}</h4>
                                        <p className="text-sm text-muted mb-2">
                                            {course.department_name} • {course.semester} {course.year}
                                        </p>
                                        <div className="flex gap-4">
                                            <span className="badge badge-success">
                                                👥 {course.student_count} Students
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-body text-center text-muted">
                                No courses assigned yet.
                            </div>
                        </div>
                    )}
                </div>

                {/* Students List */}
                <div>
                    <h3 className="mb-4">
                        {selectedCourse ? `Students in ${selectedCourse.code}` : 'Select a Course'}
                    </h3>

                    {loadingStudents ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                        </div>
                    ) : selectedCourse ? (
                        students.length > 0 ? (
                            <div className="card">
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Department</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student) => (
                                                <tr key={student.id}>
                                                    <td>
                                                        <strong>{student.first_name} {student.last_name}</strong>
                                                    </td>
                                                    <td className="text-muted">{student.email}</td>
                                                    <td>
                                                        <span className="badge badge-primary">
                                                            {student.department_name || 'N/A'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="card">
                                <div className="card-body text-center text-muted">
                                    No students enrolled in this course.
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="card">
                            <div className="card-body text-center text-muted">
                                👈 Click on a course to view enrolled students
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Courses;
