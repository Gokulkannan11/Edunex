# LMS Setup Guide - Step by Step 🚀

Follow these steps to get your LMS running locally for tomorrow's review.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- [ ] **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- [ ] **MongoDB** (v7.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- [ ] **Git** (optional, for version control)
- [ ] **Code Editor** (VS Code recommended)

### Verify Installations:
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
mysql --version   # Should show 8.0.x or higher
mongod --version  # Should show 7.0.x or higher
```

---

## 🗄️ Step 1: Database Setup

### 1.1 Start MySQL Server

**Windows:**
```bash
# Start MySQL service
net start MySQL80

# Or use MySQL Workbench to start the server
```

**Mac/Linux:**
```bash
sudo systemctl start mysql
# or
brew services start mysql
```

### 1.2 Create MySQL Database

Open MySQL command line or MySQL Workbench:

```bash
mysql -u root -p
```

Run the schema script:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS lms_db;
USE lms_db;

-- Run the schema file
SOURCE d:/MTECH/SEM 2/MDBMS/project/database/mysql_schema.sql;

-- Verify tables were created
SHOW TABLES;
```

**Expected Output:**
```
+------------------+
| Tables_in_lms_db |
+------------------+
| attendance       |
| course_teachers  |
| courses          |
| departments      |
| enrollments      |
| grades           |
| users            |
+------------------+
```

### 1.3 Start MongoDB Server

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod --dbpath "C:\data\db"
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 1.4 Setup MongoDB Database

Open a new terminal and run:

```bash
# Connect to MongoDB
mongosh

# Run the setup script
load("d:/MTECH/SEM 2/MDBMS/project/database/mongodb_setup.js")

# Verify collections were created
use lms_db
show collections
```

**Expected Output:**
```
assignments
course_content
notifications
submissions
system_logs
```

---

## 🔧 Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd "d:/MTECH/SEM 2/MDBMS/project/backend"
```

### 2.2 Install Dependencies

```bash
npm install
```

**This will install:**
- express
- mysql2
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- helmet
- dotenv
- and more...

### 2.3 Configure Environment Variables

Create/Edit the `.env` file:

```bash
# Copy the template (if not exists)
# The .env file should already exist, just update the values

# Edit with your MySQL password
notepad .env
```

**Update these values in `.env`:**

```env
# Server
NODE_ENV=development
PORT=5000

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here  # ← CHANGE THIS
MYSQL_DATABASE=lms_db

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/lms_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ Important:** Replace `your_mysql_password_here` with your actual MySQL root password!

### 2.4 Seed the Database

This creates sample users, courses, and data:

```bash
npm run seed
```

**Expected Output:**
```
🌱 Starting database seeding...

📊 Seeding MySQL...
  ✓ Departments created
  ✓ Users created (1 admin, 3 teachers, 5 students)
  ✓ Courses created (5 courses)
  ✓ Teachers assigned to courses
  ✓ Students enrolled in courses
  ✓ Attendance records created

📦 Seeding MongoDB...
  ✓ Assignments created (5 assignments)
  ✓ Submissions created (3 submissions)
  ✓ Grades created

✅ Database seeding completed successfully!

📋 Login Credentials:
   Admin:   admin@lms.edu / admin123
   Teacher: dr.sharma@lms.edu / teacher123
   Student: arjun@student.lms.edu / student123
```

### 2.5 Start Backend Server

```bash
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ MySQL connected successfully
✅ MongoDB connected successfully
```

**Keep this terminal open!** The backend server is now running.

---

## 🎨 Step 3: Frontend Setup

### 3.1 Open New Terminal

Open a **new terminal window** (keep backend running in the first one).

### 3.2 Navigate to Frontend Directory

```bash
cd "d:/MTECH/SEM 2/MDBMS/project/frontend"
```

### 3.3 Install Dependencies

```bash
npm install
```

**This will install:**
- react
- react-router-dom
- axios
- date-fns
- vite

### 3.4 Start Frontend Development Server

