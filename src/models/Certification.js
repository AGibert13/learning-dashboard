// src/models/Certification.js
// Mongoose schema and model for Certification entity
// Represents a certification the user is pursuing

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Certification Schema
 * Tracks certifications user is studying for with goals and status
 * 
 * Design decisions:
 * - Status uses enum to prevent invalid values
 * - studyHoursGoal is optional (User may not set a goal initially)
 * - createdAt and updatedAt timestamps for tracking
 */

const CertificationSchema = new Schema({
    //Certification name (e.g., AWS Certified Solutions Architect)
    // Required field - every certification must have a name
    name: {
        type: String,
        required: [true, 'Please add a certification name'],
        trim: true,
        unique: true,
        minlength: [3, 'Certification name must be at least 3 characters'],
        maxlength: [100, 'Certification name cannot exceed 100 characters']
    },
    // Certification provider (e.g., AWS, Azure)
    //Required field - every certification must have a provider
    provider: {
        type: String,
        trim: true,
        required: [true, 'Please add a certification provider (e.g., AWS, Azure)'],
        maxlength: [60, 'Provider name cannot exceed 60 characters']
    },
    // Target completion date
    // Optional - user may not have a deadline
    targetDate: {
        type: Date,
        validate: {
            // Custom validator: target date cannot be in the past
            validator: function (value) {
                // Only validate if targetDate is provided
                if (!value) return true;
                // Allow dates from today onwards
                return value >= new Date().setHours(0, 0, 0, 0);
            },
            message: props => `Target date ${props.value} cannot be in the past`
        }
    },
    // Current status of certification pursuit
    // Uses enum to restrict to valid values only
    status: {
        type: String,
        enum: {
            values: ['Not Started', 'In Progress', 'Completed'],
            message: '{VALUE} is not a valid status. Must be: Not Started, In Progress, or Completed'
        },
        default: 'Not Started'
    },
    // Goal for total study hours
    // Optional - user might not set a numeric goal
    studyHoursGoal: {
        type: Number,
        min: [0, 'Study hours goal cannot be negative'],
        max: [1000, 'Study hours goal cannot exceed 1000']
    },
},
    {
        timestamps: true

    });

/**
 * Pre-save hook (middleware)
 * Runs before document is saved to database
 * Purpose: Additional business logic or transformations
 * 
 * Example use case (for future):
 * - Auto-capitalize provider name
 * - Log when certification moves to "completed" status
 */
CertificationSchema.pre('save', async function () {
    // Example: Capitalize provider name if provided
    if (this.provider) {
        this.provider = this.provider.charAt(0).toUpperCase() + this.provider.slice(1);
    }
});

/**
 * Instance method: Check if certification is overdue
 * Can be called on any certification document
 * Usage: certification.isOverdue()
 */
CertificationSchema.methods.isOverdue = function () {
    // treat null or undefined the same way
    if (this.targetDate == null || this.status === 'Completed') return false;

    // compare calendar days (ignore time of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(this.targetDate);
    target.setHours(0, 0, 0, 0);
    return today > target;
};
/**
 * Virtual property: days until target date
 * Not stored in database, computed on the fly
 * Usage: certification.daysUntilTarget
 */
CertificationSchema.virtual('daysUntilTarget').get(function () {
    if (this.targetDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(this.targetDate);
        target.setHours(0, 0, 0, 0);
        const diffTime = target - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return null;
});
const Certification = mongoose.model('Certification', CertificationSchema);

module.exports = Certification;