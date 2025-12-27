// src/middleware/errorHanldler.js
// Centralized error handling middleware for Express
// Catches errors from routes and controllers

const errorHandler = (err, req, res, _next) => {
    let error = { ...err };
    error.message = err.message;
    
    // Log to console for dev
    console.error(`🔴 Error: ${err.stack}`);

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.name || 'Internal Server Error',
        message: error.message || 'Server Error'
    });
};

module.exports = errorHandler;