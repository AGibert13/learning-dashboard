// tests/health.test.js
// Unit test for health check endpoint
// Uses Jest and Supertest to verify the /api/health route
const supertest = require('supertest');
const app = require('../src/app');
const { describe, it, expect } = require('@jest/globals');

describe('Health Check API', () => {
    it('should return 200 OK and correct JSON structure', async () => {
        //Arrange & Act
        const response = await supertest(app).get('/api/health');
        const isIsoDate = !isNaN(Date.parse(response.body.timestamp));

        //Assert
        expect(response.status).toBe(200);
        expect (response.body).toHaveProperty('status', 'ok');
        expect(response.body).toHaveProperty('timestamp');
        expect(isIsoDate).toBe(true);
    });
    it('should return 404 for non-existent route', async () => {
        const response = await supertest(app).get('/api/not-real');
        expect(response.status).toBe(404);
    });
});