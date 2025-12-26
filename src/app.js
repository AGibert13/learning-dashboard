// src/app.js
// Basic Express app setup with a health check endpoint

const express = require('express');
const cors = require('cors');

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
        timestamp: new Date().toISOString()
    });
});

module.exports = app;