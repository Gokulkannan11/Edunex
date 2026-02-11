const express = require('express');
const router = express.Router();
const { mysqlPool } = require('../config/database');
const { auth, rbac } = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// All routes require student role
router.use(auth, rbac(['student']));

// @route   GET /api/student/dashboard
// @desc    Get student dashboard data
// @access  Private (Student)
router.get('/dashboard', async (req, res, next) => {
    try {
        const studentId = req.user.id;

        // Get enrolled courses count
        const [coursesResult] = await mysqlPool.query(
            `SELECT COUNT(*) as count FROM enrollments WHERE student_id = ? AND status = 'active'`,
            [studentId]
        );

        // Get attendance stats
        const [attendanceResult] = await mysqlPool.query(
            `SELECT 
            COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present,
            COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent,
            COUNT(*) as total
           FROM attendance a
           JOIN enrollments e ON a.enrollment_id = e.id
           WHERE e.student_id = ?`,
            [studentId]
        );

        // Get average grade
        const [gradeResult] = await mysqlPool.query(
            `SELECT ROUND(AVG(score / max_score * 100), 2) as average
           FROM grades g
           JOIN enrollments e ON g.enrollment_id = e.id
           WHERE e.student_id = ?`,
            [studentId]
        );

        // Get pending assignments from MongoDB
        const [enrollments] = await mysqlPool.query(
            `SELECT course_id FROM enrollments WHERE student_id = ? AND status = ?`,
            [studentId, 'active']
        );
        const courseIds = enrollments.map(e => e.course_id);

        // Get pending assignments count (due in future, not submitted)
        const pendingAssignments = await Assignment.countDocuments({
            courseId: { $in: courseIds },
            isPublished: true,
            dueDate: { $gte: new Date() }
        });

        // Get upcoming assignments
        const upcomingAssignments = await Assignment.find({
            courseId: { $in: courseIds },
            isPublished: true,
            dueDate: { $gte: new Date() }
        })
            .sort({ dueDate: 1 })
            .limit(5)
            .select('title courseId dueDate type maxScore');

        res.json({
            success: true,
            data: {
                enrolledCourses: coursesResult[0].count,
                pendingAssignments,
                attendance: {
                    present: attendanceResult[0].present || 0,
                    absent: attendanceResult[0].absent || 0,
                    total: attendanceResult[0].total || 0,
                    rate: attendanceResult[0].total > 0
                        ? Math.round((attendanceResult[0].present / attendanceResult[0].total) * 100)
                        : 0
                },
                averageGrade: gradeResult[0].average || 0,
                upcomingAssignments
            }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/student/courses
// @desc    Get enrolled courses
// @access  Private (Student)
router.get('/courses', async (req, res, next) => {
    try {
        const [courses] = await mysqlPool.query(
            `SELECT 
            c.id, c.code, c.name, c.description, c.credits, c.semester, c.year,
            e.enrolled_at, e.status as enrollment_status,
            d.name as department_name,
            CONCAT(u.first_name, ' ', u.last_name) as teacher_name
           FROM enrollments e
           JOIN courses c ON e.course_id = c.id
           LEFT JOIN departments d ON c.department_id = d.id
           LEFT JOIN course_teachers ct ON c.id = ct.course_id
           LEFT JOIN users u ON ct.teacher_id = u.id
           WHERE e.student_id = ? AND e.status = 'active'
           ORDER BY c.name`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: { courses }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/student/enroll/:courseId
// @desc    Enroll in a course
// @access  Private (Student)
router.post('/enroll/:courseId', async (req, res, next) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const studentId = req.user.id;

        // Check if course exists and is active
        const [courses] = await mysqlPool.query(
            `SELECT id, max_students FROM courses WHERE id = ? AND is_active = 1`,
            [courseId]
        );

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Course not found or not active'
            });
        }

        // Check current enrollment count
        const [countResult] = await mysqlPool.query(
            `SELECT COUNT(*) as count FROM enrollments WHERE course_id = ? AND status = 'active'`,
            [courseId]
        );

        if (countResult[0].count >= courses[0].max_students) {
            return res.status(400).json({
                success: false,
                message: 'Course is full'
            });
        }

        // Check if already enrolled
        const [existing] = await mysqlPool.query(
            `SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?`,
            [studentId, courseId]
        );

        if (existing && existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Already enrolled in this course'
            });
        }

        // Enroll student
        await mysqlPool.query(
            'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
            [studentId, courseId]
        );

        res.status(201).json({
            success: true,
            message: 'Enrolled successfully'
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/student/available-courses
// @desc    Get all available courses (for enrollment)
// @access  Private (Student)
router.get('/available-courses', async (req, res, next) => {
    try {
        const [courses] = await mysqlPool.query(
            `SELECT 
            c.id, c.code, c.name, c.description, c.credits, c.semester, c.year, c.max_students,
            d.name as department_name,
            (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.status = 'active') as enrolled_count
           FROM courses c
           LEFT JOIN departments d ON c.department_id = d.id
           WHERE c.is_active = 1
           ORDER BY c.code`
        );

        res.json({
            success: true,
            data: { courses }
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/student/unenroll/:courseId
// @desc    Unenroll from a course (DELETE operation - CRUD Demo)
// @access  Private (Student)
router.delete('/unenroll/:courseId', async (req, res, next) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const studentId = req.user.id;

        // Check if enrolled
        const [enrollment] = await mysqlPool.query(
            `SELECT id FROM enrollments WHERE student_id = ? AND course_id = ? AND status = ?`,
            [studentId, courseId, 'active']
        );

        if (!enrollment || enrollment.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Not enrolled in this course'
            });
        }

        // Delete enrollment (CRUD DELETE operation)
        await mysqlPool.query(
            'DELETE FROM enrollments WHERE student_id = ? AND course_id = ?',
            [studentId, courseId]
        );

        res.json({
            success: true,
            message: 'Successfully unenrolled from course'
        });
    } catch (error) {
        next(error);
    }
});


// @route   GET /api/student/assignments
// @desc    Get assignments for enrolled courses
// @access  Private (Student)
router.get('/assignments', async (req, res, next) => {
    try {
        // Get enrolled course IDs
        const [enrollments] = await mysqlPool.query(
            `SELECT course_id FROM enrollments WHERE student_id = ? AND status = ?`,
            [req.user.id, 'active']
        );

        const courseIds = enrollments.map(e => e.course_id);

        if (!courseIds || courseIds.length === 0) {
            return res.json({
                success: true,
                data: { assignments: [] }
            });
        }

        // Get assignments from MongoDB
        const assignments = await Assignment.find({
            courseId: { $in: courseIds },
            isPublished: true
        }).sort({ dueDate: 1 });

        // Get submission status for each assignment
        const studentId = req.user.id;
        const assignmentIds = assignments.map(a => a._id);
        const submissions = await Submission.find({
            assignmentId: { $in: assignmentIds },
            studentId
        });

        const submissionMap = {};
        submissions.forEach(s => {
            submissionMap[s.assignmentId.toString()] = s;
        });

        // Get course names from MySQL
        const [coursesData] = await mysqlPool.query(
            `SELECT id, code, name FROM courses WHERE id IN (?)`,
            [courseIds]
        );
        const courseMap = {};
        coursesData.forEach(c => {
            courseMap[c.id] = { code: c.code, name: c.name };
        });

        // Combine data
        const assignmentsWithStatus = assignments.map(a => ({
            _id: a._id,
            title: a.title,
            description: a.description,
            type: a.type,
            dueDate: a.dueDate,
            maxScore: a.maxScore,
            courseId: a.courseId,
            courseName: courseMap[a.courseId]?.name || 'Unknown',
            courseCode: courseMap[a.courseId]?.code || 'N/A',
            submission: submissionMap[a._id.toString()] || null,
            isSubmitted: !!submissionMap[a._id.toString()],
            isPastDue: new Date(a.dueDate) < new Date()
        }));

        res.json({
            success: true,
            data: { assignments: assignmentsWithStatus }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/student/submit/:assignmentId
// @desc    Submit an assignment
// @access  Private (Student)
router.post('/submit/:assignmentId', async (req, res, next) => {
    try {
        const { content } = req.body;
        const assignmentId = req.params.assignmentId;
        const studentId = req.user.id;

        // Get assignment
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if enrolled in course
        const [enrollment] = await mysqlPool.query(
            `SELECT id FROM enrollments WHERE student_id = ? AND course_id = ? AND status = ?`,
            [studentId, assignment.courseId, 'active']
        );

        if (!enrollment || enrollment.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Not enrolled in this course'
            });
        }

        // Check for existing submission
        const existingSubmission = await Submission.findOne({
            assignmentId,
            studentId
        });

        if (existingSubmission) {
            // Update existing
            existingSubmission.content = content;
            existingSubmission.submittedAt = new Date();
            existingSubmission.isLate = new Date() > assignment.dueDate;
            await existingSubmission.save();

            return res.json({
                success: true,
                message: 'Submission updated',
                data: { submission: existingSubmission }
            });
        }

        // Create new submission
        const submission = new Submission({
            assignmentId,
            studentId,
            content,
            isLate: new Date() > assignment.dueDate
        });

        await submission.save();

        res.status(201).json({
            success: true,
            message: 'Assignment submitted successfully',
            data: { submission }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/student/grades
// @desc    Get student grades
// @access  Private (Student)
router.get('/grades', async (req, res, next) => {
    try {
        const [grades] = await mysqlPool.query(
            `SELECT 
            g.id, g.score, g.max_score, g.feedback, g.graded_at, g.assignment_id,
            c.code as course_code, c.name as course_name
           FROM grades g
           JOIN enrollments e ON g.enrollment_id = e.id
           JOIN courses c ON e.course_id = c.id
           WHERE e.student_id = ?
           ORDER BY g.graded_at DESC`,
            [req.user.id]
        );

        // Get assignment titles from MongoDB
        const assignmentIds = grades.map(g => g.assignment_id);
        const assignments = await Assignment.find({
            _id: { $in: assignmentIds }
        }).select('_id title type');

        const assignmentMap = {};
        assignments.forEach(a => {
            assignmentMap[a._id.toString()] = { title: a.title, type: a.type };
        });

        const gradesWithTitles = grades.map(g => ({
            ...g,
            assignmentTitle: assignmentMap[g.assignment_id]?.title || 'Unknown',
            assignmentType: assignmentMap[g.assignment_id]?.type || 'unknown',
            percentage: Math.round((g.score / g.max_score) * 100)
        }));

        res.json({
            success: true,
            data: { grades: gradesWithTitles }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/student/attendance
// @desc    Get attendance records
// @access  Private (Student)
router.get('/attendance', async (req, res, next) => {
    try {
        const [attendance] = await mysqlPool.query(
            `SELECT 
            a.id, a.date, a.status,
            c.code as course_code, c.name as course_name
           FROM attendance a
           JOIN enrollments e ON a.enrollment_id = e.id
           JOIN courses c ON e.course_id = c.id
           WHERE e.student_id = ?
           ORDER BY a.date DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: { attendance }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
