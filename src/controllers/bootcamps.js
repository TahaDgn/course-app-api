const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
/** @type {import("express").RequestHandler} */
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        if (!bootcamps) {
            return next(new ErrorResponse(`Bootcamps can not be found`, 404));
        }
        res.status(200).json({ succes: true, count: bootcamps.length, data: bootcamps });
    } catch (error) {
        next(new ErrorResponse(`Bootcamps can not be found`, 500));
    }
}

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
/** @type {import("express").RequestHandler} */
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp can not be found by id ${req.params.id}`, 404));
        }

        res.status(200).json({ succes: true, data: bootcamp });
    } catch (error) {
        // res.status(400).json({success : false});
        next(error);
    }
}
// @desc Create a new bootcamp
// @route POST /api/v1/bootcamps/
// @access Private
/** @type {import("express").RequestHandler} */
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (error) {
        next(error);
    }
}
// @desc Update a bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
/** @type {import("express").RequestHandler} */
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidatiors: true
        });
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp that is called by id ${req.params.id} can not be found `, 404));
        }
        res.status(200).json({ success: true, data: bootcamp });
    } catch (error) {
        next(error);
    }
}
// @desc Delete a bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
/** @type {import("express").RequestHandler} */
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp that is called by id ${req.params.id} can not be found `, 404))
        }
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}