# CRUD Operations Demonstration Guide 🔧

This LMS demonstrates **complete CRUD operations** across both MySQL and MongoDB databases. Each operation is clearly visible in the web interface and reflects immediately in the databases.

---

## 📊 MySQL CRUD Operations

### 1. **Student Enrollment** (CREATE & DELETE)
**Location:** Student Portal → Enroll Course

#### CREATE Operation
- **Action:** Click "Enroll Now" on any available course
- **Database:** Inserts new row into `enrollments` table
- **SQL:** `INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)`
- **Validation:** Checks course capacity, prevents duplicate enrollments
- **Feedback:** Success message confirms database insertion

#### DELETE Operation
- **Action:** Click "Drop Course" on enrolled course
- **Database:** Deletes row from `enrollments` table
- **SQL:** `DELETE FROM enrollments WHERE student_id = ? AND course_id = ?`
- **Feedback:** Success message confirms database deletion

#### READ Operation
- **Action:** View "My Enrolled Courses" section
- **Database:** Queries `enrollments` table with JOINs
- **SQL:** 
  ```sql
  SELECT c.*, e.enrolled_at 
  FROM enrollments e 
  JOIN courses c ON e.course_id = c.id 
  WHERE e.student_id = ?
  ```

---

### 2. **User Management** (Full CRUD)
**Location:** Admin Portal → User Management

#### CREATE
- **Action:** Click "Add User" → Fill form → Submit
- **Database:** Inserts into `users` table with bcrypt password hash
- **SQL:** `INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (...)`

#### READ
- **Action:** View users table, search/filter by role
- **Database:** Queries `users` table with optional filters
- **SQL:** `SELECT * FROM users WHERE role = ? AND email LIKE ?`

#### UPDATE
- **Action:** Click "Activate" or "Deactivate" user
- **Database:** Updates `is_active` column in `users` table
- **SQL:** `UPDATE users SET is_active = ? WHERE id = ?`

#### DELETE
- **Note:** Soft delete via UPDATE (sets is_active = FALSE)
- **Alternative:** Hard delete can be implemented if needed

---

### 3. **Course Management** (Full CRUD)
**Location:** Admin Portal → Course Management

#### CREATE
- **Action:** Click "Add Course" → Fill details → Submit
- **Database:** Inserts into `courses` table
- **SQL:** `INSERT INTO courses (code, name, credits, semester, year) VALUES (...)`

#### READ
- **Action:** View courses table with enrollment counts
- **Database:** Complex query with subqueries
- **SQL:**
  ```sql
  SELECT c.*, 
    (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as enrolled_count
  FROM courses c
  ```

#### UPDATE
- **Action:** Click "Assign Teacher" → Select teacher → Submit
- **Database:** Inserts into `course_teachers` junction table
- **SQL:** `INSERT INTO course_teachers (course_id, teacher_id) VALUES (?, ?)`

#### DELETE
- **Note:** Soft delete via UPDATE (sets is_active = FALSE)
- **Can be extended:** Hard delete with CASCADE constraints

---

### 4. **Attendance Marking** (CREATE)
**Location:** Teacher Portal → Mark Attendance

#### CREATE Operation
- **Action:** Select course → Select date → Mark attendance → Save
- **Database:** Bulk insert into `attendance` table
- **SQL:** `INSERT INTO attendance (enrollment_id, date, status, marked_by) VALUES (...)`
- **Features:** 
  - Batch operations (mark entire class at once)
  - Status options: present, absent, late
  - Date-based tracking

---

## 🍃 MongoDB CRUD Operations

### 1. **Assignment Management** (Full CRUD)
**Location:** Teacher Portal → Create Assignment

#### CREATE
- **Action:** Fill assignment form → Submit
- **Database:** Creates new document in `assignments` collection
- **Code:** `Assignment.create({ courseId, title, description, type, dueDate, maxScore })`
- **Features:**
  - Flexible schema (rubric array can vary)
  - Embedded documents for rubric criteria
  - Date-based queries for due dates

