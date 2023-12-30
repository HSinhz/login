const express = require('express');
const router = express.Router();
const { checkUserJWT } = require('../middleware/jwtacction');
const userController = require('../app/controllers/UserController');
function testMiddleware(req, res , next ) {
    console.log("Middleware is runingggggggggg");
    next();
    
}
// detailsController.index
router.post('/api/login', testMiddleware ,  userController.handlerLogin);
router.post('/api/register', userController.handlerRegister);
router.get('/reaccess', userController.reAccessToken);







module.exports = router;