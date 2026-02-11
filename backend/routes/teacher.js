const express = require('express');
const router = express.Router();
const { mysqlPool } = require('../config/database');
const { auth, rbac } = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// All routes require teacher role
router.use(auth, rbac(['teacher']));

// @route   GET /api/teacher/dashboard
// @desc    Get teacher dashboard data
// @access  Private (Teacher)
router.get('/dashboard', async (req, res, next) => {
    try {
        const teacherId = req.user.id;

        // Get courses count
        const [coursesResult] = await mysqlPool.query(
            `SELECT COUNT(*) as count FROM course_teachers WHERE teacher_id = ?`,
            [teacherId]
        );

        // Get total students across all courses
        const [studentsResult] = await mysqlPool.query(
            `SELECT COUNT(DISTINCT e.student_id) as count
           FROM enrollments e
           JOIN course_teachers ct ON e.course_id = ct.course_id
           WHERE ct.teacher_id = ? AND e.status = 'active'`,
            [teacherId]
        );

        // Get course IDs for this teacher
        const [courseTeachers] = await mysqlPool.query(
            `SELECT course_id FROM course_teachers WHERE teacher_id = ?`,
            [teacherId]
        );
        const courseIds = courseTeachers.map(ct => ct.course_id);

        // Get pending submissions from MongoDB
        let pendingSubmissions = 0;
        if (courseIds && courseIds.length > 0) {
            const assignments = await Assignment.find({ courseId: { $in: courseIds } });
            const assignmentIds = assignments.map(a => a._id);
            pendingSubmissions = await Submission.countDocuments({
                assignmentId: { $in: assignmentIds },
                status: 'submitted'
            });
        }

        res.json({
            success: true,
            data: {
                totalCourses: coursesResult[0].count,
                totalStudents: studentsResult[0].count,
                pendingSubmissions
            }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/teacher/courses
// @desc    Get courses taught by teacher
// @access  Private (Teacher)
router.get('/courses', async (req, res, next) => {
    try {
        const [courses] = await mysqlPool.query(
            `SELECT 
            c.id, c.code, c.name, c.description, c.credits, c.semester, c.year,
            d.name as department_name,
            (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.status = 'active') as student_count
           FROM courses c
           JOIN course_teachers ct ON c.id = ct.course_id
           LEFT JOIN departments d ON c.department_id = d.id
           WHERE ct.teacher_id = ? AND c.is_active = 1
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

// @route   GET /api/teacher/courses/:courseId/students
// @desc    Get students in a course
// @access  Private (Teacher)
router.get('/courses/:courseId/students', async (req, res, next) => {
    try {
        const courseId = parseInt(req.params.courseId);

        // Verify teacher teaches this course
        const [teacherCheck] = await mysqlPool.query(
            `SELECT id FROM course_teachers WHERE course_id = ? AND teacher_id = ?`,
            [courseId, req.user.id]
        );

        if (!teacherCheck || teacherCheck.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You do not teach this course'
            });
        }

        const [students] = await mysqlPool.query(
            `SELECT 
            u.id, u.email, u.first_name, u.last_name,
            e.id as enrollment_id, e.enrolled_at,
            d.name as department_name
           FROM users u
           JOIN enrollments e ON u.id = e.student_id
           LEFT JOIN departments d ON u.department_id = d.id
           WHERE e.course_id = ? AND e.status = 'active'
           ORDER BY u.last_name, u.first_name`,
            [courseId]
        );

        res.json({
            success: true,
            data: { students }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/teacher/assignments
// @desc    Create a new assignment
// @access  Private (Teacher)
router.post('/assignments', async (req, res, next) => {
    try {
        const { courseId, title, description, type, dueDate, maxScore, rubric } = req.body;

        // Verify teacher teaches this course
        const [teacherCheck] = await mysqlPool.query(
            `SELECT id FROM course_teachers WHERE course_id = ? AND teacher_id = ?`,
            [courseId, req.user.id]
        );

        if (!teacherCheck || teacherCheck.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You do not teach this course'
            });
        }

        // Create assignment in MongoDB
        const assignment = new Assignment({
            courseId,
            title,
            description,
            type,
            dueDate: new Date(dueDate),
            maxScore,
            rubric: rubric || [],
            isPublished: true,
            createdBy: req.user.id
        });

        await assignment.save();

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully',
            data: { assignment }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/teacher/assignments/:courseId
// @desc    Get assignments for a course
// @access  Private (Teacher)
router.get('/assignments/:courseId', async (req, res, next) => {
    try {
        const courseId = parseInt(req.params.courseId);

        const assignments = await Assignment.find({ courseId })
            .sort({ dueDate: -1 });

        res.json({
            success: true,
            data: { assignments }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/teacher/submissions/:assignmentId
// @desc    Get submissions for an assignment
// @access  Private (Teacher)
router.get('/submissions/:assignmentId', async (req, res, next) => {
    try {
        const assignmentId = req.params.assignmentId;

        const submissions = await Submission.find({ assignmentId });

        // Get student details from MySQL
        const studentIds = submissions.map(s => s.studentId);
        let studentsMap = {};

        if (studentIds && studentIds.length > 0) {
            const [students] = await mysqlPool.query(
                `SELECT id, first_name, last_name, email FROM users WHERE id IN (?)`,
                [studentIds]
            );
            students.forEach(s => {
                studentsMap[s.id] = s;
            });
        }

        const submissionsWithStudents = submissions.map(s => ({
            ...s.toObject(),
            student: studentsMap[s.studentId] || null
        }));

        res.json({
            success: true,
            data: { submissions: submissionsWithStudents }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/teacher/attendance
// @desc    Mark attendance for students
// @access  Private (Teacher)
router.post('/attendance', async (req, res, next) => {
    try {
        const { courseId, date, attendanceRecords } = req.body;
        // attendanceRecords: [{ enrollmentId, status }]

        // Verify teacher teaches this course
        const [teacherCheck] = await mysqlPool.query(
            `SELECT id FROM course_teachers WHERE course_id = ? AND teacher_id = ?`,
            [courseId, req.user.id]
        );

        if (!teacherCheck || teacherCheck.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You do not teach this course'
            });
        }

        // Insert or update attendance records
        for (const record of attendanceRecords) {
            await mysqlPool.query(
                `INSERT INTO attendance (enrollment_id, date, status, marked_by)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = ?, marked_by = ?`,
                [record.enrollmentId, date, record.status, req.user.id, record.status, req.user.id]
            );
        }

        res.json({
            success: true,
            message: 'Attendance marked successfully'
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/teacher/grades
// @desc    Submit grade for a submission
// @access  Private (Teacher)
router.post('/grades', async (req, res, next) => {
    try {
        const { enrollmentId, assignmentId, score, maxScore, feedback } = req.body;

        // Insert grade
        await mysqlPool.query(
            `INSERT INTO grades (enrollment_id, assignment_id, score, max_score, feedback, graded_by)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE score = ?, feedback = ?, graded_by = ?`,
            [enrollmentId, assignmentId, score, maxScore, feedback, req.user.id, score, feedback, req.user.id]
        );

        // Update submission status in MongoDB
        await Submission.updateOne(
            { assignmentId, studentId: req.body.studentId },
            { status: 'graded' }
        );

        res.json({
            success: true,
            message: 'Grade submitted successfully'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
