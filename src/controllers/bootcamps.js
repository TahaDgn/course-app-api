const path = require('path');
const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');


// @desc Get all bootcamps
// @route GET /v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removedFields = ['select', 'sort', 'limit', 'page']; // Selectin bura olması talha aydemir tarafından reddedildi.

    // Loopover removedFields and delete them from query
    removedFields.forEach(param => delete reqQuery[param]);

    console.log(reqQuery);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt , $gte etc...)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    // Pagination fields

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Pagination results
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    // Select fields
    if (req.query.select) {
        const selectFields = req.query.select.split(',').join(' ');
        console.log(`Select fields : ${selectFields}`);
        query = query.select(selectFields);
    }

    // Sort fields
    if (req.query.sort) {
        const sortFields = req.query.sort.split(',').join(' ');
        console.log(`Sort fields : ${sortFields}`);
        query = query.sort(sortFields);
    } else {
        query = query.sort('name');
    }

    // Executing query
    const bootcamps = await query;

    res.status(200).json({ succes: true, count: bootcamps.length, pagination, data: bootcamps });
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