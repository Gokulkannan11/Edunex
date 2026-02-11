// Database Seed Script for SQLite - Run with: node scripts/seed.js
const bcrypt = require('bcryptjs');
const { db, connectMongoDB, closeConnections } = require('../config/database');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MongoDB Models
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

const seedDatabase = async () => {
    console.log('🌱 Starting database seeding...\n');

    try {
        // Connect to MongoDB
        await connectMongoDB();

        // ============================================
        // INITIALIZE SQLITE SCHEMA
        // ============================================
        console.log('📊 Initializing SQLite schema...');

        const schemaPath = path.join(__dirname, '..', '..', 'database', 'sqlite_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema);
        console.log('  ✓ Schema initialized');

        // ============================================
        // SEED SQLITE
        // ============================================
        console.log('\n📊 Seeding SQLite...');

        // Hash passwords
        const hashPassword = async (password) => {
            const salt = await bcrypt.genSalt(10);
            return bcrypt.hash(password, salt);
        };

        const adminHash = await hashPassword('admin123');
        const teacherHash = await hashPassword('teacher123');
        const studentHash = await hashPassword('student123');

        // Clear existing data
        db.exec(`
            DELETE FROM grades;
            DELETE FROM attendance;
            DELETE FROM enrollments;
            DELETE FROM course_teachers;
            DELETE FROM courses;
            DELETE FROM users;
            DELETE FROM departments;
        `);

        // Departments
        const insertDept = db.prepare(`
            INSERT INTO departments (name, code) VALUES (?, ?)
        `);

        insertDept.run('Computer Science', 'CS');
        insertDept.run('Information Technology', 'IT');
        insertDept.run('Electronics', 'ECE');
        insertDept.run('Mechanical Engineering', 'ME');
        console.log('  ✓ Departments created');

        // Users with proper hashed passwords
        const insertUser = db.prepare(`
            INSERT INTO users (email, password_hash, first_name, last_name, role, department_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        // Admin
        insertUser.run('admin@lms.edu', adminHash, 'Rajesh', 'Kumar', 'admin', 1);

        // Teachers
        insertUser.run('dr.sharma@lms.edu', teacherHash, 'Amit', 'Sharma', 'teacher', 1);
        insertUser.run('prof.patel@lms.edu', teacherHash, 'Priya', 'Patel', 'teacher', 1);
        insertUser.run('dr.reddy@lms.edu', teacherHash, 'Venkat', 'Reddy', 'teacher', 2);

        // Students
        insertUser.run('arjun@student.lms.edu', studentHash, 'Arjun', 'Nair', 'student', 1);
        insertUser.run('sneha@student.lms.edu', studentHash, 'Sneha', 'Gupta', 'student', 1);
        insertUser.run('rahul@student.lms.edu', studentHash, 'Rahul', 'Verma', 'student', 1);
        insertUser.run('ananya@student.lms.edu', studentHash, 'Ananya', 'Iyer', 'student', 2);
        insertUser.run('vikram@student.lms.edu', studentHash, 'Vikram', 'Singh', 'student', 2);
        console.log('  ✓ Users created (1 admin, 3 teachers, 5 students)');

        // Courses
        const insertCourse = db.prepare(`
            INSERT INTO courses (code, name, description, credits, department_id, semester, year)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        insertCourse.run('CS301', 'Database Management Systems', 'Study of relational and NoSQL databases including MySQL, MongoDB, and Neo4j', 4, 1, 'Spring', 2025);
        insertCourse.run('CS302', 'Web Development', 'Full-stack web development with modern frameworks like React and Node.js', 3, 1, 'Spring', 2025);
        insertCourse.run('CS201', 'Data Structures', 'Fundamental data structures and algorithms including trees, graphs, and sorting', 4, 1, 'Spring', 2025);
        insertCourse.run('IT301', 'Cloud Computing', 'Introduction to cloud platforms and services including AWS and Azure', 3, 2, 'Spring', 2025);
        insertCourse.run('CS401', 'Machine Learning', 'Introduction to ML algorithms and applications with Python', 4, 1, 'Spring', 2025);
        console.log('  ✓ Courses created (5 courses)');

        // Assign teachers to courses
        const insertCourseTeacher = db.prepare(`
            INSERT INTO course_teachers (course_id, teacher_id) VALUES (?, ?)
        `);

        insertCourseTeacher.run(1, 2);
        insertCourseTeacher.run(2, 2);
        insertCourseTeacher.run(3, 3);
        insertCourseTeacher.run(4, 4);
        insertCourseTeacher.run(5, 3);
        console.log('  ✓ Teachers assigned to courses');

        // Enrollments
        const insertEnrollment = db.prepare(`
            INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)
        `);

        insertEnrollment.run(5, 1);
        insertEnrollment.run(5, 2);
        insertEnrollment.run(5, 3);
        insertEnrollment.run(6, 1);
        insertEnrollment.run(6, 3);
        insertEnrollment.run(7, 1);
        insertEnrollment.run(7, 2);
        insertEnrollment.run(7, 5);
        insertEnrollment.run(8, 4);
        insertEnrollment.run(9, 4);
        insertEnrollment.run(9, 1);
        console.log('  ✓ Students enrolled in courses');

        // Attendance
        const insertAttendance = db.prepare(`
            INSERT INTO attendance (enrollment_id, date, status, marked_by) VALUES (?, ?, ?, ?)
        `);

        insertAttendance.run(1, '2025-01-20', 'present', 2);
        insertAttendance.run(1, '2025-01-22', 'present', 2);
        insertAttendance.run(1, '2025-01-24', 'absent', 2);
        insertAttendance.run(1, '2025-01-27', 'present', 2);
        insertAttendance.run(2, '2025-01-20', 'present', 2);
        insertAttendance.run(2, '2025-01-22', 'late', 2);
        insertAttendance.run(4, '2025-01-20', 'present', 2);
        insertAttendance.run(4, '2025-01-22', 'present', 2);
        console.log('  ✓ Attendance records created');

        // ============================================
        // SEED MONGODB
        // ============================================
        console.log('\n📦 Seeding MongoDB...');

        // Clear existing data
        await Assignment.deleteMany({});
        await Submission.deleteMany({});

        // Create assignments
        const assignments = await Assignment.insertMany([
            {
                courseId: 1,
                title: 'Database Normalization Exercise',
                description: 'Convert the given unnormalized table to 3NF. Show all intermediate steps (1NF, 2NF, 3NF) with explanations. Include functional dependencies identification.',
                type: 'homework',
                dueDate: new Date('2025-01-30T23:59:59'),
                maxScore: 100,
                rubric: [
                    { criterion: '1NF Conversion', maxPoints: 25, description: 'Correctly identify and remove repeating groups' },
                    { criterion: '2NF Conversion', maxPoints: 25, description: 'Identify partial dependencies and decompose' },
                    { criterion: '3NF Conversion', maxPoints: 25, description: 'Identify transitive dependencies and decompose' },
                    { criterion: 'Documentation', maxPoints: 25, description: 'Clear explanations and diagram quality' }
                ],
                isPublished: true,
                createdBy: 2
            },
            {
                courseId: 1,
                title: 'ER Diagram Design Project',
                description: 'Design a complete ER diagram for a Library Management System. Include entities, relationships, cardinalities, and attributes.',
                type: 'project',
                dueDate: new Date('2025-02-05T23:59:59'),
                maxScore: 150,
                isPublished: true,
                createdBy: 2
            },
            {
                courseId: 1,
                title: 'SQL Queries Practice',
                description: 'Complete the SQL exercises on SELECT, JOIN, GROUP BY, and subqueries.',
                type: 'homework',
                dueDate: new Date('2025-01-28T23:59:59'),
                maxScore: 50,
                isPublished: true,
                createdBy: 2
            },
            {
                courseId: 2,
                title: 'React Component Assignment',
                description: 'Build a reusable React component library with at least 5 components.',
                type: 'project',
                dueDate: new Date('2025-02-01T23:59:59'),
                maxScore: 100,
                isPublished: true,
                createdBy: 2
            },
            {
                courseId: 3,
                title: 'Binary Tree Implementation',
                description: 'Implement a Binary Search Tree with insert, delete, search, and traversal operations.',
                type: 'homework',
                dueDate: new Date('2025-01-31T23:59:59'),
                maxScore: 80,
                isPublished: true,
                createdBy: 3
            }
        ]);
        console.log('  ✓ Assignments created (5 assignments)');

        // Create sample submissions
        await Submission.insertMany([
            {
                assignmentId: assignments[2]._id,
                studentId: 5,
                content: 'All SQL queries completed. See attached file for solutions.',
                isLate: false,
                status: 'graded'
            },
            {
                assignmentId: assignments[2]._id,
                studentId: 6,
                content: 'Completed exercises 1-8. Had difficulty with subqueries.',
                isLate: false,
                status: 'submitted'
            },
            {
                assignmentId: assignments[0]._id,
                studentId: 5,
                content: 'Normalization steps documented with diagrams.',
                isLate: false,
                status: 'submitted'
            }
        ]);
        console.log('  ✓ Submissions created (3 submissions)');

        // Add grades for the graded submission
        const insertGrade = db.prepare(`
            INSERT INTO grades (enrollment_id, assignment_id, score, max_score, feedback, graded_by)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        insertGrade.run(1, assignments[2]._id.toString(), 45, 50, 'Excellent work on SQL queries!', 2);
        console.log('  ✓ Grades created');

        console.log('\n✅ Database seeding completed successfully!\n');
        console.log('📋 Login Credentials:');
        console.log('   Admin:   admin@lms.edu / admin123');
        console.log('   Teacher: dr.sharma@lms.edu / teacher123');
        console.log('   Student: arjun@student.lms.edu / student123');
        console.log('');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        await closeConnections();
    }
};

// Run seeding
seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
