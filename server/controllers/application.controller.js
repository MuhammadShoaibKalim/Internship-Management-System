import Application from '../models/application.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/appError.utils.js';
import { createNotification } from '../utils/notification.utils.js';

// 1. Submit Application
export const applyToInternship = catchAsync(async (req, res, next) => {
    const { internshipId, resume, coverLetter } = req.body;

    // Use provided resume or fallback to student's stored CV
    const finalResume = resume || req.user.cvUrl;

    if (!finalResume) {
        return next(new AppError('Please upload your CV/Resume in Settings before applying.', 400));
    }

    // 1. Enforce "One active internship" rule
    const existingActiveApplication = await Application.findOne({
        student: req.user.id,
        status: { $nin: ['rejected', 'completed'] }
    });

    if (existingActiveApplication) {
        return next(new AppError('You already have an active or pending internship process. You can only apply for one internship at a time.', 400));
    }

    const newApplication = await Application.create({
        student: req.user.id,
        internship: internshipId,
        resume: finalResume,
        coverLetter,
        status: 'applied'
    });

    // Create Notification for industry/admin
    await createNotification({
        type: 'APPLICATION_SUBMISSION',
        message: `New internship application submitted: Node ${req.user.name} initiated request`,
        relatedUser: req.user.id,
        priority: 'low'
    });

    res.status(201).json({
        status: 'success',
        data: { application: newApplication }
    });
});

// 2. Get Student Applications (For StudentApplications Page)
export const getMyApplications = catchAsync(async (req, res, next) => {
    const applications = await Application.find({ student: req.user.id })
        .populate({
            path: 'internship',
            select: 'title companyName status industry',
            populate: {
                path: 'industry',
                select: 'avatar'
            }
        });

    res.status(200).json({
        status: 'success',
        results: applications.length,
        data: { applications }
    });
});

// 3. Get Single Application Detail
export const getApplication = catchAsync(async (req, res, next) => {
    const application = await Application.findById(req.params.id)
        .populate('internship')
        .populate('student');

    if (!application) {
        return next(new AppError('No application found with that ID', 404));
    }

    // Ownership/Access Check
    const isStudentOwner = req.user.role === 'student' && application.student._id.toString() === req.user.id;
    const isIndustryOwner = req.user.role === 'industry' && application.internship.industry.toString() === req.user.id;
    const isSupervisorOwner = req.user.role === 'supervisor' && application.student.studentMeta?.supervisor?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isStudentOwner && !isIndustryOwner && !isSupervisorOwner && !isAdmin) {
        return next(new AppError('You do not have permission to view this application', 403));
    }

    res.status(200).json({
        status: 'success',
        data: { application }
    });
});
