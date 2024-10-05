import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from 'crypto';



// Define User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a Name'],
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    image: String,
    email: {
        type: String,
        required: [true, 'Please Enter Your Email Address'],
        validate: [validator.isEmail, "Please Enter A valid Email Address"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your Password'],
        minlength: [8, 'Password length must be at least 8 characters'],
        select: false  // Ensures that the password is not returned by default
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please Enter Your Confirm Password'],
        validate: {
            validator: function (el) {
                return el === this.password; // Check if password and confirmPassword match
            },
            message: 'Passwords do not match!'
        }
    },
    changePasswordAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});

// Password Encryption Middleware
userSchema.pre('save', async function (next) {
    // Only run this function if the password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Remove confirmPassword field
    this.confirmPassword = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    // Set the changePasswordAt field to the current time
    this.changePasswordAt = Date.now() - 1000
    next()
})

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.changePasswordAt) {
        const changedTimestamp = parseInt(this.changePasswordAt.getTime() / 1000, 10);
        return JWTTimeStamp < changedTimestamp;
    }
    return false;
};

// Compare entered password with hashed password
userSchema.methods.checkPassword = async function (enteredPassword, userPassword) {
    return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.createpasswordresetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;




    return resetToken;
}

// Create and export User model
const User = mongoose.model('User', userSchema);

export default User;
