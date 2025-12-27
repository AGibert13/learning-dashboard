// src/routes/certification.js
// Route definitions for certification endpoints
// Mapps HTTP methods and URLs to controller functions

const express = require('express');
const router = express.Router();
const { createCertification } = require('../controllers/certificationController');

/** 
 * POST /api/certifications
 * Create a new certification
 *
 * Body: JSON object with certification data
 * Response: 201 Created with certification object
 */

router.route('/')
    .post(createCertification);

module.exports = router;