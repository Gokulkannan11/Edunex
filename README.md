# 🎓 EduNex - Learning Management System

A comprehensive, full-stack Learning Management System built with **MERN stack** and **hybrid database architecture** (MySQL + MongoDB).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![MySQL](https://img.shields.io/badge/mysql-8.0-orange.svg)
![MongoDB](https://img.shields.io/badge/mongodb-7.0-green.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Database Architecture](#database-architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Demo Credentials](#demo-credentials)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

---

## 🌟 Overview

**EduNex** is a production-grade Learning Management System for educational institutions. The system demonstrates:

- **Hybrid Database Architecture** (MySQL + MongoDB)
- **Database Normalization** (3NF)
- **Complex SQL Queries** (JOINs, Subqueries, Aggregations)
- **NoSQL Document Storage**
- **ACID Transactions**
- **Role-Based Access Control**

### Why This Architecture?

#### MySQL (Relational Database)
- Structured data: users, courses, enrollments, attendance
- ACID compliance for academic records
- Referential integrity with foreign keys
- Complex queries with multi-table JOINs

#### MongoDB (Document Database)
- Flexible schemas for assignments with varying rubrics
- Nested documents for course content
- High write volume for notifications and logs
- Horizontal scalability

---

## ✨ Features

### 👨‍🎓 Student Features
- View enrolled courses
- Check attendance records
- View grades and assignments
- Submit assignments
- Track academic performance

### 👨‍🏫 Teacher Features
- Manage courses
- Mark attendance
- Create and grade assignments
- View student roster
- Generate reports

### 👨‍💼 Admin Features
- User management (CRUD)
- Course management
- System analytics
- Enrollment management
- Audit trails

### 🔐 Security
- JWT authentication
- Bcrypt password hashing
- Role-based access control
- Input validation
- SQL injection prevention
- XSS protection

---

## 🛠️ Technology Stack

### Frontend
- React 18
- Vite
- React Router v6
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- JWT
- Bcrypt

### Databases
- MySQL 8.0
- MongoDB 7.0
- Mongoose
- mysql2

---

## 🗄️ Database Architecture

```
┌─────────────────────────────────────────┐
│       APPLICATION LAYER                  │
│       (Express.js Backend)               │
└─────────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
┌─────────┐      ┌──────────────┐
│  MySQL  │      │   MongoDB    │
├─────────┤      ├──────────────┤
│ users   │      │ assignments  │
│ courses │      │ submissions  │
│ enroll  │      │ content      │
│ attend  │      │ notifications│
│ grades  │      │ logs         │
└─────────┘      └──────────────┘
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v18+)
- MySQL 8.0
- MongoDB 7.0
- Git

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd project
```

### Step 2: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Setup MySQL

```bash
# Start MySQL
net start MySQL80

# Import schema
mysql -u root -p < database/mysql_schema.sql
```

### Setup MongoDB

```bash
# Start MongoDB
net start MongoDB

# Import data
mongosh < database/mongodb_setup.js
```

### Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=lms_db

MONGODB_URI=mongodb://localhost:27017/lms_db

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

---

## ▶️ Running the Application

### Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 🔑 Demo Credentials

### Admin
```
Email: admin@lms.edu
Password: admin123
```

### Teacher
```
Email: dr.sharma@lms.edu
Password: teacher123
```

### Student
```
Email: arjun@student.lms.edu
Password: student123
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "departmentId": 1
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Student Endpoints

```http
GET /student/dashboard       # Dashboard data
GET /student/courses         # Enrolled courses
GET /student/attendance/:id  # Attendance records
GET /student/grades/:id      # Course grades
POST /student/enroll         # Enroll in course
```

### Teacher Endpoints

```http
GET /teacher/dashboard       # Dashboard data
GET /teacher/courses         # Teaching courses
GET /teacher/students/:id    # Course students
POST /teacher/attendance     # Mark attendance
POST /teacher/grade          # Submit grade
```

### Admin Endpoints

```http
GET /admin/analytics         # System analytics
GET /admin/users             # All users
POST /admin/user             # Create user
PUT /admin/user/:id          # Update user
DELETE /admin/user/:id       # Delete user
GET /admin/courses           # All courses
POST /admin/course           # Create course
```

---

## 📁 Project Structure

```
project/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
├── database/
│   ├── mysql_schema.sql
│   └── mongodb_setup.js
│
├── REVIEW_COMPONENTS.md
├── SQL_QUERIES_PRACTICE.md
└── README.md
```

---

## 🗃️ Database Schema

### MySQL Tables

- **users** - User accounts (students, teachers, admins)
- **departments** - Academic departments
- **courses** - Course catalog
- **enrollments** - Student-course relationships
- **attendance** - Attendance records
- **grades** - Assignment grades
- **course_teachers** - Teacher-course assignments

### MongoDB Collections

- **assignments** - Assignment details with rubrics
- **submissions** - Student submissions
- **course_content** - Learning materials
- **notifications** - User notifications
- **system_logs** - Audit trails

---

## 🚀 Advanced Features

### Database Views
- `student_dashboard` - Performance metrics
- `teacher_dashboard` - Teaching statistics
- `admin_analytics` - System analytics

### Stored Procedures
- `EnrollStudent()` - Validates enrollment
- `MarkAttendance()` - Batch attendance

### Triggers
- `update_user_timestamp` - Auto-update timestamps
- `after_enrollment_insert` - Audit logging

### Indexes
- Email lookups
- Course queries
- Attendance reports
- Grade calculations

---

## 📚 Learning Outcomes

✅ Database normalization (3NF)  
✅ Complex SQL queries  
✅ NoSQL document modeling  
✅ RESTful API design  
✅ Authentication & authorization  
✅ Full-stack integration  

---

## 📄 License

MIT License

---

## 👥 Authors

M.Tech Student - MDBMS Project

---

**Made with ❤️ for Database Management Systems**
