// src/models/StudySession.js
// Mongoose schema and model for StudySession entity
// Represents a study session logged by the user

const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * StudySession Schema
 * Represents a single study session for a certification.
 * Tracks what was studied, when, and for how long.
 * 
 * Relationships:
 * - Belongs to one Certification (many-to-one)
 */

const studySessionSchema = new Schema({
    // Reference to the Certification this session is for
    // Required field - every study session must belong to a certification
    certification: {
        type: Schema.Types.ObjectId,
        ref: 'Certification',
        required: [true, 'Study session must be associated with a certification.'],
        validate: {
            validator: async function(certId) {
                const cert = await mongoose.model('Certification').findById(certId);
                return cert !== null;
            },
            message: props => `Certification with id ${props.value} does not exist.`
        }
    },
    // Date of the study session
    // Required field - Must be today or in the past (no future dates)
    date: {
        type: Date,
        required: [true, 'Please provide the date of the study session.'],
        validate: {
            validator: function(value) {
                const sessionDate = new Date(value);
                sessionDate.setHours(0, 0, 0, 0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return sessionDate.getTime() <= today.getTime();
            },
            message: props => `Study session date ${props.value.toISOString()} cannot be in the future.`
        }
    },
    // Topic studied during the session
    // Required field - must describe what was studied (ex. "AWS Lambda", "React Hooks", "MongoDB Aggregation")
    topic: {
        type: String,
        required: [true, 'Please provide the topic studied during the session.'],
        trim: true,
        minlength: [2, 'Topic must be at least 2 characters.'],
        maxlength: [150, 'Topic cannot exceed 150 characters.']
    },
    // Duration of the study session in minutes
    // Required field - must be at least 1 minute (no zero or negative durations)
    duration: {
        type: Number,
        required: [true, 'Please provide the duration of the study session in minutes.'],
        min: [1, 'Study session duration must be at least 1 minute.'],
        validate: {
            validator: Number.isInteger,
            message: props => `Duration ${props.value} must be a whole number (positive integer).`
        }
    },
    // Notes about the study session
    // Optional - user can add additional details if desired
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters.']
    }
}, {
    timestamps: true,
});

// Create index to optimize queries by certification and date
studySessionSchema.index({ certification: 1, createdAt: -1 });

// Export the StudySession model
module.exports = mongoose.model('StudySession', studySessionSchema);