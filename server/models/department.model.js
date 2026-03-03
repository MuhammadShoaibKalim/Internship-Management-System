import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Department name is required'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Department code is required (e.g., CS)'],
        unique: true,
        uppercase: true
    },
    description: String,
    head: String, // Name of the HOD
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for getting students count (if needed later via population)
departmentSchema.virtual('students', {
    ref: 'User',
    foreignField: 'studentMeta.department',
    localField: 'code',
    count: true
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
