const { createAccessToken, createRefreshToken, verifyToken } = require('./jwtacction');
const { checkUserName , sendMail } = require('../services/userService')



const checkUserLogin = ( req, res , next) => {
    // Những route không cần check
    const nonSecurePaths = ['/home' , 'register' , '/login'];
    
    if( nonSecurePaths.includes(req.path)){
        return next();
    }
    if( user ){
        next();
    } else {
        
    }
}

const checkInforLogin = ( req, res, next) => {
    let email = req.body.email;
    let password = req.body.password ;
    if ( !email || !password ){
        return res.status(500).json( {
            errCode: 1,
            message: 'Vui lòng nhập email và mật khẩu',
        })
    }
    next();
}

const checkInforRegister = ( req, res, next) => {
    let username = req.body.email;
    let password = req.body.password;
    let fullname = req.body.fullname;
    let phonenumber = req.body.phonenumber;
    if( !username || !password || !fullname || !phonenumber){
        return res.status(500).json({
            errCode: 0,
            errMess: 'Vui lòng nhập thông tin'
        })
    }
    next();
}

async function checkInforEmailRegister(req, res, next) {
    let username = req.body.email;
    let result = await checkUserName(username);
    if( result){
        return res.status(500).json({
            errCode: 0,
            errMess: 'Email đã tồn tại'
        })
    }
    next();
}

const checkOTP = (req, res, next) => {
    // if( req.body.otpcode ){
        
       
    // } else {
    //     return res.status(500).json( {
    //         errCode: 1,
    //         message: 'Vui lòng nhập mã OTP',
    //     })
    // }
    next();
}

module.exports = {
    checkUserLogin,
    checkInforLogin,
    checkInforRegister,
    checkInforEmailRegister,
    checkOTP
}