import User from "./../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/email.js";

// Utility to sign JWT token
const signIn = (id) => jwt.sign({ id }, process.env.JWTSECRETKEY, { expiresIn: process.env.JWT_EXPIRES_IN });

// Utility to create and send JWT token in response
const createSendToken = (user, statusCode, res) => {
    const token = signIn(user.id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,

        sameSite: 'strict',  // Added to prevent CSRF attacks
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true
    res.cookie('jwt', token, cookieOptions);

    user.password = undefined; // Hide the password from output

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user }
    });
};

// SignUp Route Handler
const signUp = catchAsync(async (req, res) => {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
});

// Login Route Handler
const logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Validate if email and password are provided
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    // 2) Find the user by email and validate password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.checkPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }

    // 3) Send token if credentials are valid
    createSendToken(user, 200, res);
});

// Middleware to protect routes (authorization required)
const protect = catchAsync(async (req, res, next) => {
    let token;

    // 1) Check if token is provided in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please log in to access this resource.', 401));
    }

    // 2) Verify the token
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);

    // 3) Check if the user associated with the token still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if the user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // 5) Grant access
    req.user = currentUser;
    next();
});

// Restrict certain routes to specific roles
const restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
};

// Forget Password Handler
const forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/forgetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetUrl}. \nIf you did not forget your password, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for 10 minutes)",
            message
        });

        res.status(200).json({
            status: 'success',
            message: "Token sent to email!"
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later.', 500));
    }
});

// Reset Password Handler
const resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get hashed token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // 2) Find user by token and ensure token has not expired
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) return next(new AppError('Token is invalid or has expired', 400));

    // 3) Update password and clear the reset token fields
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4) Send new token after password reset
    createSendToken(user, 200, res);
});

// Update Password Handler
const updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from the collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if current password is correct
    if (!(await user.checkPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is incorrect', 401));
    }

    // 3) Check if new password is not the same as the old one
    if (await user.checkPassword(req.body.password, user.password)) {
        return next(new AppError('New password cannot be the same as the current password', 400));
    }

    // 4) Update password and send new JWT token
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    createSendToken(user, 200, res);
});

export default {
    signUp,
    logIn,
    protect,
    restrictTo,
    forgetPassword,
    resetPassword,
    updatePassword
};
