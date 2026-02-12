import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './CreateAssignment.css';

const CreateAssignment = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        type: 'Homework',
        description: '',
        maxScore: 100,
        autoGrade: false,
        availableFrom: '',
        dueDate: '',
        acceptLate: false,
        publishImmediately: true,
        notifyStudents: true
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/teacher/assignments', formData);
            navigate('/teacher/assignments');
        } catch (err) {
            console.error('Failed to create assignment:', err);
        }
    };

    return (
        <div className="create-assignment-page">
            <div className="breadcrumb-stitch">
                Courses › CS101 › Create Assignment
            </div>

            <div className="page-header-stitch">
                <h1 className="page-title-stitch">Create Assignment</h1>
                <p className="page-subtitle-stitch">
                    Add a new assignment for your students to track progress and learning objectives.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="assignment-form-stitch">
                {/* Basic Information */}
                <div className="form-section-stitch">
                    <h3 className="section-title-form">📄 Basic Information</h3>
                    <div className="form-group-stitch">
                        <label>Assignment Title</label>
                        <input
                            type="text"
                            placeholder="e.g., Introduction to Data Structures"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group-stitch">
                        <label>Assignment Type</label>
                        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                            <option>Homework</option>
                            <option>Project</option>
                            <option>Exam</option>
                            <option>Quiz</option>
                        </select>
                    </div>
                    <div className="form-group-stitch">
                        <label>Description & Instructions</label>
                        <textarea
                            rows="5"
                            placeholder="Describe the tasks, requirements, and learning objectives for your students..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                </div>

                {/* Grading */}
                <div className="form-section-stitch">
                    <h3 className="section-title-form">⭐ Grading</h3>
                    <div className="form-row-stitch">
                        <div className="form-group-stitch">
                            <label>Max Score</label>
                            <input
                                type="number"
                                value={formData.maxScore}
                                onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                            />
                        </div>
                        <div className="form-group-stitch">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={formData.autoGrade}
                                    onChange={(e) => setFormData({ ...formData, autoGrade: e.target.checked })}
                                />
                                <span>Auto-grade submissions</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Schedule */}
                <div className="form-section-stitch">
                    <h3 className="section-title-form">📅 Schedule</h3>
                    <div className="form-row-stitch">
                        <div className="form-group-stitch">
                            <label>Available From</label>
                            <input
                                type="datetime-local"
                                value={formData.availableFrom}
                                onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                            />
                        </div>
                        <div className="form-group-stitch">
                            <label>Due Date</label>
                            <input
                                type="datetime-local"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group-stitch">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={formData.acceptLate}
                                onChange={(e) => setFormData({ ...formData, acceptLate: e.target.checked })}
                            />
                            <span>Accept late submissions</span>
                        </label>
                    </div>
                </div>

                {/* Attachments */}
                <div className="form-section-stitch">
                    <h3 className="section-title-form">📎 Attachments</h3>
                    <div className="upload-area-stitch">
                        <div className="upload-icon">☁️</div>
                        <p className="upload-text">Drag and drop files here</p>
                        <p className="upload-meta">PDF, DOCX, ZIP or MP4 (Max 50MB)</p>
                        <button type="button" className="btn-browse">Browse Files</button>
                    </div>
                </div>

                {/* Publishing Settings */}
                <div className="form-section-stitch">
                    <h3 className="section-title-form">⚙️ Publishing Settings</h3>
                    <div className="form-group-stitch">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={formData.publishImmediately}
                                onChange={(e) => setFormData({ ...formData, publishImmediately: e.target.checked })}
                            />
                            <span>Publish Immediately</span>
                        </label>
                        <p className="helper-text">Make assignment visible to students right after saving</p>
                    </div>
                    <div className="form-group-stitch">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={formData.notifyStudents}
                                onChange={(e) => setFormData({ ...formData, notifyStudents: e.target.checked })}
                            />
                            <span>Notify Students</span>
                        </label>
                        <p className="helper-text">Send an email and app notification to all enrolled students</p>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions-stitch">
                    <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button type="button" className="btn-draft">
                        Save as Draft
                    </button>
                    <button type="submit" className="btn-create">
                        Create Assignment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAssignment;
