// server.js
// Entry point for the Express server

require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

// Connect to the database
connectDB();

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
});