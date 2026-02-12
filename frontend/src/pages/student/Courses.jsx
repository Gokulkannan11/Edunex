import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Courses.css';

const Courses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/student/courses');
            setCourses(response.data.data || sampleCourses);
        } catch (err) {
            setCourses(sampleCourses);
        } finally {
            setLoading(false);
        }
    };

    const sampleCourses = [
        {
            id: 1,
            code: 'CS302',
            title: 'Advanced Algorithms',
            instructor: 'Dr. Rajesh Kumar',
            progress: 75,
            nextClass: 'Mon, 10:00 AM',
            assignments: 3,
            grade: 'A'
        },
        {
            id: 2,
            code: 'MATH204',
            title: 'Calculus III',
            instructor: 'Prof. Priya Sharma',
            progress: 60,
            nextClass: 'Tue, 2:00 PM',
            assignments: 2,
            grade: 'A-'
        },
        {
            id: 3,
            code: 'DSN101',
            title: 'Digital Design',
            instructor: 'Dr. Amit Patel',
            progress: 85,
            nextClass: 'Wed, 11:00 AM',
            assignments: 1,
            grade: 'A+'
        }
    ];

    return (
        <div className="courses-page-stitch">
            <div className="page-header-stitch">
                <h1 className="page-title-stitch">My Courses</h1>
                <p className="page-subtitle-stitch">
                    View and manage your enrolled courses for Fall 2025.
                </p>
            </div>

            <div className="courses-grid-stitch">
                {courses.map((course) => (
                    <div key={course.id} className="course-card-stitch">
                        <div className="course-header-card">
                            <span className="course-code-badge">{course.code}</span>
                            <span className="course-grade-badge">{course.grade}</span>
                        </div>
                        <h3 className="course-title-card">{course.title}</h3>
                        <p className="course-instructor-card">👤 {course.instructor}</p>

                        <div className="course-progress-section">
                            <div className="progress-label-row">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${course.progress}%` }}></div>
                            </div>
                        </div>

                        <div className="course-meta-row">
                            <span>🕐 {course.nextClass}</span>
                            <span>📝 {course.assignments} pending</span>
                        </div>

                        <Link to={`/student/courses/${course.id}`} className="btn-view-course">
                            View Course
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
