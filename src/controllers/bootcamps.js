const path = require('path');
const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');


// @desc Get all bootcamps
// @route GET /v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc Get single bootcamp
// @route GET /v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp can not be found by id ${req.params.id}`, 404));
    }

    res.status(200).json({ succes: true, data: bootcamp });
});

// @desc Create a new bootcamp
// @route POST /v1/bootcamps/
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });
});

// @desc Update a bootcamp
// @route PUT /v1/bootcamps/:id
// @access Private
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
// @route DELETE /v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp that is called by id ${req.params.id} can not be found `, 404))
    }
    await bootcamp.remove();
    res.status(200).json({ success: true });
});

// @desc Get bootcamps within a radius (distance)
// @route GET /v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder

    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    const bootcamps = await Bootcamp.find({
        location: {
            $nearSphere: {
                $geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                },
                $maxDistance: distance * 1609.344
            }
        }
    }).populate('courses');


    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    })
});

// @desc Upload photo for bootcamp
// @route PUT /v1/bootcamps/:id
// @access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp that is called by id ${req.params.id} can not be found `, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Uncorrect type of uploaded file`, 400));
    }
    console.log('Mime type checked'.bgMagenta.inverse);

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }
    console.log('File size checked'.bgMagenta.inverse);
    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${path.join(__dirname, process.env.FILE_UPLOAD_PATH)}/${file.name}`, async err => {

        if (err) {
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name }, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: bootcamp,
        });

        console.log('Photo Uploaded'.bgMagenta.inverse);
    });
});