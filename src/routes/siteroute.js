const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');


// Đây là hàm kiểm tra AccessToken
const { checkUserJWT } = require('../middleware/jwtacction');

// Đây là router sử dụng 
// http://localhost:8000/home
router.get('/home', checkUserJWT , siteController.index);


router.get('/login', siteController.login );
router.get('/register', siteController.register );
router.get('/search', siteController.search);

module.exports = router;