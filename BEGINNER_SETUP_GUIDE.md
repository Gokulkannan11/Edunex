# 🎓 Complete Beginner's Guide to Running the LMS Project

**Perfect for those new to MySQL and MongoDB!**

This guide assumes you're starting from scratch and will walk you through every single step with explanations.

---

## 📚 Table of Contents

1. [Understanding What You're Building](#understanding-what-youre-building)
2. [Installing Required Software](#installing-required-software)
3. [Setting Up MySQL Database](#setting-up-mysql-database)
4. [Setting Up MongoDB Database](#setting-up-mongodb-database)
5. [Running the Backend Server](#running-the-backend-server)
6. [Running the Frontend Application](#running-the-frontend-application)
7. [Testing Your Application](#testing-your-application)
8. [Common Problems & Solutions](#common-problems--solutions)

---

## 🎯 Understanding What You're Building

### What is this project?

This is a **Learning Management System (LMS)** - like Google Classroom or Moodle. It has:
- **Students** who can enroll in courses, view assignments, and check grades
- **Teachers** who can create assignments and mark attendance
- **Admins** who can manage users and courses

### Why two databases?

- **MySQL** (Relational Database) - Stores structured data like users, courses, grades
- **MongoDB** (Document Database) - Stores flexible data like assignments, submissions

This is called **polyglot persistence** - using the right database for the right job!

### What will be running?

You'll have **4 things** running simultaneously:
1. ✅ MySQL Server (database)
2. ✅ MongoDB Server (database)
3. ✅ Backend Server (Node.js/Express - handles API requests)
4. ✅ Frontend Server (React/Vite - the website you see)

---

## 💻 Installing Required Software

### Step 1: Install Node.js

**What is Node.js?** It's a JavaScript runtime that lets you run JavaScript on your computer (not just in browsers).

1. Go to https://nodejs.org/
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. Click "Next" through all options (defaults are fine)
5. Restart your computer after installation

**Verify Installation:**
```bash
# Open Command Prompt (Windows) or Terminal (Mac/Linux)
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

> **What is npm?** Node Package Manager - it installs code libraries your project needs.

---

### Step 2: Install MySQL

**What is MySQL?** A relational database that stores data in tables (like Excel spreadsheets).

#### For Windows:

1. Go to https://dev.mysql.com/downloads/installer/
2. Download **MySQL Installer** (the larger "web" version)
3. Run the installer
4. Choose **"Developer Default"** setup type
5. Click "Next" until you reach "Accounts and Roles"
6. **IMPORTANT:** Set a root password and **remember it!** (e.g., `root123`)
7. Write it down: `MySQL Password: _______________`
8. Continue clicking "Next" and "Execute"
9. Finish installation

#### For Mac:

```bash
# Install Homebrew first (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MySQL
brew install mysql

# Start MySQL
brew services start mysql

# Secure installation
mysql_secure_installation
```

**Verify Installation:**
```bash
mysql --version
# Should show: mysql  Ver 8.0.x
```

---

### Step 3: Install MongoDB

**What is MongoDB?** A NoSQL database that stores data as JSON-like documents (flexible structure).

#### For Windows:

1. Go to https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0.x)
   - Platform: Windows
   - Package: MSI
3. Download and run the installer
4. Choose **"Complete"** installation
5. **IMPORTANT:** Check "Install MongoDB as a Service" ✅
6. Keep "Run service as Network Service user" selected
7. **IMPORTANT:** Check "Install MongoDB Compass" ✅ (GUI tool)
8. Click "Next" and "Install"

#### For Mac:

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0
```

**Verify Installation:**
```bash
mongod --version
# Should show: db version v7.0.x

# Test connection
mongosh
# Should connect and show: test>
# Type 'exit' to quit
```

---

## 🗄️ Setting Up MySQL Database

### Step 1: Start MySQL Server

#### Windows:
```bash
# Open Command Prompt as Administrator
# Press Windows key, type "cmd", right-click, "Run as administrator"

net start MySQL80
```

**Expected Output:**
```
The MySQL80 service is starting.
The MySQL80 service was started successfully.
```

#### Mac/Linux:
```bash
brew services start mysql
# or
sudo systemctl start mysql
```

---

### Step 2: Connect to MySQL

Open Command Prompt or Terminal:

```bash
mysql -u root -p
```

**What this means:**
- `mysql` - Start MySQL command line
- `-u root` - Login as user "root" (admin user)
- `-p` - Prompt for password

**You'll see:**
```
Enter password:
```

Type your MySQL password (the one you set during installation) and press Enter.

**Success looks like:**
```
Welcome to the MySQL monitor.
mysql>
```

> **Tip:** The password won't show as you type - this is normal for security!

---

### Step 3: Create the Database

Copy and paste these commands **one at a time** into the MySQL prompt:

```sql
-- Create a new database called 'lms_db'
CREATE DATABASE IF NOT EXISTS lms_db;
```

**Expected Output:**
```
Query OK, 1 row affected (0.01 sec)
```

```sql
-- Switch to using this database
USE lms_db;
```

**Expected Output:**
```
Database changed
```

---

### Step 4: Load the Database Schema

**What is a schema?** It's the blueprint for your database - defines what tables exist and what data they hold.

**Option A: Using SOURCE command (Recommended)**

```sql
-- Replace with your actual path
SOURCE d:/MTECH/SEM 2/MDBMS/project/database/mysql_schema.sql;
```

> **Important:** Use forward slashes `/` even on Windows!

**Option B: Using Command Line**

Exit MySQL first:
```sql
exit
```

Then run:
```bash
mysql -u root -p lms_db < "d:/MTECH/SEM 2/MDBMS/project/database/mysql_schema.sql"
```

---

### Step 5: Verify Tables Were Created

Log back into MySQL:
```bash
mysql -u root -p
USE lms_db;
```

Check what tables exist:
```sql
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
7 rows in set (0.00 sec)
```

✅ **Success!** Your MySQL database is ready.

You can exit MySQL:
```sql
exit
```

---

## 📦 Setting Up MongoDB Database

### Step 1: Start MongoDB Server

#### Windows:

MongoDB should already be running as a service. Verify:

```bash
# Check if MongoDB service is running
sc query MongoDB
```

If not running:
```bash
net start MongoDB
```

#### Mac/Linux:
```bash
brew services start mongodb-community@7.0
# or
sudo systemctl start mongod
```

---

### Step 2: Connect to MongoDB

Open a new Command Prompt or Terminal:

```bash
mongosh
```

**Expected Output:**
```
Current Mongosh Log ID: 65abc123...
Connecting to: mongodb://127.0.0.1:27017
Using MongoDB: 7.0.x
Using Mongosh: 2.x.x

test>
```

✅ You're now connected to MongoDB!

---

### Step 3: Run the MongoDB Setup Script

**Option A: Load script from mongosh**

```javascript
// Load and run the setup script
load("d:/MTECH/SEM 2/MDBMS/project/database/mongodb_setup.js")
```

**Option B: Run from command line**

Exit mongosh first:
```javascript
exit
```

Then run:
```bash
mongosh < "d:/MTECH/SEM 2/MDBMS/project/database/mongodb_setup.js"
```

---

### Step 4: Verify Collections Were Created

Connect to mongosh again:
```bash
mongosh
```

Switch to the lms_db database:
```javascript
use lms_db
```

Show all collections:
```javascript
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

✅ **Success!** Your MongoDB database is ready.

Exit mongosh:
```javascript
exit
```

---

## 🔧 Running the Backend Server

The backend is the "brain" of your application - it handles login, database queries, and API requests.

### Step 1: Navigate to Backend Folder

Open Command Prompt or Terminal:

```bash
cd "d:/MTECH/SEM 2/MDBMS/project/backend"
```

**What is cd?** "Change Directory" - moves you to a different folder.

---

### Step 2: Install Dependencies

```bash
npm install
```

**What's happening?**
- npm reads `package.json` (list of required libraries)
- Downloads all libraries to `node_modules` folder
- This takes 1-3 minutes

**Expected Output:**
```
added 245 packages in 45s
```

> **First time?** This creates a `node_modules` folder with all the code libraries.

---

### Step 3: Configure Environment Variables

**What is a .env file?** It stores sensitive configuration (passwords, API keys) that shouldn't be in your code.

Check if `.env` file exists:

```bash
# Windows
dir .env

# Mac/Linux
ls -la .env
```

If it doesn't exist, create it:

```bash
# Windows
notepad .env

# Mac/Linux
nano .env
```

**Copy this into the .env file:**

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here
MYSQL_DATABASE=lms_db

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/lms_db

# JWT Configuration (for authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Rate Limiting (security)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ CRITICAL:** Change `your_mysql_password_here` to your actual MySQL password!

**Save the file:**
- Notepad: File → Save
- Nano: Press `Ctrl+O`, then `Enter`, then `Ctrl+X`

---

### Step 4: Seed the Database

**What is seeding?** Creating sample data (users, courses, etc.) so you can test the application.

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

**Write down these credentials!** You'll need them to login.

---

### Step 5: Start the Backend Server

```bash
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ MySQL connected successfully
✅ MongoDB connected successfully
```

✅ **Success!** Your backend is running.

> **IMPORTANT:** Keep this terminal window open! Don't close it or press Ctrl+C.

---

## 🎨 Running the Frontend Application

The frontend is the website users see and interact with.

### Step 1: Open a NEW Terminal Window

**Don't close the backend terminal!** You need both running.

- **Windows:** Open a new Command Prompt window
- **Mac/Linux:** Open a new Terminal window

---

### Step 2: Navigate to Frontend Folder

```bash
cd "d:/MTECH/SEM 2/MDBMS/project/frontend"
```

---

### Step 3: Install Dependencies

```bash
npm install
```

**Expected Output:**
```
added 156 packages in 30s
```

---

### Step 4: Start the Frontend Server

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

✅ **Success!** Your frontend is running.

> **IMPORTANT:** Keep this terminal window open too!

---

## 🌐 Testing Your Application

### Step 1: Open Your Browser

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **http://localhost:5173**

**What is localhost?** Your own computer. Port 5173 is where the frontend is running.

---

### Step 2: You Should See the Landing Page

You should see a beautiful landing page with:
- "Welcome to EduNex" or similar
- Login/Register buttons
- Modern design

---

### Step 3: Login as a Student

Click **"Login"** and use these credentials:

```
Email: arjun@student.lms.edu
Password: student123
```

**What you should see:**
- Dashboard with stats (attendance rate, pending assignments)
- Navigation menu (Dashboard, Courses, Assignments, Grades)

---

### Step 4: Test Student Features

**Enroll in a Course:**
1. Click "Enroll Course" in the menu
2. You'll see available courses
3. Click "Enroll Now" on any course
4. ✅ Success message should appear

**View Your Courses:**
1. Click "My Courses"
2. You should see the course you just enrolled in

**View Assignments:**
1. Click "Assignments"
2. You should see a list of assignments

**View Grades:**
1. Click "Grades"
2. You should see your grades

---

### Step 5: Test Teacher Portal

**Logout:**
1. Click your name in the top-right
2. Click "Logout"

**Login as Teacher:**
```
Email: dr.sharma@lms.edu
Password: teacher123
```

**Create an Assignment:**
1. Click "Create Assignment"
2. Fill in the form:
   - Select a course
   - Enter title: "Test Assignment"
   - Enter description
   - Set due date
   - Enter max marks
3. Click "Create Assignment"
4. ✅ Success message should appear

---

### Step 6: Test Admin Portal

**Logout and Login as Admin:**
```
Email: admin@lms.edu
Password: admin123
```

**View Dashboard:**
- You should see system-wide statistics
- Total users, courses, enrollments

**Manage Users:**
1. Click "User Management"
2. You can create new users
3. Activate/deactivate users

---

## ✅ Verification Checklist

Go through this checklist to make sure everything works:

- [ ] MySQL is running
- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 5173)
- [ ] Can access http://localhost:5173
- [ ] Can login as student
- [ ] Can enroll in a course
- [ ] Can view assignments
- [ ] Can login as teacher
- [ ] Can create an assignment
- [ ] Can login as admin
- [ ] Can view dashboard

---

## 🐛 Common Problems & Solutions

### Problem 1: "npm: command not found"

**Cause:** Node.js is not installed or not in PATH.

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart your terminal
3. Try again

---

### Problem 2: "Error: connect ECONNREFUSED 127.0.0.1:3306"

**Cause:** MySQL server is not running.

**Solution:**
```bash
# Windows
net start MySQL80

# Mac/Linux
brew services start mysql
```

---

### Problem 3: "Error: connect ECONNREFUSED 127.0.0.1:27017"

**Cause:** MongoDB server is not running.

**Solution:**
```bash
# Windows
net start MongoDB

# Mac/Linux
brew services start mongodb-community@7.0
```

---

### Problem 4: "ER_ACCESS_DENIED_ERROR"

**Cause:** Wrong MySQL password in `.env` file.

**Solution:**
1. Open `backend/.env`
2. Update `MYSQL_PASSWORD=your_actual_password`
3. Save the file
4. Restart backend server (Ctrl+C, then `npm run dev`)

---

### Problem 5: "Port 5000 is already in use"

**Cause:** Another application is using port 5000.

**Solution:**

**Option A: Kill the process**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Option B: Change the port**
1. Edit `backend/.env`
2. Change `PORT=5000` to `PORT=5001`
3. Restart backend

---

### Problem 6: "Port 5173 is already in use"

**Cause:** Another Vite server is running.

**Solution:**
```bash
# Kill the process
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

---

### Problem 7: "Cannot find module 'express'"

**Cause:** Dependencies not installed.

**Solution:**
```bash
cd backend
npm install
```

---

### Problem 8: "Invalid credentials" when logging in

**Cause:** Database not seeded.

**Solution:**
```bash
cd backend
npm run seed
```

---

### Problem 9: Backend shows errors about database tables

**Cause:** MySQL schema not loaded.

**Solution:**
```bash
mysql -u root -p lms_db < "d:/MTECH/SEM 2/MDBMS/project/database/mysql_schema.sql"
```

---

### Problem 10: Frontend shows blank page

**Cause:** Backend is not running.

**Solution:**
1. Check if backend terminal is still running
2. If not, restart it: `cd backend && npm run dev`
3. Refresh browser

---

## 🚀 Quick Start Commands (After First Setup)

Once everything is installed, you only need these commands to start:

**Terminal 1 - Backend:**
```bash
cd "d:/MTECH/SEM 2/MDBMS/project/backend"
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd "d:/MTECH/SEM 2/MDBMS/project/frontend"
npm run dev
```

**Browser:**
```
http://localhost:5173
```

---

## 📚 Understanding the Technology Stack

### Backend Technologies:

| Technology | Purpose | Example |
|------------|---------|---------|
| **Node.js** | JavaScript runtime | Runs JavaScript on server |
| **Express** | Web framework | Handles HTTP requests |
| **MySQL2** | MySQL driver | Connects to MySQL database |
| **Mongoose** | MongoDB ODM | Makes MongoDB easier to use |
| **bcryptjs** | Password hashing | Securely stores passwords |
| **jsonwebtoken** | Authentication | Creates login tokens |

### Frontend Technologies:

| Technology | Purpose | Example |
|------------|---------|---------|
| **React** | UI library | Builds interactive interfaces |
| **Vite** | Build tool | Fast development server |
| **React Router** | Navigation | Handles page routing |
| **Axios** | HTTP client | Makes API requests |

---

## 🎓 Learning Resources

### MySQL Basics:
- **Tutorial:** https://www.mysqltutorial.org/
- **Practice:** Try running queries in MySQL Workbench
- **Example Query:**
  ```sql
  SELECT * FROM users WHERE role = 'student';
  ```

### MongoDB Basics:
- **Tutorial:** https://www.mongodb.com/docs/manual/tutorial/
- **Practice:** Use MongoDB Compass (GUI tool)
- **Example Query:**
  ```javascript
  db.assignments.find({ courseId: 1 })
  ```

### Node.js Basics:
- **Tutorial:** https://nodejs.dev/learn
- **Documentation:** https://nodejs.org/docs/

### React Basics:
- **Tutorial:** https://react.dev/learn
- **Interactive:** https://react.dev/learn/tutorial-tic-tac-toe

---

## 📞 Getting Help

### Check Logs:

**Backend Errors:**
- Look at the terminal where backend is running
- Errors will show in red

**Frontend Errors:**
- Open browser Developer Tools (F12)
- Click "Console" tab
- Look for red error messages

### Database Issues:

**Check MySQL:**
```bash
mysql -u root -p
SHOW DATABASES;
USE lms_db;
SHOW TABLES;
```

**Check MongoDB:**
```bash
mongosh
show dbs
use lms_db
show collections
```

---

## 🎉 Congratulations!

You've successfully set up and run a full-stack web application with:
- ✅ MySQL database
- ✅ MongoDB database
- ✅ Node.js/Express backend
- ✅ React frontend
- ✅ Authentication system
- ✅ Role-based access control

This is a **production-grade** Learning Management System!

---

## 📝 Next Steps

1. **Explore the code:**
   - Look at `backend/routes/` to see API endpoints
   - Look at `frontend/src/pages/` to see React components

2. **Customize it:**
   - Change colors in CSS files
   - Add new features
   - Modify database schema

3. **Learn more:**
   - Read the other documentation files
   - Try creating your own API endpoints
   - Experiment with database queries

---

## 🔄 Stopping Everything

When you're done:

1. **Stop Frontend:** Press `Ctrl+C` in frontend terminal
2. **Stop Backend:** Press `Ctrl+C` in backend terminal
3. **Stop MySQL:** `net stop MySQL80` (optional)
4. **Stop MongoDB:** `net stop MongoDB` (optional)

> **Note:** You can leave MySQL and MongoDB running - they use minimal resources.

---

**Happy Learning! 🚀**

If you get stuck, refer to the troubleshooting section or check the other documentation files in this project.
