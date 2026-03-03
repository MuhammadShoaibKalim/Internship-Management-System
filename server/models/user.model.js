import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxLength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    phone: {
        type: String,
        trim: true
    },
    address: String,
    role: {
        type: String,
        enum: {
            values: ['student', 'industry', 'supervisor', 'admin'],
            message: 'Role must be student, industry, supervisor, or admin'
        },
        default: 'student'
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'rejected'],
        default: 'pending' // Admin approval required
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [8, 'Password must be at least 8 characters'],
        select: false,
        validate: {
            validator: function (val) {
                // Returns true if password has 1 uppercase, 1 lowercase, 1 number, 1 symbol
                return validator.isStrongPassword(val, {
                    minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
                });
            },
            message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        }
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match!'
        }
    },
    // OTP System
    otp: String,
    otpExpires: Date,
    // Student Specific Assets
    cvUrl: String,
    bookmarks: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Internship'
        }
    ],
    // Email Verification Status
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    // Password Reset
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordResetOTP: String,
    passwordResetOTPExpires: Date,
    passwordChangedAt: Date,

    // Role-specific Metadata
    studentMeta: {
        universityId: { type: String, unique: true, sparse: true },
        cgpa: Number,
        failedCourses: { type: Number, default: 0 },
        department: String,
        supervisor: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        currentApplication: {
            type: mongoose.Schema.ObjectId,
            ref: 'Application'
        }
    },
    industryMeta: {
        companyName: String,
        companyAddress: String,
        website: String,
        registrationNumber: String,
        documents: [
            {
                name: String,
                url: String,
                uploadedAt: { type: Date, default: Date.now }
            }
        ]
    },
    supervisorMeta: {
        universityId: { type: String, unique: true, sparse: true },
        department: String,
        specialization: String
    },
    avatar: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middlewares
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

// Methods
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

userSchema.methods.createOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = crypto.createHash('sha256').update(otp).digest('hex');
    this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    return otp;
};

userSchema.methods.createPasswordResetOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.passwordResetOTP = crypto.createHash('sha256').update(otp).digest('hex');
    this.passwordResetOTPExpires = Date.now() + 10 * 60 * 1000;

    // Also recreate the token for the final reset step
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return { otp, resetToken };
};

const User = mongoose.model('User', userSchema);
export default User;
