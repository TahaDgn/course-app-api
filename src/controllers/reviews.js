const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc Get reviews of a bootcamp
// @Route GET /v1/bootcamp/:id/reviews
// @Access Public
exports.getReviews = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`There is no bootcamp with id ${req.params.bootcampId}`, 400));
    }

    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
    });
});

exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp', select: 'name description'
    });

    if (!review) {
        return next(new ErrorResponse(`There is no review with id ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        data: review,
    });
})

// @desc Create a review for the bootcamp
// @Route GET /v1/bootcamp/:id/reviews
// @Access Private
exports.createReview = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`There is no bootcamp with id ${req.params.bootcampId}`, 404));
    }

    const oldReview = await Review.findOne({ user: req.user.id, bootcamp: req.params.bootcampId });

    if (oldReview) {
        return next(new ErrorResponse(`You have already exsisted review for bootcamp ${req.params.bootcampId}`, 400));
    }

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review,
    });

});

// @desc Get reviews of a bootcamp
// @Route GET /v1/bootcamp/:id/reviews
// @Access Public
exports.updateReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`There is no review with id ${req.params.id}`));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User id ${req.user.id} is not owner of this`, 403));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: review,
    });

});

exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await (await Review.findById(req.params.id))
    if (!review) {
        return next(new ErrorResponse(`There is no review id with ${req.params.id}`));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User id with ${req.user.id} is not owner this`, 403));
    }

    await review.remove();

    res.status(200).json({ success: true });
});

exports.getUserReviews = asyncHandler(async (req, res, next) => {

    const reviews = await Review.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        data: reviews,
    });
});

