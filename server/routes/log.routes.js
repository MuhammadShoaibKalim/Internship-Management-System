import express from 'express';
import {
    submitLog,
    getMyLogs,
    getLog,
    getAllLogs
} from '../controllers/log.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(restrictTo('supervisor', 'admin'), getAllLogs);

router.route('/my-logs')
    .get(restrictTo('student'), getMyLogs);

router.route('/submit-log')
    .post(restrictTo('student'), submitLog);

router.route('/:id')
    .get(restrictTo('student', 'supervisor', 'admin'), getLog);

export default router;
