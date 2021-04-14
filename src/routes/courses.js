const express = require('express');
const {
    getCourses,
    getCourse,
    createCourse,
    deleteCourse,
    updateCourse,
} = require('../controllers/courses')

const router = express.Router({ mergeParams: true, });

router.route('/').get(getCourses).post(createCourse);
router.route('/:id').get(getCourse).delete(deleteCourse).put(updateCourse);

module.exports = router;