import Notification from '../models/notification.model.js';

export const createNotification = async ({ type, message, recipientRole, user, relatedUser, priority = 'medium' }) => {
    try {
        await Notification.create({
            type,
            message,
            recipientRole,
            user,
            relatedUser,
            priority
        });
    } catch (err) {
        console.error('Failed to create notification node:', err);
    }
};
