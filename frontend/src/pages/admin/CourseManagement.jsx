import { useState, useEffect } from 'react';
import api from '../../services/api';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [coursesRes, usersRes] = await Promise.all([
                api.get('/admin/courses'),
                api.get('/admin/users?role=teacher')
            ]);
            setCourses(coursesRes.data.data.courses);
            setTeachers(usersRes.data.data.users);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load data');
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

    return (
        <div>
            <div className="page-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="page-title">Course Management 📚</h1>
                        <p className="page-subtitle">Manage courses and assign teachers</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        ➕ Add Course
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-error mb-4">{error}</div>}

            {/* Courses Table */}
            <div className="card">
                <div className="card-header">
                    <span className="badge badge-primary">MySQL Table: courses</span>
                    <span className="text-sm text-muted" style={{ marginLeft: '0.5rem' }}>
                        {courses.length} courses
                    </span>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Credits</th>
                                <th>Semester</th>
                                <th>Enrolled</th>
                                <th>Teacher(s)</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td>
                                        <span className="badge badge-primary">{course.code}</span>
                                    </td>
                                    <td>
                                        <strong>{course.name}</strong>
                                        <div className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>
                                            {course.description?.substring(0, 50)}...
                                        </div>
                                    </td>
                                    <td>{course.department_name || '-'}</td>
                                    <td>{course.credits}</td>
                                    <td>{course.semester} {course.year}</td>
                                    <td>
                                        <span className="badge badge-success">
                                            {course.enrolled_count}/{course.max_students}
                                        </span>
                                    </td>
                                    <td>{course.teachers || 'Not assigned'}</td>
                                    <td>
                                        <span className={`badge ${course.is_active ? 'badge-success' : 'badge-danger'}`}>
                                            {course.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => setShowAssignModal(course)}
                                        >
                                            Assign Teacher
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Course Modal */}
            {showCreateModal && (
                <CreateCourseModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchData();
                    }}
                />
            )}

            {/* Assign Teacher Modal */}
            {showAssignModal && (
                <AssignTeacherModal
                    course={showAssignModal}
                    teachers={teachers}
                    onClose={() => setShowAssignModal(null)}
                    onSuccess={() => {
                        setShowAssignModal(null);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
};

// Create Course Modal
const CreateCourseModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        credits: 3,
        semester: 'Spring',
        year: 2025,
        maxStudents: 60
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post('/admin/courses', formData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                <div className="card-header flex justify-between items-center">
                    <h3>Create New Course</h3>
                    <button className="btn btn-sm btn-secondary" onClick={onClose}>✕</button>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-error mb-4">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Course Code</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="e.g., CS301"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Credits</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.credits}
                                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                                    min="1" max="6"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Course Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Database Management Systems"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input"
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Course description..."
                            />
                        </div>

                        <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Semester</label>
                                <select
                                    className="form-input"
                                    value={formData.semester}
                                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                >
                                    <option value="Spring">Spring</option>
                                    <option value="Fall">Fall</option>
                                    <option value="Summer">Summer</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Year</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Max Students</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.maxStudents}
                                    onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Course'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Assign Teacher Modal
const AssignTeacherModal = ({ course, teachers, onClose, onSuccess }) => {
    const [teacherId, setTeacherId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post(`/admin/courses/${course.id}/assign-teacher`, { teacherId: parseInt(teacherId) });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to assign teacher');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card-header flex justify-between items-center">
                    <h3>Assign Teacher</h3>
                    <button className="btn btn-sm btn-secondary" onClick={onClose}>✕</button>
                </div>
                <div className="card-body">
                    <p className="mb-4">
                        Assign a teacher to <strong>{course.code} - {course.name}</strong>
                    </p>

                    {error && <div className="alert alert-error mb-4">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Select Teacher</label>
                            <select
                                className="form-input"
                                value={teacherId}
                                onChange={(e) => setTeacherId(e.target.value)}
                                required
                            >
                                <option value="">Choose a teacher...</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.first_name} {teacher.last_name} ({teacher.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Assigning...' : 'Assign'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CourseManagement;
