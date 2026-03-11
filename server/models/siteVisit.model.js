import mongoose from 'mongoose';

const siteVisitSchema = new mongoose.Schema({
    supervisor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A visit must be assigned to a supervisor']
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A visit must be for a student']
    },
    company: {
        type: String,
        required: [true, 'Company name is required']
    },
    address: {
        type: String,
        required: [true, 'Visit address is required']
    },
    date: {
        type: Date,
        required: [true, 'Visit date is required']
    },
    time: String,
    contactPerson: String,
    status: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    report: String, // Final feedback after visit
    feedbackScore: {
        type: Number,
        min: 1,
        max: 10
    }
}, {
    timestamps: true
});

siteVisitSchema.index({ supervisor: 1 });
siteVisitSchema.index({ student: 1 });
siteVisitSchema.index({ status: 1 });
siteVisitSchema.index({ date: 1 });

const SiteVisit = mongoose.model('SiteVisit', siteVisitSchema);
export default SiteVisit;
