import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AppError from './appError.utils.js';

// ─── Certificate Storage ──────────────────────────────────────────────────────
const certificateStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/certificates';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `certificate-${req.user.id}-${Date.now()}${ext}`;
        cb(null, uniqueName);
    }
});

const certificateFilter = (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Only PDF and image files (JPG, PNG) are allowed for certificates', 400), false);
    }
};

export const uploadCertificateFile = multer({
    storage: certificateStorage,
    fileFilter: certificateFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
}).single('certificate');

// ─── CV Storage ───────────────────────────────────────────────────────────────
const cvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/cvs';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `cv-${req.user.id}-${Date.now()}${ext}`;
        cb(null, uniqueName);
    }
});

const cvFilter = (req, file, cb) => {
    const allowed = ['application/pdf'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Only PDF files are allowed for CV', 400), false);
    }
};

export const uploadCVFile = multer({
    storage: cvStorage,
    fileFilter: cvFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
}).single('cv');
