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
        const conn =await mongoose.connect(process.env.DB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Exit process with failure
        //Todo: more graceful error handling
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('📡 MongoDB Disconnected');
    } catch (error) {
        console.error(`❌ MongoDB Disconnect Error: ${error.message}`);
        process.exit(1);
    }
};

//
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB')
});

mongoose.connection.on('error', (err) => {
    console.error(`🚨 Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB');
});

module.exports = { connectDB, disconnectDB };