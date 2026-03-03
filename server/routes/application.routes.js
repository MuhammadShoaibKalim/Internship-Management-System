import express from 'express';
import {
    applyToInternship,
    getMyApplications,
    getApplication
} from '../controllers/application.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/my-applications')
    .get(restrictTo('student'), getMyApplications);

router.route('/apply')
    .post(restrictTo('student'), applyToInternship);

router.route('/:id')
    .get(restrictTo('student', 'industry', 'supervisor', 'admin'), getApplication);

export default router;
