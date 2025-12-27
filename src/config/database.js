// src/config/database.js
// Database connection setup using Mongoose
// Handles connection lifecycle (connect, disconnect, error handling)
const mongoose = require('mongoose');

/** 
 * Connect to MongoDB using Mongoose
 * Uses connection string from environment variables
 * Implements connection error handling and logging
*/

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB_NAME || 'learning_dashboard-dev',
        });
        console.info(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.info(`📊 Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Exit process with failure
        throw error;
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.info('📡 MongoDB Disconnected');
    } catch (error) {
        console.error(`❌ MongoDB Disconnect Error: ${error.message}`);
        // TODO V2: Add retry logic with exponential backoff for transient failures
        throw error;
    }
};

//
mongoose.connection.on('connected', () => {
    console.info('🔗 Mongoose connected to MongoDB')
});

mongoose.connection.on('error', (err) => {
    console.info(`🚨 Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.info('🔌 Mongoose disconnected from MongoDB');
});

module.exports = { connectDB, disconnectDB };