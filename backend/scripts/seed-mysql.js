// MySQL Database Seed Script - Run with: node scripts/seed-mysql.js
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// MongoDB Models
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

const seedDatabase = async () => {
    console.log('🌱 Starting MySQL database seeding...\n');

    let connection;

    try {
        // ============================================
        // CONNECT TO MYSQL
        // ============================================
        console.log('🔌 Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            multipleStatements: true
        });
        console.log('  ✓ Connected to MySQL');

        // ============================================
        // CREATE DATABASE
        // ============================================
        console.log('\n📊 Creating database...');
        await connection.query('CREATE DATABASE IF NOT EXISTS lms_db');
        await connection.query('USE lms_db');
        console.log('  ✓ Database lms_db ready');

        // ============================================
        // DROP EXISTING TABLES (Fresh start)
        // ============================================
        console.log('\n🗑️  Dropping existing tables...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('DROP TABLE IF EXISTS grades');
        await connection.query('DROP TABLE IF EXISTS attendance');
        await connection.query('DROP TABLE IF EXISTS enrollments');
        await connection.query('DROP TABLE IF EXISTS course_teachers');
        await connection.query('DROP TABLE IF EXISTS courses');
        await connection.query('DROP TABLE IF EXISTS users');
        await connection.query('DROP TABLE IF EXISTS departments');
        await connection.query('DROP VIEW IF EXISTS student_dashboard');
        await connection.query('DROP VIEW IF EXISTS teacher_dashboard');
        await connection.query('DROP VIEW IF EXISTS admin_analytics');
        await connection.query('DROP PROCEDURE IF EXISTS EnrollStudent');
        await connection.query('DROP PROCEDURE IF EXISTS MarkAttendance');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('  ✓ Existing tables dropped');

        // ============================================
        // CREATE TABLES
        // ============================================
        console.log('\n📋 Creating tables...');

        // Departments table
        await connection.query(`
            CREATE TABLE departments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL UNIQUE,
                code VARCHAR(10) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Users table
        await connection.query(`
            CREATE TABLE users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                role ENUM('student', 'teacher', 'admin') NOT NULL,
                department_id INT,
                phone VARCHAR(20),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
            )
        `);

        // Courses table
        await connection.query(`
            CREATE TABLE courses (
                id INT PRIMARY KEY AUTO_INCREMENT,
                code VARCHAR(20) NOT NULL UNIQUE,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                credits INT NOT NULL DEFAULT 3,
                department_id INT,
                semester ENUM('Fall', 'Spring', 'Summer') NOT NULL,
                year INT NOT NULL,
                max_students INT DEFAULT 60,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
            )
        `);

        // Course-Teacher assignment
        await connection.query(`
            CREATE TABLE course_teachers (
                id INT PRIMARY KEY AUTO_INCREMENT,
                course_id INT NOT NULL,
                teacher_id INT NOT NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
                FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_course_teacher (course_id, teacher_id)
            )
        `);

        // Enrollments table
        await connection.query(`
            CREATE TABLE enrollments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                student_id INT NOT NULL,
                course_id INT NOT NULL,
                enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
                final_grade VARCHAR(2),
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
                UNIQUE KEY unique_enrollment (student_id, course_id)
            )
        `);

        // Attendance table
        await connection.query(`
            CREATE TABLE attendance (
                id INT PRIMARY KEY AUTO_INCREMENT,
                enrollment_id INT NOT NULL,
                date DATE NOT NULL,
                status ENUM('present', 'absent', 'late') NOT NULL,
                marked_by INT NOT NULL,
                marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
                FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_attendance (enrollment_id, date)
            )
        `);

        // Grades table
        await connection.query(`
            CREATE TABLE grades (
                id INT PRIMARY KEY AUTO_INCREMENT,
                enrollment_id INT NOT NULL,
                assignment_id VARCHAR(24) NOT NULL,
                score DECIMAL(5,2) NOT NULL,
                max_score DECIMAL(5,2) NOT NULL,
                feedback TEXT,
                graded_by INT NOT NULL,
                graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
                FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log('  ✓ Tables created');

        // ============================================
        // CREATE INDEXES
        // ============================================
        console.log('\n📑 Creating indexes...');
        await connection.query('CREATE INDEX idx_users_email ON users(email)');
        await connection.query('CREATE INDEX idx_users_role ON users(role)');
        await connection.query('CREATE INDEX idx_courses_department ON courses(department_id)');
        await connection.query('CREATE INDEX idx_enrollments_student ON enrollments(student_id)');
        await connection.query('CREATE INDEX idx_enrollments_course ON enrollments(course_id)');
        await connection.query('CREATE INDEX idx_attendance_date ON attendance(date)');
        await connection.query('CREATE INDEX idx_grades_assignment ON grades(assignment_id)');
        console.log('  ✓ Indexes created');

        // ============================================
        // CREATE VIEWS
        // ============================================
        console.log('\n👁️  Creating views...');

        await connection.query(`
            CREATE VIEW student_dashboard AS
            SELECT 
                u.id AS student_id,
                u.first_name,
                u.last_name,
                COUNT(DISTINCT e.id) AS enrolled_courses,
                COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.id END) AS total_present,
                COUNT(DISTINCT a.id) AS total_classes,
                ROUND(AVG(g.score / g.max_score * 100), 2) AS average_grade
            FROM users u
            LEFT JOIN enrollments e ON u.id = e.student_id AND e.status = 'active'
            LEFT JOIN attendance a ON e.id = a.enrollment_id
            LEFT JOIN grades g ON e.id = g.enrollment_id
            WHERE u.role = 'student'
            GROUP BY u.id, u.first_name, u.last_name
        `);

        await connection.query(`
            CREATE VIEW teacher_dashboard AS
            SELECT 
                u.id AS teacher_id,
                u.first_name,
                u.last_name,
                COUNT(DISTINCT ct.course_id) AS teaching_courses,
                (SELECT COUNT(*) FROM enrollments e2 
                 JOIN course_teachers ct2 ON e2.course_id = ct2.course_id 
                 WHERE ct2.teacher_id = u.id AND e2.status = 'active') AS total_students
            FROM users u
            LEFT JOIN course_teachers ct ON u.id = ct.teacher_id
            WHERE u.role = 'teacher'
            GROUP BY u.id, u.first_name, u.last_name
        `);

        await connection.query(`
            CREATE VIEW admin_analytics AS
            SELECT 
                (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students,
                (SELECT COUNT(*) FROM users WHERE role = 'teacher') AS total_teachers,
                (SELECT COUNT(*) FROM users WHERE role = 'admin') AS total_admins,
                (SELECT COUNT(*) FROM courses WHERE is_active = TRUE) AS active_courses,
                (SELECT COUNT(*) FROM enrollments WHERE status = 'active') AS active_enrollments,
                (SELECT COUNT(*) FROM departments) AS total_departments
        `);

        console.log('  ✓ Views created');

        // ============================================
        // SEED DATA
        // ============================================
        console.log('\n🌱 Seeding data...');

        // Hash passwords
        const adminHash = await bcrypt.hash('admin123', 10);
        const teacherHash = await bcrypt.hash('teacher123', 10);
        const studentHash = await bcrypt.hash('student123', 10);

        // Departments
        await connection.query(`
            INSERT INTO departments (name, code) VALUES
            ('Computer Science', 'CS'),
            ('Information Technology', 'IT'),
            ('Electronics', 'ECE'),
            ('Mechanical Engineering', 'ME')
        `);
        console.log('  ✓ Departments created (4)');

        // Users
        await connection.query(`
            INSERT INTO users (email, password_hash, first_name, last_name, role, department_id) VALUES
            ('admin@lms.edu', ?, 'Rajesh', 'Kumar', 'admin', 1),
            ('dr.sharma@lms.edu', ?, 'Amit', 'Sharma', 'teacher', 1),
            ('prof.patel@lms.edu', ?, 'Priya', 'Patel', 'teacher', 1),
            ('dr.reddy@lms.edu', ?, 'Venkat', 'Reddy', 'teacher', 2),
            ('arjun@student.lms.edu', ?, 'Arjun', 'Nair', 'student', 1),
            ('sneha@student.lms.edu', ?, 'Sneha', 'Gupta', 'student', 1),
            ('rahul@student.lms.edu', ?, 'Rahul', 'Verma', 'student', 1),
            ('ananya@student.lms.edu', ?, 'Ananya', 'Iyer', 'student', 2),
            ('vikram@student.lms.edu', ?, 'Vikram', 'Singh', 'student', 2)
        `, [adminHash, teacherHash, teacherHash, teacherHash, studentHash, studentHash, studentHash, studentHash, studentHash]);
        console.log('  ✓ Users created (1 admin, 3 teachers, 5 students)');

        // Courses
        await connection.query(`
            INSERT INTO courses (code, name, description, credits, department_id, semester, year) VALUES
            ('CS301', 'Database Management Systems', 'Study of relational and NoSQL databases including MySQL, MongoDB, and Neo4j', 4, 1, 'Spring', 2025),
            ('CS302', 'Web Development', 'Full-stack web development with modern frameworks like React and Node.js', 3, 1, 'Spring', 2025),
            ('CS201', 'Data Structures', 'Fundamental data structures and algorithms including trees, graphs, and sorting', 4, 1, 'Spring', 2025),
            ('IT301', 'Cloud Computing', 'Introduction to cloud platforms and services including AWS and Azure', 3, 2, 'Spring', 2025),
            ('CS401', 'Machine Learning', 'Introduction to ML algorithms and applications with Python', 4, 1, 'Spring', 2025)
        `);
        console.log('  ✓ Courses created (5)');

        // Course-Teacher assignments
        await connection.query(`
            INSERT INTO course_teachers (course_id, teacher_id) VALUES
            (1, 2), (2, 2), (3, 3), (4, 4), (5, 3)
        `);
        console.log('  ✓ Teachers assigned to courses');

        // Enrollments
        await connection.query(`
            INSERT INTO enrollments (student_id, course_id) VALUES
            (5, 1), (5, 2), (5, 3),
            (6, 1), (6, 3),
            (7, 1), (7, 2), (7, 5),
            (8, 4),
            (9, 4), (9, 1)
        `);
        console.log('  ✓ Students enrolled (10 enrollments)');

        // Attendance
        await connection.query(`
            INSERT INTO attendance (enrollment_id, date, status, marked_by) VALUES
            (1, '2025-01-20', 'present', 2),
            (1, '2025-01-22', 'present', 2),
            (1, '2025-01-24', 'absent', 2),
            (1, '2025-01-27', 'present', 2),
            (2, '2025-01-20', 'present', 2),
            (2, '2025-01-22', 'late', 2),
            (4, '2025-01-20', 'present', 2),
            (4, '2025-01-22', 'present', 2)
        `);
        console.log('  ✓ Attendance records created (8)');

        // ============================================
        // SEED MONGODB (if configured)
        // ============================================
        if (process.env.MONGODB_URI) {
            console.log('\n📦 Seeding MongoDB...');
            await mongoose.connect(process.env.MONGODB_URI);

            // Clear existing data
            await Assignment.deleteMany({});
            await Submission.deleteMany({});

            // Create assignments
            const assignments = await Assignment.insertMany([
                {
                    courseId: 1,
                    title: 'Database Normalization Exercise',
                    description: 'Convert the given unnormalized table to 3NF.',
                    type: 'homework',
                    dueDate: new Date('2025-01-30T23:59:59'),
                    maxScore: 100,
                    isPublished: true,
                    createdBy: 2
                },
                {
                    courseId: 1,
                    title: 'SQL Queries Practice',
                    description: 'Complete SQL exercises on SELECT, JOIN, GROUP BY.',
                    type: 'homework',
                    dueDate: new Date('2025-01-28T23:59:59'),
                    maxScore: 50,
                    isPublished: true,
                    createdBy: 2
                }
            ]);
            console.log('  ✓ MongoDB assignments created (2)');

            // Add grade for first assignment
            await connection.query(`
                INSERT INTO grades (enrollment_id, assignment_id, score, max_score, feedback, graded_by)
                VALUES (1, ?, 45, 50, 'Excellent work!', 2)
            `, [assignments[1]._id.toString()]);
            console.log('  ✓ Sample grade added');

            await mongoose.disconnect();
        }

        console.log('\n✅ MySQL database seeding completed successfully!\n');
        console.log('📋 Login Credentials:');
        console.log('   Admin:   admin@lms.edu / admin123');
        console.log('   Teacher: dr.sharma@lms.edu / teacher123');
        console.log('   Student: arjun@student.lms.edu / student123');
        console.log('\n📊 Database Statistics:');
        const [stats] = await connection.query('SELECT * FROM admin_analytics');
        console.log('   Students:', stats[0].total_students);
        console.log('   Teachers:', stats[0].total_teachers);
        console.log('   Courses:', stats[0].active_courses);
        console.log('   Enrollments:', stats[0].active_enrollments);
        console.log('');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Run seeding
seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
