const mongoose = require('mongoose');
const { Schema } = mongoose;

const CertificationSchema = new Schema({
    name: {type: String, required: [true, "Name is required"],},
    provider: {type: String, trim: true},
    targetDate: Date,
    status: {type: String, enum: ['planned', 'in-progress', 'completed'], default: 'planned'},
    studyHoursGoal: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now},
    overallProgress: {type: Number, min: 0, max: 100, default: 0}
});

module.exports = mongoose.model('Certification', CertificationSchema);