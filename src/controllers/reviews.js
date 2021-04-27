const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');
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

exports.createReview = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`There is no bootcamp with id ${req.params.bootcampId}`, 404));
    }

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review,
    });

});

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

})

