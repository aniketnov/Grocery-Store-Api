import User from "./../models/user.model.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/email.js";
import crypto from 'crypto';

// Sign JWT Token
function signIn(id) {
    return jwt.sign({ id }, process.env.JWTSECRETKEY, { expiresIn: process.env.JWT_EXPIRES_IN })
}

// SignUp Route
const signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        role: req.body.role,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword

    });

    const token = signIn(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

// Login Route
const logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    // 2) Find user and check password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.checkPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }

    // 3) If everything is okay, send the token
    const token = signIn(user._id);
    res.status(200).json({
        status: "success",
        token
    });
});

// Protect Middleware
const protect = catchAsync(async (req, res, next) => {
    // 1) Get token from headers
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // 2) Verify the token
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);

    // 3) Check if the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if the user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
});


const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("you do not have a permision to perform this action", 403))
        }
        next()
    }
}

const forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        return next(new AppError("User Not Found", 404))
    }
    const resetToken = user.createpasswordresetToken()
    await user.save({ validateBeforeSave: false });
    console.log(resetToken);

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/forgetPassword/${resetToken}`

    const message = `Forget your password submit a Patch Request with your new password and passwordComfirm to ${resetUrl}. \n if you did not forget password avoid this mail.`

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid only 10 min)",
            message
        })

        res.status(200).json({
            status: 'success',
            message: "Token send to email"

        })
    } catch (error) {
        user.passwordResetExpires = undefined
        user.passwordResetToken = undefined
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error to sending a email try again again', 500))
    }
})

const resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get hashed token from the params
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // 2) Find user based on the token and check if token has not expired
    const user = await User.findOne({
        passwordResetToken: hashToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) return next(new AppError('Token is invalid or has exprire', 400))

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signIn(user._id)

    res.status(200).json({
        status: "success",
        token
    })

})

export default { signUp, logIn, protect, restrictTo, forgetPassword, resetPassword };
