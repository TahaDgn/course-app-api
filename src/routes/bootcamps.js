const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

const { advancedResults } = require('../middlewares/advancedResults');

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();
const { jwtAuthentication, authorize } = require('../middlewares/auth');

// Re-route into other resource routhers
router.use('/:bootcampId/courses', courseRouter)

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(jwtAuthentication, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(jwtAuthentication, authorize('publisher', 'admin'), updateBootcamp)
    .delete(jwtAuthentication, authorize('publisher', 'admin'), deleteBootcamp);

router.route('/:id/photo')
    .put(jwtAuthentication, authorize('publisher', 'admin'), bootcampPhotoUpload);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

module.exports = router;