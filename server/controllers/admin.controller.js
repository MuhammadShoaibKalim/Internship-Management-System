import User from '../models/user.model.js';
import Application from '../models/application.model.js';
import Internship from '../models/internship.model.js';
import Department from '../models/department.model.js';
import SystemConfig from '../models/systemConfig.model.js';
import Notification from '../models/notification.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/appError.utils.js';
import { createNotification } from '../utils/notification.utils.js';

// 1. Get Admin Dashboard Stats
export const getAdminStats = catchAsync(async (req, res, next) => {
    const stats = {
        totalUsers: await User.countDocuments(),
        pendingIndustries: await User.countDocuments({ role: 'industry', status: 'pending' }),
        activeInternships: await Internship.countDocuments({ status: 'open' }),
        totalApplications: await Application.countDocuments(),
        systemReports: await Application.countDocuments({ status: 'completed' }) // Mocking reports as completed apps
    };

    // Institutional Vetting (Pending Industries)
    const institutionalVetting = await User.find({ role: 'industry', status: 'pending' })
        .select('name createdAt industryMeta status')
        .sort('-createdAt')
        .limit(5);

    // System Telemetry (Dynamic simulation)
    const telemetry = {
        cpuLoad: parseFloat((Math.random() * (40 - 20) + 20).toFixed(1)),
        dbConsistency: 100,
        nodeStatus: 'Active Node',
        networkLatency: `${Math.floor(Math.random() * (15 - 8) + 8)}ms`
    };

    // Security Feed (Real data from Notification collection)
    const notifications = await Notification.find({ recipient: 'admin', status: 'active' })
        .sort('-createdAt')
        .limit(10);

    const securityFeed = notifications.map(n => ({
        id: n._id,
        type: n.type,
        message: n.message,
        timestamp: n.createdAt
    }));

    res.status(200).json({
        status: 'success',
        data: {
            stats,
            institutionalVetting,
            telemetry,
            securityFeed
        }
    });
});

// 2. User Management: Get All Users with Filters
export const getAllUsers = catchAsync(async (req, res, next) => {
    const filter = {};
    if (req.query.role && req.query.role !== 'all') filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
        filter.$or = [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
            { 'industryMeta.registrationNumber': { $regex: req.query.search, $options: 'i' } },
            { 'studentMeta.universityId': { $regex: req.query.search, $options: 'i' } },
            { 'supervisorMeta.universityId': { $regex: req.query.search, $options: 'i' } }
        ];
    }

    const users = await User.find(filter).sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
    });
});

// 3. User Management: Update User Status/Role
export const updateUserStatus = catchAsync(async (req, res, next) => {
    const { status, role } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, { status, role }, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { user }
    });

    // Notification for admin
    await createNotification({
        type: 'SYSTEM_ALERT',
        message: `Identity status synchronized: ${user.name} established as ${user.status}`,
        recipientRole: 'admin',
        relatedUser: user._id,
        priority: 'low'
    });

    // Notification for User
    await createNotification({
        type: 'SECURITY',
        message: `Your account status has been updated to ${user.status} by an administrator.`,
        user: user._id,
        relatedUser: req.user.id,
        priority: 'medium'
    });
});

