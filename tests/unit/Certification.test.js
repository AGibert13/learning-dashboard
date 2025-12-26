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
    it('should fail if overallProgress is greater than 100', async () => {
        const cert = new Certification({
            name: 'AWS Solutions Architect',
            provider: 'Amazon',
            overallProgress: 150
        });

        let err;
        try {
            await cert.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.errors.overallProgress).toBeDefined();
        expect(err.errors.overallProgress.message).toContain('100');
    });
});