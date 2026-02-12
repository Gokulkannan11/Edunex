# SQL Queries Practice Guide
**LMS Database - MySQL Query Examples**

This document contains comprehensive SQL queries for practicing and demonstrating database operations for the LMS project.

---

## Table of Contents

1. [Basic SELECT Queries](#basic-select-queries)
2. [WHERE Clause & Filtering](#where-clause--filtering)
3. [JOIN Operations](#join-operations)
4. [Aggregate Functions](#aggregate-functions)
5. [GROUP BY & HAVING](#group-by--having)
6. [Subqueries](#subqueries)
7. [Advanced Queries](#advanced-queries)
8. [Views](#views)
9. [Stored Procedures](#stored-procedures)
10. [Triggers](#triggers)
11. [Transactions](#transactions)
12. [Performance Queries](#performance-queries)

---

## Basic SELECT Queries

### 1. Select all students
```sql
SELECT * FROM users WHERE role = 'student';
```

### 2. Select all active courses
```sql
SELECT code, name, credits, semester, year 
FROM courses 
WHERE is_active = TRUE;
```

### 3. Select specific columns from departments
```sql
SELECT id, name, code FROM departments;
```

### 4. Count total users
```sql
SELECT COUNT(*) as total_users FROM users;
```

### 5. List all courses with their codes
```sql
SELECT code, name, credits 
FROM courses 
ORDER BY code;
```

---

## WHERE Clause & Filtering

### 6. Find users by email
```sql
SELECT * FROM users 
WHERE email = 'arjun@student.lms.edu';
```

### 7. Find courses with more than 3 credits
```sql
SELECT code, name, credits 
FROM courses 
WHERE credits > 3;
```

### 8. Find students in Computer Science department
```sql
SELECT u.first_name, u.last_name, u.email 
FROM users u
JOIN departments d ON u.department_id = d.id
WHERE d.code = 'CS' AND u.role = 'student';
```

### 9. Find courses in Spring 2025 semester
```sql
SELECT code, name, semester, year 
FROM courses 
WHERE semester = 'Spring' AND year = 2025;
```

### 10. Find active enrollments
```sql
SELECT * FROM enrollments 
WHERE status = 'active';
```

### 11. Find users created in last 30 days
```sql
SELECT first_name, last_name, email, created_at 
FROM users 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### 12. Find courses with capacity less than 50
```sql
SELECT code, name, max_students 
FROM courses 
WHERE max_students < 50;
```

---

## JOIN Operations

### 13. INNER JOIN - Students with their departments
```sql
SELECT 
    u.first_name, 
    u.last_name, 
    d.name as department_name
FROM users u
INNER JOIN departments d ON u.department_id = d.id
WHERE u.role = 'student';
```

### 14. LEFT JOIN - All courses with their departments
```sql
SELECT 
    c.code, 
    c.name as course_name, 
    d.name as department_name
FROM courses c
LEFT JOIN departments d ON c.department_id = d.id;
```

### 15. Multiple JOINs - Student enrollments with course details
```sql
SELECT 
    u.first_name,
    u.last_name,
    c.code,
    c.name as course_name,
    e.enrolled_at,
    e.status
FROM enrollments e
INNER JOIN users u ON e.student_id = u.id
INNER JOIN courses c ON e.course_id = c.id
WHERE u.role = 'student';
```

### 16. Teacher-Course assignments
```sql
SELECT 
    u.first_name as teacher_name,
    u.last_name,
    c.code,
    c.name as course_name
FROM course_teachers ct
INNER JOIN users u ON ct.teacher_id = u.id
INNER JOIN courses c ON ct.course_id = c.id;
```

### 17. Student attendance records
```sql
SELECT 
    u.first_name,
    u.last_name,
    c.name as course_name,
    a.date,
    a.status
FROM attendance a
INNER JOIN enrollments e ON a.enrollment_id = e.id
INNER JOIN users u ON e.student_id = u.id
INNER JOIN courses c ON e.course_id = c.id
ORDER BY a.date DESC;
```

---

## Aggregate Functions

### 18. Count students per department
```sql
SELECT 
    d.name as department,
    COUNT(u.id) as student_count
FROM departments d
LEFT JOIN users u ON d.id = u.department_id AND u.role = 'student'
GROUP BY d.id, d.name;
```

### 19. Average credits per department
```sql
SELECT 
    d.name as department,
    AVG(c.credits) as avg_credits
FROM departments d
LEFT JOIN courses c ON d.id = c.department_id
GROUP BY d.id, d.name;
```

### 20. Total enrollments per course
```sql
SELECT 
    c.code,
    c.name,
    COUNT(e.id) as total_enrollments
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.code, c.name;
```

### 21. Maximum and minimum course credits
```sql
SELECT 
    MAX(credits) as max_credits,
    MIN(credits) as min_credits,
    AVG(credits) as avg_credits
FROM courses;
```

---

## GROUP BY & HAVING

### 22. Courses with more than 2 enrollments
```sql
SELECT 
    c.code,
    c.name,
    COUNT(e.id) as enrollment_count
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.code, c.name
HAVING COUNT(e.id) > 2;
```

### 23. Students with attendance percentage
```sql
SELECT 
    u.first_name,
    u.last_name,
    COUNT(a.id) as total_classes,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
    ROUND(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id), 2) as attendance_percentage
FROM users u
JOIN enrollments e ON u.id = e.student_id
JOIN attendance a ON e.id = a.enrollment_id
WHERE u.role = 'student'
GROUP BY u.id, u.first_name, u.last_name
HAVING COUNT(a.id) > 0;
```

### 24. Departments with more than 5 students
```sql
SELECT 
    d.name,
    COUNT(u.id) as student_count
FROM departments d
JOIN users u ON d.id = u.department_id
WHERE u.role = 'student'
GROUP BY d.id, d.name
HAVING COUNT(u.id) > 5;
```

### 25. Teachers teaching more than 1 course
```sql
SELECT 
    u.first_name,
    u.last_name,
    COUNT(ct.course_id) as courses_teaching
FROM users u
JOIN course_teachers ct ON u.id = ct.teacher_id
WHERE u.role = 'teacher'
GROUP BY u.id, u.first_name, u.last_name
HAVING COUNT(ct.course_id) > 1;
```

---

## Subqueries

### 26. Students enrolled in DBMS course
```sql
SELECT first_name, last_name, email
FROM users
WHERE id IN (
    SELECT student_id 
    FROM enrollments 
    WHERE course_id = (
        SELECT id FROM courses WHERE code = 'CS301'
    )
);
```

### 27. Courses with enrollment above average
```sql
SELECT c.code, c.name, COUNT(e.id) as enrollment_count
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.code, c.name
HAVING COUNT(e.id) > (
    SELECT AVG(enrollment_count) 
    FROM (
        SELECT COUNT(*) as enrollment_count 
        FROM enrollments 
        GROUP BY course_id
    ) as avg_enrollments
);
```

### 28. Students with perfect attendance
```sql
SELECT u.first_name, u.last_name
FROM users u
WHERE u.id IN (
    SELECT e.student_id
    FROM enrollments e
    JOIN attendance a ON e.id = a.enrollment_id
    GROUP BY e.student_id
    HAVING SUM(CASE WHEN a.status != 'present' THEN 1 ELSE 0 END) = 0
);
```

### 29. Courses not yet enrolled by any student
```sql
SELECT code, name
FROM courses
WHERE id NOT IN (
    SELECT DISTINCT course_id FROM enrollments
);
```

### 30. Students in the same department as a specific student
```sql
SELECT first_name, last_name
FROM users
WHERE department_id = (
    SELECT department_id 
    FROM users 
    WHERE email = 'arjun@student.lms.edu'
) AND role = 'student';
```

---

## Advanced Queries

### 31. Student performance dashboard
```sql
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    COUNT(DISTINCT e.course_id) as enrolled_courses,
    COUNT(DISTINCT a.id) as total_classes,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as classes_attended,
    ROUND(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100.0 / 
          NULLIF(COUNT(DISTINCT a.id), 0), 2) as attendance_percentage,
    ROUND(AVG(g.score / g.max_score * 100), 2) as average_grade
FROM users u
LEFT JOIN enrollments e ON u.id = e.student_id AND e.status = 'active'
LEFT JOIN attendance a ON e.id = a.enrollment_id
LEFT JOIN grades g ON e.id = g.enrollment_id
WHERE u.role = 'student' AND u.id = 5
GROUP BY u.id, u.first_name, u.last_name;
```

### 32. Course capacity analysis
```sql
SELECT 
    c.code,
    c.name,
    c.max_students,
    COUNT(e.id) as current_enrollment,
    (c.max_students - COUNT(e.id)) as available_seats,
    ROUND(COUNT(e.id) * 100.0 / c.max_students, 2) as capacity_percentage
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
WHERE c.is_active = TRUE
GROUP BY c.id, c.code, c.name, c.max_students
ORDER BY capacity_percentage DESC;
```

### 33. Teacher workload analysis
```sql
SELECT 
    u.first_name,
    u.last_name,
    COUNT(DISTINCT ct.course_id) as courses_teaching,
    SUM(course_students.student_count) as total_students
FROM users u
JOIN course_teachers ct ON u.id = ct.teacher_id
LEFT JOIN (
    SELECT course_id, COUNT(*) as student_count
    FROM enrollments
    WHERE status = 'active'
    GROUP BY course_id
) as course_students ON ct.course_id = course_students.course_id
WHERE u.role = 'teacher'
GROUP BY u.id, u.first_name, u.last_name;
```

### 34. Department-wise performance
```sql
SELECT 
    d.name as department,
    COUNT(DISTINCT CASE WHEN u.role = 'student' THEN u.id END) as total_students,
    COUNT(DISTINCT CASE WHEN u.role = 'teacher' THEN u.id END) as total_teachers,
    COUNT(DISTINCT c.id) as total_courses,
    COUNT(DISTINCT e.id) as total_enrollments,
    ROUND(AVG(g.score / g.max_score * 100), 2) as avg_grade
FROM departments d
LEFT JOIN users u ON d.id = u.department_id
LEFT JOIN courses c ON d.id = c.department_id
LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
LEFT JOIN grades g ON e.id = g.enrollment_id
GROUP BY d.id, d.name;
```

### 35. Attendance trends by date
```sql
SELECT 
    a.date,
    COUNT(*) as total_records,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
    SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_count,
    SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late_count,
    ROUND(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as attendance_rate
FROM attendance a
GROUP BY a.date
ORDER BY a.date DESC;
```

---

## Views

### 36. Create student dashboard view
```sql
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
```

### 37. Query student dashboard view
```sql
SELECT * FROM student_dashboard WHERE student_id = 5;
```

### 38. Create teacher dashboard view
```sql
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
```

### 39. Create admin analytics view
```sql
CREATE VIEW admin_analytics AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students,
    (SELECT COUNT(*) FROM users WHERE role = 'teacher') AS total_teachers,
    (SELECT COUNT(*) FROM users WHERE role = 'admin') AS total_admins,
    (SELECT COUNT(*) FROM courses WHERE is_active = TRUE) AS active_courses,
    (SELECT COUNT(*) FROM enrollments WHERE status = 'active') AS active_enrollments,
    (SELECT COUNT(*) FROM departments) AS total_departments;
```

---

## Stored Procedures

### 40. Create enrollment procedure
```sql
DELIMITER //

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
        SET p_result = 'Already enrolled';
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

DELIMITER ;
```

### 41. Call enrollment procedure
```sql
CALL EnrollStudent(5, 1, @result);
SELECT @result;
```

---

## Triggers

### 42. Create timestamp update trigger
```sql
DELIMITER //

CREATE TRIGGER update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;
```

### 43. Test trigger
```sql
UPDATE users SET phone = '1234567890' WHERE id = 5;
SELECT id, first_name, updated_at FROM users WHERE id = 5;
```

---

## Transactions

### 44. Enrollment transaction
```sql
START TRANSACTION;

INSERT INTO enrollments (student_id, course_id) VALUES (5, 4);
INSERT INTO attendance (enrollment_id, date, status, marked_by) 
VALUES (LAST_INSERT_ID(), CURDATE(), 'present', 2);

COMMIT;
```

### 45. Rollback example
```sql
START TRANSACTION;

UPDATE enrollments SET status = 'dropped' WHERE id = 1;

-- Oops, wrong enrollment
ROLLBACK;
```

---

## Performance Queries

### 46. Explain query plan
```sql
EXPLAIN SELECT * FROM users WHERE email = 'arjun@student.lms.edu';
```

### 47. Index usage check
```sql
SHOW INDEX FROM users;
```

### 48. Slow query identification
```sql
SELECT 
    u.first_name,
    c.name,
    COUNT(a.id)
FROM users u
JOIN enrollments e ON u.id = e.student_id
JOIN courses c ON e.course_id = c.id
JOIN attendance a ON e.id = a.enrollment_id
GROUP BY u.id, c.id;
```

---

## Practice Exercises

### Exercise 1: Find top performing students
```sql
-- Write a query to find students with average grade > 80%
```

### Exercise 2: Course popularity ranking
```sql
-- Rank courses by enrollment count
```

### Exercise 3: Attendance defaulters
```sql
-- Find students with attendance < 75%
```

### Exercise 4: Teacher efficiency
```sql
-- Calculate average grade per teacher
```

### Exercise 5: Department comparison
```sql
-- Compare departments by student performance
```

---

## Tips for Review

1. **Practice JOINs**: Understand INNER, LEFT, RIGHT, and FULL JOINs
2. **Master Aggregations**: COUNT, SUM, AVG, MIN, MAX
3. **Use Subqueries**: Nested queries for complex filtering
4. **Understand Indexes**: Know when and where to use them
5. **Test Procedures**: Create and call stored procedures
6. **Implement Triggers**: Auto-update timestamps and logs
7. **Use Transactions**: Ensure data consistency
8. **Analyze Performance**: Use EXPLAIN to optimize queries

---

**Good luck with your review! 🎓**
