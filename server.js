// server.js
// Entry point for the Express server

require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');

// Define the port
const PORT = process.env.PORT || 5000;
/**
 * Start server function
 * Connects to MongoDB first, then starts the Express server
 * This ensures database is ready before accepting requests
 */
const startServer = async () => {
  try {
    // Connect to MongoDB before starting the server
    // This fail-fast approach prevents serving requests without database access
    await connectDB();

    // Start Express server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();