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

    const studentObj = student.toObject();
    if (studentObj.cvUrl) {
        studentObj.cv = {
            url: studentObj.cvUrl,
            name: 'Student_CV.pdf',
            updatedAt: studentObj.updatedAt
        };
    }

    res.status(200).json({
        status: 'success',
        data: { student: studentObj }
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
    }).populate('internship');

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

// 5. Upload CV (Requires uploadCVFile middleware in routes)
export const uploadCV = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload a CV file (PDF)', 400));
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/cvs/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user.id, {
        cvUrl: fileUrl
    }, {
        new: true,
        runValidators: false
    });

    res.status(200).json({
        status: 'success',
        data: {
            cv: {
                url: fileUrl,
                name: req.file.originalname,
                updatedAt: new Date()
            }
        }
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

// 7. Upload Generic Document (Requires uploadDocumentFile middleware in routes)
export const uploadDocument = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload a document file (PDF, Image, or Word Doc)', 400));
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/documents/${req.file.filename}`;
    const newDoc = {
        name: req.file.originalname,
        url: fileUrl,
        uploadedAt: new Date()
    };

    const user = await User.findByIdAndUpdate(req.user.id, {
        $push: { documents: newDoc }
    }, {
        new: true,
        runValidators: false
    });

    res.status(200).json({
        status: 'success',
        message: 'Document uploaded successfully',
        data: {
            document: user.documents[user.documents.length - 1]
        }
    });
});

// 8. Delete Generic Document
export const deleteDocument = catchAsync(async (req, res, next) => {
    const { documentId } = req.params;

    const user = await User.findByIdAndUpdate(req.user.id, {
        $pull: { documents: { _id: documentId } }
    }, {
        new: true,
        runValidators: false
    });

    if (!user) {
        return next(new AppError('User not found or document deletion failed', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Document removed successfully'
    });
});
