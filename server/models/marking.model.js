import mongoose from 'mongoose';

const markingSchema = new mongoose.Schema({
    supervisor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Marking must be done by a supervisor']
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Marking must belong to a student']
    },
    application: {
        type: mongoose.Schema.ObjectId,
        ref: 'Application',
        required: [true, 'Marking must be linked to an application']
    },
    metrics: {
        technicalProficiency: { type: Number, min: 0, max: 100 },
        softSkills: { type: Number, min: 0, max: 100 },
        logConsistency: { type: Number, min: 0, max: 100 },
        industryFeedback: { type: Number, min: 0, max: 100 }
    },
    industryGpa: Number, // Provided by company
    recommendation: {
        type: String,
        required: [true, 'Final academic recommendation is required']
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: Date
}, {
    timestamps: true
});

const Marking = mongoose.model('Marking', markingSchema);
export default Marking;
