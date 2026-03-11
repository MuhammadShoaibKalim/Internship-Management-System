import User from '../models/user.model.js';
import Log from '../models/log.model.js';
import SiteVisit from '../models/siteVisit.model.js';
import Marking from '../models/marking.model.js';
import Application from '../models/application.model.js';
import PerformanceEvaluation from '../models/performanceEvaluation.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/appError.utils.js';
import { createNotification } from '../utils/notification.utils.js';

// 1. Get Supervisor Dashboard Stats
export const getSupervisorStats = catchAsync(async (req, res, next) => {
    const supervisorId = req.user.id;

    // Parallelize queries for better performance
    const [assignedStudents, assignedStudentIds] = await Promise.all([
        User.countDocuments({ role: 'student', 'studentMeta.supervisor': supervisorId }),
        User.find({ role: 'student', 'studentMeta.supervisor': supervisorId }).distinct('_id')
    ]);

    const [pendingLogs, siteVisits, finalMarkingReady, pendingEndorsements, monitoringQueue] = await Promise.all([
        Log.countDocuments({
            status: 'submitted',
            student: { $in: assignedStudentIds }
        }),
        SiteVisit.countDocuments({ supervisor: supervisorId, status: 'upcoming' }),
        Application.countDocuments({
            status: 'industry_selected',
            student: { $in: assignedStudentIds }
        }),
        (async () => {
            if (req.user.role === 'admin') {
                return await Application.countDocuments({ status: 'applied' });
            }
            const dept = req.user.supervisorMeta?.department;
            if (!dept) return 0;

            const deptStudentIds = await User.find({
                role: 'student',
                $or: [
                    { 'studentMeta.department': { $regex: new RegExp(`^${dept}$`, 'i') } },
                    { 'academicDetails.department': { $regex: new RegExp(`^${dept}$`, 'i') } }
                ]
            }).distinct('_id');

            return await Application.countDocuments({
                status: 'applied',
                student: { $in: deptStudentIds }
            });
        })(),
        (async () => {
            const monitoringQueueRaw = await User.find({ role: 'student', 'studentMeta.supervisor': supervisorId })
                .select('name studentMeta status updatedAt avatar')
                .limit(5);

            return await Promise.all(monitoringQueueRaw.map(async (student) => {
                const [totalLogs, pendingLogs] = await Promise.all([
                    Log.countDocuments({ student: student._id }),
                    Log.countDocuments({ student: student._id, status: 'submitted' })
                ]);

                const studentObj = student.toObject();
                studentObj.stats = { totalLogs, pendingLogs };
                return studentObj;
            }));
        })()
    ]);

    const stats = {
        assignedStudents,
        pendingLogs,
        siteVisits,
        finalMarkingReady,
        pendingEndorsements
    };

    res.status(200).json({
        status: 'success',
        data: { stats, monitoringQueue }
    });
});

// 2. Get Assigned Students
export const getAssignedStudents = catchAsync(async (req, res, next) => {
    const students = await User.find({ role: 'student', 'studentMeta.supervisor': req.user.id })
        .populate({
            path: 'studentMeta.currentApplication',
            populate: { path: 'internship', select: 'title industry companyName' }
        });

    // Fetch log counts and industry evaluation for each student
    const studentsWithStats = await Promise.all(students.map(async (student) => {
        const [totalLogs, pendingLogs, performanceEvaluation] = await Promise.all([
            Log.countDocuments({ student: student._id }),
            Log.countDocuments({ student: student._id, status: 'submitted' }),
            PerformanceEvaluation.findOne({ student: student._id, period: 'Final' })
        ]);

        const studentObj = student.toObject();
        studentObj.stats = { totalLogs, pendingLogs };
        studentObj.performanceEvaluation = performanceEvaluation;
        return studentObj;
    }));

    res.status(200).json({
        status: 'success',
        results: studentsWithStats.length,
        data: { students: studentsWithStats }
    });
});

