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

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resource routhers
router.use('/:bootcampId/courses', courseRouter)

router.route('/')
    .get(getBootcamps)
    .post(createBootcamp);
router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);
router.route('/:id/photo')
    .put(bootcampPhotoUpload);
router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

module.exports = router;