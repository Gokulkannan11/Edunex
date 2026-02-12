# Frontend Implementation Plan
## Learning Management System - React Dashboard

---

## 📋 Project Overview

A comprehensive React-based frontend for a multi-database Learning Management System with role-based access control (RBAC) for **Admin**, **Teacher**, and **Student** roles.

| Aspect | Specification |
|--------|---------------|
| **Framework** | React 18+ with React Router v6 |
| **State Management** | Context API + useReducer (lightweight global state) |
| **Styling** | CSS Modules with modern design (glassmorphism, gradients) |
| **Charts** | Chart.js with react-chartjs-2 |
| **Graph Visualization** | D3.js for Neo4j learning path visualization |
| **HTTP Client** | Axios with interceptors |
| **Authentication** | JWT stored in localStorage |

---

## 🗄️ Database-to-Frontend Mapping

Understanding which database powers which frontend feature:

### MySQL (Relational Data)
| Feature | Frontend Component | Data |
|---------|-------------------|------|
| User Authentication | Login, Register | users table |
| Course Catalog | Course listings | courses, departments |
| Enrollments | Enrollment buttons | enrollments |
| Attendance | Calendar view | attendance |
| Grades | Grade tables | grades |

### MongoDB (Document Data)
| Feature | Frontend Component | Data |
|---------|-------------------|------|
| Assignments | Assignment cards | assignments collection |
| Submissions | Upload forms | submissions collection |
| Course Content | Content viewer | course_content collection |
| Notifications | Notification bell | notifications collection |
| Activity Logs | Admin logs view | system_logs collection |

### Neo4j (Graph Data)
| Feature | Frontend Component | Data |
|---------|-------------------|------|
| Learning Path | D3.js visualization | Course → Topic → Prerequisite |
| Recommendations | "Recommended for you" | RECOMMENDS relationships |
| Academic Network | Network graph | Student → Course → Teacher |
| Prerequisite Chain | Dependency tree | PREREQUISITE_OF relationships |

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html                # Main HTML template
│   └── favicon.ico               # LMS favicon
├── src/
│   ├── assets/
│   │   └── images/               # Static images
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.js         # Role-based navigation
│   │   │   ├── Sidebar.js        # Collapsible sidebar
│   │   │   ├── Card.js           # Reusable card component
│   │   │   ├── Modal.js          # Modal dialog
│   │   │   ├── Button.js         # Styled buttons
│   │   │   ├── Loading.js        # Loading spinner
│   │   │   ├── Toast.js          # Notification toasts
│   │   │   ├── Table.js          # Data table with pagination
│   │   │   └── FormInput.js      # Styled form inputs
│   │   ├── charts/
│   │   │   ├── GradeChart.js     # Grades visualization
│   │   │   ├── AttendanceChart.js # Attendance chart
│   │   │   ├── ProgressChart.js  # Course progress
│   │   │   └── AnalyticsChart.js # Admin analytics
│   │   ├── graphs/
│   │   │   ├── LearningPath.js   # D3.js Neo4j graph
│   │   │   ├── NetworkGraph.js   # Academic network
│   │   │   └── PrerequisiteTree.js # Course prerequisites
│   │   └── layout/
│   │       ├── Layout.js         # Main layout wrapper
│   │       ├── Header.js         # Top header
│   │       └── Footer.js         # Footer component
│   ├── context/
│   │   ├── AuthContext.js        # Authentication state
│   │   ├── ThemeContext.js       # Dark/Light theme
│   │   └── NotificationContext.js # Toast notifications
│   ├── hooks/
│   │   ├── useAuth.js            # Custom auth hook
│   │   ├── useFetch.js           # Data fetching hook
│   │   └── useForm.js            # Form handling hook
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Register.js       # Registration page
│   │   │   └── ForgotPassword.js # Password recovery
│   │   ├── student/
│   │   │   ├── Dashboard.js      # Student dashboard
│   │   │   ├── Courses.js        # My courses + enrollment
│   │   │   ├── CourseDetail.js   # Single course view
│   │   │   ├── Assignments.js    # Assignment list (MongoDB)
│   │   │   ├── SubmitAssignment.js # File upload submission
│   │   │   ├── Grades.js         # Grades with charts
│   │   │   ├── Attendance.js     # Attendance calendar
│   │   │   └── LearningPath.js   # Neo4j visualization
│   │   ├── teacher/
│   │   │   ├── Dashboard.js      # Teacher dashboard
│   │   │   ├── MyCourses.js      # Courses I teach
│   │   │   ├── CourseStudents.js # Students in course
│   │   │   ├── CreateAssignment.js # Create assignment (MongoDB)
│   │   │   ├── ViewSubmissions.js # View student submissions
│   │   │   ├── MarkAttendance.js # Mark attendance (MySQL)
│   │   │   └── GradeStudents.js  # Grade assignments
│   │   ├── admin/
│   │   │   ├── Dashboard.js      # Admin dashboard
│   │   │   ├── UserManagement.js # CRUD users
│   │   │   ├── CourseManagement.js # CRUD courses
│   │   │   ├── DepartmentManagement.js # CRUD departments
│   │   │   ├── EnrollmentManagement.js # Manage enrollments
│   │   │   ├── Analytics.js      # System analytics
│   │   │   └── SystemLogs.js     # Activity logs (MongoDB)
│   │   ├── shared/
│   │   │   ├── Profile.js        # User profile page
│   │   │   ├── Settings.js       # User settings
│   │   │   └── NotFound.js       # 404 page
│   │   └── landing/
│   │       └── Home.js           # Landing page
│   ├── services/
│   │   ├── api.js                # Axios instance
│   │   ├── authService.js        # Auth API calls
│   │   ├── studentService.js     # Student API calls
│   │   ├── teacherService.js     # Teacher API calls
│   │   ├── adminService.js       # Admin API calls
│   │   └── graphService.js       # Neo4j graph API calls
│   ├── utils/
│   │   ├── constants.js          # API URLs, roles
│   │   ├── helpers.js            # Utility functions
│   │   └── validators.js         # Form validation
│   ├── styles/
│   │   ├── variables.css         # CSS custom properties
│   │   ├── global.css            # Global styles
│   │   ├── components.css        # Component styles
│   │   └── themes.css            # Dark/Light themes
│   ├── App.js                    # Main app with routing
│   └── index.js                  # Entry point
├── package.json                  # Dependencies
└── .env                          # Environment variables
```

---

## 🎨 UI/UX Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* Role Colors */
  --student-color: #10b981;    /* Green */
  --teacher-color: #8b5cf6;    /* Purple */
  --admin-color: #ef4444;      /* Red */
  
  /* Semantic Colors */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
  
  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.25);
  --glass-border: rgba(255, 255, 255, 0.18);
}
```

