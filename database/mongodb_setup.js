// ============================================
// LMS MongoDB Setup Script
// Learning Management System
// Run with: mongosh < mongodb_setup.js
// ============================================

// Switch to LMS database
use('lms_db');

// ============================================
// DROP EXISTING COLLECTIONS (for fresh setup)
// ============================================
db.assignments.drop();
db.submissions.drop();
db.course_content.drop();
db.notifications.drop();
db.system_logs.drop();

// ============================================
// CREATE COLLECTIONS WITH VALIDATION
// ============================================

// Assignments Collection
db.createCollection('assignments', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['courseId', 'title', 'type', 'dueDate', 'maxScore', 'createdBy'],
      properties: {
        courseId: {
          bsonType: 'int',
          description: 'MySQL course ID - required'
        },
        title: {
          bsonType: 'string',
          description: 'Assignment title - required'
        },
        description: {
          bsonType: 'string',
          description: 'Detailed description'
        },
        type: {
          enum: ['quiz', 'homework', 'project', 'exam'],
          description: 'Assignment type - required'
        },
        dueDate: {
          bsonType: 'date',
          description: 'Due date - required'
        },
        maxScore: {
          bsonType: 'int',
          minimum: 1,
          description: 'Maximum score - required'
        },
        rubric: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              criterion: { bsonType: 'string' },
              maxPoints: { bsonType: 'int' },
              description: { bsonType: 'string' }
            }
          }
        },
        isPublished: {
          bsonType: 'bool',
          description: 'Whether assignment is visible to students'
        },
        createdBy: {
          bsonType: 'int',
          description: 'MySQL teacher ID - required'
        },
        createdAt: {
          bsonType: 'date'
        },
        updatedAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// Submissions Collection
db.createCollection('submissions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['assignmentId', 'studentId'],
      properties: {
        assignmentId: {
          bsonType: 'objectId',
          description: 'Reference to assignment - required'
        },
        studentId: {
          bsonType: 'int',
          description: 'MySQL student ID - required'
        },
        content: {
          bsonType: 'string',
          description: 'Text submission content'
        },
        fileUrl: {
          bsonType: 'string',
          description: 'URL to uploaded file'
        },
        submittedAt: {
          bsonType: 'date'
        },
        isLate: {
          bsonType: 'bool'
        },
        status: {
          enum: ['submitted', 'graded', 'returned'],
          description: 'Submission status'
        }
      }
    }
  }
});

// Course Content Collection (flexible schema for different content types)
db.createCollection('course_content', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['courseId', 'title', 'type'],
      properties: {
        courseId: {
          bsonType: 'int',
          description: 'MySQL course ID'
        },
        title: {
          bsonType: 'string'
        },
        type: {
          enum: ['lecture', 'reading', 'video', 'resource', 'link'],
          description: 'Content type'
        },
        content: {
          bsonType: 'object',
          description: 'Flexible content structure'
        },
        order: {
          bsonType: 'int'
        },
        isPublished: {
          bsonType: 'bool'
        }
      }
    }
  }
});

// Notifications Collection
db.createCollection('notifications');

// System Logs Collection
db.createCollection('system_logs');

// ============================================
// CREATE INDEXES
// ============================================

// Assignments indexes
db.assignments.createIndex({ courseId: 1 });
db.assignments.createIndex({ createdBy: 1 });
db.assignments.createIndex({ dueDate: 1 });
db.assignments.createIndex({ type: 1 });

// Submissions indexes
db.submissions.createIndex({ assignmentId: 1 });
db.submissions.createIndex({ studentId: 1 });
db.submissions.createIndex({ submittedAt: -1 });

// Course content indexes
db.course_content.createIndex({ courseId: 1, order: 1 });

// Notifications indexes
db.notifications.createIndex({ userId: 1, read: 1 });
db.notifications.createIndex({ createdAt: -1 });

// System logs indexes
db.system_logs.createIndex({ timestamp: -1 });
db.system_logs.createIndex({ userId: 1 });
db.system_logs.createIndex({ action: 1 });

// ============================================
// SAMPLE DATA
// ============================================

