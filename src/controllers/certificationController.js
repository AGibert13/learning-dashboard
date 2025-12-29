// src/controllers/certificationController.js
// Business logic for certification CRUD operations
// Separated from routes for testability and maintainability

const Certification = require('../models/Certification');
const { filterDefinedFields } = require('../utils/objectUtils');

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

/**
 * Get all certifications
 * GET /api/certifications
 * 
 * Response: 200 OK with array of certifications
 */

const getAllCertifications = async (req, res, next) => {
    try {
        // Retrieve all certifications from the database
        // Sort by createdAt descending (newest first)
        const certifications = await Certification.find()
            .sort( {createdAt: -1 });

        // Return array (can be empty is no certifications exist)
        return res.status(200).json({
            success: true,
            count: certifications.length,
            data: certifications
        });
    } catch (error) {
        // Pass to error handling middleware
        return next(error);
    }
};
/**
 * Get single certification by ID
 * GET /api/certifications/:id
 * 
 * Response: 200 OK with certification object, or 404 if not found
 */
const getCertificationById = async (req, res, next) => {
    try {
        // Extract certification ID from request parameters
        const { id } = req.params;

        // Find certification by ID
        const certification = await Certification.findById(id);

        // If not found, throw error to error handler
        if (!certification) {
            const error = new Error(`Certification with ID ${id} not found`);
            error.statusCode = 404;
            throw error;
        }

        // Return found certification
        return res.status(200).json({
            success: true,
            data: certification
        });
    } catch (error) {
        // Pass to error handling middleware
        return next(error);
    }
};

/**
 * Update certification by ID
 * PATCH /api/certifications/:id
 * 
 * Request body: Any valid certification fields to update
 * {
 *  name?: String,
 *  provider?: String,
 *  targetDate?: Date,
 *  status?: String,
 *  studyHoursGoal?: Number
 * }
 * 
 * Response: 200 OK with updated certification, or 404 if not found
 */
const updateCertification = async (req, res, next) => {
    try {
        // Extract certification ID from request parameters
        const { id } = req.params;
        const { name, provider, targetDate, status, studyHoursGoal } =  req.body;

        // Prepare update data, filtering out undefined fields
        const updateData = filterDefinedFields({
            name,
            provider,
            targetDate,
            status,
            studyHoursGoal
        });

        // Find and update certification in one operation
        const updatedCertification = await Certification.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true, // Return updated document
                runValidators: true // Run model validation on update
            }
        );
        
        // If not found, throw error to error handler
        if (!updatedCertification) {
            const error = new Error(`Certification with ID ${id} not found`);
            error.statusCode = 404;
            throw error;
        }

        // Return updated certification
        return res.status(200).json({
            success: true,
            data: updatedCertification
        });
    } catch (error) {
        // Pass to error handling middleware
        return next(error);
    }
};

/**
 * Delete Certification by ID
 * DELETE /api/certifications/:id
 * 
 * Response: 204 No Content on success, or 404 if not found
 */
const deleteCertification = async (req, res, next) => {
    try {
        // Extract certification ID from request parameters
        const { id } = req.params;

        // Find and delete certification
        const deletedCertificaiton = await Certification.findByIdAndDelete(id);
        
        // If not found, throw error to error handler
        if (!deletedCertificaiton) {
            const error = new Error(`Certification with ID ${id} not found`);
            error.statusCode = 404;
            throw error;
        }

        // Return 204 on success
        return res.status(204).send();
    } catch (error) {
        // Pass to error handling middleware
        return next(error);
    }
};

module.exports = {
    createCertification,
    getAllCertifications,
    getCertificationById,
    updateCertification,
    deleteCertification
};