# Backend Implementation Plan
## Learning Management System - Node.js/Express API with Polyglot Persistence

---

## 📋 Project Overview

A comprehensive Node.js/Express backend API implementing **polyglot persistence** with MySQL, MongoDB, and Neo4j for a college Learning Management System.

| Aspect | Specification |
|--------|---------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 4.x |
| **MySQL Driver** | mysql2/promise with connection pooling |
| **MongoDB ODM** | Mongoose 8.x |
| **Neo4j Driver** | neo4j-driver 5.x |
| **Authentication** | JWT (jsonwebtoken) |
| **Security** | Helmet, CORS, bcrypt, rate-limiting |
| **Validation** | express-validator |

---

## 🗄️ Database Responsibility Matrix

### Why This Database?

| Database | Responsibility | Justification |
|----------|---------------|---------------|
| **MySQL** | Users, Courses, Enrollments, Attendance, Grades, Departments | Relational data with strict consistency, complex joins, ACID transactions, normalized schema (3NF) |
| **MongoDB** | Assignments, Submissions, Course Content, Notifications, Logs | Semi-structured data with varying schemas (assignment types, rubrics), high write volumes (logs), flexible content storage |
| **Neo4j** | Learning Paths, Prerequisites, Recommendations, Academic Network | Graph relationships (Course → Topic → Prerequisite), efficient traversal queries, recommendation algorithms |

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js           # All database connections
│   ├── mysql.js              # MySQL pool configuration
│   ├── mongodb.js            # Mongoose connection
│   ├── neo4j.js              # Neo4j driver setup
│   └── env.js                # Environment configuration
├── middleware/
│   ├── auth.js               # JWT authentication
│   ├── rbac.js               # Role-based access control
│   ├── errorHandler.js       # Global error handling
│   ├── validator.js          # Input validation rules
│   └── rateLimiter.js        # API rate limiting
├── models/
│   ├── mysql/
│   │   ├── User.js           # User model (MySQL queries)
│   │   ├── Course.js         # Course model
│   │   ├── Enrollment.js     # Enrollment model
│   │   ├── Attendance.js     # Attendance model
│   │   └── Grade.js          # Grade model
│   └── mongodb/
│       ├── Assignment.js     # Assignment schema
│       ├── Submission.js     # Submission schema
│       ├── CourseContent.js  # Content schema
│       ├── Notification.js   # Notification schema
│       └── SystemLog.js      # Logging schema
├── services/
│   ├── authService.js        # Authentication logic
│   ├── studentService.js     # Student business logic
│   ├── teacherService.js     # Teacher business logic
│   ├── adminService.js       # Admin business logic
│   ├── graphService.js       # Neo4j graph operations
│   └── syncService.js        # Cross-database sync
├── controllers/
│   ├── authController.js     # Auth endpoints handler
│   ├── studentController.js  # Student endpoints
│   ├── teacherController.js  # Teacher endpoints
│   ├── adminController.js    # Admin endpoints
│   ├── dashboardController.js# Dashboard data
│   └── graphController.js    # Neo4j endpoints
├── routes/
│   ├── index.js              # Route aggregator
│   ├── auth.js               # /api/auth/*
│   ├── student.js            # /api/student/*
│   ├── teacher.js            # /api/teacher/*
│   ├── admin.js              # /api/admin/*
│   ├── dashboard.js          # /api/dashboard/*
│   └── graph.js              # /api/graph/*
├── utils/
│   ├── logger.js             # Winston logging
│   ├── helpers.js            # Utility functions
│   ├── constants.js          # App constants
│   └── cypher.js             # Cypher query templates
├── scripts/
│   ├── seed.js               # Database seeding
│   └── migrate.js            # Schema migrations
├── tests/
│   ├── unit/
│   │   ├── auth.test.js
│   │   └── services.test.js
│   └── integration/
│       └── api.test.js
├── app.js                    # Express app setup
├── server.js                 # Server entry point
├── package.json
├── .env.example
└── .env
```

---

## 🔐 Security Architecture

### Authentication Flow

```
Client                           Server                         Database
  │                                │                               │
  ├─── POST /auth/login ──────────►│                               │
  │    { email, password }         │                               │
  │                                ├── Query users table ─────────►│ MySQL
  │                                │◄── User record ──────────────┤
  │                                │                               │
  │                                ├── Verify bcrypt hash          │
  │                                ├── Generate JWT token          │
  │◄── { token, user } ───────────┤                               │
  │                                │                               │
  ├─── GET /api/student/courses ──►│                               │
  │    Authorization: Bearer {JWT} │                               │
  │                                ├── Verify JWT                  │
  │                                ├── Extract user from token     │
  │                                ├── Check role = 'student'      │
  │                                ├── Query courses ─────────────►│ MySQL
  │◄── { courses: [...] } ────────┤                               │
