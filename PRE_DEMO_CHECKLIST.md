# Pre-Demo Testing Checklist

**Date:** January 28, 2026  
**Review Date:** January 29, 2026  
**Time to Complete:** ~30 minutes

---

## 🎯 Purpose

This checklist ensures everything works perfectly before your demo tomorrow. Go through each item systematically.

---

## ✅ PHASE 1: Environment Setup (5 minutes)

### Database Services

- [ ] **MySQL is running**
  ```bash
  # Windows: Check Services or run
  mysql -u root -p -e "SELECT 'MySQL is running' AS status;"
  ```
  - If not running: Start MySQL service
  - Expected: Connection successful

- [ ] **MongoDB is running**
  ```bash
  # Check if MongoDB is running
  mongosh --eval "db.runCommand({ ping: 1 })"
  ```
  - If not running: Start MongoDB service
  - Expected: `{ ok: 1 }`

- [ ] **Databases are seeded**
  ```bash
  # Check MySQL
  mysql -u root -p -e "USE lms_db; SELECT COUNT(*) FROM users;"
  
  # Check MongoDB
  mongosh lms_db --eval "db.assignments.countDocuments()"
  ```
  - Expected: MySQL has users, MongoDB has assignments
  - If empty: Run seed script (`cd backend && npm run seed`)

---

## ✅ PHASE 2: Backend Testing (5 minutes)

### Start Backend Server

- [ ] **Navigate to backend folder**
  ```bash
  cd backend
  ```

- [ ] **Check .env file exists**
  ```bash
  # Windows
  dir .env
  
  # Should show .env file
  ```
  - If missing: Copy from .env.example and configure

- [ ] **Install dependencies (if needed)**
  ```bash
  npm install
  ```

- [ ] **Start backend server**
  ```bash
  npm run dev
  ```
  - Expected output:
    ```
    Server running on port 5000
    MySQL Connected: lms_db
    MongoDB Connected
    ```
  - If errors: Check database connections and .env file

- [ ] **Test API health**
  - Open browser: http://localhost:5000
  - Or use curl:
    ```bash
    curl http://localhost:5000
    ```
  - Expected: Some response (even if just "Cannot GET /")

- [ ] **Keep backend terminal open**
  - Don't close this terminal
  - Backend must stay running

---

## ✅ PHASE 3: Frontend Testing (5 minutes)

### Start Frontend Server

- [ ] **Open NEW terminal**
  - Keep backend terminal running
  - Open a second terminal window

- [ ] **Navigate to frontend folder**
  ```bash
  cd frontend
  ```

- [ ] **Install dependencies (if needed)**
  ```bash
  npm install
  ```

- [ ] **Start frontend server**
  ```bash
  npm run dev
  ```
  - Expected output:
    ```
    VITE v5.x.x  ready in xxx ms
    ➜  Local:   http://localhost:5173/
    ```

- [ ] **Frontend opens in browser**
  - Should auto-open http://localhost:5173
  - If not: Manually visit http://localhost:5173

- [ ] **Landing page loads correctly**
  - See EduNex logo
  - See hero section "Where Learning Connects"
  - See three role cards (Student, Teacher, Admin)
  - See database architecture section
  - No console errors (press F12 to check)

---

## ✅ PHASE 4: Authentication Testing (5 minutes)

### Test Login Flow

- [ ] **Click "Login" button on landing page**
  - Should navigate to /login
  - Login form appears

- [ ] **Test Admin Login**
  1. Click "Admin" demo button
  2. Credentials auto-fill: admin@lms.edu / admin123
  3. Click "Sign In"
  4. Should redirect to /admin dashboard
  5. See admin metrics and navigation

- [ ] **Logout**
  - Click logout button in sidebar
  - Should return to landing page

- [ ] **Test Teacher Login**
  1. Click "Login" → "Teacher" demo button
  2. Click "Sign In"
  3. Should redirect to /teacher dashboard
  4. See teacher metrics

- [ ] **Logout and test Student Login**
  1. Logout
  2. Login → "Student" demo button
  3. Should redirect to /student dashboard
  4. See student metrics

---

## ✅ PHASE 5: CRUD Operations Testing (10 minutes)

