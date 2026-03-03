import mongoose from 'mongoose';

const performanceEvaluationSchema = new mongoose.Schema({
    industry: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Evaluation must belong to an industry partner']
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Evaluation must belong to a student']
    },
    application: {
        type: mongoose.Schema.ObjectId,
        ref: 'Application',
        required: [true, 'Evaluation must be linked to an application']
    },
    period: {
        type: String,
        enum: ['First Month', 'Mid-term', 'Final', 'Other'],
        required: [true, 'Please specify the evaluation period']
    },
    metrics: {
        professionalism: { type: Number, min: 1, max: 10 },
        technicalSkills: { type: Number, min: 1, max: 10 },
        communication: { type: Number, min: 1, max: 10 },
        punctuality: { type: Number, min: 1, max: 10 },
        learningAgility: { type: Number, min: 1, max: 10 }
    },
    overallScore: Number,
    comments: String,
    status: {
        type: String,
        enum: ['draft', 'completed'],
        default: 'completed'
    },
    evaluatedAt: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
});

// Calculate overall score before saving
performanceEvaluationSchema.pre('save', function (next) {
    if (this.metrics) {
        const values = Object.values(this.metrics);
        const sum = values.reduce((acc, curr) => acc + curr, 0);
        this.overallScore = (sum / (values.length * 10)) * 100;
    }
    next();
});

const PerformanceEvaluation = mongoose.model('PerformanceEvaluation', performanceEvaluationSchema);
export default PerformanceEvaluation;
