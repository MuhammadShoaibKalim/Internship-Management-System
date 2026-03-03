import express from 'express';
import {
    getSupervisorStats,
    getAssignedStudents,
    reviewLog,
    scheduleVisit,
    getVisits,
    submitMarking
} from '../controllers/supervisor.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('supervisor'));

router.get('/stats', getSupervisorStats);
router.get('/students', getAssignedStudents);
router.patch('/logs/:id', reviewLog);
router.post('/visits', scheduleVisit);
router.get('/visits', getVisits);
router.post('/marking', submitMarking);

export default router;
