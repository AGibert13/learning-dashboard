// src/app.js
// Basic Express app setup with a health check endpoint

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const certificationRoutes = require('./routes/certifications');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Health Check Endpoint
// Purpose: To verify that the server is running and responsive
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Learning Dashboard API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
// All certification endpoints are prefixed with /api/certifications
app.use('/api/certifications', certificationRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;