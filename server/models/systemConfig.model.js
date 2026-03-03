import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    category: {
        type: String,
        enum: ['security', 'platform', 'notifications', 'infrastructure'],
        default: 'platform'
    },
    description: String,
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);

export default SystemConfig;
