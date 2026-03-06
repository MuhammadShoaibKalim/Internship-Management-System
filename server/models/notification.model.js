import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'USER_REGISTRATION',
            'INDUSTRY_VERIFICATION',
            'APPLICATION_SUBMISSION',
            'APPLICATION_UPDATE',
            'LOG_SUBMISSION',
            'LOG_REVIEW',
            'EVALUATION_SUBMITTED',
            'MARKING_PUBLISHED',
            'SYSTEM_ALERT',
            'SECURITY',
            'AUTH_LOG'
        ],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    recipientRole: {
        type: String,
        enum: ['admin', 'student', 'industry', 'supervisor', 'all'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        description: 'Specific user to receive this notification'
    },
    relatedUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        description: 'User who triggered the action'
    },
    isRead: {
        type: Boolean,
        default: false
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
