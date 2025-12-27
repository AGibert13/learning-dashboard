// src/controllers/certificationController.js
// Business logic for certification CRUD operations
// Separated from routes for testability and maintainability

const Certification = require('../models/Certification');

/** 
 * Create a new certification
 * POST /api/certifications
 * 
 * Request body:
 * {
 *  name: String (required),
 *  provider: String (required),
 *  targetDate: Date (optional, must not be in the past),
 *  status: String (optional, defaults to 'Not Started'),
 *  studyHoursGoal: Number (optional, must not be negative)
 * }
 * 
 * Response: 201 Created with certification object
 */
const createCertification = async (req, res, next) => {
    try {
        // Extract certification data from request body
        const { name, provider, targetDate, status, studyHoursGoal } = req.body;

        // Create new certification using Mongoose model
        // Model handles validation (required fields, enums, etc.)
        const certification = new Certification({
            name,
            provider,
            targetDate,
            status,
            studyHoursGoal
        });

        // Save to database
        // Pre-save hooks run here (e.g., capitalizing provider)
        const savedCertification = await certification.save();

        // Return 201 Created with saved certification
        // 201 is the proper HTTP status for resource creation
        return res.status(201).json({
            success: true,
            data: savedCertification
        });
    } catch (error) {
        // Pass to error handling middleware
        // This prevent exposing internal error details to client
        return next(error);
    }
};

module.exports = {
    createCertification,
};