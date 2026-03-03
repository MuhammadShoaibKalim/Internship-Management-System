import express from 'express';
import {
    signup,
    login,
    logout,
    verifyOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    updatePassword
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public Routes
router.post('/signup', signup);
router.post('/register', signup); // Alias for convenience
router.post('/login', login);
router.post('/verifyOTP', verifyOTP);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetOTP', verifyResetOTP);
router.patch('/resetPassword/:token', resetPassword);

// Protected Routes
router.use(protect);

router.get('/logout', logout);
router.patch('/updateMyPassword', updatePassword);

export default router;