// Sample Assignments
const assignments = [
  {
    courseId: 1,  // DBMS
    title: 'Database Normalization Exercise',
    description: 'Convert the given unnormalized table to 3NF. Show all intermediate steps (1NF, 2NF, 3NF) with explanations. Include functional dependencies identification.',
    type: 'homework',
    dueDate: new Date('2025-01-30T23:59:59'),
    maxScore: 100,
    rubric: [
      { criterion: '1NF Conversion', maxPoints: 25, description: 'Correctly identify and remove repeating groups' },
      { criterion: '2NF Conversion', maxPoints: 25, description: 'Identify partial dependencies and decompose' },
      { criterion: '3NF Conversion', maxPoints: 25, description: 'Identify transitive dependencies and decompose' },
      { criterion: 'Documentation', maxPoints: 25, description: 'Clear explanations and diagram quality' }
    ],
    isPublished: true,
    createdBy: 2,  // Dr. Smith
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20')
  },
  {
    courseId: 1,  // DBMS
    title: 'ER Diagram Design Project',
    description: 'Design a complete ER diagram for a Library Management System. Include entities, relationships, cardinalities, and attributes. Submit as PDF.',
    type: 'project',
    dueDate: new Date('2025-02-05T23:59:59'),
    maxScore: 150,
    rubric: [
      { criterion: 'Entity Identification', maxPoints: 30, description: 'All relevant entities identified' },
      { criterion: 'Relationship Mapping', maxPoints: 40, description: 'Correct relationships with cardinalities' },
      { criterion: 'Attribute Assignment', maxPoints: 30, description: 'Appropriate attributes for each entity' },
      { criterion: 'Diagram Quality', maxPoints: 25, description: 'Clean, professional diagram' },
      { criterion: 'Documentation', maxPoints: 25, description: 'Assumptions and explanations' }
    ],
    isPublished: true,
    createdBy: 2,
    createdAt: new Date('2025-01-22'),
    updatedAt: new Date('2025-01-22')
  },
  {
    courseId: 1,  // DBMS
    title: 'SQL Queries Practice',
    description: 'Complete the SQL exercises on SELECT, JOIN, GROUP BY, and subqueries. Use the provided sample database.',
    type: 'homework',
    dueDate: new Date('2025-01-28T23:59:59'),
    maxScore: 50,
    rubric: [
      { criterion: 'Basic SELECT', maxPoints: 10, description: 'Simple SELECT with WHERE' },
      { criterion: 'JOIN Operations', maxPoints: 15, description: 'Inner and outer joins' },
      { criterion: 'Aggregations', maxPoints: 15, description: 'GROUP BY with HAVING' },
      { criterion: 'Subqueries', maxPoints: 10, description: 'Nested queries' }
    ],
    isPublished: true,
    createdBy: 2,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  {
    courseId: 2,  // Web Development
    title: 'React Component Assignment',
    description: 'Build a reusable React component library with at least 5 components (Button, Card, Modal, Input, Alert). Include proper props, styling, and documentation.',
    type: 'project',
    dueDate: new Date('2025-02-01T23:59:59'),
    maxScore: 100,
    rubric: [
      { criterion: 'Component Quality', maxPoints: 40, description: 'Well-structured, reusable components' },
      { criterion: 'Styling', maxPoints: 20, description: 'Consistent and responsive design' },
      { criterion: 'Props & State', maxPoints: 20, description: 'Proper use of React patterns' },
      { criterion: 'Documentation', maxPoints: 20, description: 'Usage examples and prop types' }
    ],
    isPublished: true,
    createdBy: 2,
    createdAt: new Date('2025-01-18'),
    updatedAt: new Date('2025-01-18')
  },
  {
    courseId: 3,  // Data Structures
    title: 'Binary Tree Implementation',
    description: 'Implement a Binary Search Tree in your preferred language with insert, delete, search, and traversal operations.',
    type: 'homework',
    dueDate: new Date('2025-01-31T23:59:59'),
    maxScore: 80,
    rubric: [
      { criterion: 'Insert Operation', maxPoints: 20, description: 'Correct BST insertion' },
      { criterion: 'Delete Operation', maxPoints: 20, description: 'Handle all delete cases' },
      { criterion: 'Search Operation', maxPoints: 15, description: 'Efficient search implementation' },
      { criterion: 'Traversals', maxPoints: 15, description: 'Inorder, preorder, postorder' },
      { criterion: 'Code Quality', maxPoints: 10, description: 'Clean, documented code' }
    ],
    isPublished: true,
    createdBy: 3,  // Prof. Johnson
    createdAt: new Date('2025-01-19'),
    updatedAt: new Date('2025-01-19')
  }
];

db.assignments.insertMany(assignments);

// Get inserted assignment IDs for submissions
const insertedAssignments = db.assignments.find({}).toArray();

// Sample Submissions (for the SQL Queries Practice - assignment index 2)
const sqlAssignment = insertedAssignments[2];
const submissions = [
  {
    assignmentId: sqlAssignment._id,
    studentId: 5,  // Alice
    content: 'All SQL queries completed. See attached file for solutions.',
    submittedAt: new Date('2025-01-27T14:30:00'),
    isLate: false,
    status: 'graded'
  },
  {
    assignmentId: sqlAssignment._id,
    studentId: 6,  // Bob
    content: 'Completed exercises 1-8. Had difficulty with subqueries.',
    submittedAt: new Date('2025-01-28T10:15:00'),
    isLate: false,
    status: 'submitted'
  },
  {
    assignmentId: insertedAssignments[0]._id,  // Normalization
    studentId: 5,  // Alice
    content: 'Normalization steps documented with diagrams.',
    submittedAt: new Date('2025-01-28T09:00:00'),
    isLate: false,
    status: 'submitted'
  }
];

db.submissions.insertMany(submissions);

// Sample Course Content
const courseContent = [
  {
    courseId: 1,
    title: 'Introduction to DBMS',
    type: 'lecture',
    content: {
      slides: 'week1_intro.pdf',
      topics: ['What is DBMS', 'Types of Databases', 'DBMS Architecture'],
      duration: '90 minutes'
    },
    order: 1,
    isPublished: true,
    createdAt: new Date('2025-01-10')
  },
  {
    courseId: 1,
    title: 'Relational Model',
    type: 'lecture',
    content: {
      slides: 'week2_relational.pdf',
      topics: ['Relations', 'Keys', 'Integrity Constraints'],
      duration: '90 minutes'
    },
    order: 2,
    isPublished: true,
    createdAt: new Date('2025-01-17')
  },
  {
    courseId: 1,
    title: 'Normalization Basics',
    type: 'reading',
    content: {
      text: 'Chapter 5 from Database System Concepts by Silberschatz',
      pages: '120-145',
      estimatedTime: '45 minutes'
    },
    order: 3,
    isPublished: true,
    createdAt: new Date('2025-01-20')
  },
  {
    courseId: 1,
    title: 'SQL Tutorial Video',
    type: 'video',
    content: {
      url: 'https://example.com/sql-tutorial',
      duration: '25 minutes',
      topics: ['SELECT', 'WHERE', 'JOIN']
    },
    order: 4,
    isPublished: true,
    createdAt: new Date('2025-01-22')
  }
];

db.course_content.insertMany(courseContent);

// Sample Notifications
const notifications = [
  {
    userId: 5,  // Alice
    type: 'assignment',
    title: 'New Assignment Posted',
    message: 'Database Normalization Exercise has been posted in DBMS',
    read: false,
    createdAt: new Date('2025-01-20T10:00:00')
  },
  {
    userId: 5,
    type: 'grade',
    title: 'Assignment Graded',
    message: 'Your SQL Queries Practice has been graded. Score: 45/50',
    read: true,
    createdAt: new Date('2025-01-28T11:00:00')
  },
  {
    userId: 6,  // Bob
    type: 'reminder',
    title: 'Assignment Due Soon',
    message: 'Normalization Exercise is due in 2 days',
    read: false,
    createdAt: new Date('2025-01-28T08:00:00')
  }
];

db.notifications.insertMany(notifications);

// Sample System Logs
const systemLogs = [
  {
    action: 'USER_LOGIN',
    userId: 5,
    userEmail: 'alice@student.lms.edu',
    userRole: 'student',
    details: { ip: '192.168.1.100', browser: 'Chrome' },
    timestamp: new Date('2025-01-28T09:00:00')
  },
  {
    action: 'ASSIGNMENT_SUBMITTED',
    userId: 5,
    userEmail: 'alice@student.lms.edu',
    userRole: 'student',
    details: { assignmentId: sqlAssignment._id.toString(), courseId: 1 },
    timestamp: new Date('2025-01-27T14:30:00')
  },
  {
    action: 'USER_CREATED',
    userId: 1,
    userEmail: 'admin@lms.edu',
    userRole: 'admin',
    details: { createdUser: 'new.student@lms.edu', role: 'student' },
    timestamp: new Date('2025-01-25T11:00:00')
  },
  {
    action: 'COURSE_CREATED',
    userId: 1,
    userEmail: 'admin@lms.edu',
    userRole: 'admin',
    details: { courseCode: 'CS401', courseName: 'Machine Learning' },
    timestamp: new Date('2025-01-15T14:00:00')
  }
];

db.system_logs.insertMany(systemLogs);

// ============================================
// VERIFICATION
// ============================================

print('\n=== MongoDB Setup Complete ===\n');
print('Collections created:');
print('  - assignments: ' + db.assignments.countDocuments() + ' documents');
print('  - submissions: ' + db.submissions.countDocuments() + ' documents');
print('  - course_content: ' + db.course_content.countDocuments() + ' documents');
print('  - notifications: ' + db.notifications.countDocuments() + ' documents');
print('  - system_logs: ' + db.system_logs.countDocuments() + ' documents');
print('\nIndexes created for optimal performance.');
print('\nSample queries to test:');
print('  db.assignments.find({ courseId: 1 })');
print('  db.submissions.find({ status: "submitted" })');
print('  db.notifications.find({ userId: 5, read: false })');
