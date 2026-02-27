// src/middleware/errorHandler.js
// Centralized error handling middleware for Express
// Catches errors from routes and controllers

/** 
 * Error handling middleware
 * @param {Error} err - Error object from previous middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} _next - Express next function (not used)
 */

const errorHandler = (err, req, res, _next) => {
    // Log to console for dev
    console.error(`🔴 Error: ${err.stack}`);

    if (err.name === 'ValidationError') {
        // Extract validation error messages
        const messages = Object.values(err.errors).map(err => err.message);

        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            messages
        });
    }

    // MongoDB duplicate key error (unique constraint violation)
    if (err.code === 11000) {
        // Extract the field and value that cause the duplicate key error
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];

        return res.status(409).json({
            success: false,
            error: 'Duplicate Error',
            message: `"${value}" already exists for field "${field}". Please use a different value.`
        });
    }

    // No Id found error
    if (err.message && err.message.includes('with ID') && err.message.includes('not found')) {
        return res.status(404).json({
            success: false,
            error: 'Not Found',
            message: err.message
        });
    }

    // MongoDB CastError (invalid ObjectId)
    if(err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({
            success: false,
            error: 'Invalid ID',
            message: `The provided ID "${err.value}" is not a valid identifier.`
        });
    }

    return res.status(err.statusCode || 500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message || 'Server Error'
    });
};

module.exports = errorHandler;