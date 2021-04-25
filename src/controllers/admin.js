const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc Get all users
// @route GET v1/admin/users
// @access Private
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc Get user by id
// @route GET v1/admin/users/:id
// @access Private
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`There is no user with id ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: user,
    })
});

// @desc Create a user
// @route POST v1/admin/users
// @access Private
exports.createUser = asyncHandler(async (req, res, next) => {
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
})

// @desc Update a user
// @route PUT v1/admin/users/:id
// @access Private
exports.updateUser = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
    // const user = await User.findById(req.params.id);
    // if (!user) {
    //     return next(new ErrorResponse(`There is no user with id ${req.params.id}`, 404));
    // }
    // await user.updateOne(req.body, {
    //     new: true,
    //     runValidators: true,
    // });

    // await user.save();

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc Delete a user
// @route DELETE v1/admin/users/:id
// @access Private
exports.deleteUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`There is no user with id ${req.params.id}`));
    }

    await user.remove();

    res.status(204).json({
        success: true,
    })
})