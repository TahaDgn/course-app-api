const express = require('express');
const { register, login, me, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controllers/auth');
const router = express.Router();

const { jwtAuthentication } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', jwtAuthentication, me);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', jwtAuthentication, updateDetails);
router.put('/updatepassword', jwtAuthentication, updatePassword);
module.exports = router;