### Admin Portal - User Management (MySQL CRUD)

- [ ] **Login as Admin**
  - Email: admin@lms.edu
  - Password: admin123

- [ ] **Navigate to User Management**
  - Click "User Management" in sidebar
  - User table loads with data

- [ ] **CREATE: Add New User**
  1. Click "Add User" button
  2. Fill form:
     - First Name: Test
     - Last Name: Demo
     - Email: test.demo@lms.edu
     - Role: Student
     - Department: Computer Science
  3. Click "Create User"
  4. Success message appears
  5. New user appears in table

- [ ] **READ: View Users**
  - Table shows all users
  - Can see the user you just created

- [ ] **UPDATE: Edit User**
  1. Find any user
  2. Click "Edit" or toggle Active/Inactive
  3. Make a change
  4. Save
  5. Change reflects in table

- [ ] **DELETE: Remove User (Optional)**
  - Delete the test user you created
  - User removed from table

### Teacher Portal - Assignment Management (MongoDB CRUD)

- [ ] **Logout and login as Teacher**
  - Email: dr.sharma@lms.edu
  - Password: teacher123

- [ ] **Navigate to Create Assignment**
  - Click "Create Assignment" in sidebar

- [ ] **CREATE: Create Assignment**
  1. Select Course: "Database Management Systems"
  2. Title: "Test Assignment"
  3. Type: Homework
  4. Description: "This is a test"
  5. Due Date: Pick tomorrow's date
  6. Max Points: 100
  7. Click "Create Assignment"
  8. Success message appears

- [ ] **READ: View Assignments**
  - Navigate to "My Courses"
  - Click on a course
  - See assignments list (including the one you created)

### Student Portal - Enrollment (MySQL CRUD)

- [ ] **Logout and login as Student**
  - Email: arjun@student.lms.edu
  - Password: student123

- [ ] **Navigate to Enroll Course**
  - Click "Enroll Course" in sidebar

- [ ] **READ: View Available Courses**
  - See list of available courses
  - See "Enroll" buttons

- [ ] **CREATE: Enroll in Course**
  1. Find a course you're not enrolled in
  2. Click "Enroll"
  3. Success message appears
  4. Switch to "My Courses" tab
  5. See newly enrolled course

- [ ] **DELETE: Drop Course**
  1. In "My Courses" tab
  2. Find a course
  3. Click "Drop Course"
  4. Confirm
  5. Course removed from list

- [ ] **View Assignments (MongoDB READ)**
  - Navigate to "Assignments" in sidebar
  - See assignments list (including test assignment from teacher)
  - Assignments load from MongoDB

- [ ] **View Grades**
  - Navigate to "Grades" in sidebar
  - See grades table
  - Data loads correctly

---

## ✅ PHASE 6: UI/UX Testing (3 minutes)

### Visual & Interaction Testing

- [ ] **Landing page looks professional**
  - No layout issues
  - Images/icons display correctly
  - Colors match design system

- [ ] **Navigation works smoothly**
  - Sidebar links work
  - Page transitions smooth
  - No broken links

- [ ] **Forms work correctly**
  - Input fields accept text
  - Dropdowns work
  - Buttons are clickable
  - Validation messages appear

- [ ] **Tables display properly**
  - Data loads in tables
  - Columns aligned
  - Scrolling works if needed

- [ ] **Responsive design (Optional)**
  - Press F12 → Toggle device toolbar
  - Test mobile view
  - Layout adjusts properly

---

## ✅ PHASE 7: Browser Console Check (2 minutes)

### Check for Errors

- [ ] **Open browser console (F12)**
  - Click "Console" tab

- [ ] **Navigate through app**
  - Visit each portal
  - Perform CRUD operations
  - Check console after each action

- [ ] **No critical errors**
  - Warnings are okay
  - No red error messages
  - No "Failed to fetch" errors
  - No authentication errors

- [ ] **Network tab check**
  - Click "Network" tab in DevTools
  - Perform an action (e.g., login)
  - See API calls to http://localhost:5000
  - Status codes are 200 or 201 (success)

---

## ✅ PHASE 8: Documentation Review (3 minutes)