### Typography
```css
/* Font Stack */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-heading: 'Outfit', 'Inter', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
```

### Component Styles
- **Cards**: Glassmorphism with blur effect, subtle shadows
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Floating labels, focus animations
- **Navigation**: Collapsed sidebar with smooth transitions
- **Modals**: Centered with backdrop blur

---

## 🔒 Role-Based Access Control (RBAC)

### Route Protection
```javascript
// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

### Role-Based Navigation

| Role | Sidebar Menu Items |
|------|-------------------|
| **Student** | Dashboard, My Courses, Assignments, Grades, Attendance, Learning Path |
| **Teacher** | Dashboard, My Courses, Create Assignment, Mark Attendance, Grade Students |
| **Admin** | Dashboard, Users, Courses, Departments, Enrollments, Analytics, System Logs |

---

## 📱 Page Implementation Details

### Student Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Welcome back, {firstName}!                          │
├───────────────┬───────────────┬───────────────┬────────────┤
│ Enrolled      │ Pending       │ Average       │ Attendance │
│ Courses: 5    │ Assignments: 3│ Grade: 85%    │ Rate: 92%  │
├───────────────┴───────────────┴───────────────┴────────────┤
│              Upcoming Assignments (MongoDB)                 │
│  ┌─────────────────────────────────────────────────┐       │
│  │ 📝 DBMS Assignment 2 - Due: Jan 30             │       │
│  │ 📝 Web Dev Project   - Due: Feb 1              │       │
│  └─────────────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────────────┤
│              Grade Progress Chart (Chart.js)                │
│              [Bar chart showing course grades]              │
└─────────────────────────────────────────────────────────────┘
```

