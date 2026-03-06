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
    hoursWorked: Number,
    dateRange: String, // e.g. "Oct 23 - Oct 27"
    summary: String,    // For the list view
    tasksPerformed: {
        type: String,
        required: [true, 'Please describe tasks performed']
    },
    challenges: String,
    learnings: String,
    attachment: {
        url: String,
        originalName: String
    },
    status: {
        type: String,
        enum: ['pending_student', 'submitted', 'approved', 'rejected'],
        default: 'submitted'
    },
    supervisorComments: String,
    marks: {
        type: Number,
        min: 0,
        max: 100
    },
    industryComments: String,
    industryMarks: {
        type: Number,
        min: 0,
        max: 100
    },
    assignedTasks: String // Next week's goals set by Industry
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Log = mongoose.model('Log', logSchema);
export default Log;
