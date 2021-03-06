const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');


// Protect routes
exports.jwtAuthentication = asyncHandler(async (req, res, next) => {

    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearrer token in header
        token = req.headers.authorization.split(' ')[1];
    }
    // Set token from cookie
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    //Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorize to access', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);


        next();

    } catch (error) {
        return next(new ErrorResponse(`Not authorized to access this route`, 401));
    }
});


// Grant access to spesific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`Unauthorized role to access this route`, 403));
        }
        next();
    }
}