#### READ
- **Action:** Student views assignments list
- **Database:** Queries `assignments` collection with filters
- **Code:** `Assignment.find({ courseId: { $in: courseIds }, isPublished: true })`
- **Features:**
  - Filtered by enrolled courses
  - Sorted by due date
  - Joined with course data from MySQL

#### UPDATE
- **Action:** Teacher can update assignment (can be extended)
- **Database:** Updates document in `assignments` collection
- **Code:** `Assignment.findByIdAndUpdate(id, { title, description })`

#### DELETE
- **Action:** Teacher can delete assignment (can be extended)
- **Database:** Removes document from `assignments` collection
- **Code:** `Assignment.findByIdAndDelete(id)`

---

### 2. **Submission Management** (CREATE & UPDATE)
**Location:** Student Portal → Assignments → Submit

#### CREATE
- **Action:** Click assignment → Enter content → Submit
- **Database:** Creates document in `submissions` collection
- **Code:** `Submission.create({ assignmentId, studentId, content, isLate })`

#### UPDATE
- **Action:** Resubmit assignment (updates existing submission)
- **Database:** Updates existing submission document
- **Code:** 
  ```javascript
  Submission.findOneAndUpdate(
    { assignmentId, studentId },
    { content, submittedAt: new Date() }
  )
  ```

#### READ
- **Action:** View submission status in assignments list
- **Database:** Queries `submissions` collection
- **Code:** `Submission.find({ studentId, assignmentId: { $in: assignmentIds } })`

---

## 🎯 CRUD Operations Summary Table

| Operation | MySQL Examples | MongoDB Examples |
|-----------|----------------|------------------|
| **CREATE** | Enroll student, Create user, Mark attendance | Create assignment, Submit assignment |
| **READ** | View courses, View users, View grades | View assignments, View submissions |
| **UPDATE** | Activate/deactivate user, Assign teacher | Update submission, Update assignment |
| **DELETE** | Unenroll student, Delete enrollment | Delete assignment (can extend) |

---

## 🔍 How to Demonstrate CRUD in Review

### For MySQL:
1. **Login as Student** → Go to "Enroll Course"
2. **Show available courses** (READ from `courses` table)
3. **Click "Enroll Now"** (CREATE in `enrollments` table)
4. **Verify in "My Courses"** (READ with JOIN)
5. **Click "Drop Course"** (DELETE from `enrollments` table)
6. **Show it's gone** (Verify DELETE worked)

### For MongoDB:
1. **Login as Teacher** → Go to "Create Assignment"
2. **Fill form and submit** (CREATE in `assignments` collection)
3. **Login as Student** → View assignments (READ from MongoDB)
4. **Submit assignment** (CREATE in `submissions` collection)
5. **Resubmit** (UPDATE existing submission)

### For Admin (Full CRUD):
1. **Go to User Management**
2. **Create new user** (CREATE)
3. **Search/filter users** (READ with filters)
4. **Deactivate user** (UPDATE)
5. **Show in table** (Verify UPDATE)

---

## 💡 Database Verification

### Check MySQL Operations:
```sql
-- View enrollments
SELECT * FROM enrollments WHERE student_id = 5;

-- View attendance
SELECT * FROM attendance WHERE date = '2025-01-28';

-- View users
SELECT * FROM users WHERE role = 'student';
```

### Check MongoDB Operations:
```javascript
// View assignments
db.assignments.find({ courseId: 1 })

// View submissions
db.submissions.find({ studentId: 5 })
```

---

## 🚀 Key Features

✅ **Real-time Updates** - All operations reflect immediately in UI
✅ **Validation** - Prevents duplicate enrollments, capacity checks
✅ **Error Handling** - Clear error messages for failed operations
✅ **Visual Feedback** - Success/error alerts after each operation
✅ **Database Integrity** - Foreign key constraints, unique indexes
✅ **Polyglot Persistence** - Demonstrates when to use SQL vs NoSQL

---

This comprehensive CRUD implementation showcases professional database management practices suitable for production applications.
