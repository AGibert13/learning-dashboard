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

describe('GET /api/certifications', () => {
    it('should return empty array when no certifications exist', async() => {
        // Arrange & Act
        const response = await supertest(app)
        .get('/api/certifications')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

        // Assert
        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(0);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(0);
    });

    it('should return all certifications', async() => {
        // Arrange
        await Certification.create([
            { name: 'AWS AI Practitioner', provider: 'AWS' },
            { name: 'Python PCAP', provider: 'Python Institute' }
        ]);

        // Act
        const response = await supertest(app)
        .get('/api/certifications')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

        // Assert
        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(2);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(2);

        const names = response.body.data.map(cert => cert.name);
        expect(names[0]).toBe('AWS AI Practitioner');
        expect(names[1]).toBe('Python PCAP');
    });
    
    it('should return 500 for server errors', async () => {
        // Arrange
        // Mock Certification.find to throw error
        jest.spyOn(Certification, 'find')
        .mockImplementationOnce(() => {
            throw new Error('Database read failure');
        });

        // Act
        const response = await supertest(app)
        .get('/api/certifications')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500);
        
        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Internal Server Error');
        expect(response.body.message).toBe('Database read failure');
    });
});

describe('GET /api/certifications/:id', () => {
    it('should return a single certification by ID', async () => {
        // Arrange
        const cert = await Certification.create({
            name: 'AWS Solutions Architect',
            provider: 'AWS',
            status: 'In Progress',
            studyHoursGoal: 100
        });

        // Act
        const response = await supertest(app)
        .get(`/api/certifications/${cert._id}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

        // Assert
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data._id).toBe(cert._id.toString());
        expect(response.body.data.name).toBe(cert.name);
        expect(response.body.data.provider).toBe(cert.provider);
        expect(response.body.data.status).toBe(cert.status);
        expect(response.body.data.studyHoursGoal).toBe(cert.studyHoursGoal);
    });

    it('should return 404 for non-existent certification ID', async () => {
        // Arrange - Valid ObjectId format but not in DB
        const nonExistentId = '60d21b4667d0d8992e610c85';

        // Act
        const response = await supertest(app)
        .get(`/api/certifications/${nonExistentId}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);

        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Not Found');
        expect(response.body.message).toBe(`Certification with ID ${nonExistentId} not found`);
    });

    it('should return 400 for invalid certification ID format', async () => {
        // Arrange - Invalid ObjectId format
        const invalidId = '12345';

        // Act
        const response = await supertest(app)
        .get(`/api/certifications/${invalidId}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Invalid ID');
        expect(response.body.message).toBe(`The provided ID "${invalidId}" is not a valid identifier.`);
    });
});

describe('PUT /api/certifications/:id', () => {
    it('should update certification with valid data', async () => {
        // Arrange
        const cert = await Certification.create({
            name: 'AWS Developer Associate',
            provider: 'AWS',
            status: 'Not Started',
            studyHoursGoal: 40
        });
        const updateData = {
            status: 'In Progress',
            studyHoursGoal: 60
        };

        // Act
        const response = await supertest(app)
        .put(`/api/certifications/${cert._id}`)
        .set('Content-Type', 'application/json')
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

        // Assert
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data._id).toBe(cert._id.toString());
        expect(response.body.data.status).toBe(updateData.status);
        expect(response.body.data.studyHoursGoal).toBe(updateData.studyHoursGoal);
        expect(response.body.data.name).toBe('AWS Developer Associate');
        expect(response.body.data.provider).toBe('AWS');
        expect(new Date(response.body.data.updatedAt).getTime()).toBeGreaterThan(new Date(response.body.data.createdAt).getTime());

        const updatedCert = await Certification.findById(cert._id);
        expect(updatedCert.status).toBe(updateData.status);
        expect(updatedCert.studyHoursGoal).toBe(updateData.studyHoursGoal);
    });
    
    it('should update only the name field', async () => {
        // Arrange
        const cert = await Certification.create({
            name: 'AWS Security Specialist',
            provider: 'AWS',
            status: 'In Progress'
        });
        
        // Act
        const response = await supertest(app)
        .put(`/api/certifications/${cert._id}`)
        .set('Content-Type', 'application/json')
        .send({ name: 'AWS Certified Machine Learning Specialist' })
        .expect('Content-Type', /json/)
        .expect(200);

        // Assert
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data._id).toBe(cert._id.toString());
        expect(response.body.data.name).toBe('AWS Certified Machine Learning Specialist');
        expect(response.body.data.provider).toBe('AWS');
        expect(response.body.data.status).toBe('In Progress');

        const updatedCert = await Certification.findById(cert._id);
        expect(updatedCert.name).toBe('AWS Certified Machine Learning Specialist');
    });

    it('should return 400 for invalid status value on update', async () => {
        // Arrange
        const cert = await Certification.create({
            name: 'Python PCEP',
            provider: 'Python Institute'
        });

        // Act
        const response = await supertest(app)
        .put(`/api/certifications/${cert._id}`)
        .set('Content-Type', 'application/json')
        .send({ status: 'Unknown Status' })
        .expect('Content-Type', /json/)
        .expect(400);

        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Validation Error');
        expect(response.body.messages).toContain('Unknown Status is not a valid status. Must be: Not Started, In Progress, or Completed');
    });

    it('should return 400 for past target date on update', async () => {
        // Arrange
        const cert = await Certification.create({
            name: 'MIM Professional',
            provider: 'MIM'
        });

        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 5);

        // Act
        const response = await supertest(app)
        .put(`/api/certifications/${cert._id}`)
        .set('Content-Type', 'application/json')
        .send({ targetDate: pastDate })
        .expect('Content-Type', /json/)
        .expect(400);

        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Validation Error');
        expect(response.body.messages).toContain(`Target date ${pastDate} cannot be in the past`);
    });

    it('should return 400 for negative studyHoursGoal on update', async () => {
        // Arrange
        const cert = await Certification.create({
            name: 'AWS Cloud Practitioner',
            provider: 'AWS'
        });
        
        // Act
        const response = await supertest(app)
        .put(`/api/certifications/${cert._id}`)
        .set('Content-Type', 'application/json')
        .send({ studyHoursGoal: -10 })
        .expect('Content-Type', /json/)
        .expect(400);

        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Validation Error');
        expect(response.body.messages).toContain('Study hours goal cannot be negative');
    });

    it('should return 404 for non-existent certification ID', async () => {
        // Arrange
        const nonExistentId = '60d21b4667d0d8992e610c85';

        // Act
        const response = await supertest(app)
        .put(`/api/certifications/${nonExistentId}`)
        .set('Content-Type', 'application/json')
        .send({ status: 'Completed' })
        .expect('Content-Type', /json/)
        .expect(404);
        
        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Not Found');
        expect(response.body.message).toBe(`Certification with ID ${nonExistentId} not found`);
    });

    it('should return 400 for invalid certification ID format', async () => {
        // Arrange
        const invalidId = 'invalid-id';

        // Act
        const response = await supertest(app)
        .put(`/api/certifications/${invalidId}`)
        .set('Content-Type', 'application/json')
        .send({ status: 'Completed' })
        .expect('Content-Type', /json/)
        .expect(400);

        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Invalid ID');
        expect(response.body.message).toBe(`The provided ID "${invalidId}" is not a valid identifier.`);
    });
});

describe('DELETE /api/certifications/:id', () => {
    it('should delete certification successfully', async () => {
        // Arrange
        const cert = await Certification.create({
            name: 'AWS CloudOps Engineer',
            provider: 'AWS'
        });

        // Act
        const response = await supertest(app)
        .delete(`/api/certifications/${cert._id}`)
        .set('Content-Type', 'application/json')
        .expect(204);
        
        // Assert
        expect(response.body).toEqual({});

        const deletedCert = await Certification.findById(cert._id);
        expect(deletedCert).toBeNull();
    });

    it('should return 404 when deleting non-existent certification', async () => {
        // Arrange
        const nonExistentId = '60d21b4667d0d8992e610c85';

        // Act
        const response = await supertest(app)
        .delete(`/api/certifications/${nonExistentId}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
        
        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Not Found');
        expect(response.body.message).toBe(`Certification with ID ${nonExistentId} not found`);
    });
    it('should return 400 for invalid certification ID format', async () => {
        // Arrange
        const invalidId = 'not-a-valid-id';

        // Act
        const response = await supertest(app)
        .delete(`/api/certifications/${invalidId}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);
        
        // Assert
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Invalid ID');
        expect(response.body.message).toBe(`The provided ID "${invalidId}" is not a valid identifier.`);
    });
    it('should not affect other certifications when deleting one', async () => {
        // Arrange
        const cert1 = await Certification.create({
            name: 'AWS DevOps Engineer',
            provider: 'AWS'
        });
        const cert2 = await Certification.create({
            name: 'AWS Advanced Networking',
            provider: 'AWS'
        });

        // Act
        const response = await supertest(app)
        .delete(`/api/certifications/${cert1._id}`)
        .set('Content-Type', 'application/json')
        .expect(204);
        
        // Assert
        expect(response.body).toEqual({});
        
        const remainingCert = await Certification.findById(cert2._id);
        expect(remainingCert).toBeDefined();
        expect(remainingCert.name).toBe('AWS Advanced Networking');

        const allCerts = await Certification.find();
        expect(allCerts.length).toBe(1);
        expect(allCerts[0]._id.toString()).toBe(cert2._id.toString());
    });
});