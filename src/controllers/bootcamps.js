const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
/** @type {import("express").RequestHandler} */
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamps = await Bootcamp.find();
    res.status(200).json({ succes: true, count: bootcamps.length, data: bootcamps });
});

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
/** @type {import("express").RequestHandler} */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp can not be found by id ${req.params.id}`, 404));
    }

    res.status(200).json({ succes: true, data: bootcamp });
})
// @desc Create a new bootcamp
// @route POST /api/v1/bootcamps/
// @access Private
/** @type {import("express").RequestHandler} */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });
});
// @desc Update a bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
/** @type {import("express").RequestHandler} */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidatiors: true
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp that is called by id ${req.params.id} can not be found `, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});
// @desc Delete a bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
/** @type {import("express").RequestHandler} */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp that is called by id ${req.params.id} can not be found `, 404))
    }
    await bootcamp.delete();
    res.status(200).json({ success: true });
});