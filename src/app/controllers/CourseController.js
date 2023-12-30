const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');

class CourseController {
    
    
    // [GET] /course/create
    create( req, res, next){
        res.status(201).json("Người dùng đã đăng nhập");
    }

    
}

module.exports = new CourseController;