// src/routes/certification.js
// Route definitions for certification endpoints
// Maps HTTP methods and URLs to controller functions

const express = require('express');
const router = express.Router();
const { 
    createCertification, 
    getAllCertifications, 
    getCertificationById,
    updateCertification,
    deleteCertification
 } = require('../controllers/certificationController');

/** 
 * Base route: /api/certifications
 * Handles certification-related requests
 * POST /api/certifications - Create a new certification
 * GET /api/certifications - Get all certifications
 * GET /api/certifications/:id - Get certification by ID
 * PATCH /api/certifications/:id - Update certification by ID
 * DELETE /api/certifications/:id - Delete certification by ID
 */

router.route('/')
    .post(createCertification)
    .get(getAllCertifications);

router.route('/:id')
    .get(getCertificationById)
    .patch(updateCertification)
    .delete(deleteCertification);

module.exports = router;