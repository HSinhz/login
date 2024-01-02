const express = require('express');
const router = express.Router();
const { checkInforLogin,checkInforRegister ,checkInforEmailRegister, checkOTP } = require('../middleware/checkuserlogin');
const { checkUserJWT } = require('../middleware/jwtacction');
const userController = require('../app/controllers/UserController');

// detailsController.index
router.post('/api/login', checkInforLogin, userController.handlerLogin);
router.post('/api/register',checkInforRegister, checkInforEmailRegister, userController.handlerRegister);
router.post('/api/otp', checkOTP , userController.handlerOTPRegister);

module.exports = router;