```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.0.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## 🌐 Step 4: Access the Application

### 4.1 Open Browser

Navigate to: **http://localhost:5173**

### 4.2 Test Login

Use these credentials to test different roles:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@lms.edu | admin123 |
| **Teacher** | dr.sharma@lms.edu | teacher123 |
| **Student** | arjun@student.lms.edu | student123 |

---

## ✅ Step 5: Verify Everything Works

### 5.1 Test Student Portal

1. Login as student: `arjun@student.lms.edu / student123`
2. Check dashboard shows stats
3. Go to "Enroll Course" → Enroll in a course
4. Go to "My Courses" → Verify course appears
5. Go to "Assignments" → View assignments
6. Go to "Grades" → View grades

### 5.2 Test Teacher Portal

1. Logout and login as teacher: `dr.sharma@lms.edu / teacher123`
2. Check dashboard
3. Go to "Courses" → Click a course to see students
4. Go to "Create Assignment" → Create new assignment
5. Go to "Mark Attendance" → Mark attendance for a class

### 5.3 Test Admin Portal

1. Logout and login as admin: `admin@lms.edu / admin123`
2. Check dashboard analytics
3. Go to "User Management" → Create a new user
4. Activate/Deactivate a user
5. Go to "Course Management" → View courses

---

## 🎯 Step 6: CRUD Operations Demo

### MySQL CRUD (Student Enrollment)

1. **Login as Student**
2. **Go to "Enroll Course"**
3. **CREATE:** Click "Enroll Now" on any course
   - ✅ Success message appears
   - ✅ Check MySQL: `SELECT * FROM enrollments;`
4. **READ:** View "My Enrolled Courses"
   - ✅ Course appears in the list
5. **DELETE:** Click "Drop Course"
   - ✅ Success message appears
   - ✅ Check MySQL: Course removed from enrollments

### MongoDB CRUD (Assignments)

1. **Login as Teacher**
2. **CREATE:** Go to "Create Assignment" → Fill form → Submit
   - ✅ Success message
   - ✅ Check MongoDB: `db.assignments.find()`
3. **READ:** Login as Student → View "Assignments"
   - ✅ Assignment appears in list

---

## 🐛 Troubleshooting

### Backend won't start

**Error:** `Error: connect ECONNREFUSED`
- **Solution:** Make sure MySQL and MongoDB are running
- Check connection strings in `.env`

**Error:** `ER_ACCESS_DENIED_ERROR`
- **Solution:** Check MySQL password in `.env`

### Frontend won't start

**Error:** `EADDRINUSE: address already in use`
- **Solution:** Port 5173 is busy. Kill the process or change port in `vite.config.js`

### Can't login

**Error:** "Invalid credentials"
- **Solution:** Make sure you ran `npm run seed` to create users
- Check that backend is running on port 5000

### Database connection failed

**MySQL:**
```bash
# Check if MySQL is running
mysql -u root -p
```

**MongoDB:**
```bash
# Check if MongoDB is running
mongosh
```

---

## 📱 Quick Reference Commands

### Start Everything:

**Terminal 1 (Backend):**
```bash
cd "d:/MTECH/SEM 2/MDBMS/project/backend"
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd "d:/MTECH/SEM 2/MDBMS/project/frontend"
npm run dev
```

### Stop Everything:

- Press `Ctrl + C` in both terminal windows
- Stop MySQL: `net stop MySQL80`
- Stop MongoDB: `net stop MongoDB`

---

## 🎓 For Your Review Tomorrow

### Before the Review:
1. ✅ Run through this setup guide
2. ✅ Test all three portals (Student, Teacher, Admin)
3. ✅ Practice the CRUD demo (enroll/unenroll)
4. ✅ Review `CRUD_OPERATIONS_GUIDE.md`
5. ✅ Check `PROJECT_STATUS.md` for talking points

### During the Review:
1. Show the **Admin Dashboard** first (system overview)
2. Demonstrate **CRUD operations** (enroll/unenroll)
3. Show **polyglot persistence** (MySQL vs MongoDB)
4. Highlight **security features** (JWT, RBAC, password hashing)
5. Show **database schema** (normalized tables, indexes)

---

## 📚 Additional Resources

- **README.md** - Project overview
- **PROJECT_STATUS.md** - What's completed
- **CRUD_OPERATIONS_GUIDE.md** - Detailed CRUD demo steps
- **Backend API Docs** - See routes in `backend/routes/`
- **Database Schemas** - See `database/` folder

---

## 🎉 You're All Set!

Your LMS is now running and ready for tomorrow's review. Good luck! 🚀

**Need help?** Check the troubleshooting section or review the documentation files.
