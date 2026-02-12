import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Courses.css';

const Courses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/teacher/courses');
            setCourses(response.data.data || sampleCourses);
        } catch (err) {
            setCourses(sampleCourses);
        }
    };

    const sampleCourses = [
        { id: 1, code: 'PHY-201', title: 'Advanced Physics', students: 32, assignments: 5, nextClass: 'Mon, 2:00 PM' },
        { id: 2, code: 'MAT-405', title: 'Linear Algebra', students: 28, assignments: 3, nextClass: 'Tue, 10:00 AM' },
        { id: 3, code: 'RES-301', title: 'Research Methodology', students: 24, assignments: 2, nextClass: 'Wed, 3:00 PM' }
    ];

    return (
        <div className="teacher-courses-page">
            <div className="page-header-stitch">
                <div>
                    <h1 className="page-title-stitch">My Courses</h1>
                    <p className="page-subtitle-stitch">Manage your courses and student enrollments.</p>
                </div>
                <Link to="/teacher/courses/create" className="btn-create-course">
                    + Create Course
                </Link>
            </div>

            <div className="courses-grid-teacher">
                {courses.map((course) => (
                    <div key={course.id} className="teacher-course-card">
                        <div className="course-header-teacher">
                            <span className="course-code-badge-teacher">{course.code}</span>
                            <span className="students-count-teacher">👥 {course.students}</span>
                        </div>
                        <h3 className="course-title-teacher">{course.title}</h3>
                        <div className="course-stats-teacher">
                            <div className="stat-item-teacher">
                                <span className="stat-label-teacher">Assignments</span>
                                <span className="stat-value-teacher">{course.assignments}</span>
                            </div>
                            <div className="stat-item-teacher">
                                <span className="stat-label-teacher">Next Class</span>
                                <span className="stat-value-teacher">{course.nextClass}</span>
                            </div>
                        </div>
                        <div className="course-actions-teacher">
                            <Link to={`/teacher/courses/${course.id}`} className="btn-manage">Manage</Link>
                            <Link to={`/teacher/courses/${course.id}/assignments`} className="btn-assignments">Assignments</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
