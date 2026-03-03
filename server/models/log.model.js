import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A log must belong to a student']
    },
    application: {
        type: mongoose.Schema.ObjectId,
        ref: 'Application',
        required: [true, 'A log must be linked to an active application']
    },
    date: {
        type: Date,
        default: Date.now()
    },
    weekNumber: Number,
    dateRange: String, // e.g. "Oct 23 - Oct 27"
    summary: String,    // For the list view
    tasksPerformed: {
        type: String,
        required: [true, 'Please describe tasks performed']
    },
    challenges: String,
    learnings: String,
    status: {
        type: String,
        enum: ['submitted', 'approved', 'rejected'],
        default: 'submitted'
    },
    supervisorComments: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Log = mongoose.model('Log', logSchema);
export default Log;
