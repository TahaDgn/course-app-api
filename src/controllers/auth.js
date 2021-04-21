const asyncHandler = require("../middlewares/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");


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

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
    })
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
    const user = await User.findOne({ email }).select('+password');

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
