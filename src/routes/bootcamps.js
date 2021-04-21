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
const { jwtAuthentication } = require('../middlewares/auth');

// Re-route into other resource routhers
router.use('/:bootcampId/courses', courseRouter)

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(jwtAuthentication, createBootcamp);
router.route('/:id')
    .get(getBootcamp)
    .put(jwtAuthentication, updateBootcamp)
    .delete(jwtAuthentication, deleteBootcamp);
router.route('/:id/photo')
    .put(jwtAuthentication, bootcampPhotoUpload);
router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

module.exports = router;