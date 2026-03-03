import User from '../models/user.model.js';
import Log from '../models/log.model.js';
import SiteVisit from '../models/siteVisit.model.js';
import Marking from '../models/marking.model.js';
import Application from '../models/application.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/appError.utils.js';

// 1. Get Supervisor Dashboard Stats
export const getSupervisorStats = catchAsync(async (req, res, next) => {
    const supervisorId = req.user.id;

    const stats = {
        assignedStudents: await User.countDocuments({ role: 'student', supervisor: supervisorId }),
        pendingLogs: await Log.countDocuments({
            status: 'submitted',
            student: { $in: await User.find({ supervisor: supervisorId }).distinct('_id') }
        }),
        siteVisits: await SiteVisit.countDocuments({ supervisor: supervisorId, status: 'upcoming' }),
        finalMarkingReady: await Application.countDocuments({
            status: 'industry_selected', // Assuming this means ready for final marking by supervisor
            student: { $in: await User.find({ supervisor: supervisorId }).distinct('_id') }
        })
    };

    // Recent Activity / Monitoring Queue (Students assigned to this supervisor)
    const monitoringQueue = await User.find({ role: 'student', supervisor: supervisorId })
        .select('name studentMeta status updatedAt')
        .limit(5);

    res.status(200).json({
        status: 'success',
        data: { stats, monitoringQueue }
    });
});

// 2. Get Assigned Students
export const getAssignedStudents = catchAsync(async (req, res, next) => {
    const students = await User.find({ role: 'student', supervisor: req.user.id })
        .populate({
            path: 'studentMeta.currentApplication',
            populate: { path: 'internship', select: 'title industry' }
        });

    res.status(200).json({
        status: 'success',
        results: students.length,
        data: { students }
    });
});

// 3. Review Weekly Log
export const reviewLog = catchAsync(async (req, res, next) => {
    const { status, supervisorComments } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return next(new AppError('Please provide a valid status (approved or rejected)', 400));
    }

    const log = await Log.findById(req.params.id).populate('student');

    if (!log) {
        return next(new AppError('No log found with that ID', 404));
    }

    // Check if student is assigned to this supervisor (Admin bypass)
    const isSupervisorOwner = log.student.supervisor?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isSupervisorOwner && !isAdmin) {
        return next(new AppError('You are not authorized to review this student\'s log', 403));
    }

    log.status = status;
    log.supervisorComments = supervisorComments;
    log.reviewedAt = Date.now();
    await log.save();

    res.status(200).json({
        status: 'success',
        data: { log }
    });
});

// 4. Site Visits
export const scheduleVisit = catchAsync(async (req, res, next) => {
    const { student: studentId } = req.body;

    // Check if student is assigned to this supervisor (Admin bypass)
    const student = await User.findById(studentId);
    const isSupervisorOwner = student && student.supervisor?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!student || (!isSupervisorOwner && !isAdmin)) {
        return next(new AppError('You can only schedule visits for your assigned students (or you are not an authorized admin)', 403));
    }

    const visit = await SiteVisit.create({
        ...req.body,
        supervisor: req.user.id
    });

    res.status(201).json({
        status: 'success',
        data: { visit }
    });
});

export const getVisits = catchAsync(async (req, res, next) => {
    // Admin sees all, supervisor sees their own
    const filter = req.user.role === 'admin' ? {} : { supervisor: req.user.id };
    const visits = await SiteVisit.find(filter).sort('date');

    res.status(200).json({
        status: 'success',
        results: visits.length,
        data: { visits }
    });
});

// 5. Final Marking
export const submitMarking = catchAsync(async (req, res, next) => {
    const { studentId, applicationId, metrics, recommendation, industryGpa } = req.body;

    // Check if student is assigned to this supervisor (Admin bypass)
    const student = await User.findById(studentId);
    const isSupervisorOwner = student && student.supervisor?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!student || (!isSupervisorOwner && !isAdmin)) {
        return next(new AppError('You can only submit marking for your assigned students (or you are not an authorized admin)', 403));
    }

    const marking = await Marking.create({
        supervisor: req.user.id,
        student: studentId,
        application: applicationId,
        metrics,
        recommendation,
        industryGpa,
        isPublished: true,
        publishedAt: Date.now()
    });

    // Update Application status to completed
    await Application.findByIdAndUpdate(applicationId, { status: 'completed' });

    res.status(201).json({
        status: 'success',
        data: { marking }
    });
});
