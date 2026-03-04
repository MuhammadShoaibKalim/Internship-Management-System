import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/user.model.js';
import AppError from '../utils/appError.utils.js';
import catchAsync from '../utils/catchAsync.utils.js';

// 1. Authenticated Gate (Protect)
export const protect = catchAsync(async (req, res, next) => {
    let token;

    // 1) Get token from Headers or Cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please login again.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

// 2. Role Gate (Restrict To)
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'industry']. req.user.role is 'student'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
// 3. Permission Gate (Restrict To Specific Admin Capabilities)
export const restrictPermission = (...requiredPermissions) => {
    return (req, res, next) => {
        // 1) Allow Super Admins (role admin with 'all' permission or implicit full access if no specific permissions set)
        if (req.user.role === 'admin') {
            const userPermissions = req.user.adminMeta?.permissions || [];

            // If they have 'all' or no permissions defined yet (legacy/super-admin), grant access
            if (userPermissions.includes('all') || userPermissions.length === 0) {
                return next();
            }

            // 2) Check if user has at least one of the required permissions
            const hasPermission = requiredPermissions.some(perm => userPermissions.includes(perm));

            if (!hasPermission) {
                return next(new AppError('You do not have the required administrative permissions to perform this action', 403));
            }

            return next();
        }

        // 3) If not an admin but reached here, something is wrong with route definition
        return next(new AppError('Permission checking is only applicable for administrative identities', 403));
    };
};
