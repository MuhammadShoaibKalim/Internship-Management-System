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
    deleteCertificate,
    uploadDocument,
    deleteDocument,
    getMyMarking
} from '../controllers/student.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { uploadCertificateFile, uploadCVFile, uploadDocumentFile } from '../utils/upload.utils.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('student'));

// ─── General ──────────────────────────────────────────────────────────────────
router.get('/stats', getStudentStats);
router.get('/profile', getMyProfile);
router.patch('/update-profile', updateMyProfile);
router.post('/toggle-bookmark/:id', toggleBookmark);

// ─── CV ───────────────────────────────────────────────────────────────────────
router.post('/upload-cv', uploadCVFile, uploadCV);

// ─── Certificates ─────────────────────────────────────────────────────────────
router.get('/certificates', getMyCertificates);
router.get('/certificates/:applicationId', getCertificateDetails);
router.post('/certificates/:applicationId/upload', uploadCertificateFile, uploadCertificate);
router.delete('/certificates/:applicationId', deleteCertificate);

// ─── Generic Documents ────────────────────────────────────────────────────────
router.post('/upload-document', uploadDocumentFile, uploadDocument);
router.delete('/documents/:documentId', deleteDocument);

// ─── Final Marking ────────────────────────────────────────────────────────────
router.get('/marking', getMyMarking);

export default router;
