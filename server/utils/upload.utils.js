import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import AppError from './appError.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Certificate Storage ──────────────────────────────────────────────────────
const certificateStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/uploads/certificates');
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
        const dir = path.join(__dirname, '../public/uploads/cvs');
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

// ─── Generic Document Storage ──────────────────────────────────────────────────
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/uploads/documents');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `doc-${req.user.id}-${Date.now()}${ext}`;
        cb(null, uniqueName);
    }
});

const documentFilter = (req, file, cb) => {
    // Allow PDFs, images, and standard office docs
    const allowed = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Only PDFs, images, and Word docs are allowed', 400), false);
    }
};

export const uploadDocumentFile = multer({
    storage: documentStorage,
    fileFilter: documentFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
}).single('document');

// ─── Avatar / Profile Photo Storage ───────────────────────────────────────────
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/uploads/avatars');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `avatar-${req.user.id}-${Date.now()}${ext}`;
        cb(null, uniqueName);
    }
});

const avatarFilter = (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Only image files are allowed for profile photos', 400), false);
    }
};

export const uploadAvatarFile = multer({
    storage: avatarStorage,
    fileFilter: avatarFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2 MB max for avatars
}).single('avatar');