```

### Middleware Stack

```javascript
// app.js - Middleware order matters!
app.use(helmet());              // Security headers
app.use(cors(corsOptions));     // CORS configuration
app.use(express.json());        // Parse JSON bodies
app.use(rateLimiter);           // Rate limiting
app.use(requestLogger);         // Log all requests (MongoDB)

// Protected routes
app.use('/api/student', auth, rbac(['student']), studentRoutes);
app.use('/api/teacher', auth, rbac(['teacher']), teacherRoutes);
app.use('/api/admin', auth, rbac(['admin']), adminRoutes);

// Error handling (last in chain)
app.use(errorHandler);
```

### Role-Based Access Control

```javascript
// middleware/rbac.js
const rbac = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    next();
  };
};
```

---

## 📊 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Database |
|--------|----------|-------------|----------|
| POST | `/register` | Register new user | MySQL + Neo4j |
| POST | `/login` | User login | MySQL |
| GET | `/me` | Get current user | MySQL |
| PUT | `/profile` | Update profile | MySQL |
| PUT | `/password` | Change password | MySQL |
| POST | `/logout` | Invalidate token | - |

### Student Routes (`/api/student`)

| Method | Endpoint | Description | Database |
|--------|----------|-------------|----------|
| GET | `/dashboard` | Dashboard summary | MySQL + MongoDB |
| GET | `/courses` | Enrolled courses | MySQL |
| POST | `/enroll/:courseId` | Enroll in course | MySQL + Neo4j |
| GET | `/assignments` | My assignments | MongoDB |
| GET | `/assignments/:id` | Assignment detail | MongoDB |
| POST | `/submissions` | Submit assignment | MongoDB |
| GET | `/grades` | My grades | MySQL |
| GET | `/attendance` | Attendance records | MySQL |
| GET | `/notifications` | My notifications | MongoDB |

### Teacher Routes (`/api/teacher`)

| Method | Endpoint | Description | Database |
|--------|----------|-------------|----------|
| GET | `/dashboard` | Teacher dashboard | MySQL |
| GET | `/courses` | Courses I teach | MySQL |
| GET | `/courses/:id/students` | Students in course | MySQL |
| POST | `/assignments` | Create assignment | MongoDB |
| PUT | `/assignments/:id` | Update assignment | MongoDB |
| DELETE | `/assignments/:id` | Delete assignment | MongoDB |
| GET | `/submissions/:courseId` | View submissions | MongoDB |
| POST | `/attendance` | Mark attendance | MySQL |
| PUT | `/attendance/:id` | Update attendance | MySQL |
| POST | `/grades` | Submit grades | MySQL |
| PUT | `/grades/:id` | Update grade | MySQL |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Database |
|--------|----------|-------------|----------|
| GET | `/dashboard` | System analytics | All 3 |
| GET | `/users` | List all users | MySQL |
| POST | `/users` | Create user | MySQL + Neo4j |
| GET | `/users/:id` | Get user details | MySQL |
| PUT | `/users/:id` | Update user | MySQL |
| DELETE | `/users/:id` | Delete user | MySQL + Neo4j |
| GET | `/courses` | All courses | MySQL |
| POST | `/courses` | Create course | MySQL + Neo4j |
| PUT | `/courses/:id` | Update course | MySQL |
| DELETE | `/courses/:id` | Delete course | All 3 |
| GET | `/departments` | All departments | MySQL |
| POST | `/departments` | Create department | MySQL |
| GET | `/enrollments` | All enrollments | MySQL |
| GET | `/logs` | System activity logs | MongoDB |
| GET | `/analytics` | Detailed analytics | All 3 |

### Graph Routes (`/api/graph`)

| Method | Endpoint | Description | Query Type |
|--------|----------|-------------|------------|
| GET | `/learning-path/:courseId` | Course learning path | Cypher |
| GET | `/prerequisites/:courseId` | Course prerequisites | Cypher |
| GET | `/recommendations/:studentId` | Course recommendations | Cypher |
| GET | `/network/:userId` | Academic network | Cypher |
| POST | `/sync-enrollment` | Sync enrollment to graph | Cypher |

---

## 🗃️ Database Schemas

### MySQL Schema (Normalized to 3NF)

```sql
-- Users table (with role-based inheritance)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Courses table
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    credits INT NOT NULL,
    department_id INT,
    description TEXT,
    semester ENUM('Fall', 'Spring', 'Summer') NOT NULL,
    year INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Enrollments (junction table)
CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
    final_grade DECIMAL(5,2),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
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
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id),
    FOREIGN KEY (marked_by) REFERENCES users(id)
);

