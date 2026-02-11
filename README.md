# EduNex - Learning Management System 🎓

A full-stack Learning Management System demonstrating **polyglot persistence** with MySQL and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- MongoDB 7.0+

### 1. Database Setup

**MySQL:**
```bash
mysql -u root -p < database/mysql_schema.sql
```

**MongoDB:**
```bash
mongosh < database/mongodb_setup.js
```

### 2. Backend Setup

```bash
cd backend
npm install

# Configure environment
# Edit .env file with your database credentials

# Seed the database with sample data
npm run seed

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application

Open http://localhost:5173

**Demo Credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.edu | admin123 |
| Teacher | dr.sharma@lms.edu | teacher123 |
| Student | arjun@student.lms.edu | student123 |

---

## 🏗️ Architecture

### Database Strategy (Polyglot Persistence)

| Database | Purpose | Data Stored |
|----------|---------|-------------|
| **MySQL** | Relational data requiring ACID | Users, Courses, Enrollments, Attendance, Grades |
| **MongoDB** | Flexible schema, high writes | Assignments, Submissions, Notifications, Logs |

### Why This Design?

**MySQL for:**
- User authentication (password hashing, sessions)
- Course-student relationships (enrollment management)
- Attendance tracking (fixed schema, date-based queries)
- Grade calculations (numeric precision, aggregations)
- ACID transactions for enrollment process

**MongoDB for:**
- Assignments (variable rubrics, flexible content types)
- Submissions (varying content: text, files, links)
- Activity logs (high write volume, schema evolution)
- Notifications (flexible payload structure)

---

## 📁 Project Structure

```
project/
├── database/
│   ├── mysql_schema.sql      # MySQL tables, views, procedures
│   └── mongodb_setup.js      # MongoDB collections, indexes
├── backend/
│   ├── config/database.js    # DB connections
│   ├── middleware/           # Auth, error handling
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── scripts/seed.js       # Sample data seeder
│   ├── app.js                # Express config
│   └── server.js             # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI
│   │   ├── pages/            # Route components
│   │   ├── context/          # Auth state
│   │   └── services/         # API client
│   └── index.html
└── README.md
```

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Student Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/student/dashboard | Dashboard stats |
| GET | /api/student/courses | Enrolled courses |
| GET | /api/student/assignments | All assignments |
| GET | /api/student/grades | Grade records |

### Teacher Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/teacher/dashboard | Dashboard stats |
| GET | /api/teacher/courses | Taught courses |
| POST | /api/teacher/assignments | Create assignment (MongoDB) |
| POST | /api/teacher/attendance | Mark attendance (MySQL) |

### Admin Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | System analytics |
| GET/POST | /api/admin/users | User management |
| GET/POST | /api/admin/courses | Course management |

---

## 🔧 CRUD Operations Demo

This LMS provides **complete CRUD operations** visible in the web interface:

### MySQL CRUD
| Operation | Feature | Location |
|-----------|---------|----------|
| **CREATE** | Enroll in course | Student → Enroll Course |
| **READ** | View enrolled courses | Student → My Courses |
| **UPDATE** | Activate/deactivate user | Admin → User Management |
| **DELETE** | Drop course | Student → Enroll Course |

### MongoDB CRUD
| Operation | Feature | Location |
|-----------|---------|----------|
| **CREATE** | Create assignment | Teacher → Create Assignment |
| **READ** | View assignments | Student → Assignments |
| **UPDATE** | Resubmit assignment | Student → Submit Assignment |
| **DELETE** | Delete assignment | Teacher (can extend) |

**📖 See [CRUD_OPERATIONS_GUIDE.md](CRUD_OPERATIONS_GUIDE.md) for detailed demonstration steps.**

---

## 🎨 Features

### Student Portal
- Dashboard with attendance rate, pending assignments
- View enrolled courses
- Track assignments and due dates
- View grades with percentage calculations

### Teacher Portal
- Course management with student lists
- Create assignments (stored in MongoDB)
- Mark attendance (stored in MySQL)
- Grade submissions

### Admin Portal
- System-wide analytics
- User management (CRUD)
- Course management
- Teacher assignment

---

## 🛠️ Technologies

**Backend:**
- Node.js + Express
- MySQL2 (connection pool)
- Mongoose (MongoDB ODM)
- JWT authentication
- bcryptjs for password hashing

**Frontend:**
- React 18 + Vite
- React Router v6
- Axios for API calls
- date-fns for date formatting

**Security:**
- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting
- Input validation

---

## 📊 Database Schema Highlights

### MySQL Tables (Normalized to 3NF)
- **users**: id, email, password_hash, role, department_id
- **courses**: id, code, name, credits, semester, year
- **enrollments**: student_id, course_id (with capacity check)
- **attendance**: enrollment_id, date, status
- **grades**: enrollment_id, assignment_id (links to MongoDB)

### MongoDB Collections
- **assignments**: courseId, title, type, dueDate, rubric (flexible)
- **submissions**: assignmentId, studentId, content, status

---

## 👨‍💻 Author

Built as a MDBMS project demonstrating polyglot persistence in web applications.
