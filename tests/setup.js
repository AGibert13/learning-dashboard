// tests/setup.js
// Global test setup and teardown for Jest
// Handles MongoDB connection lifecycle for test isolation

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { beforeAll, afterAll, afterEach } = require('@jest/globals');

let mongoServer;

/**
 * Connect to the in-memory MongoDB before all tests
 * MongoMemoryServer creates a temporary MongoDB instance in RAM
 * Benefits:
 * - Fast (no network I/O)
 * - Isolated (doesn't affect real database)
 * - Clean state for every test run
 */
beforeAll(async () => {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect Mongoose to the in-memory database
    await mongoose.connect(uri);
    console.log('🧪 Test database connected');
});

/**
 * Clean up after each test
 * Deletes all data from all collections
 * Ensures tests don't interfere with each other
*/
afterEach(async () => {
    // Get all collections in the database
    const collections = mongoose.connection.collections;

    // Delete all documents from each collection
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

/**
 * Disconnect and stop MongoDB after all tests complete
 * Cleanup prevents memory leaks and hanging processes
 */
afterAll(async () => {
    // Close Mongoose connection
    await mongoose.connection.close();

    // Stop in-memory MongoDB server
    await mongoServer.stop();
    console.log('🧪 Test database disconnected');
});
