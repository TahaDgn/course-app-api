const asyncHandler = require("../middlewares/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


// @desc Register user
// @route POST /v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    res.status(201).json({
        success: true,
    });
});

// @desc Log in user
// @route POST /v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password +passwordSalt');

    if (!user) {
        return next(new ErrorResponse('Please be sure about email or password are correct', 401));
    }
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return next(new ErrorResponse('Please be sure about email or password are correct', 401));
    }

    sendTokenResponse(user, 200, res);

});

// Get token from model and create a cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create a token 
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token });
}

// @desc Get current logged user
// @route POST /v1/auth/me
// @access Private
exports.me = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse(`There is no user with id ${req.user.id}`));
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc Log user out / clear cookie
// @route POST /v1/auth/logout
// @access Private
exports.logout = asyncHandler(async (req, res, next) => {

    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    })

    res.status(200).json({ success: true });
});

// @desc Sends password reset token to an email
// @route POST /v1/auth/forgotpassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        'host',
    )}/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

// @desc Reset password
// @route POST /v1/auth/resetpassword/:resettoken
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now()
        },
    }).select('+resetPasswordToken +resetPasswordExpire');
    if (!user) {
        return next(new ErrorResponse(`Invalid token`, 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()

    res.status(200).json({ success: true });

});

// @desc Get current logged user
// @route PUT /v1/auth/updatedetails
// @access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: user,
    });
});


// @desc Update password of current logged user
// @route PUT /v1/auth/updatepassword 
// @access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password +passwordSalt');

    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
        return next(new ErrorResponse(`Wrong password, be sure your password is true`, 403));
    }

    user.password = req.body.newPassword

    await user.save();

    res.status(200).json({ success: true });

})