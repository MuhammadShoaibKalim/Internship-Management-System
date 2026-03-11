import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
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

    // 2) Find user
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // 3) Update fields
    const allowedFields = ['name', 'email', 'phone', 'secondaryEmails', 'avatar', 'address', 'academicDetails', 'skills', 'studentMeta', 'industryMeta', 'supervisorMeta'];

    Object.keys(req.body).forEach(el => {
        if (allowedFields.includes(el)) {
            // Special handling for nested meta objects to avoid overwriting existing sub-fields
            if (['studentMeta', 'industryMeta', 'supervisorMeta', 'academicDetails'].includes(el) && typeof req.body[el] === 'object') {
                user[el] = { ...user[el]?.toObject(), ...req.body[el] };
            } else {
                user[el] = req.body[el];
            }
        }
    });

    // 4) Save user (bypass full validation for existing required fields like passwordConfirm)
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        data: {
            user
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

// 4. Upload Avatar
export const uploadAvatar = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload an image file for your profile photo', 400));
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        avatar: fileUrl
    }, {
        new: true,
        runValidators: false
    });

    res.status(200).json({
        status: 'success',
        message: 'Profile photo uploaded successfully',
        data: {
            user: updatedUser
        }
    });
});

// 5. Get My Notifications
export const getMyNotifications = catchAsync(async (req, res, next) => {
    const notifications = await Notification.find({
        $or: [
            { user: req.user.id },
            { recipientRole: req.user.role },
            { recipientRole: 'all' }
        ],
        status: 'active'
    })
        .sort('-createdAt')
        .populate('relatedUser', 'name avatar role');

    res.status(200).json({
        status: 'success',
        results: notifications.length,
        data: { notifications }
    });
});

// 6. Mark Notification as Read
export const markNotificationAsRead = catchAsync(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return next(new AppError('No notification found with that ID', 404));
    }

    // Check if user is the recipient or has the recipient role
    const isDirectRecipient = notification.user && notification.user.toString() === req.user.id;
    const isRoleRecipient = notification.recipientRole && (notification.recipientRole === req.user.role || notification.recipientRole === 'all');

    if (!isDirectRecipient && !isRoleRecipient) {
        return next(new AppError('You are not authorized to mark this notification as read', 403));
    }

    notification.isRead = true;
    if (!notification.readBy.includes(req.user.id)) {
        notification.readBy.push(req.user.id);
    }

    await notification.save();

    res.status(200).json({
        status: 'success',
        data: { notification }
    });
});
