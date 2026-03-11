import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'An application must belong to a student']
    },
    internship: {
        type: mongoose.Schema.ObjectId,
        ref: 'Internship',
        required: [true, 'An application must belong to an internship']
    },
    status: {
        type: String,
        enum: [
            'pending',
            'applied',
            'shortlisted',
            'interviewed',
            'industry_selected',
            'supervisor_endorsed',
            'approved',
            'rejected',
            'completed'
        ],
        default: 'pending'
    },
    resume: {
        type: String,
        required: [true, 'Please provide a resume/CV URL']
    },
    coverLetter: String,
    appliedAt: {
        type: Date,
        default: Date.now()
    },
    feedback: String,
    certificate: {
        url: { type: String, default: null },
        uploadedAt: { type: Date, default: null },
        originalName: { type: String, default: null }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Optimization Indexes
applicationSchema.index({ status: 1 });
applicationSchema.index({ student: 1 });
applicationSchema.index({ internship: 1 });

// Ensure a student can't apply to the same internship twice
applicationSchema.index({ student: 1, internship: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