### Verify Documentation is Ready

- [ ] **README.md is complete**
  - Open and skim through
  - Quick start instructions present
  - Demo credentials listed
  - Architecture explained

- [ ] **CRUD_OPERATIONS_GUIDE.md exists**
  - Open and verify
  - Step-by-step CRUD instructions
  - Can use as reference during demo

- [ ] **DEMO_SCRIPT.md is ready**
  - Your demo script is prepared
  - Timeline makes sense
  - Talking points are clear

- [ ] **PROJECT_STATUS.md is accurate**
  - Shows 100% completion
  - Lists all features
  - Matches what you've built

---

## ✅ PHASE 9: Final Preparation (2 minutes)

### Get Ready for Tomorrow

- [ ] **Know your demo credentials**
  - Admin: admin@lms.edu / admin123
  - Teacher: dr.sharma@lms.edu / teacher123
  - Student: arjun@student.lms.edu / student123

- [ ] **Bookmark important URLs**
  - Landing: http://localhost:5173
  - Login: http://localhost:5173/login

- [ ] **Close unnecessary apps**
  - Close extra browser tabs
  - Close unnecessary applications
  - Clean desktop if screen sharing

- [ ] **Test screen sharing (if remote demo)**
  - Open Zoom/Teams/Meet
  - Test screen share
  - Verify audio/video

- [ ] **Charge laptop**
  - Ensure laptop is charged
  - Have charger ready

- [ ] **Prepare backup plan**
  - If demo fails, you can show code
  - Have documentation ready
  - Can explain architecture verbally

---

## 🚨 Troubleshooting Guide

### Common Issues & Solutions

**Issue: MySQL won't connect**
- Solution: Check MySQL service is running
- Check .env credentials match MySQL setup
- Try: `mysql -u root -p` to test connection

**Issue: MongoDB won't connect**
- Solution: Check MongoDB service is running
- Check connection string in .env
- Try: `mongosh` to test connection

**Issue: Backend crashes on start**
- Solution: Check error message
- Verify all dependencies installed: `npm install`
- Check .env file exists and is configured

**Issue: Frontend shows blank page**
- Solution: Check browser console (F12)
- Verify backend is running
- Check API URL in frontend code

**Issue: Login fails**
- Solution: Check backend is running
- Verify database is seeded
- Use demo login buttons instead of typing

**Issue: CRUD operations don't work**
- Solution: Check browser console for errors
- Verify backend API is responding
- Check database connections

---

## ✅ Final Checklist

**Before you sleep tonight:**
- [ ] All tests above passed
- [ ] Both servers start without errors
- [ ] All CRUD operations work
- [ ] Demo credentials work
- [ ] Documentation is ready
- [ ] You understand the architecture
- [ ] You're confident about tomorrow

**Tomorrow morning (30 min before demo):**
- [ ] Start MySQL service
- [ ] Start MongoDB service
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Quick test: Login as each role
- [ ] Open DEMO_SCRIPT.md for reference
- [ ] Take a deep breath - you're ready! 😊

---

## 📊 Test Results Summary

**Date Tested:** _________________  
**Time:** _________________

| Component | Status | Notes |
|-----------|--------|-------|
| MySQL Running | ⬜ Pass ⬜ Fail | |
| MongoDB Running | ⬜ Pass ⬜ Fail | |
| Backend Server | ⬜ Pass ⬜ Fail | |
| Frontend Server | ⬜ Pass ⬜ Fail | |
| Landing Page | ⬜ Pass ⬜ Fail | |
| Admin Login | ⬜ Pass ⬜ Fail | |
| Teacher Login | ⬜ Pass ⬜ Fail | |
| Student Login | ⬜ Pass ⬜ Fail | |
| MySQL CRUD | ⬜ Pass ⬜ Fail | |
| MongoDB CRUD | ⬜ Pass ⬜ Fail | |
| No Console Errors | ⬜ Pass ⬜ Fail | |

**Overall Status:** ⬜ READY FOR DEMO ⬜ NEEDS FIXES

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

**You've got this! Everything is ready. Just test it once more and you'll ace tomorrow's demo! 🚀**
