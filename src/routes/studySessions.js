// src/routes/studySessions.js
// Route definitions for study session endpoints
// Maps HTTP methods and URLs to controller functions

const express = require('express');
const router = express.Router();
const {
    createStudySession,
} = require('../controllers/studySessionController');

/** 
 * Base route: /api/study-sessions
 * Handles study session-related requests
 * POST /api/study-sessions - Create a new study session
 */

router.route('/')
    .post(createStudySession);

module.exports = router;