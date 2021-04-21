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
const { jwtAuthentication } = require('../middlewares/auth');

router.route('/').get(advancedResults(Course, { path: 'bootcamp', select: 'name description' }), getCourses).post(jwtAuthentication, createCourse);
router.route('/:id').get(getCourse).delete(jwtAuthentication, deleteCourse).put(jwtAuthentication, updateCourse);

module.exports = router;