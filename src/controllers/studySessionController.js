// src/controllers/studySessionController.js
// Business logic for study session CRUD operations
// Separated from routes for testability and maintainability

const StudySession = require('../models/StudySession');
const { filterDefinedFields } = require('../utils/objectUtils');

/** 
 * Create a new study session
 * POST /api/study-sessions
 * 
 * Request body:
 * {
 *  certification: ObjectId (required, must reference an existing certification),
 *  date: Date (required, must be today or in the past),
 *  topic: String (required, describes what was studied),
 *  duration: Number (required, duration in minutes, must be positive),
 *  notes: String (optional, additional details about the session)
 * }
 * 
 * Response: 201 Created with study session object
 */

const createStudySession = async (req, res, next) => {
    try {
        // Extract study session data from request body
        const { certification, date, topic, duration, notes } = req.body;

        // Filter out notes if it's undefined to avoid saving empty string
        const sessionData = filterDefinedFields({ certification, date, topic, duration, notes });

        // Create new study session using Mongoose model
        // Model handles validation (required fields, references, etc.)
        const studySession = new StudySession(sessionData);

        // Save to database
        const savedSession = await studySession.save();

        // Return 201 Created with saved study session
        return res.status(201).json({
            success: true,
            data: savedSession
        });
    } catch (error) {
        // Pass to error handling middleware
        // This prevent exposing internal error details to client
        return next(error);
    }
}

module.exports = {
    createStudySession
};