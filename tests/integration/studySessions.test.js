// tests/integration/studySessions.test.js
// Integration tests for study session model
// Tests database operations, relationships with Certification, and populate functionality

const mongoose = require('mongoose');
const { describe, it, expect } = require('@jest/globals');
const StudySession = require('../../src/models/StudySession');
const Certification = require('../../src/models/Certification');

describe('Study Session Model Integration Tests', () => {
    describe('Database Operations', () => {
        it('should create and save a study session to the database', async () => {
            // Arrange & Act
            const certification = await new Certification({
                name: 'Test Certification',
                provider: 'Test Provider',
                targetDate: new Date(),
                status: 'In Progress',
                studyHoursGoal: 60
            }).save();

            const studySession = await new StudySession({
                certification: certification._id,
                date: new Date(),
                duration: 120,
                topic: 'Test Topic',
                notes: 'This is a test study session.'
            }).save();

            // Assert
            expect(studySession._id).toBeDefined();
            expect(studySession.certification.toString()).toBe(certification._id.toString());
            expect(studySession.topic).toBe('Test Topic');
            expect(studySession.duration).toBe(120);
            expect(studySession.notes).toBe('This is a test study session.');
            expect(studySession.createdAt).toBeDefined();
            expect(studySession.updatedAt).toBeDefined();
        });

        it('should fail to create a study session with a non-existent certification', async () => {
            // Arrange
            const invalidCertId = new mongoose.Types.ObjectId();

            // Act & Assert
            await expect(new StudySession({
                certification: invalidCertId,
                date: new Date(),
                duration: 60,
                topic: 'Invalid Cert Test'
            }).save()).rejects.toThrow(`Certification with id ${invalidCertId} does not exist.`);
        });

        it('should retrieve a study session from the database', async () => {
            // Arrange
            const certification = await new Certification({
                name: 'Retrieve Test Certification',
                provider: 'Test Provider',
                targetDate: new Date(),
                status: 'In Progress',
                studyHoursGoal: 40
            }).save();

            const studySession = await new StudySession({
                certification: certification._id,
                date: new Date(),
                duration: 90,
                topic: 'Retrieve Test Topic'
            }).save();

            // Act
            const foundSession = await StudySession.findById(studySession._id);

            // Assert
            expect(foundSession).toBeDefined();
            expect(foundSession.topic).toBe('Retrieve Test Topic');
            expect(foundSession.duration).toBe(90);
        });

        it('should update a study session in the database', async () => {
            // Arrange
            const certification = await new Certification({
                name: 'Update Test Certification',
                provider: 'Test Provider',
                targetDate: new Date(),
                status: 'In Progress',
                studyHoursGoal: 50
            }).save();

            const studySession = await new StudySession({
                certification: certification._id,
                date: new Date(),
                duration: 45,
                topic: 'Update Test Topic'
            }).save();

            // Act
            studySession.duration = 60;
            studySession.notes = 'Updated notes for the study session.';
            const updatedSession = await studySession.save();

            // Assert
            const foundSession = await StudySession.findById(updatedSession._id);
            expect(foundSession.duration).toBe(60);
            expect(foundSession.notes).toBe('Updated notes for the study session.');
        });

        it('should delete a study session from the database', async () => {
            // Arrange
            const certification = await new Certification({
                name: 'Delete Test Certification',
                provider: 'Test Provider',
                targetDate: new Date(),
                status: 'In Progress',
                studyHoursGoal: 30
            }).save();

            const studySession = await new StudySession({
                certification: certification._id,
                date: new Date(),
                duration: 30,
                topic: 'Delete Test Topic'
            }).save();

            // Act
            await StudySession.findByIdAndDelete(studySession._id);

            // Assert
            const foundSession = await StudySession.findById(studySession._id);
            expect(foundSession).toBeNull();
        });
    });

    describe('Certification Relationship', () => {
        it('should populate certification details when retrieving a study session', async () => {
            // Arrange
            const certification = await new Certification({
                name: 'Populate Test Certification',
                provider: 'Test Provider',
                targetDate: new Date(),
                status: 'In Progress',
                studyHoursGoal: 70
            }).save();

            const studySession = await new StudySession({
                certification: certification._id,
                date: new Date(),
                duration: 75,
                topic: 'Populate Test Topic'
            }).save();

            // Act
            const populatedSession = await StudySession.findById(studySession._id).populate('certification');

            // Assert
            expect(populatedSession.certification).toBeDefined();
            expect(populatedSession.certification._id.toString()).toBe(certification._id.toString());
            expect(populatedSession.certification.name).toBe('Populate Test Certification');
            expect(populatedSession.certification.provider).toBe('Test Provider');
            expect(populatedSession.certification.studyHoursGoal).toBe(70);
            expect(populatedSession.certification.status).toBe('In Progress');
            expect(populatedSession.certification.targetDate.setHours(0, 0, 0, 0)).toBe(certification.targetDate.setHours(0, 0, 0, 0));
        });

        it('should find all session for a specific certification', async () => {
            // Arrange
            const certification1 = await new Certification({
                name: 'Cert One',
                provider: 'Provider A',
                targetDate: new Date(),
                status: 'In Progress',
                studyHoursGoal: 80
            }).save();

            const certification2 = await new Certification({
                name: 'Cert Two',
                provider: 'Provider B',
                targetDate: new Date(),
                status: 'Not Started',
                studyHoursGoal: 60
            }).save();

            await new StudySession({
                certification: certification1._id,
                date: new Date(),
                duration: 50,
                topic: 'Topic for Cert One - Session 1'
            }).save();

            await new StudySession({
                certification: certification1._id,
                date: new Date(),
                duration: 70,
                topic: 'Topic for Cert One - Session 2'
            }).save();

            await new StudySession({
                certification: certification2._id,
                date: new Date(),
                duration: 40,
                topic: 'Topic for Cert Two - Session 1'
            }).save();

            // Act
            const certification1Sessions = await StudySession.find({ certification: certification1._id });
            const certification2Sessions = await StudySession.find({ certification: certification2._id });

            // Assert
            expect(certification1Sessions.length).toBe(2);
            expect(certification1Sessions[0].certification.toString()).toBe(certification1._id.toString());
            expect(certification1Sessions[0].topic).toBe('Topic for Cert One - Session 2');
            expect(certification1Sessions[1].certification.toString()).toBe(certification1._id.toString());
            expect(certification1Sessions[1].topic).toBe('Topic for Cert One - Session 1');

            expect(certification2Sessions.length).toBe(1);
            expect(certification2Sessions[0].certification.toString()).toBe(certification2._id.toString());
            expect(certification2Sessions[0].topic).toBe('Topic for Cert Two - Session 1');
        });

        it('should calculate total study hours for a certification', async () => {
            // Arrange
            const certification = await new Certification({
                name: 'Total Hours Cert',
                provider: 'Provider C',
                targetDate: new Date(),
                status: 'In Progress',
                studyHoursGoal: 100
            }).save();

            await new StudySession({
                certification: certification._id,
                date: new Date(),
                duration: 60,
                topic: 'Session 1'
            }).save();

            await new StudySession({
                certification: certification._id,
                date: new Date(),
                duration: 90,
                topic: 'Session 2'
            }).save();
            await new StudySession({
                certification: certification._id,
                date: new Date(),
                duration: 30,
                topic: 'Session 3'
            }).save();

            // Act
            const sessions = await StudySession.find({ certification: certification._id });
            const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
            const totalHours = totalMinutes / 60;

            // Assert
            expect(totalHours).toBe(3.0);
            expect(totalMinutes).toBe(180);
        });
    });

    describe('Query Performance', () => {
        it('should use index when querying study sessions by certification and date', async () => {
            // Arrange
            const certification = await new Certification({
                name: 'Index Test Certification',
                provider: 'Test Provider',
                targetDate: new Date(),
                status: 'In Progress',
                studyHoursGoal: 90
            }).save();

            for (let i = 0; i < 10; i++) {
                await new StudySession({
                    certification: certification._id,
                    date: new Date(Date.now() - i * 86400000), // Past 10 days
                    duration: 30 + i * 10,
                    topic: `Index Test Topic ${i + 1}`
                }).save();
            }

            // Act
            const explainResult = await StudySession.find({ certification: certification._id })
                .sort({ date: -1 })
                .explain('executionStats');

            // Assert
            expect(explainResult.executionStats).toBeDefined();
            const indexUsed = explainResult.executionStats.totalKeysExamined > 0;
            expect(indexUsed).toBe(true);
        });
    });

    describe('Data Integrity', () => {
        it('should maintain referential integrity', async () => {
            // Arrange
            const certification = await new Certification({
                name: 'Referential Integrity Cert',
                provider: 'Provider D',
                targetDate: new Date(),
                status: 'In Progress',
                studyHoursGoal: 120
            }).save();

            const studySession = await new StudySession({
                certification: certification._id,
                date: new Date(),
                duration: 80,
                topic: 'Integrity Test Topic'
            }).save();

            // Act
            const foundCertification = await Certification.findById(certification._id);
            const foundStudySession = await StudySession.findById(studySession._id);

            // Assert
            expect(foundCertification).toBeDefined();
            expect(foundStudySession).toBeDefined();
            expect(foundStudySession.certification.toString()).toBe(foundCertification._id.toString());
        });
    });
});