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

/**
 * Get all study sessions; optionally filter by certification and date range
 * GET /api/study-sessions
 * GET /api/study-sessions?certification=:certId&startDate=:start&endDate=:end
 * 
 * Response: 200 OK with array of study sessions
 * 
 * Note: Filtering by certification and date range is optional. If no query parameters are provided, all study sessions will be returned.
 * If certification is provided, only sessions for that certification will be returned.
 * If startDate and/or endDate are provided, only sessions within that date range will be returned.
*/

const getAllStudySessions = async (req, res, next) => {
    try {
        let filter = {};

        // Conditionally add certification filter if provided
        if (req.query.certification) {
            filter.certification = req.query.certification;
        }
        
        // Conditionally add date range filter if startDate and/or endDate are provided
        if (req.query.startDate || req.query.endDate) {
            filter.date = {};
            if (req.query.startDate) {
                filter.date.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                filter.date.$lte = new Date(req.query.endDate);
            }
        }

        // Query database with optional filters and add certification details
        const studySessions = await StudySession
            .find(filter)
            .populate('certification', 'name provider status')
            .sort({ date: -1 }); // Sort by most recent first

        return res.status(200).json({
            success: true,
            count: studySessions.length,
            data: studySessions
        });
    } catch (error) {
        return next(error);
    }
}

/**
 * Get single study session by ID
 * GET /api/study-sessions/:id
 * 
 * Response: 200 OK with study session object, or 404 if not found
 */

const getStudySessionById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const studySession = await StudySession
            .findById(id)
            .populate('certification', 'name provider status');

        if (!studySession) {
            const error = new Error(`Study session with ID ${id} not found`);
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({
            success: true,
            data: studySession
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createStudySession,
    getAllStudySessions,
    getStudySessionById
};