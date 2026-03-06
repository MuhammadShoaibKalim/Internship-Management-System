import express from 'express';
import { getMe, updateMe, deleteMe, uploadAvatar, getMyNotifications, markNotificationAsRead } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadAvatarFile } from '../utils/upload.utils.js';

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.patch('/updateMe', updateMe);
router.post('/upload-avatar', uploadAvatarFile, uploadAvatar);
router.delete('/deleteMe', deleteMe);

// Notification Routes
router.get('/notifications', getMyNotifications);
router.patch('/notifications/:id/read', markNotificationAsRead);

export default router;
