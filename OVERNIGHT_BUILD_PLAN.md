# 🚀 OVERNIGHT BUILD PLAN - LMS Review Ready
## Timeline: Tonight (Jan 28) → Review (Jan 29)

---

## ⏰ Time Available: ~12 hours focused work

## 🎯 MVP Scope (Simplified for Review)

### What We're Building
| Component | Technology | Focus |
|-----------|------------|-------|
| Frontend | React + Vite | 3 working dashboards |
| Backend | Node.js + Express | Auth + Core APIs |
| SQL | MySQL | Users, Courses, Enrollments |
| NoSQL | MongoDB | Assignments, Submissions |

### What We're Skipping (for now)
- ❌ Neo4j (learning paths visualization)
- ❌ Complex analytics
- ❌ File uploads
- ❌ Advanced features

---

## 📋 BUILD ORDER

### Phase 1: Database Setup (30 min)
- [ ] Create MySQL database and tables
- [ ] Create MongoDB collections
- [ ] Insert sample data

### Phase 2: Backend Core (2 hours)
- [ ] Project setup with dependencies
- [ ] Database connections (MySQL + MongoDB)
- [ ] Auth routes (register, login, me)
- [ ] Student routes (courses, assignments, grades)
- [ ] Teacher routes (assignments, attendance)
- [ ] Admin routes (users, courses)

### Phase 3: Frontend Shell (1 hour)
- [ ] Vite + React setup
- [ ] Basic CSS design system
- [ ] Auth context and protected routes
- [ ] Login + Register pages

### Phase 4: Student Portal (2 hours)
- [ ] Student dashboard with stats
- [ ] Courses list with enrollment
- [ ] Assignments list (from MongoDB)
- [ ] Grades view

### Phase 5: Teacher Portal (1.5 hours)
- [ ] Teacher dashboard
- [ ] Create assignment form
- [ ] Mark attendance page

### Phase 6: Admin Portal (1.5 hours)
- [ ] Admin dashboard with analytics
- [ ] User management table
- [ ] Course management

### Phase 7: Polish (1 hour)
- [ ] Fix bugs
- [ ] Add loading states
- [ ] Prepare demo flow

---

## 🗂️ FINAL PROJECT STRUCTURE

```
project/
├── database/
│   ├── mysql_schema.sql
│   └── mongodb_setup.js
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## ✅ DEMO FLOW FOR REVIEW

1. **Start**: Show landing page (or go straight to login)
2. **Student Demo**:
   - Login as student
   - View dashboard with enrolled courses
   - See assignments from MongoDB
   - Check grades
3. **Teacher Demo**:
   - Login as teacher
   - View courses I teach
   - Create a new assignment (stored in MongoDB)
   - Mark attendance (stored in MySQL)
4. **Admin Demo**:
   - Login as admin
   - View all users
   - Create new course
   - Show analytics

---

## 🔑 SAMPLE CREDENTIALS

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.edu | admin123 |
| Teacher | teacher@lms.edu | teacher123 |
| Student | student@lms.edu | student123 |

---

## 💾 DATABASE JUSTIFICATION (For Viva)

**"Why MySQL?"**
- Users, courses, enrollments are **relational** data
- Need **ACID transactions** for enrollment process
- **Normalized to 3NF** for data integrity
- Foreign key constraints ensure data consistency

**"Why MongoDB?"**
- Assignments have **flexible schema** (quiz vs project vs exam)
- Submission content varies (text, links, descriptions)
- **High write volume** for activity logs
- Schema can evolve without migrations

**"How do they connect?"**
- MongoDB documents store MySQL IDs as references
- Example: Assignment has `courseId: 1` pointing to MySQL course
- Backend service layer handles the integration
- Single API endpoint can query both databases

---

## 🚀 LET'S START BUILDING!
