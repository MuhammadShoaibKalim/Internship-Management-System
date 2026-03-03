import express from 'express';
import {
    getStudentStats,
    getMyProfile,
    updateMyProfile,
    getMyCertificates,
    uploadCV,
    toggleBookmark,
    uploadCertificate,
    getCertificateDetails,
    deleteCertificate
} from '../controllers/student.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { uploadCertificateFile, uploadCVFile } from '../utils/upload.utils.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('student'));

// ─── General ──────────────────────────────────────────────────────────────────
router.get('/stats', getStudentStats);
router.get('/profile', getMyProfile);
router.patch('/update-profile', updateMyProfile);
router.post('/toggle-bookmark/:id', toggleBookmark);

// ─── CV ───────────────────────────────────────────────────────────────────────
router.post('/upload-cv', uploadCV);

// ─── Certificates ─────────────────────────────────────────────────────────────
router.get('/certificates', getMyCertificates);
router.get('/certificates/:applicationId', getCertificateDetails);
router.post('/certificates/:applicationId/upload', uploadCertificateFile, uploadCertificate);
router.delete('/certificates/:applicationId', deleteCertificate);

export default router;
