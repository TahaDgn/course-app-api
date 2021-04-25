const express = require('express');
const { getUsers, getUser, updateUser, createUser, deleteUser } = require('../controllers/admin');
const { advancedResults } = require('../middlewares/advancedResults');
const { jwtAuthentication, authorize } = require('../middlewares/auth');
const User = require('../models/User');

const router = express.Router();

router.use(jwtAuthentication);
router.use(authorize('admin'))

router.route('/users/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);
router.route('/users')
    .get(advancedResults(User), getUsers)
    .post(createUser);
module.exports = router;