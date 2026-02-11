# MySQL Complete Guide - Shell, Workbench & Password Reset

## Table of Contents
1. [Reset Forgotten MySQL Password](#reset-forgotten-mysql-password)
2. [MySQL Shell Guide](#mysql-shell-guide)
3. [MySQL Workbench Guide](#mysql-workbench-guide)
4. [Common Tasks & Commands](#common-tasks--commands)

---

## Reset Forgotten MySQL Password

### Method 1: Using MySQL Installer (Recommended for Windows)

1. **Open MySQL Installer**
   - Search for "MySQL Installer" in Windows Start Menu
   - Click on "Reconfigure" next to MySQL Server

2. **Follow the Reconfiguration Wizard**
   - Click "Next" until you reach "Accounts and Roles"
   - Enter a new root password
   - Complete the wizard

### Method 2: Manual Reset (If Method 1 doesn't work)

1. **Stop MySQL Service**
   ```powershell
   # Run PowerShell as Administrator
   Stop-Service MySQL80
   ```

2. **Create a password reset file**
   - Create a file `C:\mysql-init.txt` with this content:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
   FLUSH PRIVILEGES;
   ```

3. **Start MySQL with init file**
   ```powershell
   # Find your MySQL bin directory (usually C:\Program Files\MySQL\MySQL Server 8.0\bin)
   cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
   
   # Start MySQL with the init file
   .\mysqld.exe --init-file=C:\mysql-init.txt --console
   ```

4. **Stop the manual MySQL process** (Ctrl+C in the console)

5. **Delete the init file** (for security)
   ```powershell
   Remove-Item C:\mysql-init.txt
   ```

6. **Start MySQL service normally**
   ```powershell
   Start-Service MySQL80
   ```

### Method 3: Skip Grant Tables (Advanced)

1. **Stop MySQL Service**
   ```powershell
   Stop-Service MySQL80
   ```

2. **Start MySQL without password verification**
   ```powershell
   cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
   .\mysqld.exe --skip-grant-tables --console
   ```

3. **In a new PowerShell window, connect without password**
   ```powershell
   cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
   .\mysql.exe -u root
   ```

4. **Reset the password**
   ```sql
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Stop the skip-grant-tables MySQL** (Ctrl+C)

6. **Start MySQL normally**
   ```powershell
   Start-Service MySQL80
   ```

---

## MySQL Shell Guide

### What is MySQL Shell?

MySQL Shell is an advanced command-line client and code editor for MySQL. It supports SQL, JavaScript, and Python scripting modes.

### Installation

MySQL Shell is typically installed with MySQL Server. If not:
- Download from: https://dev.mysql.com/downloads/shell/
- Or install via MySQL Installer

### Starting MySQL Shell

```powershell
# Method 1: From anywhere (if in PATH)
mysqlsh

# Method 2: Navigate to MySQL bin directory
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
.\mysqlsh.exe
```

### Connecting to MySQL Server

```javascript
// Method 1: Connect during startup
mysqlsh --uri root@localhost:3306

// Method 2: Connect after starting shell
\connect root@localhost:3306

// Method 3: With password in command (not recommended for security)
mysqlsh --uri root@localhost:3306 --password=your_password

// Method 4: Connect to specific database
\connect root@localhost:3306/lms_db
```

### MySQL Shell Modes

MySQL Shell supports three modes:

#### 1. SQL Mode (Default)
```sql
-- Switch to SQL mode
\sql

-- Now you can run SQL commands
SHOW DATABASES;
USE lms_db;
SHOW TABLES;
SELECT * FROM users LIMIT 10;
```

#### 2. JavaScript Mode
```javascript
// Switch to JavaScript mode
\js

// Access database using X DevAPI
var session = mysqlx.getSession('root@localhost:33060');
var schema = session.getSchema('lms_db');
var users = schema.getTable('users');

// Query data
var result = users.select(['id', 'name', 'email']).limit(10).execute();
var row = result.fetchOne();
while(row) {
    print(row);
    row = result.fetchOne();
}
```

#### 3. Python Mode
```python
# Switch to Python mode
\py

# Access database using X DevAPI
session = mysqlx.get_session('root@localhost:33060')
schema = session.get_schema('lms_db')
users = schema.get_table('users')

# Query data
result = users.select(['id', 'name', 'email']).limit(10).execute()
for row in result.fetch_all():
    print(row)
```

### Essential MySQL Shell Commands

```javascript
// Help
\help
\h

// Show current mode
\status

// Quit
\quit
\q
\exit

// Execute SQL file
\source C:\path\to\script.sql

// Show warnings
\W

// Don't show warnings
\w

// Reconnect
\reconnect

// Show connection info
\status

// Use a database
\use lms_db

// Execute system commands
\! dir  // Windows
\! ls   // Linux/Mac
```

### MySQL Shell Configuration

```javascript
// Set options
\option --persist resultFormat=json
\option --persist history.autoSave=true
\option --persist history.maxSize=5000

// View all options
\option -l
```

### Advanced Features

#### 1. Dump and Load Utilities

```javascript
// Dump entire instance
util.dumpInstance("C:\\mysql_backup", {threads: 4})

// Dump specific schemas
util.dumpSchemas(["lms_db"], "C:\\mysql_backup\\lms_db", {threads: 4})

// Load dump
util.loadDump("C:\\mysql_backup", {threads: 4})
```

#### 2. Parallel Table Import

```javascript
// Import CSV/JSON files
util.importTable("C:\\data\\users.csv", {
    schema: "lms_db",
    table: "users",
    threads: 4,
    fieldsTerminatedBy: ",",
    fieldsEnclosedBy: '"',
    linesTerminatedBy: "\n"
})
```

#### 3. Upgrade Checker

```javascript
// Check for upgrade issues
util.checkForServerUpgrade('root@localhost:3306', {password: 'your_password'})
```

---

## MySQL Workbench Guide

### What is MySQL Workbench?

MySQL Workbench is a unified visual tool for database architects, developers, and DBAs. It provides:
- Database design & modeling
- SQL development
- Database administration
- Data migration
- Performance monitoring

### Starting MySQL Workbench

1. Search for "MySQL Workbench" in Windows Start Menu
2. Click to launch

### Creating a Connection

1. **Click the "+" icon** next to "MySQL Connections"
2. **Fill in connection details:**
   - Connection Name: `Local LMS Database` (or any name)
   - Hostname: `localhost` or `127.0.0.1`
   - Port: `3306`
   - Username: `root`
   - Password: Click "Store in Vault" and enter your password
3. **Test Connection** to verify
4. **Click OK** to save

### Main Workbench Areas

#### 1. Home Screen
- **MySQL Connections**: Saved connections
- **Models**: Database design models
- **Shortcuts**: Quick access to common tasks

#### 2. SQL Editor (Query Tab)

```sql
-- Open a new query tab: Ctrl+T
-- Execute current statement: Ctrl+Enter
-- Execute all statements: Ctrl+Shift+Enter
-- Format SQL: Ctrl+B

-- Example queries
SHOW DATABASES;
USE lms_db;
SHOW TABLES;
DESCRIBE users;
SELECT * FROM users LIMIT 100;
```

#### 3. Navigator Panel (Left Side)

- **Schemas**: Browse databases, tables, views, procedures
- **Administration**: Server status, users, data export/import
- **Performance**: Performance dashboard, reports

#### 4. Information Panel (Right Side)

- **Object Info**: Details about selected objects
- **Session**: Current session information
- **Output**: Query results and messages

### Essential Workbench Features

#### 1. Database Design (EER Diagrams)

```
File → New Model → Add Diagram
```

- **Create Tables**: Double-click on canvas
- **Add Relationships**: Use relationship tools
- **Forward Engineer**: Generate SQL from diagram
- **Reverse Engineer**: Create diagram from existing database

#### 2. Data Export/Import

**Export Data:**
```
Server → Data Export
- Select schemas to export
- Choose export options (structure/data)
- Select output format (SQL dump or CSV)
- Click "Start Export"
```

**Import Data:**
```
Server → Data Import
- Select import from dump or folder
- Choose file/folder
- Select target schema
- Click "Start Import"
```

#### 3. Table Data Editor

```sql
-- Right-click on table → "Select Rows - Limit 1000"
-- Edit cells directly
-- Click "Apply" to save changes
-- Use filters and sorting
```

#### 4. Visual Explain

```sql
-- Write a SELECT query
-- Click the "Execution Plan" icon (or Query → Explain Current Statement)
-- View visual representation of query execution
```

#### 5. Query History

```
View → Panels → History
- See all executed queries
- Re-run previous queries
- Search query history
```

#### 6. Code Snippets

```
Edit → Preferences → SQL Editor → SQL Snippets
- Create reusable code snippets
- Use abbreviations for quick insertion
```

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Query Tab | `Ctrl+T` |
| Execute Statement | `Ctrl+Enter` |
| Execute All | `Ctrl+Shift+Enter` |
| Format SQL | `Ctrl+B` |
| Comment/Uncomment | `Ctrl+/` |
| Auto-complete | `Ctrl+Space` |
| Save Script | `Ctrl+S` |
| Open Script | `Ctrl+O` |
| Find | `Ctrl+F` |
| Replace | `Ctrl+H` |

### Administration Tasks

#### 1. User Management

```
Server → Users and Privileges
- Add/Edit/Delete users
- Set passwords
- Grant privileges
- View user connections
```

#### 2. Server Status

```
Server → Server Status
- View server statistics
- Monitor connections
- Check server health
```

#### 3. Performance Dashboard

```
Performance → Dashboard
- Monitor server performance
- View real-time metrics
- Analyze slow queries
```

#### 4. Database Backup

```sql
-- Using Workbench Export
Server → Data Export → Select Schemas → Start Export

-- Or use mysqldump via Workbench
-- Administration → Data Export/Restore
```

### Workbench Preferences

```
Edit → Preferences

Key settings:
- SQL Editor → Safe Updates (uncheck for development)
- SQL Editor → SQL Execution → Limit Rows (set to 1000 or desired)
- Fonts & Colors → Customize appearance
- Modeling → Set default schema settings
```

---

## Common Tasks & Commands

### Database Operations

```sql
-- Create database
CREATE DATABASE lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use database
USE lms_db;

-- Drop database
DROP DATABASE IF EXISTS old_db;

-- Show all databases
SHOW DATABASES;

-- Show current database
SELECT DATABASE();
```

### Table Operations

```sql
-- Create table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Show tables
SHOW TABLES;

-- Describe table structure
DESCRIBE users;
SHOW CREATE TABLE users;

-- Alter table
ALTER TABLE users ADD COLUMN phone VARCHAR(15);
ALTER TABLE users MODIFY COLUMN name VARCHAR(150);
ALTER TABLE users DROP COLUMN phone;

-- Drop table
DROP TABLE IF EXISTS old_table;
```

### Data Operations

```sql
-- Insert data
INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');

-- Insert multiple rows
INSERT INTO users (name, email) VALUES 
    ('Jane Smith', 'jane@example.com'),
    ('Bob Johnson', 'bob@example.com');

-- Update data
UPDATE users SET name = 'John Smith' WHERE id = 1;

-- Delete data
DELETE FROM users WHERE id = 1;

-- Select data
SELECT * FROM users;
SELECT name, email FROM users WHERE id > 10 LIMIT 10;
```

### User & Privilege Management

```sql
-- Create user
CREATE USER 'lms_user'@'localhost' IDENTIFIED BY 'password123';

-- Grant privileges
GRANT ALL PRIVILEGES ON lms_db.* TO 'lms_user'@'localhost';
GRANT SELECT, INSERT, UPDATE ON lms_db.* TO 'lms_user'@'localhost';

-- Show grants
SHOW GRANTS FOR 'lms_user'@'localhost';

-- Revoke privileges
REVOKE INSERT ON lms_db.* FROM 'lms_user'@'localhost';

-- Drop user
DROP USER 'lms_user'@'localhost';

-- Flush privileges (apply changes)
FLUSH PRIVILEGES;
```

### Backup & Restore

```powershell
# Backup database (using mysqldump)
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
.\mysqldump.exe -u root -p lms_db > C:\backup\lms_db_backup.sql

# Backup all databases
.\mysqldump.exe -u root -p --all-databases > C:\backup\all_databases.sql

# Restore database
.\mysql.exe -u root -p lms_db < C:\backup\lms_db_backup.sql

# Restore with creation
.\mysql.exe -u root -p < C:\backup\lms_db_backup.sql
```

### Performance & Monitoring

```sql
-- Show running processes
SHOW PROCESSLIST;
SHOW FULL PROCESSLIST;

-- Kill a process
KILL process_id;

-- Show table status
SHOW TABLE STATUS FROM lms_db;

-- Analyze table
ANALYZE TABLE users;

-- Optimize table
OPTIMIZE TABLE users;

-- Show indexes
SHOW INDEX FROM users;

-- Show variables
SHOW VARIABLES LIKE 'max_connections';

-- Show status
SHOW STATUS LIKE 'Threads_connected';
```

---

## Quick Reference for Your LMS Project

### Connect to your LMS database

**MySQL Shell:**
```bash
mysqlsh --uri root@localhost:3306/lms_db
```

**MySQL Workbench:**
1. Open Workbench
2. Click on your connection
3. Run: `USE lms_db;`

### Common LMS Database Queries

```sql
-- View all users
SELECT * FROM users LIMIT 100;

-- View students
SELECT * FROM users WHERE role = 'student';

-- View courses
SELECT * FROM courses;

-- View enrollments
SELECT u.name, c.title, e.enrolled_at
FROM enrollments e
JOIN users u ON e.student_id = u.id
JOIN courses c ON e.course_id = c.id;

-- Check database size
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'lms_db'
GROUP BY table_schema;
```

---

## Troubleshooting

### Can't connect to MySQL Server

1. **Check if MySQL is running:**
   ```powershell
   Get-Service MySQL80
   ```

2. **Start MySQL if stopped:**
   ```powershell
   Start-Service MySQL80
   ```

3. **Check port 3306 is not blocked:**
   ```powershell
   netstat -an | findstr 3306
   ```

### Access Denied Error

- Verify username and password
- Check user privileges: `SHOW GRANTS FOR 'username'@'localhost';`
- Ensure user exists: `SELECT user, host FROM mysql.user;`

### Connection Timeout

- Check firewall settings
- Verify MySQL is listening on correct port
- Check `bind-address` in `my.ini` configuration file

---

## Additional Resources

- **Official MySQL Documentation**: https://dev.mysql.com/doc/
- **MySQL Shell Documentation**: https://dev.mysql.com/doc/mysql-shell/8.0/en/
- **MySQL Workbench Manual**: https://dev.mysql.com/doc/workbench/en/
- **MySQL Tutorial**: https://www.mysqltutorial.org/

---

## Next Steps for Your Project

1. **Reset your MySQL password** using Method 1 or 2 above
2. **Test connection** using MySQL Shell or Workbench
3. **Verify your LMS database** is accessible
4. **Update your backend configuration** with the new password in `backend/config/database.js`
5. **Restart your backend server** to apply changes

