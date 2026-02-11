const app = require('./app');
const { connectMongoDB, testConnections, closeConnections } = require('./config/database');

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectMongoDB();

        // Test all database connections
        await testConnections();

        // Start Express server
        const server = app.listen(PORT, () => {
            console.log(`\n🚀 LMS Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API URL: http://localhost:${PORT}/api`);
            console.log(`\n📊 Available endpoints:`);
            console.log(`   GET  /api/health - Health check`);
            console.log(`   POST /api/auth/register - Register user`);
            console.log(`   POST /api/auth/login - Login user`);
            console.log(`   GET  /api/student/* - Student routes`);
            console.log(`   GET  /api/teacher/* - Teacher routes`);
            console.log(`   GET  /api/admin/* - Admin routes`);
            console.log(`\n`);
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal) => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                console.log('HTTP server closed');
                await closeConnections();
                process.exit(0);
            });

            // Force close after 10 seconds
            setTimeout(() => {
                console.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
