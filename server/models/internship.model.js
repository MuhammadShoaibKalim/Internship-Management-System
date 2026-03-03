import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'An internship must have a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'An internship must have a description']
    },
    industry: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'An internship must belong to an industry']
    },
    companyName: String, // Denormalized for easier display
    location: {
        type: String,
        required: [true, 'Please specify location (e.g., Remote, Islamabad, etc.)']
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Remote', 'On-site'],
        default: 'Full-time'
    },
    duration: {
        type: String,
        required: [true, 'Please specify duration (e.g., 3 Months)']
    },
    stipend: {
        type: String,
        default: 'Unpaid'
    },
    tags: [String],
    skillsRequired: [String],
    deadline: {
        type: Date,
        required: [true, 'Please specify an application deadline']
    },
    status: {
        type: String,
        enum: ['draft', 'open', 'closed'],
        default: 'draft'
    },
    category: {
        type: String,
        required: [true, 'Please specify a category (e.g., Web Dev, Finance, AI)']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Internship = mongoose.model('Internship', internshipSchema);
export default Internship;