### Teacher Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Teacher Dashboard                                   │
├───────────────┬───────────────┬───────────────┬────────────┤
│ My Courses: 3 │ Total         │ Pending       │ Avg Class  │
│               │ Students: 120 │ Submissions: 8│ Grade: 78% │
├───────────────┴───────────────┴───────────────┴────────────┤
│                    My Courses                               │
│  ┌────────────────────┬────────────────────┐               │
│  │ DBMS (45 students) │ Web Dev (35 students)│             │
│  └────────────────────┴────────────────────┘               │
├─────────────────────────────────────────────────────────────┤
│              Quick Actions                                  │
│  [Create Assignment] [Mark Attendance] [Grade Students]     │
└─────────────────────────────────────────────────────────────┘
```

### Admin Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ Header: System Administration                               │
├───────────────┬───────────────┬───────────────┬────────────┤
│ Total Users   │ Active        │ Total         │ Departments│
│ 500           │ Courses: 25   │ Enrollments:  │ 8          │
│               │               │ 1200          │            │
├───────────────┴───────────────┴───────────────┴────────────┤
│              User Distribution (Pie Chart)                  │
│              Students: 400 | Teachers: 80 | Admins: 20     │
├─────────────────────────────────────────────────────────────┤
│              Recent System Activity (MongoDB logs)          │
│  ┌─────────────────────────────────────────────────┐       │
│  │ • User john.doe registered - 2 hours ago        │       │
│  │ • Course DBMS created - 3 hours ago             │       │
│  └─────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Neo4j Graph Visualization (D3.js)

### Learning Path Component

The Learning Path page visualizes:
1. **Course → Topic Relationships** (PART_OF)
2. **Topic → Prerequisite Mapping** (PREREQUISITE_OF)
3. **Recommended Courses** (RECOMMENDS)

```javascript
// LearningPath.js - D3.js force-directed graph
const LearningPath = () => {
  useEffect(() => {
    // Fetch graph data from Neo4j endpoint
    const fetchGraph = async () => {
      const response = await graphService.getLearningPath(courseId);
      // response: { nodes: [...], relationships: [...] }
      
      // D3.js force simulation
      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(relationships))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width/2, height/2));
    };
  }, [courseId]);
};
```

### Network Visualization
- **Nodes**: Courses (circles), Topics (rectangles)
- **Edges**: Solid lines for PART_OF, dashed for PREREQUISITE_OF
- **Colors**: Each department gets a unique color
- **Interactivity**: Hover for details, click to navigate

---

## 🚀 Implementation Phases

### Phase 1: Project Setup (Day 1)
- [ ] Initialize React project with Vite
- [ ] Install dependencies (react-router, axios, chart.js, d3)
- [ ] Set up folder structure
- [ ] Configure environment variables
- [ ] Create CSS design system (variables, global styles)

### Phase 2: Common Components (Day 1-2)
- [ ] Navbar with role-based menu
- [ ] Sidebar with collapsible navigation
- [ ] Card, Modal, Button components
- [ ] Loading spinner and Toast notifications
- [ ] Table with pagination and sorting
- [ ] Form inputs with validation

### Phase 3: Authentication Pages (Day 2)
- [ ] Login page with form validation
- [ ] Register page with role selection
- [ ] AuthContext and useAuth hook
- [ ] Protected route wrapper
- [ ] JWT token management (axios interceptors)

### Phase 4: Student Portal (Day 3-4)
- [ ] Dashboard with stats cards
- [ ] Courses page with enrollment
- [ ] Assignments list (MongoDB integration)
- [ ] Assignment submission with file upload
- [ ] Grades page with Chart.js
- [ ] Attendance calendar view
- [ ] Learning Path (Neo4j D3.js visualization)

### Phase 5: Teacher Portal (Day 5-6)
- [ ] Dashboard with class analytics
- [ ] My Courses management
- [ ] Create/Edit Assignment form (MongoDB)
- [ ] View student submissions
- [ ] Mark Attendance interface (MySQL)
- [ ] Grade students with bulk operations

### Phase 6: Admin Portal (Day 7-8)
- [ ] System dashboard with analytics
- [ ] User management (CRUD all roles)
- [ ] Course management
- [ ] Department management
- [ ] Enrollment management
- [ ] System logs viewer (MongoDB)

### Phase 7: Polish & Testing (Day 9-10)
- [ ] Responsive design for all pages
- [ ] Dark/Light theme implementation
- [ ] Loading states and error handling
- [ ] Form validation messages
- [ ] Cross-browser testing
- [ ] Performance optimization

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "axios": "^1.6.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "d3": "^7.8.5",
    "date-fns": "^3.0.0",
    "react-icons": "^5.0.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "eslint": "^8.55.0"
  }
}
```

---

## 🧪 Verification Plan

### Automated Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage
```

### Manual Testing Checklist

#### Authentication Flow
- [ ] Register as Student → login → verify student dashboard
- [ ] Register as Teacher → login → verify teacher dashboard
- [ ] Register as Admin → login → verify admin dashboard
- [ ] Test invalid login (wrong password)
- [ ] Test session expiry (JWT timeout)

#### Student Features
- [ ] View enrolled courses
- [ ] Enroll in new course
- [ ] View assignments from MongoDB
- [ ] Submit assignment with file upload
- [ ] View grades with charts
- [ ] Check attendance calendar
- [ ] View learning path (Neo4j graph)

#### Teacher Features
- [ ] View courses I teach
- [ ] Create new assignment
- [ ] View student submissions
- [ ] Mark attendance for a session
- [ ] Grade student submissions

#### Admin Features
- [ ] List all users
- [ ] Create new user (any role)
- [ ] Edit user details
- [ ] Delete user
- [ ] Manage courses/departments
- [ ] View system analytics
- [ ] Check system logs

---

## 🔗 API Integration Points

| Frontend Feature | Backend Endpoint | Database |
|-----------------|------------------|----------|
| Login | POST /api/auth/login | MySQL |
| Get Courses | GET /api/student/courses | MySQL |
| Create Assignment | POST /api/teacher/assignments | MongoDB |
| Get Learning Path | GET /api/graph/learning-path/:id | Neo4j |
| Get System Logs | GET /api/admin/logs | MongoDB |

---

## ✅ Success Criteria

- [ ] All 3 portals fully functional with CRUD operations
- [ ] Beautiful, modern UI with animations
- [ ] Charts and visualizations working
- [ ] Neo4j learning path visualization
- [ ] Responsive design (mobile + desktop)
- [ ] No console errors
- [ ] Smooth user experience
- [ ] Authentication flow working
- [ ] Role-based access enforced

---

**Next Steps**: Start Phase 1 - Project Setup with Vite and React Router configuration.
