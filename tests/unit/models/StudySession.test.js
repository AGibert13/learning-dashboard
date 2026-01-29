// tests/unit/models/StudySession.test.js
// Unit tests for StudySession model
// Tests validation rules, required fields, and business logic without DB interactions

const mongoose = require('mongoose')
const StudySession = require('../../../src/models/StudySession');
// const Certification = require('../../../src/models/Certification');
const { describe, it, expect } = require('@jest/globals');

describe('Study Session Model', () => {
    describe('Schema Validation', () => {
        it('should create a valid study session with required fields', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'AWS Lambda Functions',
                duration: 90
            });

            const error = session.validateSync();
            expect(error).toBeUndefined();
        });

        it('should require certification field', () => {
            const session = new StudySession({
                date: new Date(),
                topic: 'AWS Lambda',
                duration: 60
            });

            const error = session.validateSync();
            expect(error.errors['certification']).toBeDefined();
            expect(error.errors['certification'].message).toBe('Study session must be associated with a certification.');
        });

        it('should require date field', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                topic: 'React Hooks',
                duration: 45
            });

            const error = session.validateSync();
            expect(error.errors['date']).toBeDefined();
            expect(error.errors['date'].message).toBe('Please provide the date of the study session.');
        });

        it('should require topic field', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                duration: 20
            });

            const error = session.validateSync();
            expect(error.errors['topic']).toBeDefined();
            expect(error.errors['topic'].message).toBe('Please provide the topic studied during the session.');
        });

        it('should require duration field', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'MongoDB Aggregation'
            });

            const error = session.validateSync();
            expect(error.errors['duration']).toBeDefined();
            expect(error.errors['duration'].message).toBe('Please provide the duration of the study session in minutes.');
        });
    });

    describe('Field Validations', () => {
        it('should not allow future dates for study session', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1); // Tomorrow

            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: futureDate,
                topic: 'Docker Basics',
                duration: 30
            });

            const error = session.validateSync();
            expect(error.errors['date']).toBeDefined();
            expect(error.errors['date'].message).toBe(`Study session date ${futureDate.toISOString()} cannot be in the future.`);
        });

        it('should accept today\'s date for study session', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'GraphQL Introduction',
                duration: 60
            });

            const error = session.validateSync();
            expect(error).toBeUndefined();
        });

        it('should accept a past date for study session', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 5); // 5 days ago

            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: pastDate,
                topic: 'Kubernetes Intro',
                duration: 75
            });

            const error = session.validateSync();
            expect(error).toBeUndefined();
        });

        it('should enforce duration to be at least 1 minute', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'TypeScript Basics',
                duration: 0
            });

            const error = session.validateSync();
            expect(error.errors['duration']).toBeDefined();
            expect(error.errors['duration'].message).toBe('Study session duration must be at least 1 minute.');
        });

        it('should throw error for negative duration', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'Python Asyncio',
                duration: -30
            });

            const error = session.validateSync();
            expect(error.errors['duration']).toBeDefined();
            expect(error.errors['duration'].message).toBe('Study session duration must be at least 1 minute.');
        });

        it('should throw error for non-integer duration', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'Python Asyncio',
                duration: 30.5
            });

            const error = session.validateSync();
            expect(error.errors['duration']).toBeDefined();
            expect(error.errors['duration'].message).toBe(`Duration ${session.duration} must be a whole number (positive integer).`);
        });

        it('should accept valid duration', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'Django Framework',
                duration: 45
            });

            const error = session.validateSync();
            expect(error).toBeUndefined();
        });

        it('should trim topic field', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: '   Vue.js Components   ',
                duration: 50
            });
            const error = session.validateSync();
            expect(error).toBeUndefined();
            expect(session.topic).toBe('Vue.js Components');
        });

        it('should enforce topic length greater than or equal to 2 characters', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'A',
                duration: 25
            });

            const error = session.validateSync();
            expect(error.errors['topic']).toBeDefined();
            expect(error.errors['topic'].message).toBe('Topic must be at least 2 characters.');
        });

        it('should enforce topic length less than or equal to 150 characters', () => {
            const longTopic = 'A'.repeat(151);

            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: longTopic,
                duration: 25
            });

            const error = session.validateSync();
            expect(error.errors['topic']).toBeDefined();
            expect(error.errors['topic'].message).toBe('Topic cannot exceed 150 characters.');
        });
    });

    describe('Optional Fields', () => {
        it('should allow notes field to be undefined', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'CSS Grid Layout',
                duration: 40
            });

            const error = session.validateSync();
            expect(error).toBeUndefined();
            expect(session.notes).toBeUndefined();
        });

        it('should accept valid notes', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'Node.js Event Loop',
                duration: 120,
                notes: 'Focused on understanding asynchronous behavior.'
            });

            const error = session.validateSync();
            expect(error).toBeUndefined();
        });

        it('should trim notes field', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'RESTful APIs',
                duration: 80,
                notes: '   Reviewed best practices for designing RESTful APIs.   '
            });

            const error = session.validateSync();
            expect(error).toBeUndefined();
            expect(session.notes).toBe('Reviewed best practices for designing RESTful APIs.');
        });

        it('should enforce notes length less than or equal to 1000 characters', () => {
            const longNotes = 'A'.repeat(1001);

            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'Microservices Architecture',
                duration: 110,
                notes: longNotes
            });

            const error = session.validateSync();
            expect(error.errors['notes']).toBeDefined();
            expect(error.errors['notes'].message).toBe('Notes cannot exceed 1000 characters.');
        });
    });

    describe('Timestamps', () => {
        it('should have createdAt and updatedAt timestamps', () => {
            const session = new StudySession({
                certification: new mongoose.Types.ObjectId(),
                date: new Date(),
                topic: 'Agile Methodologies',
                duration: 70
            });

            expect(session.schema.paths['createdAt']).toBeDefined();
            expect(session.schema.paths['updatedAt']).toBeDefined();
        });
    });
});