const Course = require('../models/Course');
const Account = require('../models/Account');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
    // [GET] /
    index(req, res, next) /* Đang ở controller */ {
        res.render('home');
        // res.status(201).json('Người dùng đã đăng nhập bằng Token');
    }

    // [GET] /search
    search(req, res){
        res.render('search');
    }

    // [GET] /login
    login( req, res, next){
        res.render('account/login');
    }


    register( req, res, next){
        res.render('account/register');
    }
    
   

}

module.exports = new SiteController;