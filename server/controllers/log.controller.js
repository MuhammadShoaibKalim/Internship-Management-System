import User from '../models/user.model.js';
import Log from '../models/log.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/appError.utils.js';
import Application from '../models/application.model.js';
import Internship from '../models/internship.model.js';
import { createNotification } from '../utils/notification.utils.js';

// 1. Submit Daily/Weekly Log
export const submitLog = catchAsync(async (req, res, next) => {
    const { weekNumber, hoursWorked, summary, learningOutcomes } = req.body;

    // Find the student's active application to link the log automatically
    const application = await Application.findOne({
        student: req.user.id,
        // Enforce that logs can only be submitted once fully 'approved' (hired)
        status: { $in: ['approved', 'completed'] }
    });

    if (!application) {
        return next(new AppError('You do not have an active, hired internship to submit logs for.', 400));
    }

    let attachment = undefined;
    if (req.file) {
        attachment = {
            url: `/uploads/documents/${req.file.filename}`,
            originalName: req.file.originalname
        };
    }

    // Check if a placeholder exists for this week
    let log = await Log.findOne({
        student: req.user.id,
        application: application._id,
        weekNumber,
        status: 'pending_student'
    });

    if (log) {
        // Update existing placeholder
        log.hoursWorked = hoursWorked;
        log.summary = summary;
        log.tasksPerformed = summary;
        log.learnings = learningOutcomes;
        log.status = 'submitted';
        if (attachment) log.attachment = attachment;
        await log.save();
    } else {
        // Create new log if no placeholder exists
        log = await Log.create({
            student: req.user.id,
            application: application._id,
            weekNumber,
            hoursWorked,
            summary,
            tasksPerformed: summary,
            learnings: learningOutcomes,
            attachment,
            status: 'submitted'
        });
    }

    res.status(201).json({
        status: 'success',
        data: { log }
    });

    // Notify Industry and Supervisor
    const student = await User.findById(req.user.id).populate('studentMeta.supervisor');

    // Notification for Industry
    await createNotification({
        type: 'LOG_SUBMISSION',
        message: `${req.user.name} submitted weekly log for Week ${weekNumber}`,
        user: application.internship.industry,
        relatedUser: req.user.id,
        priority: 'low'
    });

    // Notification for Supervisor
    if (student.studentMeta?.supervisor) {
        await createNotification({
            type: 'LOG_SUBMISSION',
            message: `${req.user.name} submitted weekly log for Week ${weekNumber}`,
            user: student.studentMeta.supervisor._id,
            relatedUser: req.user.id,
            priority: 'low'
        });
    }
});

// 2. Get Student's Logs
export const getMyLogs = catchAsync(async (req, res, next) => {
    const logs = await Log.find({ student: req.user.id })
        .sort({ date: -1 })
        .populate({
            path: 'application',
            populate: { path: 'internship', select: 'title' }
        });

    res.status(200).json({
        status: 'success',
        results: logs.length,
        data: { logs }
    });
});

// 3. Get Single Log Detail
export const getLog = catchAsync(async (req, res, next) => {
    const log = await Log.findById(req.params.id).populate('student');

    if (!log) {
        return next(new AppError('No log found with that ID', 404));
    }

    // Ownership/Access Check
    const isStudentOwner = req.user.role === 'student' && log.student._id.toString() === req.user.id;
    const isSupervisorOwner = req.user.role === 'supervisor' && log.student.studentMeta?.supervisor?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Industry access: If the log belongs to an intern hired by this industry
    let isIndustryOwner = false;
    if (req.user.role === 'industry') {
        const application = await Application.findById(log.application).populate('internship');
        isIndustryOwner = application && application.internship.industry.toString() === req.user.id;
    }

    if (!isStudentOwner && !isSupervisorOwner && !isAdmin && !isIndustryOwner) {
        return next(new AppError('You do not have permission to view this log', 403));
    }

    res.status(200).json({
        status: 'success',
        data: { log }
    });
});

// 4. Get All Logs (Admin/Supervisor/Industry with filters)
export const getAllLogs = catchAsync(async (req, res, next) => {
    let filter = {};

    // 1) Handle Role Restrictions
    if (req.user.role === 'student') {
        filter.student = req.user.id;
    } else if (req.user.role === 'supervisor') {
        // Find students assigned to this supervisor
        const assignedStudentIds = await User.find({ 'studentMeta.supervisor': req.user.id }).distinct('_id');
        filter.student = { $in: assignedStudentIds };
    } else if (req.user.role === 'industry') {
        // Industry sees logs for their hired interns
        const myInternships = await Internship.find({ industry: req.user.id }).distinct('_id');
        const approvedApps = await Application.find({
            internship: { $in: myInternships },
            status: 'approved'
        }).distinct('_id');
        filter.application = { $in: approvedApps };
    }
    // Admin sees all by default

    // 2) Apply specific student filter if provided in query
    if (req.query.student) {
        filter.student = req.query.student;
    }

    const logs = await Log.find(filter)
        .sort({ createdAt: -1 })
        .populate('student', 'name email avatar')
        .populate({
            path: 'application',
            populate: { path: 'internship', select: 'title companyName' }
        });

    res.status(200).json({
        status: 'success',
        results: logs.length,
        data: { logs }
    });
});

// 5. Grade/Review Log (Supervisor or Industry)
export const gradeLog = catchAsync(async (req, res, next) => {
    const { status, remarks, marks, industryRemarks, industryMarks } = req.body;

    const log = await Log.findById(req.params.id).populate({
        path: 'application',
        populate: { path: 'internship' }
    });

    if (!log) {
        return next(new AppError('No log found with that ID', 404));
    }

    // Role-based authorization and logic
    if (req.user.role === 'supervisor') {
        const student = await User.findById(log.student);
        if (student.studentMeta?.supervisor?.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new AppError('You are not authorized to review this log', 403));
        }
        if (status) log.status = status;
        if (remarks) log.supervisorComments = remarks;
        if (marks !== undefined) log.marks = marks;
    }
    else if (req.user.role === 'industry') {
        const isIndustryOwner = log.application.internship.industry.toString() === req.user.id;
        if (!isIndustryOwner && req.user.role !== 'admin') {
            return next(new AppError('You are not authorized to review this log', 403));
        }
        // Always overwrite — allow empty string clears
        if (industryRemarks !== undefined) log.industryComments = industryRemarks;
        if (industryMarks !== undefined) log.industryMarks = industryMarks;
        if (req.body.assignedTasks !== undefined) log.assignedTasks = req.body.assignedTasks;

        // If industry is reviewing a submitted log, mark it as approved
        if (log.status === 'submitted' && (industryRemarks !== undefined || industryMarks !== undefined)) {
            log.status = 'approved';
        }
    }

    const savedLog = await log.save();

    res.status(200).json({
        status: 'success',
        data: { log: savedLog }
    });

    // Notify Student
    await createNotification({
        type: 'LOG_REVIEW',
        message: `Your weekly log for Week ${log.weekNumber} has been reviewed by ${req.user.role === 'supervisor' ? 'your supervisor' : 'industry'}`,
        user: log.student,
        relatedUser: req.user.id,
        priority: 'low'
    });
});
