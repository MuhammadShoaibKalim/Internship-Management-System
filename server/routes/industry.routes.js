import express from 'express';
import {
    getIndustryStats,
    createInternship,
    getIndustryInternships,
    updateInternship,
    deleteInternship,
    getApplicants,
    updateApplicantStatus,
    getActiveInterns,
    submitEvaluation,
    getEvaluations
} from '../controllers/industry.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('industry'));

// Dashboard
router.get('/stats', getIndustryStats);

// Internship Postings
router.route('/postings')
    .get(getIndustryInternships)
    .post(createInternship);

router.route('/postings/:id')
    .patch(updateInternship)
    .delete(deleteInternship);

// Talent Pipeline
router.get('/applicants', getApplicants);
router.patch('/applicants/:id/status', updateApplicantStatus);

// Interns
router.get('/interns', getActiveInterns);

// Evaluations
router.route('/evaluations')
    .get(getEvaluations)
    .post(submitEvaluation);

export default router;
