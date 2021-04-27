const express = require('express');
const { advancedResults } = require('../middlewares/advancedResults');
const {
    getReviews, createReview, updateReview
} = require('../controllers/reviews');


const router = express.Router({ mergeParams: true });

const { jwtAuthentication, authorize } = require('../middlewares/auth');
const Review = require('../models/Review');

router.route('/').get(getReviews).post(jwtAuthentication, createReview);
router.route('/:id').put(jwtAuthentication, updateReview);

module.exports = router;