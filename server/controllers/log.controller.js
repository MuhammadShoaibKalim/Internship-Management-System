import Log from '../models/log.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/appError.utils.js';

// 1. Submit Daily/Weekly Log
export const submitLog = catchAsync(async (req, res, next) => {
    const { applicationId, tasksPerformed, challenges, learnings } = req.body;

    const newLog = await Log.create({
        student: req.user.id,
        application: applicationId,
        tasksPerformed,
        challenges,
        learnings
    });

    res.status(201).json({
        status: 'success',
        data: { log: newLog }
    });
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
    const isSupervisorOwner = req.user.role === 'supervisor' && log.student.supervisor?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isStudentOwner && !isSupervisorOwner && !isAdmin) {
        return next(new AppError('You do not have permission to view this log', 403));
    }

    res.status(200).json({
        status: 'success',
        data: { log }
    });
});
