const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { mysqlPool } = require('../config/database');
const { auth, rbac } = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// All routes require admin role
router.use(auth, rbac(['admin']));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard analytics
// @access  Private (Admin)
router.get('/dashboard', async (req, res, next) => {
    try {
        // Get user counts
        const [userCounts] = await mysqlPool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as students,
        SUM(CASE WHEN role = 'teacher' THEN 1 ELSE 0 END) as teachers,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins
      FROM users WHERE is_active = 1
    `);

        // Get course counts
        const [courseCounts] = await mysqlPool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
      FROM courses
    `);

        // Get enrollment count
        const [enrollmentCount] = await mysqlPool.query(
            `SELECT COUNT(*) as count FROM enrollments WHERE status = 'active'`
        );

        // Get department count
        const [deptCount] = await mysqlPool.query(`SELECT COUNT(*) as count FROM departments`);

        // Get assignment count from MongoDB
        const assignmentCount = await Assignment.countDocuments();
        const submissionCount = await Submission.countDocuments();

        res.json({
            success: true,
            data: {
                users: userCounts[0],
                courses: courseCounts[0],
                enrollments: enrollmentCount[0].count,
                departments: deptCount[0].count,
                assignments: assignmentCount,
                submissions: submissionCount
            }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', async (req, res, next) => {
    try {
        const { role, search } = req.query;

        let query = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.role, u.is_active,
        u.created_at, d.name as department_name
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE 1=1
    `;
        const params = [];

        if (role) {
            query += ' AND u.role = ?';
            params.push(role);
        }

        if (search) {
            query += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY u.created_at DESC';

        const [users] = await mysqlPool.query(query, params);

        res.json({
            success: true,
            data: { users }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/admin/users
// @desc    Create a new user
// @access  Private (Admin)
router.post('/users', async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, role, departmentId } = req.body;

        // Check if user exists
        const [existing] = await mysqlPool.query(
            `SELECT id FROM users WHERE email = ?`,
            [email]
        );

        if (existing && existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await mysqlPool.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, role, department_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [email, passwordHash, firstName, lastName, role, departmentId || null]
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { userId: result.insertId }
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/admin/users/:id
// @desc    Update a user
// @access  Private (Admin)
router.put('/users/:id', async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const { firstName, lastName, role, departmentId, isActive } = req.body;

        await mysqlPool.query(
            `UPDATE users SET 
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        role = COALESCE(?, role),
        department_id = COALESCE(?, department_id),
        is_active = COALESCE(?, is_active)
       WHERE id = ?`,
            [firstName, lastName, role, departmentId, isActive, userId]
        );

        res.json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Deactivate a user (soft delete)
// @access  Private (Admin)
router.delete('/users/:id', async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);

        await mysqlPool.query(
            'UPDATE users SET is_active = 0 WHERE id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'User deactivated successfully'
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/admin/courses
// @desc    Get all courses
// @access  Private (Admin)
router.get('/courses', async (req, res, next) => {
    try {
        const [courses] = await mysqlPool.query(`
      SELECT 
        c.id, c.code, c.name, c.description, c.credits, c.semester, c.year,
        c.max_students, c.is_active, c.created_at,
        d.name as department_name,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.status = 'active') as enrolled_count,
        GROUP_CONCAT(CONCAT(u.first_name, ' ', u.last_name)) as teachers
      FROM courses c
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN course_teachers ct ON c.id = ct.course_id
      LEFT JOIN users u ON ct.teacher_id = u.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

        res.json({
            success: true,
            data: { courses }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/admin/courses
// @desc    Create a new course
// @access  Private (Admin)
router.post('/courses', async (req, res, next) => {
    try {
        const { code, name, description, credits, departmentId, semester, year, maxStudents } = req.body;

        const [result] = await mysqlPool.query(
            `INSERT INTO courses (code, name, description, credits, department_id, semester, year, max_students)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [code, name, description, credits || 3, departmentId, semester, year, maxStudents || 60]
        );

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: { courseId: result.insertId }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/admin/courses/:courseId/assign-teacher
// @desc    Assign a teacher to a course
// @access  Private (Admin)
router.post('/courses/:courseId/assign-teacher', async (req, res, next) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const { teacherId } = req.body;

        // Check if already assigned
        const [existing] = await mysqlPool.query(
            'SELECT id FROM course_teachers WHERE course_id = ? AND teacher_id = ?',
            [courseId, teacherId]
        );

        if (existing && existing.length > 0) {
            await mysqlPool.query(
                'UPDATE course_teachers SET assigned_at = CURRENT_TIMESTAMP WHERE course_id = ? AND teacher_id = ?',
                [courseId, teacherId]
            );
        } else {
            await mysqlPool.query(
                'INSERT INTO course_teachers (course_id, teacher_id) VALUES (?, ?)',
                [courseId, teacherId]
            );
        }

        res.json({
            success: true,
            message: 'Teacher assigned successfully'
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/admin/departments
// @desc    Get all departments
// @access  Private (Admin)
router.get('/departments', async (req, res, next) => {
    try {
        const [departments] = await mysqlPool.query(`
      SELECT 
        d.id, d.name, d.code, d.created_at,
        (SELECT COUNT(*) FROM users u WHERE u.department_id = d.id) as user_count,
        (SELECT COUNT(*) FROM courses c WHERE c.department_id = d.id) as course_count
      FROM departments d
      ORDER BY d.name
    `);

        res.json({
            success: true,
            data: { departments }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/admin/departments
// @desc    Create a department
// @access  Private (Admin)
router.post('/departments', async (req, res, next) => {
    try {
        const { name, code } = req.body;

        const [result] = await mysqlPool.query(
            'INSERT INTO departments (name, code) VALUES (?, ?)',
            [name, code]
        );

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: { departmentId: result.insertId }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