// 3. Review Weekly Log
export const reviewLog = catchAsync(async (req, res, next) => {
    const { status, supervisorComments, marks } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return next(new AppError('Please provide a valid status (approved or rejected)', 400));
    }

    const log = await Log.findById(req.params.id).populate('student');

    if (!log) {
        return next(new AppError('No log found with that ID', 404));
    }

    // Check if student is assigned to this supervisor (Admin bypass)
    const isSupervisorOwner = log.student.studentMeta?.supervisor?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isSupervisorOwner && !isAdmin) {
        return next(new AppError('You are not authorized to review this student\'s log', 403));
    }

    log.status = status;
    if (supervisorComments !== undefined) log.supervisorComments = supervisorComments;
    if (marks !== undefined) log.marks = marks;
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
    const isSupervisorOwner = student && student.studentMeta?.supervisor?.toString() === req.user.id;
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

    // Notify Student
    await createNotification({
        type: 'SYSTEM_ALERT',
        message: `A site visit has been scheduled for ${new Date(visit.date).toLocaleDateString()} at ${visit.time}`,
        user: visit.student,
        relatedUser: req.user.id,
        priority: 'medium'
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
    const isSupervisorOwner = student && student.studentMeta?.supervisor?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!student || (!isSupervisorOwner && !isAdmin)) {
        return next(new AppError('You can only submit marking for your assigned students (or you are not an authorized admin)', 403));
    }

    // Validation for metrics (0-100) and industry GPA (0-4)
    if (metrics) {
        const fields = ['technicalProficiency', 'softSkills', 'logConsistency', 'industryFeedback'];
        for (const field of fields) {
            if (metrics[field] < 0 || metrics[field] > 100) {
                return next(new AppError(`${field} must be between 0 and 100`, 400));
            }
        }
    }

    if (industryGpa !== undefined && (industryGpa < 0 || industryGpa > 4)) {
        return next(new AppError('Industry GPA must be between 0 and 4.0', 400));
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

    // Notify Student
    await createNotification({
        type: 'MARKING_PUBLISHED',
        message: `Your final internship evaluation and marking has been published by your supervisor.`,
        user: studentId,
        relatedUser: req.user.id,
        priority: 'high'
    });
});

// 6. Get Pending Applications for Endorsement
export const getPendingApplications = catchAsync(async (req, res, next) => {
    // Get supervisor's department to filter relevant applications
    const supervisor = await User.findById(req.user.id);
    const department = supervisor.supervisorMeta?.department?.trim();
    const isAdmin = req.user.role === 'admin';

    if (!department && !isAdmin) {
        return next(new AppError('Supervisor department not set. Please update your profile.', 400));
    }

    // 1. Efficiently find relevant students first (hits indexes)
    const deptStudentFilter = isAdmin ? {} : {
        role: 'student',
        $or: [
            { 'studentMeta.department': { $regex: new RegExp(`^${department}$`, 'i') } },
            { 'academicDetails.department': { $regex: new RegExp(`^${department}$`, 'i') } }
        ]
    };

    const studentIds = await User.find(deptStudentFilter).distinct('_id');

    // 2. Query applications using student IDs (hits student index)
    const applications = await Application.find({
        status: 'applied',
        student: { $in: studentIds }
    })
        .populate({
            path: 'student',
            select: 'name email avatar studentMeta academicDetails'
        })
        .populate('internship', 'title companyName');

    res.status(200).json({
        status: 'success',
        results: applications.length,
        data: { applications }
    });
});

// 7. Endorse or Reject Application
export const endorseApplication = catchAsync(async (req, res, next) => {
    const { status, feedback } = req.body;

    if (!['supervisor_endorsed', 'rejected'].includes(status)) {
        return next(new AppError('Status must be supervisor_endorsed or rejected', 400));
    }

    const application = await Application.findById(req.params.id).populate('student');

    if (!application) {
        return next(new AppError('No application found with that ID', 404));
    }

    // Update Application
    application.status = status;
    if (feedback) application.feedback = feedback;
    await application.save();

    // If endorsed, assign student to this supervisor
    if (status === 'supervisor_endorsed') {
        await User.findByIdAndUpdate(application.student._id, {
            'studentMeta.supervisor': req.user.id,
            'studentMeta.currentApplication': application._id,
            status: 'active' // Ensure student is active once endorsed/assigned
        });
    }

    // Create notification for student

    // Create notification for student
    // Create notification for student
    await createNotification({
        type: 'APPLICATION_UPDATE',
        message: `Your application has been ${status === 'supervisor_endorsed' ? 'endorsed by your supervisor' : 'rejected'}.`,
        user: application.student._id,
        relatedUser: req.user.id,
        priority: 'medium'
    });

    res.status(200).json({
        status: 'success',
        data: { application }
    });
});
