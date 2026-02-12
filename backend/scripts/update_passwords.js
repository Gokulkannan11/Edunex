const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function updatePasswords() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'lms_db'
    });

    try {
        console.log('🔐 Updating user passwords with proper bcrypt hashes...\n');

        // Hash passwords
        const adminHash = await bcrypt.hash('admin123', 10);
        const teacherHash = await bcrypt.hash('teacher123', 10);
        const studentHash = await bcrypt.hash('student123', 10);

        // Update admin
        await connection.query(
            'UPDATE users SET password_hash = ? WHERE email = ?',
            [adminHash, 'admin@lms.edu']
        );
        console.log('✅ Updated admin@lms.edu (password: admin123)');

        // Update teachers
        const teachers = ['dr.sharma@lms.edu', 'prof.patel@lms.edu', 'dr.reddy@lms.edu'];
        for (const email of teachers) {
            await connection.query(
                'UPDATE users SET password_hash = ? WHERE email = ?',
                [teacherHash, email]
            );
            console.log(`✅ Updated ${email} (password: teacher123)`);
        }

        // Update students
        const students = [
            'arjun@student.lms.edu',
            'sneha@student.lms.edu',
            'rahul@student.lms.edu',
            'ananya@student.lms.edu',
            'vikram@student.lms.edu'
        ];
        for (const email of students) {
            await connection.query(
                'UPDATE users SET password_hash = ? WHERE email = ?',
                [studentHash, email]
            );
            console.log(`✅ Updated ${email} (password: student123)`);
        }

        console.log('\n✅ All passwords updated successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('   Admin:   admin@lms.edu / admin123');
        console.log('   Teacher: dr.sharma@lms.edu / teacher123');
        console.log('   Student: arjun@student.lms.edu / student123');

    } catch (error) {
        console.error('❌ Error updating passwords:', error);
    } finally {
        await connection.end();
    }
}

updatePasswords();
