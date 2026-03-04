import Notification from '../models/notification.model.js';

export const createNotification = async ({ type, message, recipient = 'admin', relatedUser, priority = 'medium' }) => {
    try {
        await Notification.create({
            type,
            message,
            recipient,
            relatedUser,
            priority
        });
    } catch (err) {
        console.error('Failed to create notification node:', err);
    }
};
