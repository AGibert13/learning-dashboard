// jest.config.js
// Jest configuration for testing Node.js/Express application
// Separates unit tests from integration tests for targeted test runs

module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js', // Exclude server entry point (hard to test in isolation)
    ],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 60,
            lines: 60,
            statements: 60,
        }
    },
    testMatch: [
        '**/tests/**/*.test.js', 
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    verbose: true,
    testTimeout: 10000, 
};