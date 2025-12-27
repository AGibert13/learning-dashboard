// tests/unit/models/Certification.test.js
// Unit tests for Certification model
// Tests validation rules, schema defaults, and instance methods
const { describe, it, expect } = require('@jest/globals');
const Certification = require('../../src/models/Certification');

describe('Certification Model', () => {
    // Test suite for validation rules
    describe('Validation', () => {
        it('should create a valid certification with all fields', async () => {
            // Arrange - create certification data
            const certData = {
                name: 'AWS Certified AI Practitioner',
                provider: 'AWS',
                targetDate: new Date('2026-12-31'),
                status: 'In Progress',
                studyHoursGoal: 50
            };

            // Act - create and save certification
            const certification = new Certification(certData);
            const savedCert = await certification.save();

            // Assert - verify saved data matches input
            expect(savedCert._id).toBeDefined();
            expect(savedCert.name).toBe(certData.name);
            expect(savedCert.provider).toBe(certData.provider);
            expect(savedCert.targetDate.toISOString()).toBe(certData.targetDate.toISOString());
            expect(savedCert.status).toBe(certData.status);
            expect(savedCert.studyHoursGoal).toBe(certData.studyHoursGoal)
            expect(savedCert.createdAt).toBeDefined();
            expect(savedCert.updatedAt).toBeDefined();
        });
        it('should require name and provider fields', async () => {
            // Arrange - certification without name and provider
            const certification = new Certification({});

            // Act & Assert - expect validation error
            let err;
            try {
                await certification.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.name).toBeDefined();
            expect(err.errors.name.message).toBe('Please add a certification name')
            expect(err.errors.provider).toBeDefined();
            expect(err.errors.provider.message).toBe('Please add a certification provider (e.g., AWS, Azure)');
        });
        it('should reject name shorter than 3 characters', async () => {
            // Arrange - certification with short name
            const certification = new Certification({
                name: 'AI',
                provider: 'AWS'
            });

            // Act & Assert - expect validation error
            let err;
            try {
                await certification.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.name).toBeDefined();
            expect(err.errors.name.message).toBe('Certification name must be at least 3 characters');
        });
        it('should accept valid status values', async () => {
            const validStatuses = ['Not Started', 'In Progress', 'Completed'];

            //Arrange & Act & Assert - test each valid status
            for (const status of validStatuses) {
                const certification = new Certification({
                    name: `Test Cert ${status}`,
                    provider: 'Test Provider',
                    status: status
                });

                const savedCert = await certification.save();
                expect(savedCert.status).toBe(status);
            }
        });
        it('should reject invalid status values', async () => {
            // Arrange - certification with invalid status
            const certification = new Certification({
                name: 'Invalid Status Cert',
                provider: 'Test Provider',
                status: 'Invalid Status'
            });

            // Act & Assert - expect validation error

            let err;
            try {
                await certification.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.status).toBeDefined();
        });
        it('should default status to "Not Started" if not provided', async () => {
            // Arrange - certification without status
            const certification = new Certification({
                name: 'Default Status Cert',
                provider: 'Test Provider'
            });

            // Act - save certification
            const savedCert = await certification.save();

            // Assert - verify default status
            expect(savedCert.status).toBe('Not Started');
        });
        it('should validate studyHoursGoal is non-negative', async () => {
            // Arrange - certification with negative studyHoursGoal
            const certification = new Certification({
                name: 'Negative Study Hours Cert',
                provider: 'Test Provider',
                studyHoursGoal: -10
            });

            // Act & Assert - expect validation error
            let err;
            try {
                await certification.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.studyHoursGoal).toBeDefined();
        });
        it('should validate studyHoursGoal does not exceed 1000', async () => {
            // Arrange - certification with excessive studyHoursGoal
            const certification = new Certification({
                name: 'Excessive Study Hours Cert',
                provider: 'Test Provider',
                studyHoursGoal: 1500
            });

            // Act & Assert - expect validation error
            let err;
            try {
                await certification.save();
            } catch (error) {
                err = error;
            }
            expect(err).toBeDefined();
            expect(err.errors.studyHoursGoal).toBeDefined();
        });
    });
    // Test suite for pre-save hooks
    describe('Pre-save Hooks', () => {
        it('should capitalize provider name before saving', async () => {
            // Arrange - certification with lowercase provider
            const certification = new Certification({
                name: 'Capitalization Test Cert',
                provider: 'aws'
            });

            // Act - save certification
            const savedCert = await certification.save();

            // Assert - verify provider name is capitalized
            expect(savedCert.provider).toBe('Aws');
        });
        it('should handle provider with mixed case', async () => {
            // Arrange - certification with mixed case provider
            const certification = new Certification({
                name: 'Mixed Case Provider Cert',
                provider: 'aZUrE'
            });

            // Act - save certification
            const savedCert = await certification.save();

            // Assert - verify provider name is capitalized
            expect(savedCert.provider).toBe('AZUrE');
        });
    });
    // Test suite for instance methods
    describe('Instance Methods', () => {
        describe('isOverdue', () => {
            it('should return false if no target date is set', async () => {
                // Arrange - certification without target date
                const certification = new Certification({
                    name: 'No Target Date Cert',
                    provider: 'Test Provider',
                    status: 'In Progress'
                });

                // Act - check if overdue
                await certification.save();
                // Assert - should not be overdue
                expect(certification.isOverdue()).toBe(false);
            });
            it('should return false if status is Completed', async () => {
                // Arrange - completed certification
                const pastDate = new Date();
                pastDate.setDate(pastDate.getDate() - 10); // 10 days ago

                const certification = new Certification({
                    name: 'Completed Cert',
                    provider: 'Test Provider',
                    targetDate: pastDate,
                    status: 'Completed'
                });

                // Act & Assert
                expect(certification.isOverdue()).toBe(false);
            });
            it('should return true if target date has passed and not completed', async () => {
                // Arrange - overdue certification
                const pastDate = new Date();
                pastDate.setDate(pastDate.getDate() - 10); // 10 days ago
                const certification = new Certification({
                    name: 'Overdue Cert',
                    provider: 'Test Provider',
                    targetDate: pastDate,
                    status: 'In Progress'
                });

                // Act & Assert
                // Not calling save() to avoid pre-save hook interference
                expect(certification.isOverdue()).toBe(true);
            });
            it('should return false if the target date is in the future', async () => {
                // Arrange - non-overdue certification
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 10); // 10 days in future
                const certification = new Certification({
                    name: 'On Track Cert',
                    provider: 'Test Provider',
                    targetDate: futureDate,
                    status: 'In Progress'
                });
                
                // Act & Assert
                await certification.save();
                expect(certification.isOverdue()).toBe(false);
            });
        });
    });
    // Test suite for virtual properties
    describe('Virtual Properties', () => {
        describe('daysUntilTarget', () => {
            it('should return null if no target date is set', async () => {
                // Arrange - certification without target date
                const certification = new Certification({
                    name: 'No Target Date Cert',
                    provider: 'Test Provider'
                });

                // Act & Assert
                expect(certification.daysUntilTarget).toBeNull();
            });
            it('should calculate days until target date', async () => {
                // Arrange - certification with future target date
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 15); // 15 days in future
                const certification = new Certification({
                    name: 'Future Target Cert',
                    provider: 'Test Provider',
                    targetDate: futureDate
                });

                // Act & Assert
                expect(certification.daysUntilTarget).toBe(15);
            });
            it('should return negative number for past dates', async () => {
                // Arrange - certification with past target date
                const pastDate = new Date();
                pastDate.setDate(pastDate.getDate() - 7); // 7 days ago
                const certification = new Certification({
                    name: 'Past Target Cert',
                    provider: 'Test Provider',
                    targetDate: pastDate
                });

                // Act & Assert
                expect(certification.daysUntilTarget).toBe(-7);
            });
        });
    });
});