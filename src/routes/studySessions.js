// src/routes/studySessions.js
// Route definitions for study session endpoints
// Maps HTTP methods and URLs to controller functions

const express = require('express');
const router = express.Router();
const {
    createStudySession,
    getAllStudySessions,
    getStudySessionById
} = require('../controllers/studySessionController');

/** 
 * Base route: /api/study-sessions
 * Handles study session-related requests
 * POST /api/study-sessions - Create a new study session
 * GET /api/study-sessions - Get all study sessions (optionally filter by certification and date range)
 * GET /api/study-sessions/:id - Get study session by ID
 */

router.route('/')
    .post(createStudySession)
    .get(getAllStudySessions);

router.route('/:id')
    .get(getStudySessionById);

module.exports = router;