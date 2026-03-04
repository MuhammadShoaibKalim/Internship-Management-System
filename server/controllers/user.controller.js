import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/appError.utils.js';

// 1. Get My Profile
export const getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

// 2. Update My Profile (General + Role Metadata)
export const updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updatePassword.', 400));
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated directly
    const filteredBody = {};
    const allowedFields = ['name', 'email', 'secondaryEmails', 'phone', 'avatar', 'studentMeta', 'industryMeta', 'supervisorMeta', 'address'];

    Object.keys(req.body).forEach(el => {
        if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
    });

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// 3. Deactivate My Account
export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { status: 'inactive' });

    res.status(204).json({
        status: 'success',
        data: null
    });
});
