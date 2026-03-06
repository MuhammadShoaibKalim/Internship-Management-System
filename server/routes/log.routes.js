import express from 'express';
import {
    submitLog,
    getMyLogs,
    getLog,
    getAllLogs,
    gradeLog
} from '../controllers/log.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { uploadDocumentFile } from '../utils/upload.utils.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(restrictTo('supervisor', 'admin', 'industry'), getAllLogs);

router.route('/my-logs')
    .get(restrictTo('student'), getMyLogs);

router.route('/submit-log')
    .post(restrictTo('student'), uploadDocumentFile, submitLog);

router.route('/:id')
    .get(restrictTo('student', 'supervisor', 'admin', 'industry'), getLog);

router.route('/:id/grade')
    .patch(restrictTo('supervisor', 'admin', 'industry'), gradeLog);

export default router;
