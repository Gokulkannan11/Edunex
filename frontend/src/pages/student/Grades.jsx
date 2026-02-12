import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Grades.css';

const Grades = () => {
    const { user } = useAuth();
    const [grades, setGrades] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        try {
            const response = await api.get('/student/grades');
            setGrades(response.data.data || sampleGrades);
        } catch (err) {
            setGrades(sampleGrades);
        }
    };

    const sampleGrades = [
        { course: 'CS302', title: 'Advanced Algorithms', assignment: 'Midterm Exam', score: 95, total: 100, grade: 'A', date: 'Sep 15, 2025' },
        { course: 'MATH204', title: 'Calculus III', assignment: 'Problem Set 3', score: 88, total: 100, grade: 'A-', date: 'Sep 10, 2025' },
        { course: 'DSN101', title: 'Digital Design', assignment: 'UI Project', score: 98, total: 100, grade: 'A+', date: 'Sep 05, 2025' },
        { course: 'PHYS102', title: 'Applied Mechanics', assignment: 'Lab Report 2', score: 85, total: 100, grade: 'B+', date: 'Aug 28, 2025' }
    ];

    const filteredGrades = filter === 'all' ? grades : grades.filter(g => g.course === filter);
    const overallGPA = 3.8;

    return (
        <div className="grades-page-stitch">
            <div className="page-header-stitch">
                <h1 className="page-title-stitch">My Grades</h1>
                <p className="page-subtitle-stitch">
                    Track your academic performance and grades for all courses.
                </p>
            </div>

            <div className="gpa-card-stitch">
                <div className="gpa-label">Overall GPA</div>
                <div className="gpa-value">{overallGPA}</div>
                <div className="gpa-meta">Top 5% of your cohort</div>
            </div>

            <div className="filter-section-stitch">
                <button className={`filter-btn-stitch ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                    All Courses
                </button>
                <button className={`filter-btn-stitch ${filter === 'CS302' ? 'active' : ''}`} onClick={() => setFilter('CS302')}>
                    CS302
                </button>
                <button className={`filter-btn-stitch ${filter === 'MATH204' ? 'active' : ''}`} onClick={() => setFilter('MATH204')}>
                    MATH204
                </button>
            </div>

            <div className="grades-table-stitch">
                <div className="table-header-grades">
                    <div>COURSE</div>
                    <div>ASSIGNMENT</div>
                    <div>SCORE</div>
                    <div>GRADE</div>
                    <div>DATE</div>
                </div>
                {filteredGrades.map((grade, index) => (
                    <div key={index} className="table-row-grades">
                        <div>
                            <div className="course-code-small">{grade.course}</div>
                            <div className="course-title-small">{grade.title}</div>
                        </div>
                        <div className="assignment-name">{grade.assignment}</div>
                        <div className="score-value">{grade.score}/{grade.total}</div>
                        <div>
                            <span className={`grade-badge ${grade.grade.replace('+', 'plus').replace('-', 'minus').toLowerCase()}`}>
                                {grade.grade}
                            </span>
                        </div>
                        <div className="date-value">{grade.date}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Grades;