// 3b. User Management: Delete User
export const deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    if (user.role === 'admin') {
        return next(new AppError('Security Protocol Error: Administrative accounts cannot be purged through this interface.', 403));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// 4. Industry Verification: Approve/Reject Industry
export const verifyIndustry = catchAsync(async (req, res, next) => {
    const { status } = req.body; // 'active' or 'rejected'

    if (!['active', 'rejected'].includes(status)) {
        return next(new AppError('Invalid status for verification. Use active or rejected.', 400));
    }

    const user = await User.findOneAndUpdate(
        { _id: req.params.id, role: 'industry' },
        { status },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new AppError('No industry account found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        message: `Industry account has been ${status}`,
        data: { user }
    });

    // System Notification
    await createNotification({
        type: 'INDUSTRY_VERIFICATION',
        message: `Industry node ${status}: ${user.name} verification finalized`,
        recipientRole: 'admin',
        relatedUser: user._id,
        priority: status === 'active' ? 'medium' : 'high'
    });

    // Notification for Industry
    await createNotification({
        type: 'INDUSTRY_VERIFICATION',
        message: `Your industry account verification status has been updated to: ${status}`,
        user: user._id,
        relatedUser: req.user.id,
        priority: 'high'
    });
});

// 5. Department Management: Get Detailed Stats
export const getDepartmentStats = catchAsync(async (req, res, next) => {
    // Get all departments
    const departments = await Department.find();

    const stats = await Promise.all(departments.map(async (dept) => {
        const studentCount = await User.countDocuments({ role: 'student', 'studentMeta.department': dept.code });
        const supervisorCount = await User.countDocuments({ role: 'supervisor', 'supervisorMeta.department': dept.code });
        const internshipCount = await Internship.countDocuments({ category: dept.code }); // Assuming category stores dept code

        return {
            name: dept.name,
            code: dept.code,
            students: studentCount,
            supervisors: supervisorCount,
            internships: internshipCount,
            avgCGPA: (await User.aggregate([
                { $match: { role: 'student', 'studentMeta.department': dept.code } },
                { $group: { _id: null, avgCgpa: { $avg: '$studentMeta.cgpa' } } }
            ]))[0]?.avgCgpa || 0
        };
    }));

    res.status(200).json({
        status: 'success',
        data: { stats }
    });
});

// 6. Global Reports: Funnel, Leaderboard and Market Share
export const getGlobalReports = catchAsync(async (req, res, next) => {
    // 6a. Funnel Stats (Aligned with UI labels)
    const funnel = [
        { label: 'Total Applications', count: await Application.countDocuments(), width: 'w-full', alpha: 'bg-white/10' },
        { label: 'Initial Vetting', count: await Application.countDocuments({ status: { $in: ['eligibility_checked', 'supervisor_endorsed'] } }), width: 'w-[80%]', alpha: 'bg-white/20' },
        { label: 'Shortlisted Nodes', count: await Application.countDocuments({ status: { $in: ['approved', 'industry_selected'] } }), width: 'w-[45%]', alpha: 'bg-emerald-500/40' },
        { label: 'Signed MoUs', count: await Application.countDocuments({ status: 'completed' }), width: 'w-[20%]', alpha: 'bg-emerald-500' }
    ];

    // 6b. Top Recruiter Nodes
    const topRecruiters = await Application.aggregate([
        { $match: { status: 'completed' } },
        {
            $lookup: {
                from: 'internships',
                localField: 'internship',
                foreignField: '_id',
                as: 'internship'
            }
        },
        { $unwind: '$internship' },
        {
            $group: {
                _id: '$internship.industry',
                placementCount: { $sum: 1 }
            }
        },
        { $sort: { placementCount: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'industry'
            }
        },
        { $unwind: '$industry' },
        {
            $project: {
                industryName: '$industry.name',
                placementCount: 1
            }
        }
    ]);

    // 6c. Market Intake Share (Engineering vs others)
    const marketShare = await User.aggregate([
        { $match: { role: 'student' } },
        {
            $group: {
                _id: '$studentMeta.department',
                count: { $sum: 1 }
            }
        }
    ]);

    // 6d. System Telemetry (Derived from real departments)
    const departments = await Department.find().select('code');
    const telemetry = {
        syncEfficiency: parseFloat((Math.random() * (99.9 - 99.5) + 99.5).toFixed(1)),
        dbLatency: `${Math.floor(Math.random() * (18 - 10) + 10)}ms`,
        nodeStatus: 'VERIFIED & ACTIVE',
        activeNodes: departments.map(d => ({
            id: d.code,
            status: 'active'
        }))
    };

    res.status(200).json({
        status: 'success',
        data: {
            funnel,
            topRecruiters,
            marketShare,
            telemetry
        }
    });
});

// 7. Settings Management
export const getSystemSettings = catchAsync(async (req, res, next) => {
    const settings = await SystemConfig.find();
    res.status(200).json({
        status: 'success',
        data: { settings }
    });
});

export const updateSystemSetting = catchAsync(async (req, res, next) => {
    const { key, value, category, description } = req.body;

    const setting = await SystemConfig.findOneAndUpdate(
        { key },
        { value, category, description, updatedAt: Date.now(), updatedBy: req.user.id },
        { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'success',
        data: { setting }
    });
});

// 8. Full Department CRUD
export const createDepartment = catchAsync(async (req, res, next) => {
    const doc = await Department.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { department: doc }
    });
});

export const getAllDepartments = catchAsync(async (req, res, next) => {
    const docs = await Department.find().sort('name');
    res.status(200).json({
        status: 'success',
        results: docs.length,
        data: { departments: docs }
    });
});

export const updateDepartment = catchAsync(async (req, res, next) => {
    const doc = await Department.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) return next(new AppError('No department found with that ID', 404));

    res.status(200).json({
        status: 'success',
        data: { department: doc }
    });
});

export const deleteDepartment = catchAsync(async (req, res, next) => {
    const doc = await Department.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('No department found with that ID', 404));

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// 9. Create Sub-Admin with Restrictions
export const createSubAdmin = catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm, permissions } = req.body;

    const newAdmin = await User.create({
        name,
        email,
        password,
        passwordConfirm,
        role: 'admin',
        status: 'active', // Immediate activation by superior
        isEmailVerified: true,
        adminMeta: {
            permissions: permissions || ['read_only']
        }
    });

    res.status(201).json({
        status: 'success',
        data: {
            user: newAdmin
        }
    });
});

// 10. Global Search (Admin Hub)
export const globalSearch = catchAsync(async (req, res, next) => {
    const { query } = req.query;

    if (!query) {
        return res.status(200).json({
            status: 'success',
            data: { results: [] }
        });
    }

    const regex = new RegExp(query, 'i');

    const [users, internships, departments] = await Promise.all([
        User.find({
            $or: [
                { name: regex },
                { email: regex },
                { 'industryMeta.companyName': regex }
            ]
        }).select('name email role status industryMeta.companyName').limit(5),

        Internship.find({
            $or: [
                { title: regex },
                { companyName: regex }
            ]
        }).select('title companyName status').limit(5),

        Department.find({
            $or: [
                { name: regex },
                { code: regex }
            ]
        }).select('name code').limit(5)
    ]);

    // Format results for frontend consumption
    const results = [
        ...users.map(u => ({
            id: u._id,
            title: u.name,
            subtitle: u.role === 'industry' ? u.industryMeta?.companyName : u.email,
            type: 'USER',
            role: u.role,
            status: u.status
        })),
        ...internships.map(i => ({
            id: i._id,
            title: i.title,
            subtitle: i.companyName,
            type: 'INTERNSHIP',
            status: i.status
        })),
        ...departments.map(d => ({
            id: d._id,
            title: d.name,
            subtitle: d.code,
            type: 'DEPARTMENT'
        }))
    ];

    res.status(200).json({
        status: 'success',
        results: results.length,
        data: { results }
    });
});
