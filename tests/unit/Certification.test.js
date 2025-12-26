const { describe, it, beforeAll, afterEach, afterAll, expect } = require('@jest/globals');
const dbhHandler = require('../db-handler');
const Certification = require('../../src/models/Certification');

beforeAll(async () => {
    await dbhHandler.connect();
});

afterEach(async () => {
    await dbhHandler.clearDatabase();
});

afterAll(async () => {
    await dbhHandler.closeDatabase();
});

describe('Certification Model Validation', () => {
    it('should fail if name is missing', async () => {
        const cert = new Certification({
            name: '',
            provider: 'Amazon',
        });

        let err;
        try {
            await cert.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.errors.name).toBeDefined();
        expect(err.errors.name.message).toContain('name');
    });
});