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

router.route('/').get(advancedResults(Course, { path: 'bootcamp', select: 'name description' }), getCourses).post(createCourse);
router.route('/:id').get(getCourse).delete(deleteCourse).put(updateCourse);

module.exports = router;