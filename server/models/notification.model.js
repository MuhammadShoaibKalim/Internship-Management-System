import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['USER_REGISTRATION', 'INDUSTRY_VERIFICATION', 'APPLICATION_SUBMISSION', 'SYSTEM_ALERT', 'SECURITY', 'AUTH_LOG'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        enum: ['admin', 'student', 'industry', 'supervisor', 'all'],
        default: 'admin'
    },
    relatedUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    readBy: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
