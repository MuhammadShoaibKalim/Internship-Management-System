import Internship from '../models/internship.model.js';
import Application from '../models/application.model.js';
import PerformanceEvaluation from '../models/performanceEvaluation.model.js';
import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/appError.utils.js';

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
        companyName: req.user.name // Denormalize company name
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
        internship: { $in: await Internship.find({ industry: req.user.id }).distinct('_id') }
    };

    if (req.query.status) filter.status = req.query.status;

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

    application.status = status;
    if (feedback) application.feedback = feedback;
    await application.save();

    res.status(200).json({
        status: 'success',
        data: { application }
    });
});

// 4. Intern Management
export const getActiveInterns = catchAsync(async (req, res, next) => {
    const interns = await Application.find({
        status: 'approved', // 'approved' means they are officially interns
        internship: { $in: await Internship.find({ industry: req.user.id }).distinct('_id') }
    })
        .populate('student', 'name email studentMeta avatar')
        .populate('internship', 'title duration');

    res.status(200).json({
        status: 'success',
        results: interns.length,
        data: { interns }
    });
});

// 5. Performance Evaluations
export const submitEvaluation = catchAsync(async (req, res, next) => {
    const { application: applicationId } = req.body;

    // Check if industry owns the internship linked to this application
    const application = await Application.findById(applicationId).populate('internship');

    const isIndustryOwner = application && application.internship.industry.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!application || (!isIndustryOwner && !isAdmin)) {
        return next(new AppError('Not authorized to evaluate this application', 403));
    }

    const evaluation = await PerformanceEvaluation.create({
        ...req.body,
        industry: req.user.id
    });

    res.status(201).json({
        status: 'success',
        data: { evaluation }
    });
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
