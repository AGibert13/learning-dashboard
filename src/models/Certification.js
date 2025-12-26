const mongoose = require('mongoose');
const { Schema } = mongoose;

const CertificationSchema = new Schema({
    name: { type: String, required: [true, 'Please add a certification name'], trim: true, unique: true },
    provider: { type: String, trim: true, required: [true, 'Please add a certification provider (e.g., AWS, Azure)'] },
    targetDate: { type: Date, required: [true, 'Please add a target completion date'] },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
    studyHoursGoal: { type: Number, default: 0 },
},
    {
        timestamps: true

    });

module.exports = mongoose.model('Certification', CertificationSchema);