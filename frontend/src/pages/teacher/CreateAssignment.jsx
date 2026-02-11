import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateAssignment = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        courseId: '',
        title: '',
        description: '',
        type: 'homework',
        dueDate: '',
        maxScore: 100
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'courseId' || name === 'maxScore' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await api.post('/teacher/assignments', formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/teacher');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create assignment');
        } finally {
            setSubmitting(false);
        }
    };

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
                <h1 className="page-title">Create Assignment ➕</h1>
                <p className="page-subtitle">Create a new assignment for your course</p>
            </div>

            <div className="card" style={{ maxWidth: '700px' }}>
                <div className="card-header">
                    <div className="flex items-center gap-2">
                        <span className="badge badge-primary">MongoDB Collection</span>
                        <span className="text-sm text-muted">Assignments are stored in MongoDB</span>
                    </div>
                </div>
                <div className="card-body">
                    {success && (
                        <div className="alert alert-success">
                            ✅ Assignment created successfully! Redirecting...
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error">{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Course *</label>
                            <select
                                name="courseId"
                                className="form-input"
                                value={formData.courseId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a course</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.code} - {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Database Normalization Exercise"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description *</label>
                            <textarea
                                name="description"
                                className="form-input"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detailed description of the assignment..."
                                required
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Type *</label>
                                <select
                                    name="type"
                                    className="form-input"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="homework">Homework</option>
                                    <option value="quiz">Quiz</option>
                                    <option value="project">Project</option>
                                    <option value="exam">Exam</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Due Date *</label>
                                <input
                                    type="datetime-local"
                                    name="dueDate"
                                    className="form-input"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Max Score *</label>
                                <input
                                    type="number"
                                    name="maxScore"
                                    className="form-input"
                                    value={formData.maxScore}
                                    onChange={handleChange}
                                    min="1"
                                    max="1000"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={submitting}
                            >
                                {submitting ? 'Creating...' : 'Create Assignment'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary btn-lg"
                                onClick={() => navigate('/teacher')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAssignment;
