const Account = require('../models/Account');
const userService = require('../../services/userService');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { verifyToken } = require('../../middleware/jwtacction');
const { parse } = require('dotenv');
const {ReAccessToken} = require('../../middleware/checkuserlogin');

class UserController {
    // [POST] /api/login
    async handlerLogin(req, res , next){
        let email = req.body.email;
        let password = req.body.password ;

        if ( !email || !password ){
            return res.status(500).json( {
                errCode: 1,
                message: 'Vui lòng nhập email và mật khẩu',
            })
        }

        let userData = await userService.handlerLogin( email, password );

        if( !userData ){
            return res.status(500).json({
                message: 'userData is not valid'
            });
        }
        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMess,
            data : {
                access_token: userData.access_token,
                refresh_token: userData.refresh_token,
                roles: userData.roles  
            }
            
        });
        /* Các bước của BA khi xử lý đăng nhập
            Kiểm tra xem Email có tồn tài hay chưa
            kiểm tra mật khẩu 
            return userInfo ( roleId)
            access Token ( Json web Token )
        */
    }

    // [POST] /api/signin
    async handlerRegister(req, res, next){
        let username = req.body.email;
        let password = req.body.password;
        let fullname = req.body.fullname;
        let phonenumber = req.body.phonenumber;
        let userData = req.body;
        if( !username || !password || !fullname || !phonenumber){
            return res.status(500).json({
                errCode: 0,
                errMess: 'Vui lòng nhập thông tin'
            })
        }
        
        let result = await userService.handlerRegister( username, userData );
        return res.status(200).json({
            errCode: result.errCode,
            errMess: result.errMess
        })

    }

    reAccessToken(req, res ){
        const refresh_token = req.headers.token;
        const parse111 =  verifyToken(refresh_token);
        res.json(parse111)
    }
    
}

module.exports = new UserController();