const express = require('express');
const { getUsers, getUser, updateUser, createUser, deleteUser } = require('../controllers/admin');
const { advancedResults } = require('../middlewares/advancedResults');
const { jwtAuthentication, authorize } = require('../middlewares/auth');
const User = require('../models/User');

const router = express.Router();

router.route('/users/:id')
    .get(jwtAuthentication, authorize('admin'), getUser)
    .put(jwtAuthentication, authorize('admin'), updateUser)
    .delete(jwtAuthentication, authorize('admin'), deleteUser);
router.route('/users')
    .get(jwtAuthentication, authorize('admin'), advancedResults(User), getUsers)
    .post(jwtAuthentication, authorize('admin'), createUser);
module.exports = router;