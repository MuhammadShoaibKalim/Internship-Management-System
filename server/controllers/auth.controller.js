import crypto from 'crypto';
import User from '../models/user.model.js';
import AppError from '../utils/appError.utils.js';
import catchAsync from '../utils/catchAsync.utils.js';
import { createSendToken } from '../utils/jwt.utils.js';
import sendEmail from '../utils/email.utils.js';
import logger from '../utils/logger.utils.js';
import { getOTPTemplate, getResetTemplate, getResetOTPTemplate } from '../utils/emailTemplate.utils.js';
import { createNotification } from '../utils/notification.utils.js';

// 1. REGISTER (STEP 1: Details Submission)
export const signup = catchAsync(async (req, res, next) => {
    let { identifier, password, passwordConfirm, role } = req.body;
    let email = identifier;

    // 1. Resolve identifier for Students and Supervisors
    if (role === 'student' || role === 'supervisor') {
        // If it's a University ID (e.g., bsf2100926), auto-map to university email
        if (/^(bsf|mt)\d{7}$/i.test(identifier)) {
            email = `${identifier.toLowerCase()}@ue.edu.pk`;
        }
        // Otherwise, if it's already an email (even Gmail), we just use it as is.
    }

    const newUser = await User.create({
        email: email.toLowerCase(),
        password,
        passwordConfirm,
        role,
        status: role === 'admin' ? 'active' : 'pending',
        studentMeta: role === 'student' ? {
            universityId: /^(bsf|mt)\d{7}$/i.test(identifier.split('@')[0]) ? identifier.split('@')[0] : undefined,
            department: req.body.department,
            cgpa: req.body.cgpa
        } : undefined,
        industryMeta: role === 'industry' ? {
            companyName: req.body.companyName,
            website: req.body.website,
            companyAddress: req.body.companyAddress
        } : undefined,
        supervisorMeta: role === 'supervisor' ? {
            department: req.body.department,
            specialization: req.body.specialization
        } : undefined
    });

    // Generate OTP
    const otpCode = newUser.createOTP();
    await newUser.save({ validateBeforeSave: false });

    // Send OTP via Email
    console.log('---------- TEST OTP ----------');
    console.log(`Email: ${newUser.email}`);
    console.log(`OTP Code: ${otpCode}`);
    console.log('------------------------------');

    try {
        await sendEmail({
            email: newUser.email,
            subject: 'Account Verification - IMS Portal',
            message: `Your IMS verification code is: ${otpCode}`,
            html: getOTPTemplate(otpCode)
        });

        res.status(200).json({
            status: 'success',
            message: 'OTP sent to email. Please verify to complete registration.'
        });
    } catch (err) {
        // Rollback user creation if email fails
        await User.findByIdAndDelete(newUser.id);
        return next(new AppError('There was an error sending the email. Registration cancelled.', 500));
    }
});

// 2. VERIFY OTP (STEP 2: Finalize Registration & Login)
export const verifyOTP = catchAsync(async (req, res, next) => {
    if (!req.body.email || !req.body.otp) {
        return next(new AppError('Please provide email and OTP', 400));
    }

    const hashedOTP = crypto.createHash('sha256').update(req.body.otp).digest('hex');

    const user = await User.findOne({
        email: req.body.email,
        otp: hashedOTP,
        otpExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Invalid or expired OTP code', 400));
    }

    user.isEmailVerified = true;
    user.status = 'active'; // Automatically activate account after verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    logger.success(`User Verified successfully: ${user.email}`);

    // Create system notification for admin
    await createNotification({
        type: 'USER_REGISTRATION',
        message: `New identity node initialized: ${user.name} (${user.role})`,
        relatedUser: user._id,
        priority: 'medium'
    });

    // Login user automatically after verification
    createSendToken(user, 201, res);
});

// 3. LOGIN
export const login = catchAsync(async (req, res, next) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return next(new AppError('Please provide email/ID and password!', 400));
    }

    let email = identifier.toLowerCase();

    // Resolve identifier for University members (Students/Supervisors)
    if (/^(bsf|mt)\d{7}$/i.test(identifier)) {
        email = `${identifier.toLowerCase()}@ue.edu.pk`;
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    if (user.status !== 'active' && user.role !== 'admin') {
        return next(new AppError('Your account is pending approval by the Admin.', 403));
    }

    createSendToken(user, 200, res);
});

// 4. FORGOT PASSWORD (STEP 1: Send OTP)
export const forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with that email address.', 404));
    }

    const { otp, resetToken } = user.createPasswordResetOTP();
    await user.save({ validateBeforeSave: false });

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset OTP - IMS Portal',
            message: `Your password reset code is: ${otp}`,
            html: getResetOTPTemplate(otp)
        });

        res.status(200).json({
            status: 'success',
            message: '6-digit OTP sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetOTP = undefined;
        user.passwordResetOTPExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

// 4.5 VERIFY RESET OTP (STEP 2: Verify & Get Reset Token)
export const verifyResetOTP = catchAsync(async (req, res, next) => {
    if (!req.body.email || !req.body.otp) {
        return next(new AppError('Please provide email and OTP', 400));
    }

    const hashedOTP = crypto.createHash('sha256').update(req.body.otp).digest('hex');

    const user = await User.findOne({
        email: req.body.email,
        passwordResetOTP: hashedOTP,
        passwordResetOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Invalid or expired reset OTP', 400));
    }

    // OTP is valid!
    // Since we don't want to clear the passwordResetToken yet (it's needed for the next step),
    // we just clear the OTP after successful verification.
    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // We return the resetToken (not the hashed one) so the frontend can use it in PATCH /resetPassword/:token
    // Note: The createPasswordResetOTP method generates a fresh resetToken as well.
    // However, the createPasswordResetOTP doesn't return the plain resetToken by default as per my previous edit.
    // Wait, let's check my previous edit to createPasswordResetOTP.
    // userSchema.methods.createPasswordResetOTP = function () { ... return { otp, resetToken }; }
    // Yes, it returns the plain resetToken. But wait, in forgotPassword I didn't store it for verifyResetOTP to use later?
    // I should probably store the plain token temporarily OR just use the OTP as the reset token itself.
    // Professional way: OTP verifies, system gives user a 'Reset Session Token'.

    // Let's refine the logic: forgotPassword generates OTP (hashed in DB) AND Token (hashed in DB).
    // verifyResetOTP verifies OTP, and if correct, it needs to find a way to give the user the plain resetToken.
    // Since we can't 'get' the plain token back from a hash, let's just use the OTP to grant a temporary reset session.
    // Better yet: return a fresh short-lived token from verifyResetOTP.

    const freshResetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(freshResetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        resetToken: freshResetToken,
        message: 'OTP verified. You can now reset your password.'
    });
});

// 5. RESET PASSWORD
export const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
});

// 6. UPDATE PASSWORD (AUTHENTICATED)
export const updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
});

// 7. LOGOUT
export const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};
