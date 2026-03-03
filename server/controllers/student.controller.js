import path from 'path';
import User from '../models/user.model.js';
import Application from '../models/application.model.js';
import Log from '../models/log.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/appError.utils.js';

// 1. Get Student Dashboard Stats
export const getStudentStats = catchAsync(async (req, res, next) => {
    const stats = {
        totalApplications: await Application.countDocuments({ student: req.user.id }),
        shortlisted: await Application.countDocuments({
            student: req.user.id,
            status: { $in: ['approved', 'industry_selected'] }
        }),
        weeklyLogs: await Log.countDocuments({ student: req.user.id })
    };

    // Also get the current placement (most recent active internship)
    const currentPlacement = await Application.findOne({
        student: req.user.id,
        status: { $in: ['approved', 'industry_selected', 'completed'] }
    }).populate('internship').sort('-updatedAt');

    res.status(200).json({
        status: 'success',
        data: {
            stats,
            currentPlacement
        }
    });
});

// 2. Get Student Profile (For CV Builder / Settings)
export const getMyProfile = catchAsync(async (req, res, next) => {
    const student = await User.findById(req.user.id);

    if (!student) {
        return next(new AppError('Student not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { student }
    });
});

// 3. Update Student Profile
export const updateMyProfile = catchAsync(async (req, res, next) => {
    // Filter out restricted fields like password, role, etc.
    const filteredBody = { ...req.body };
    delete filteredBody.password;
    delete filteredBody.role;
    delete filteredBody.email;
    delete filteredBody.status;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: { user: updatedUser }
    });
});

// 4. Get My Certificates (Completed Applications)
export const getMyCertificates = catchAsync(async (req, res, next) => {
    const completedApps = await Application.find({
        student: req.user.id,
        status: 'completed'
    }).populate('internship').select('+certificate');

    res.status(200).json({
        status: 'success',
        results: completedApps.length,
        data: { certificates: completedApps }
    });
});

// 4b. Upload Certificate for a Completed Internship
export const uploadCertificate = catchAsync(async (req, res, next) => {
    const { applicationId } = req.params;

    // 1) Find the application
    const application = await Application.findOne({
        _id: applicationId,
        student: req.user.id
    });

    if (!application) {
        return next(new AppError('No application found with that ID for your account', 404));
    }

    // 2) Only allow certificate upload for completed internships
    if (application.status !== 'completed') {
        return next(new AppError('You can only upload a certificate for a completed internship', 400));
    }

    // 3) Check if file was actually uploaded via multer
    if (!req.file) {
        return next(new AppError('Please upload a certificate file (PDF or image)', 400));
    }

    // 4) Build the accessible URL (served as static)
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/certificates/${req.file.filename}`;

    // 5) Save to application
    application.certificate = {
        url: fileUrl,
        uploadedAt: new Date(),
        originalName: req.file.originalname
    };
    await application.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Certificate uploaded successfully',
        data: {
            applicationId: application._id,
            certificate: application.certificate
        }
    });
});

// 4c. Get Single Certificate Details by Application ID
export const getCertificateDetails = catchAsync(async (req, res, next) => {
    const { applicationId } = req.params;

    const application = await Application.findOne({
        _id: applicationId,
        student: req.user.id,
        status: 'completed'
    }).populate('internship');

    if (!application) {
        return next(new AppError('No completed application found with that ID', 404));
    }

    if (!application.certificate || !application.certificate.url) {
        return next(new AppError('No certificate has been uploaded for this application yet', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            application: {
                _id: application._id,
                internship: application.internship,
                status: application.status,
                certificate: application.certificate
            }
        }
    });
});

// 4d. Delete / Remove Certificate
export const deleteCertificate = catchAsync(async (req, res, next) => {
    const { applicationId } = req.params;

    const application = await Application.findOne({
        _id: applicationId,
        student: req.user.id,
        status: 'completed'
    });

    if (!application) {
        return next(new AppError('No completed application found with that ID', 404));
    }

    if (!application.certificate || !application.certificate.url) {
        return next(new AppError('No certificate exists to delete for this application', 404));
    }

    application.certificate = { url: null, uploadedAt: null, originalName: null };
    await application.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Certificate removed successfully'
    });
});

// 5. Upload/Update CV
export const uploadCV = catchAsync(async (req, res, next) => {
    if (!req.body.cvUrl) {
        return next(new AppError('Please provide a CV URL', 400));
    }

    const user = await User.findByIdAndUpdate(req.user.id, {
        cvUrl: req.body.cvUrl
    }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

// 6. Toggle Bookmark Internship
export const toggleBookmark = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const internshipId = req.params.id;

    if (!user.bookmarks) user.bookmarks = [];

    const isBookmarked = user.bookmarks.includes(internshipId);

    if (isBookmarked) {
        user.bookmarks = user.bookmarks.filter(id => id.toString() !== internshipId);
    } else {
        user.bookmarks.push(internshipId);
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: isBookmarked ? 'Bookmark removed' : 'Bookmark added',
        data: { bookmarks: user.bookmarks }
    });
});
