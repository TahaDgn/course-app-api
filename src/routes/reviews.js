const express = require('express');
const { advancedResults } = require('../middlewares/advancedResults');
const {
    getReviews, createReview, updateReview, deleteReview, getUserReviews, getReview
} = require('../controllers/reviews');


const router = express.Router({ mergeParams: true });

const { jwtAuthentication } = require('../middlewares/auth');
const Review = require('../models/Review');

router.route('/').get(advancedResults(Review, { path: 'bootcamp', select: 'name description' }), getReviews).post(jwtAuthentication, createReview);
router.route('/me').get(jwtAuthentication, getUserReviews);
router.route('/:id').get(getReview).put(jwtAuthentication, updateReview).delete(jwtAuthentication, deleteReview);



module.exports = router;