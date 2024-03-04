const express = require('express');
const {register, login, getMe, logout, generateResetToken, resetPassword} = require('../controllers/auth');
const {protect} = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(protect, logout);
router.route('/me').get(protect, getMe);
router.route('/resetpassword').post(generateResetToken);
router.route('/resetpassword/:resetToken').put(resetPassword);

module.exports = router;