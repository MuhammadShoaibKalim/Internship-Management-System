import Internship from '../models/internship.model.js';
import Application from '../models/application.model.js';
import PerformanceEvaluation from '../models/performanceEvaluation.model.js';
import User from '../models/user.model.js';
import Log from '../models/log.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/appError.utils.js';
import { createNotification } from '../utils/notification.utils.js';

// 1. Dashboard Stats
export const getIndustryStats = catchAsync(async (req, res, next) => {
    const industryId = req.user.id;

    const stats = {
        activePosts: await Internship.countDocuments({ industry: industryId, status: 'open' }),
        totalApplicants: await Application.countDocuments({
            internship: { $in: await Internship.find({ industry: industryId }).distinct('_id') }
        }),
        onboardingInterns: await Application.countDocuments({
            status: 'approved',
            internship: { $in: await Internship.find({ industry: industryId }).distinct('_id') }
        }),
        pendingLogs: await Log.countDocuments({
            industryMarks: { $exists: false },
            application: {
                $in: await Application.find({
                    internship: { $in: await Internship.find({ industry: industryId }).distinct('_id') }
                }).distinct('_id')
            }
        })
    };

    // Recent Applicants
    const recentApplicants = await Application.find({
        internship: { $in: await Internship.find({ industry: industryId }).distinct('_id') }
    })
        .populate('student', 'name email avatar')
        .populate('internship', 'title')
        .sort('-createdAt')
        .limit(5);

    res.status(200).json({
        status: 'success',
        data: { stats, recentApplicants }
    });
});

// 2. Manage Postings
export const createInternship = catchAsync(async (req, res, next) => {
    const internship = await Internship.create({
        ...req.body,
        industry: req.user.id,
        companyName: req.user.name || 'Anonymous Entity'
    });

    res.status(201).json({
        status: 'success',
        data: { internship }
    });
});

export const getIndustryInternships = catchAsync(async (req, res, next) => {
    const internships = await Internship.find({ industry: req.user.id });

    res.status(200).json({
        status: 'success',
        results: internships.length,
        data: { internships }
    });
});

export const updateInternship = catchAsync(async (req, res, next) => {
    const internship = await Internship.findOneAndUpdate(
        { _id: req.params.id, industry: req.user.id },
        req.body,
        { new: true, runValidators: true }
    );

    if (!internship) return next(new AppError('No internship found with that ID under your account', 404));

    res.status(200).json({
        status: 'success',
        data: { internship }
    });
});

