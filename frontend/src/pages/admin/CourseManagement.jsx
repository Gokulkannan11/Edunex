import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './CourseManagement.css';

const sampleCourses = [
    { id: 1, code: 'CS302', title: 'Advanced Algorithms', instructor: 'Dr. Rajesh Kumar', students: 32, status: 'active' },
    { id: 2, code: 'MATH204', title: 'Calculus III', instructor: 'Prof. Priya Sharma', students: 28, status: 'active' },
    { id: 3, code: 'DSN101', title: 'Digital Design', instructor: 'Dr. Amit Patel', students: 24, status: 'active' }
];

const CourseManagement = () => {
    const [courses, setCourses] = useState(sampleCourses);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        credits: 3,
        semester: 'Fall',
        year: 2025,
        maxStudents: 60
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/admin/courses');
            setCourses(response.data.courses || sampleCourses);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setCourses(sampleCourses);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/admin/courses', formData);
            console.log('Course created successfully:', response.data);

            // Close modal and reset form
            setShowModal(false);
            setFormData({ code: '', name: '', description: '', credits: 3, semester: 'Fall', year: 2025, maxStudents: 60 });

            // Refresh the course list
            await fetchCourses();
        } catch (err) {
            console.error('Error creating course:', err);
            setError(err.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="course-management-page">
            <div className="page-header-stitch">
                <div>
                    <h1 className="page-title-stitch">Course Management</h1>
                    <p className="page-subtitle-stitch">Manage all courses, instructors, and enrollments.</p>
                </div>
                <button className="btn-add-course" onClick={() => setShowModal(true)}>+ Add Course</button>
            </div>

            <div className="courses-table-admin">
                <div className="table-header-courses">
                    <div>CODE</div>
                    <div>COURSE TITLE</div>
                    <div>INSTRUCTOR</div>
                    <div>STUDENTS</div>
                    <div>STATUS</div>
                    <div>ACTIONS</div>
                </div>
                {courses.map((course) => (
                    <div key={course.id} className="table-row-courses">
                        <div className="code-cell">{course.code}</div>
                        <div className="title-cell">{course.name || course.title}</div>
                        <div className="instructor-cell">{course.teachers || course.instructor || 'TBA'}</div>
                        <div className="students-cell">{course.enrolled_count || course.students || 0}</div>
                        <div>
                            <span className={`status-badge ${course.is_active !== undefined ? (course.is_active ? 'active' : 'inactive') : course.status}`}>
                                {course.is_active !== undefined ? (course.is_active ? 'active' : 'inactive') : course.status}
                            </span>
                        </div>
                        <div className="actions-cell">
                            <button className="btn-action">Edit</button>
                            <button className="btn-action">View</button>
                            <button className="btn-action danger">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Course Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Course</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddCourse}>
                            {error && <div className="alert-error">{error}</div>}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Course Code</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="CS301"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Credits</label>
                                    <input
                                        type="number"
                                        value={formData.credits}
                                        onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                                        min="1"
                                        max="6"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Course Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Introduction to Computer Science"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Course description..."
                                    rows="3"
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Semester</label>
                                    <select
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                    >
                                        <option value="Fall">Fall</option>
                                        <option value="Spring">Spring</option>
                                        <option value="Summer">Summer</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Year</label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        min="2025"
                                        max="2030"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Max Students</label>
                                <input
                                    type="number"
                                    value={formData.maxStudents}
                                    onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                                    min="10"
                                    max="200"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagement;
