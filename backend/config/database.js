const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
require('dotenv').config();

// ============================================
// MySQL Database Connection Pool
// ============================================
const mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lms_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ============================================
// MongoDB Connection
// ============================================
const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms_db');
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// MongoDB connection event handlers
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});

// ============================================
// Test Connections
// ============================================
const testConnections = async () => {
    try {
        // Test MySQL
        const connection = await mysqlPool.getConnection();
        await connection.query('SELECT 1 + 1 AS result');
        connection.release();
        console.log('✅ MySQL connected successfully');

        // Test MongoDB
        if (mongoose.connection.readyState === 1) {
            console.log('✅ MongoDB connection verified');
        }

        return true;
    } catch (error) {
        console.error('❌ Database connection test failed:', error.message);
        return false;
    }
};

// ============================================
// Graceful Shutdown
// ============================================
const closeConnections = async () => {
    try {
        await mysqlPool.end();
        await mongoose.connection.close();
        console.log('✅ All database connections closed');
    } catch (error) {
        console.error('❌ Error closing connections:', error.message);
    }
};

module.exports = {
    mysqlPool,
    mongoose,
    connectMongoDB,
    testConnections,
    closeConnections
};
