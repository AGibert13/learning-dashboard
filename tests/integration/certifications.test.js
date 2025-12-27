// tests/integration/certification.test.js
// Integration tests for certification API endpoints
// Tests full HTTP request → Controller → Model → Database flow

const supertest = require('supertest');
const app = require('../../src/app');
const Certification = require('../../src/models/Certification');
const { describe, it, expect } = require('@jest/globals');

describe('POST /api/certifications', () => {
    it('should create a new certification with valid data', async () => {
        // Arrange
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10);
        const certData = {
            name: 'AWS AI Practitioner',
            provider: 'aws',
            targetDate: futureDate,
            status: 'In Progress',
            studyHoursGoal: 50
        };

        // Act
        const response = await supertest(app)
            .post('/api/certifications')
            .set('Content-Type', 'application/json')
            .send(certData)
            .expect('Content-Type', /json/)
            .expect(201);

            // Assert
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.data._id).toBeDefined();
            expect(response.body.data.name).toBe(certData.name);
            expect(response.body.data.provider).toBe('Aws');
            expect(response.body.data.status).toBe(certData.status);
            expect(response.body.data.studyHoursGoal).toBe(certData.studyHoursGoal);
            expect(new Date(response.body.data.targetDate).toISOString()).toBe(new Date(certData.targetDate).toISOString())
            expect(response.body.data.createdAt).toBeDefined();
            expect(response.body.data.updatedAt).toBeDefined();

            const savedCert = await Certification.findById(response.body.data._id);
            expect(savedCert).toBeDefined();
            expect(savedCert.name).toBe(certData.name);
            expect(savedCert.provider).toBe('Aws');
    });
    it('should return 400 when required fields are missing', async () => {
        // Arrange - missing name and provider
        const certData = {
            targetDate: new Date(),
            status: 'In Progress',
            studyHoursGoal: 50
        };

        // Act
        const response = await supertest(app)
        .post('/api/certifications')
        .set('Content-Type', 'application/json')
        .send(certData)
        .expect('Content-Type', /json/)
        .expect(400);

        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Validation Error');
        expect(response.body.messages).toContain('Please add a certification name');
        expect(response.body.messages).toContain('Please add a certification provider (e.g., AWS, Azure)');
    });
    it('should return 409 when certification name already exists', async () => {
        // Arrange
        await Certification.create({
            name: 'Duplicate Test Cert',
            provider: 'Test Provider'
        });

        // Act
        const duplicateData = {
            name: 'Duplicate Test Cert',
            provider: 'Test Provider'
        };

        const response = await supertest(app)
        .post('/api/certifications')
        .set('Content-Type', 'application/json')
        .send(duplicateData)
        .expect('Content-Type', /json/)
        .expect(409);

        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Duplicate Error');
        expect(response.body.message).toBe('"Duplicate Test Cert" already exists for field "name". Please use a different value.');
    });
    it('should return 400 for invalid status value', async () => {
        // Arrange
        const certData = {
            name: 'Invalid Status Cert',
            provider: 'Test Provider',
            status: 'Random Status'
        };

        // Act
        const response = await supertest(app)
        .post('/api/certifications')
        .set('Content-Type', 'application/json')
        .send(certData)
        .expect('Content-Type', /json/)
        .expect(400);

        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Validation Error');
        expect(response.body.messages).toContain('Random Status is not a valid status. Must be: Not Started, In Progress, or Completed');
    });
    it('should return 400 for past target date', async () => {
        // Arrange
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 10);
        const certData = {
            name: 'Past Date Cert',
            provider: 'Test Provider',
            targetDate: pastDate
        };

        // Act
        const response = await supertest(app)
        .post('/api/certifications')
        .set('Content-Type', 'application/json')
        .send(certData)
        .expect('Content-Type', /json/)
        .expect(400);
        
        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Validation Error');
        expect(response.body.messages).toContain(`Target date ${pastDate} cannot be in the past`);
    });
    it('should return 500 for server errors', async () => {
        // Arrange
        const certData = {
            name: 'Server Error Cert',
            provider: 'Test Provider'
        };
    
        // Mock Certification.create to throw error
        jest.spyOn(Certification.prototype, 'save')
        .mockImplementationOnce(() => {{
            throw new Error('Database failure');
        }});

        // Act
        const response = await supertest(app)
        .post('/api/certifications')
        .set('Content-Type', 'application/json')
        .send(certData)
        .expect('Content-Type', /json/)
        .expect(500);

        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Internal Server Error');
        expect(response.body.message).toBe('Database failure');

        // Restore original implementation
        Certification.prototype.save.mockRestore();
    });
});