-- Grades table
CREATE TABLE grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    enrollment_id INT NOT NULL,
    assignment_id VARCHAR(24) NOT NULL,  -- MongoDB ObjectId reference
    score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL,
    graded_by INT NOT NULL,
    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feedback TEXT,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id),
    FOREIGN KEY (graded_by) REFERENCES users(id)
);
```

### MongoDB Schemas

```javascript
// Assignment Schema
const AssignmentSchema = new Schema({
  courseId: { type: Number, required: true },  // MySQL course ID
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['quiz', 'homework', 'project', 'exam'],
    required: true 
  },
  dueDate: { type: Date, required: true },
  maxScore: { type: Number, required: true },
  rubric: [{
    criterion: String,
    maxPoints: Number,
    description: String
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  isPublished: { type: Boolean, default: false },
  createdBy: { type: Number, required: true },  // MySQL teacher ID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Submission Schema
const SubmissionSchema = new Schema({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: Number, required: true },  // MySQL student ID
  content: { type: String },
  files: [{
    filename: String,
    url: String,
    size: Number,
    uploadedAt: Date
  }],
  submittedAt: { type: Date, default: Date.now },
  isLate: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['submitted', 'graded', 'returned'],
    default: 'submitted'
  }
});

// Course Content Schema
const CourseContentSchema = new Schema({
  courseId: { type: Number, required: true },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['lecture', 'reading', 'video', 'resource'],
    required: true
  },
  content: { type: Schema.Types.Mixed },  // Flexible content structure
  order: { type: Number, required: true },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// System Log Schema
const SystemLogSchema = new Schema({
  action: { type: String, required: true },
  userId: { type: Number },
  userEmail: { type: String },
  userRole: { type: String },
  resource: { type: String },
  details: { type: Schema.Types.Mixed },
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});
```

### Neo4j Cypher Schema

```cypher
// Node Types
// Student nodes
CREATE CONSTRAINT student_id IF NOT EXISTS FOR (s:Student) REQUIRE s.id IS UNIQUE;
(:Student { id: INT, name: STRING, email: STRING })

// Teacher nodes
CREATE CONSTRAINT teacher_id IF NOT EXISTS FOR (t:Teacher) REQUIRE t.id IS UNIQUE;
(:Teacher { id: INT, name: STRING, email: STRING })

// Course nodes
CREATE CONSTRAINT course_id IF NOT EXISTS FOR (c:Course) REQUIRE c.id IS UNIQUE;
(:Course { id: INT, code: STRING, name: STRING })

// Topic nodes
CREATE CONSTRAINT topic_name IF NOT EXISTS FOR (t:Topic) REQUIRE t.name IS UNIQUE;
(:Topic { name: STRING, description: STRING })

// Relationship Types
(:Student)-[:ENROLLED_IN { enrolledAt: DATE }]->(:Course)
(:Teacher)-[:TEACHES { since: DATE }]->(:Course)
(:Course)-[:PREREQUISITE_OF]->(:Course)
(:Topic)-[:PART_OF]->(:Course)
(:Topic)-[:PREREQUISITE_OF]->(:Topic)
(:Course)-[:RECOMMENDS { score: FLOAT }]->(:Course)
(:Student)-[:MENTORED_BY]->(:Teacher)
```

---

## 🔄 Cross-Database Synchronization

### When to Sync Data

| Event | From | To | Action |
|-------|------|-----|--------|
| User Registration | MySQL | Neo4j | Create Student/Teacher node |
| Course Creation | MySQL | Neo4j | Create Course node |
| Enrollment | MySQL | Neo4j | Create ENROLLED_IN relationship |
| Teacher Assignment | MySQL | Neo4j | Create TEACHES relationship |
| User Deletion | MySQL | Neo4j | Delete node and relationships |

### Sync Service Implementation

```javascript
// services/syncService.js
class SyncService {
  // Sync new enrollment to Neo4j
  async syncEnrollment(studentId, courseId) {
    const session = neo4j.session();
    try {
      await session.run(`
        MATCH (s:Student {id: $studentId})
        MATCH (c:Course {id: $courseId})
        MERGE (s)-[:ENROLLED_IN {enrolledAt: date()}]->(c)
      `, { studentId, courseId });
    } finally {
      await session.close();
    }
  }
  
  // Sync user creation to Neo4j
  async syncUserCreation(user) {
    const session = neo4j.session();
    const label = user.role === 'teacher' ? 'Teacher' : 'Student';
    
    try {
      await session.run(`
        CREATE (n:${label} {
          id: $id,
          name: $name,
          email: $email
        })
      `, { 
        id: user.id, 
        name: `${user.first_name} ${user.last_name}`,
        email: user.email 
      });
    } finally {
      await session.close();
    }
  }
}
```

---

## 🚀 Implementation Phases

### Phase 1: Project Setup (Day 1)
- [ ] Initialize Node.js project with npm
- [ ] Install all dependencies
- [ ] Set up folder structure
- [ ] Configure environment variables
- [ ] Set up Winston logging

### Phase 2: Database Connections (Day 2)
- [ ] Configure MySQL connection pool
- [ ] Set up Mongoose connection with event handlers
- [ ] Configure Neo4j driver
- [ ] Create connection test utility
- [ ] Implement graceful shutdown

### Phase 3: Authentication System (Day 3)
- [ ] User registration with bcrypt hashing
- [ ] Login with JWT generation
- [ ] Auth middleware for protected routes
- [ ] RBAC middleware
- [ ] Password reset functionality

### Phase 4: Student API (Day 4-5)
- [ ] Dashboard endpoint (aggregate from all DBs)
- [ ] Courses CRUD (MySQL)
- [ ] Enrollment with transaction
- [ ] Assignments listing (MongoDB)
- [ ] Submission upload (MongoDB)
- [ ] Grades and attendance (MySQL)

### Phase 5: Teacher API (Day 6-7)
- [ ] Teacher dashboard
- [ ] Assignment CRUD (MongoDB with validation)
- [ ] Submission viewing and grading
- [ ] Attendance marking (MySQL transaction)
- [ ] Grade submission with triggers

### Phase 6: Admin API (Day 8-9)
- [ ] User management (full CRUD)
- [ ] Course and department management
- [ ] Enrollment management
- [ ] System analytics (aggregation pipelines)
- [ ] Activity logs (MongoDB queries)

### Phase 7: Neo4j Integration (Day 10)
- [ ] Learning path queries
- [ ] Prerequisite chain traversal
- [ ] Course recommendations
- [ ] Academic network visualization
- [ ] Cross-database sync on mutations

### Phase 8: Advanced Features (Day 11-12)
- [ ] MySQL stored procedures integration
- [ ] MongoDB aggregation pipelines
- [ ] Transaction handling across operations
- [ ] Error handling and logging
- [ ] Rate limiting and security hardening

### Phase 9: Testing & Documentation (Day 13-14)
- [ ] Unit tests for services
- [ ] Integration tests for API endpoints
- [ ] Swagger/OpenAPI documentation
- [ ] Performance testing
- [ ] Security audit

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "mongoose": "^8.0.3",
    "neo4j-driver": "^5.15.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.55.0"
  }
}
```

---

## 🧪 Verification Plan

### Automated Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/unit/auth.test.js
```

### Test Files Structure

```
tests/
├── unit/
│   ├── auth.test.js        # Auth service tests
│   ├── student.test.js     # Student service tests
│   ├── teacher.test.js     # Teacher service tests
│   └── graph.test.js       # Neo4j service tests
└── integration/
    ├── auth.api.test.js    # Auth endpoints
    ├── student.api.test.js # Student endpoints
    ├── teacher.api.test.js # Teacher endpoints
    └── admin.api.test.js   # Admin endpoints
```

### Manual Testing Checklist

#### Database Connections
```bash
# Test all database connections
node -e "require('./config/database').testAllConnections()"
```

#### API Health Checks
```bash
# Health endpoint
curl http://localhost:5000/api/health

# Should return:
# { "status": "ok", "mysql": "connected", "mongodb": "connected", "neo4j": "connected" }
```

#### Authentication Tests
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Protected route (use token from login response)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

#### RBAC Tests
```bash
# Student trying admin route (should fail with 403)
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer <student_token>"
```

---

## 🔧 Environment Configuration

```env
# .env.example
NODE_ENV=development
PORT=5000

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=lms_db

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/lms_db

# Neo4j Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📈 Performance Optimization

### MySQL
- Connection pooling (min: 5, max: 20)
- Prepared statements for frequent queries
- Indexes on foreign keys and search columns
- Explain analyze for slow queries

### MongoDB
- Indexes on frequently queried fields
- Projection to return only needed fields
- Aggregation pipeline optimization
- Document size monitoring

### Neo4j
- Parameterized Cypher queries
- Session pooling
- Index on node properties used in MATCH
- Profile queries for optimization

---

## ✅ Success Criteria

- [ ] All API endpoints functional and tested
- [ ] Authentication and RBAC working correctly
- [ ] MySQL transactions maintaining data integrity
- [ ] MongoDB aggregations returning accurate analytics
- [ ] Neo4j graph queries efficient for learning paths
- [ ] Cross-database sync working on mutations
- [ ] Error handling returning proper status codes
- [ ] Rate limiting protecting endpoints
- [ ] Logging capturing all important events
- [ ] API documentation complete

---

**Next Steps**: Start Phase 1 - Project Setup with npm init and dependency installation.
