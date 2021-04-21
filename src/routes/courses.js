const express = require('express');
const {
    getCourses,
    getCourse,
    createCourse,
    deleteCourse,
    updateCourse,
} = require('../controllers/courses');

const Course = require('../models/Course');
const { advancedResults } = require('../middlewares/advancedResults');

const router = express.Router({ mergeParams: true, });
const { jwtAuthentication, authorize } = require('../middlewares/auth');

router.route('/')
    .get(advancedResults(Course, { path: 'bootcamp', select: 'name description' }), getCourses)
    .post(jwtAuthentication, authorize('publisher', 'admin'), createCourse);

router.route('/:id')
    .get(jwtAuthentication, authorize('user', 'publisher', 'admin'), getCourse)
    .delete(jwtAuthentication, authorize('publisher', 'admin'), deleteCourse)
    .put(jwtAuthentication, authorize('publisher', 'admin'), updateCourse);

module.exports = router;