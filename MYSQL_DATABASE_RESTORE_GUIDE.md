# MySQL Database Restoration Guide

## Current Situation
✅ MySQL has been reinstalled successfully  
✅ MySQL service is running  
❌ LMS database (`lms_db`) doesn't exist yet  

## Quick Restore Steps

### Option 1: Using MySQL Workbench (Recommended - Visual)

1. **Open MySQL Workbench**
   - Click on your MySQL connection

2. **Open the Schema File**
   - Go to `File` → `Open SQL Script`
   - Navigate to: `d:\MTECH\SEM 2\MDBMS\project\database\mysql_schema.sql`
   - Click `Open`

3. **Execute the Script**
   - Click the ⚡ lightning bolt icon (Execute)
   - Or press `Ctrl+Shift+Enter`
   - Wait for completion (you'll see "MySQL Schema Created Successfully!")

4. **Verify Database Creation**
   - In the Navigator panel (left side), click the 🔄 refresh icon
   - You should see `lms_db` in the schemas list
   - Expand it to see all tables

### Option 2: Using MySQL Shell (Command Line)

1. **Open PowerShell**

2. **Navigate to MySQL bin directory**
   ```powershell
   cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
   ```

3. **Connect to MySQL**
   ```powershell
   .\mysql.exe -u root -p
   ```
   Enter your MySQL password when prompted

4. **Run the schema file**
   ```sql
   SOURCE d:/MTECH/SEM 2/MDBMS/project/database/mysql_schema.sql
   ```

5. **Verify**
   ```sql
   SHOW DATABASES;
   USE lms_db;
   SHOW TABLES;
   SELECT COUNT(*) FROM users;
   ```

### Option 3: Using PowerShell (One Command)

```powershell
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
Get-Content "d:\MTECH\SEM 2\MDBMS\project\database\mysql_schema.sql" | .\mysql.exe -u root -p
```

## What Gets Created

### 📊 Database Structure

**Tables:**
- `departments` - 4 departments (CS, IT, ECE, ME)
- `users` - 9 users (1 admin, 3 teachers, 5 students)
- `courses` - 5 courses
- `course_teachers` - Teacher assignments
- `enrollments` - Student enrollments
- `attendance` - Attendance records
- `grades` - Grade records

**Views:**
- `student_dashboard` - Student performance summary
- `teacher_dashboard` - Teacher course summary
- `admin_analytics` - System-wide statistics

**Stored Procedures:**
- `EnrollStudent()` - Enroll student with validation
- `MarkAttendance()` - Mark class attendance

**Triggers:**
- `update_user_timestamp` - Auto-update timestamps
- `after_enrollment_insert` - Enrollment logging

### 🔑 Default Login Credentials

> ⚠️ **IMPORTANT**: The passwords in the SQL file are placeholders. You need to update them with proper bcrypt hashes.

**Temporary Credentials (from SQL file):**
- Admin: `admin@lms.edu` / (placeholder hash)
- Teacher: `dr.sharma@lms.edu` / (placeholder hash)
- Student: `arjun@student.lms.edu` / (placeholder hash)

**Actual Credentials (after running seed script):**
- Admin: `admin@lms.edu` / `admin123`
- Teacher: `dr.sharma@lms.edu` / `teacher123`
- Student: `arjun@student.lms.edu` / `student123`

## Update Password Hashes (Required!)

The SQL file contains placeholder password hashes. You need to update them with real bcrypt hashes.

### Method 1: Create a MySQL Seed Script (Recommended)

I'll create a Node.js script that generates proper password hashes and updates MySQL.

### Method 2: Manual Update via MySQL Workbench

After running the schema, you can manually update passwords:

```sql
-- Update admin password (hash for 'admin123')
UPDATE users 
SET password_hash = '$2b$10$YourActualBcryptHashHere' 
WHERE email = 'admin@lms.edu';

-- Repeat for other users...
```

## Verification Queries

After restoration, run these queries to verify everything is working:

```sql
-- Check database exists
SHOW DATABASES LIKE 'lms_db';

-- Use the database
USE lms_db;

-- Check all tables
SHOW TABLES;

-- Count records
SELECT 'Departments' AS Table_Name, COUNT(*) AS Count FROM departments
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Courses', COUNT(*) FROM courses
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM enrollments
UNION ALL
SELECT 'Attendance', COUNT(*) FROM attendance;

-- Test views
SELECT * FROM student_dashboard;
SELECT * FROM teacher_dashboard;
SELECT * FROM admin_analytics;

-- Test a join query
SELECT 
    u.first_name, 
    u.last_name, 
    c.code, 
    c.name 
FROM users u 
JOIN enrollments e ON u.id = e.student_id 
JOIN courses c ON e.course_id = c.id 
WHERE u.role = 'student'
LIMIT 10;
```

## Update Backend Configuration

After restoring the database, update your backend configuration:

**File: `backend/config/database.js`**

Make sure the MySQL connection settings match your new installation:

```javascript
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_new_mysql_password',  // ← Update this!
    database: 'lms_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```

## Restart Backend Server

After updating the configuration:

1. **Stop the current backend** (if running)
   - Press `Ctrl+C` in the terminal running the backend

2. **Restart the backend**
   ```powershell
   cd "d:\MTECH\SEM 2\MDBMS\project\backend"
   npm run dev
   ```

3. **Check the connection**
   - Look for "✓ MySQL Connected" in the console
   - Test the health endpoint: http://localhost:5000/api/health

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- Your password in `backend/config/database.js` doesn't match MySQL
- Update the password in the config file

### Error: "Unknown database 'lms_db'"
- The schema script hasn't been run yet
- Follow Option 1 or 2 above to create the database

### Error: "Cannot connect to MySQL server"
- MySQL service is not running
- Run: `Start-Service MySQL80` in PowerShell (as Administrator)

### Tables are empty
- The schema creates sample data automatically
- If tables are empty, check if the INSERT statements ran successfully
- You may need to run the seed script to add proper password hashes

## Next Steps

1. ✅ Restore database using one of the options above
2. ✅ Verify all tables and data exist
3. ⚠️ Update password hashes (see next section)
4. ✅ Update backend configuration
5. ✅ Restart backend server
6. ✅ Test login with credentials

---

**Need help?** Check the main guide: `MYSQL_COMPLETE_GUIDE.md`
