import express from 'express';
import { getMe, updateMe, deleteMe } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All routes below are protected

router.get('/me', getMe);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

export default router;
