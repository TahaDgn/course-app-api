const asyncHandler = require("../middlewares/async");
const Bootcamp = require("../models/Bootcamp");
const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");


// @desc Get courses
// @route GET /v1/courses
// @route GET /v1/:bootcampId/courses
// @access Public
exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {

        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
        if (!bootcamp) {
            return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404))
        }
        const courses = await Course.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc Get courses
// @route GET /v1/courses/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description',
    });
    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: course,
    });
});

// @desc Create a new bootcamp
// @route POST /v1/bootcamps/:bootcampId/courses
// @access Private
/** @type {import("express").RequestHandler} */
exports.createCourse = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    // Add user to body
    req.body.user = req.user.id;

    const bootcamp = (await Bootcamp.findById(req.params.bootcampId));
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404));
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User id ${req.user.id} is not owner of this bootcamp`, 403));
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course,
    });

});

// @desc Delete a new bootcamp
// @route DELETE /v1/courses/:id
// @access Private
/** @type {import("express").RequestHandler} */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`Bootcamp that is called by id ${req.params.id} can not be found `, 404));
    }

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User id ${req.user.id} is not owner of this`, 403));
    }

    await course.remove();

    res.status(204).json({ success: true });
})

// @desc Update a bootcamp
// @route PUT /v1/courses/:id
// @access Private
/** @type {import("express").RequestHandler} */
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`Course that is called by id ${req.params.id} can not be found`, 404));
    }

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User id ${req.user.id} is not owner of this`, 403));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidatiors: true,
    });

    res.status(200).json({ success: true, data: course });
});

