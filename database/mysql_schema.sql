-- ============================================
-- LMS Database Schema - MySQL
-- Learning Management System
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS lms_db;
USE lms_db;

-- ============================================
-- TABLES (Normalized to 3NF)
-- ============================================

-- Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for students, teachers, admins)
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
);

-- Courses table
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
);

-- Course-Teacher assignment (many-to-many)
CREATE TABLE course_teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    teacher_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_teacher (course_id, teacher_id)
);

-- Enrollments table
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
);

-- Attendance table
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
);

-- Grades table (links to MongoDB assignment_id)
CREATE TABLE grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    enrollment_id INT NOT NULL,
    assignment_id VARCHAR(24) NOT NULL,  -- MongoDB ObjectId as string
    score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL,
    feedback TEXT,
    graded_by INT NOT NULL,
    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES (Performance Optimization)
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_courses_department ON courses(department_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_grades_assignment ON grades(assignment_id);

-- ============================================
-- VIEWS (Dashboard Summaries)
-- ============================================

-- Student dashboard view
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
GROUP BY u.id, u.first_name, u.last_name;

-- Teacher dashboard view
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
GROUP BY u.id, u.first_name, u.last_name;

-- Admin analytics view
CREATE VIEW admin_analytics AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students,
    (SELECT COUNT(*) FROM users WHERE role = 'teacher') AS total_teachers,
    (SELECT COUNT(*) FROM users WHERE role = 'admin') AS total_admins,
    (SELECT COUNT(*) FROM courses WHERE is_active = TRUE) AS active_courses,
    (SELECT COUNT(*) FROM enrollments WHERE status = 'active') AS active_enrollments,
    (SELECT COUNT(*) FROM departments) AS total_departments;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

-- Enroll student in course with validation
CREATE PROCEDURE EnrollStudent(
    IN p_student_id INT,
    IN p_course_id INT,
    OUT p_result VARCHAR(100)
)
BEGIN
    DECLARE v_current_count INT;
    DECLARE v_max_students INT;
    DECLARE v_already_enrolled INT;
    
    -- Check if already enrolled
    SELECT COUNT(*) INTO v_already_enrolled 
    FROM enrollments 
    WHERE student_id = p_student_id AND course_id = p_course_id;
    
    IF v_already_enrolled > 0 THEN
        SET p_result = 'Already enrolled in this course';
    ELSE
        -- Check capacity
        SELECT COUNT(*) INTO v_current_count 
        FROM enrollments 
        WHERE course_id = p_course_id AND status = 'active';
        
        SELECT max_students INTO v_max_students 
        FROM courses 
        WHERE id = p_course_id;
        
        IF v_current_count >= v_max_students THEN
            SET p_result = 'Course is full';
        ELSE
            INSERT INTO enrollments (student_id, course_id) 
            VALUES (p_student_id, p_course_id);
            SET p_result = 'Enrolled successfully';
        END IF;
    END IF;
END //

-- Mark attendance for a class
CREATE PROCEDURE MarkAttendance(
    IN p_course_id INT,
    IN p_date DATE,
    IN p_marked_by INT
)
BEGIN
    -- This procedure expects attendance data to be inserted separately
    -- It's a placeholder for batch attendance marking
    SELECT 'Attendance marking initialized' AS message;
END //

DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER //

-- Update timestamp on user update
CREATE TRIGGER update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

-- Log enrollment changes (can be extended)
CREATE TRIGGER after_enrollment_insert
AFTER INSERT ON enrollments
FOR EACH ROW
BEGIN
    -- Could insert into an audit table here
    -- For now, just a placeholder
    SELECT 1;
END //

DELIMITER ;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Departments
INSERT INTO departments (name, code) VALUES
('Computer Science', 'CS'),
('Information Technology', 'IT'),
('Electronics', 'ECE'),
('Mechanical Engineering', 'ME');

-- Users (passwords are bcrypt hashed - these are placeholders, actual hash in backend)
-- Password for all: respective role + "123" (e.g., admin123, teacher123, student123)
INSERT INTO users (email, password_hash, first_name, last_name, role, department_id) VALUES
-- Admins
('admin@lms.edu', '$2b$10$placeholder_admin_hash', 'Rajesh', 'Kumar', 'admin', 1),

-- Teachers
('dr.sharma@lms.edu', '$2b$10$placeholder_teacher_hash', 'Amit', 'Sharma', 'teacher', 1),
('prof.patel@lms.edu', '$2b$10$placeholder_teacher_hash', 'Priya', 'Patel', 'teacher', 1),
('dr.reddy@lms.edu', '$2b$10$placeholder_teacher_hash', 'Venkat', 'Reddy', 'teacher', 2),

-- Students
('arjun@student.lms.edu', '$2b$10$placeholder_student_hash', 'Arjun', 'Nair', 'student', 1),
('sneha@student.lms.edu', '$2b$10$placeholder_student_hash', 'Sneha', 'Gupta', 'student', 1),
('rahul@student.lms.edu', '$2b$10$placeholder_student_hash', 'Rahul', 'Verma', 'student', 1),
('ananya@student.lms.edu', '$2b$10$placeholder_student_hash', 'Ananya', 'Iyer', 'student', 2),
('vikram@student.lms.edu', '$2b$10$placeholder_student_hash', 'Vikram', 'Singh', 'student', 2);

-- Courses
INSERT INTO courses (code, name, description, credits, department_id, semester, year) VALUES
('CS301', 'Database Management Systems', 'Study of relational and NoSQL databases', 4, 1, 'Spring', 2025),
('CS302', 'Web Development', 'Full-stack web development with modern frameworks', 3, 1, 'Spring', 2025),
('CS201', 'Data Structures', 'Fundamental data structures and algorithms', 4, 1, 'Spring', 2025),
('IT301', 'Cloud Computing', 'Introduction to cloud platforms and services', 3, 2, 'Spring', 2025),
('CS401', 'Machine Learning', 'Introduction to ML algorithms and applications', 4, 1, 'Spring', 2025);

-- Assign teachers to courses
INSERT INTO course_teachers (course_id, teacher_id) VALUES
(1, 2),  -- Dr. Smith teaches DBMS
(2, 2),  -- Dr. Smith teaches Web Dev
(3, 3),  -- Prof. Johnson teaches Data Structures
(4, 4),  -- Dr. Williams teaches Cloud Computing
(5, 3);  -- Prof. Johnson teaches ML

-- Enrollments
INSERT INTO enrollments (student_id, course_id) VALUES
(5, 1), (5, 2), (5, 3),  -- Alice enrolled in 3 courses
(6, 1), (6, 3),          -- Bob enrolled in 2 courses
(7, 1), (7, 2), (7, 5),  -- Charlie enrolled in 3 courses
(8, 4),                   -- Diana enrolled in 1 course
(9, 4), (9, 1);          -- Evan enrolled in 2 courses

-- Sample Attendance
INSERT INTO attendance (enrollment_id, date, status, marked_by) VALUES
(1, '2025-01-20', 'present', 2),
(1, '2025-01-22', 'present', 2),
(1, '2025-01-24', 'absent', 2),
(1, '2025-01-27', 'present', 2),
(2, '2025-01-20', 'present', 2),
(2, '2025-01-22', 'late', 2),
(4, '2025-01-20', 'present', 2),
(4, '2025-01-22', 'present', 2);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Test student dashboard view
-- SELECT * FROM student_dashboard;

-- Test teacher dashboard view
-- SELECT * FROM teacher_dashboard;

-- Test admin analytics view
-- SELECT * FROM admin_analytics;

-- Get student with courses
-- SELECT u.first_name, u.last_name, c.code, c.name 
-- FROM users u 
-- JOIN enrollments e ON u.id = e.student_id 
-- JOIN courses c ON e.course_id = c.id 
-- WHERE u.role = 'student';

SELECT 'MySQL Schema Created Successfully!' AS Status;
