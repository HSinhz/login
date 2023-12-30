const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController');
const { checkUserJWT } = require('../middleware/jwtacction');

// detailsController.index
router.get('/create', checkUserJWT, courseController.create);




module.exports = router;