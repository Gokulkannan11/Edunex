# Quick Start - Restore MySQL Database

## Step 1: Update MySQL Password in .env

1. Open `backend\.env` file
2. Find line 9: `MYSQL_PASSWORD=your_mysql_password`
3. Replace `your_mysql_password` with your actual MySQL root password
4. Save the file

Example:
```env
MYSQL_PASSWORD=MyActualPassword123
```

## Step 2: Run the Seed Script

Open PowerShell in the project directory and run:

```powershell
cd "d:\MTECH\SEM 2\MDBMS\project"
node backend\scripts\seed-mysql.js
```

This will:
- ✅ Create the `lms_db` database
- ✅ Create all tables (departments, users, courses, enrollments, etc.)
- ✅ Create views (student_dashboard, teacher_dashboard, admin_analytics)
- ✅ Insert sample data with **proper bcrypt password hashes**
- ✅ Create 1 admin, 3 teachers, 5 students

## Step 3: Verify Database

### Option A: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Refresh schemas (click 🔄)
4. You should see `lms_db` with all tables

### Option B: Using MySQL Shell
```powershell
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
.\mysql.exe -u root -p
```

Then run:
```sql
SHOW DATABASES;
USE lms_db;
SHOW TABLES;
SELECT * FROM users;
```

## Step 4: Test Login Credentials

After seeding, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.edu | admin123 |
| Teacher | dr.sharma@lms.edu | teacher123 |
| Student | arjun@student.lms.edu | student123 |

## Step 5: Restart Backend (if running)

If your backend is already running, restart it:

1. Press `Ctrl+C` in the terminal running the backend
2. Start it again:
   ```powershell
   cd "d:\MTECH\SEM 2\MDBMS\project\backend"
   npm run dev
   ```

You should see: `✓ MySQL Connected`

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- Your password in `.env` is incorrect
- Update `MYSQL_PASSWORD` in `backend\.env`

### Error: "Cannot connect to MySQL server"
- MySQL service is not running
- Run: `Start-Service MySQL80` (as Administrator)

### Error: "Database already exists"
- The script will drop and recreate everything
- This is safe - it's designed for a fresh start

---

**That's it!** Your database should now be fully restored with all data and proper password hashes.
