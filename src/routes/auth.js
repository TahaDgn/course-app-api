const express = require('express');
const { register, login, me } = require('../controllers/auth');
const router = express.Router();

const { jwtAuthentication } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', jwtAuthentication, me);



module.exports = router;