export const deleteInternship = catchAsync(async (req, res, next) => {
    const internship = await Internship.findOneAndDelete({ _id: req.params.id, industry: req.user.id });

    if (!internship) return next(new AppError('No internship found with that ID under your account', 404));

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// 3. Talent Pipeline (Applicants)
export const getApplicants = catchAsync(async (req, res, next) => {
    const filter = {
        internship: { $in: await Internship.find({ industry: req.user.id }).distinct('_id') },
        status: req.query.status || 'supervisor_endorsed' // Defaults to endorsed only
    };

    const applicants = await Application.find(filter)
        .populate('student', 'name email studentMeta avatar phone')
        .populate('internship', 'title category');

    res.status(200).json({
        status: 'success',
        results: applicants.length,
        data: { applicants }
    });
});

export const updateApplicantStatus = catchAsync(async (req, res, next) => {
    const { status, feedback } = req.body;

    // Check if industry owns the internship linked to this application
    const application = await Application.findById(req.params.id).populate('internship');

    const isIndustryOwner = application && application.internship.industry.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!application || (!isIndustryOwner && !isAdmin)) {
        return next(new AppError('Not authorized to manage this application', 403));
    }

    // Ensure they can only hire if supervisor has endorsed
    if (status === 'approved' && application.status !== 'supervisor_endorsed' && !isAdmin) {
        return next(new AppError('Academic endorsement is required before final industry selection.', 400));
    }

    application.status = status;
    if (feedback) application.feedback = feedback;
    await application.save();

    // Notify Student
    await createNotification({
        type: 'APPLICATION_UPDATE',
        message: `Industrial node update: ${application.internship.companyName} has ${status === 'approved' ? 'finalized your selection' : 'updated your status to ' + status}`,
        user: application.student._id,
        relatedUser: req.user.id,
        priority: 'medium'
    });

    res.status(200).json({
        status: 'success',
        data: { application }
    });
});

// 4. Intern Management (Active Interns)
export const getActiveInterns = catchAsync(async (req, res, next) => {
    const interns = await Application.find({
        status: 'approved',
        internship: { $in: await Internship.find({ industry: req.user.id }).distinct('_id') }
    })
        .populate('student', 'name email studentMeta avatar phone')
        .populate('internship', 'title duration category');

    res.status(200).json({
        status: 'success',
        results: interns.length,
        data: { interns }
    });
});

// 5. Performance Evaluations
export const submitEvaluation = catchAsync(async (req, res, next) => {
    const { application: applicationId, metrics, period, comments } = req.body;

    // Check if industry owns the internship linked to this application
    const application = await Application.findById(applicationId).populate('internship');

    const isIndustryOwner = application && application.internship.industry.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!application || (!isIndustryOwner && !isAdmin)) {
        return next(new AppError('Not authorized to evaluate this application', 403));
    }

    // Guard: enforce all logs are submitted before Final evaluation
    if (period === 'Final') {
        const pendingLogs = await Log.countDocuments({
            application: applicationId,
            status: 'pending_student'
        });
        if (pendingLogs > 0) {
            return next(new AppError(
                `Cannot finalize evaluation. ${pendingLogs} weekly log(s) are still pending student submission.`,
                400
            ));
        }
    }

    let certificate = undefined;
    if (req.file) {
        certificate = {
            url: `/uploads/certificates/${req.file.filename}`,
            originalName: req.file.originalname
        };
    }

    let totalHours = 0;
    let totalTasksCompleted = 0;
    let totalDocsUploaded = 0;

    if (period === 'Final') {
        const approvedLogs = await Log.find({ application: applicationId, status: 'approved' });

        approvedLogs.forEach(log => {
            totalHours += (log.hoursWorked || 0);

            if (log.tasksPerformed) {
                totalTasksCompleted += log.tasksPerformed.split('\n').filter(t => t.trim() !== '').length;
            }

            if (log.attachment && log.attachment.url) {
                totalDocsUploaded += 1;
            }
        });
    }

    let evaluation;
    try {
        evaluation = await PerformanceEvaluation.create({
            application: applicationId,
            student: application.student,
            industry: req.user.id,
            metrics: typeof metrics === 'string' ? JSON.parse(metrics) : metrics,
            period,
            comments,
            certificate,
            totalHours,
            totalTasksCompleted,
            totalDocsUploaded
        });
    } catch (saveError) {
        console.error("EVALUATION SAVE ERROR:", saveError);
        return next(new AppError('Failed to save evaluation: ' + saveError.message, 400));
    }

    // Mark application as completed if this is the final evaluation
    if (period === 'Final') {
        application.status = 'completed';

        // Sync certificate to application if provided
        if (certificate) {
            application.certificate = {
                url: certificate.url,
                uploadedAt: new Date(),
                originalName: certificate.originalName
            };
        }

        await application.save();
    }

    res.status(201).json({
        status: 'success',
        data: { evaluation }
    });

    // Notify Student
    await createNotification({
        type: 'EVALUATION_SUBMITTED',
        message: `A new ${period} performance evaluation has been submitted by ${application.internship.companyName}`,
        user: application.student._id,
        relatedUser: req.user.id,
        priority: 'medium'
    });

    // Notify Supervisor if exists
    if (application.student.studentMeta?.supervisor) {
        await createNotification({
            type: 'EVALUATION_SUBMITTED',
            message: `Evaluation submitted for ${application.student.name} by ${application.internship.companyName}`,
            user: application.student.studentMeta.supervisor,
            relatedUser: req.user.id,
            priority: 'low'
        });
    }
});

export const getEvaluations = catchAsync(async (req, res, next) => {
    const evaluations = await PerformanceEvaluation.find({ industry: req.user.id })
        .populate('student', 'name avatar')
        .populate('application', 'internship');

    res.status(200).json({
        status: 'success',
        results: evaluations.length,
        data: { evaluations }
    });
});

// 6. Initialize Internship Plan (Pre-create Logs)
export const initializeInternshipPlan = catchAsync(async (req, res, next) => {
    const { applicationId, totalWeeks } = req.body;

    // Check application and ownership
    const application = await Application.findById(applicationId).populate('internship');
    if (!application) return next(new AppError('No application found', 404));

    if (application.internship.industry.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized to manage this internship', 403));
    }

    // Get existing week numbers to avoid duplicates
    const existingLogs = await Log.find({ application: applicationId }).select('weekNumber');
    const existingWeeks = new Set(existingLogs.map(l => l.weekNumber));

    // Create only missing placeholders
    const logs = [];
    for (let i = 1; i <= totalWeeks; i++) {
        if (!existingWeeks.has(i)) {
            logs.push({
                student: application.student,
                application: applicationId,
                weekNumber: i,
                status: 'pending_student'
            });
        }
    }

    if (logs.length === 0) {
        return next(new AppError('All weeks in this range already exist. No new logs created.', 400));
    }

    const createdLogs = await Log.insertMany(logs);

    res.status(201).json({
        status: 'success',
        message: `${createdLogs.length} new week(s) added successfully`,
        data: { logs: createdLogs }
    });
});
