require("dotenv").config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const Account = require('../app/models/Account');
const OtpCode = require('../app/models/OtpCode');
const JWTService = require('./JWTService');
const { createAccessToken, createRefreshToken, verifyToken } = require('../middleware/jwtacction');

async function handlerLogin(email, password) {
    return new Promise( async ( resolve, reject) => {
        try{
            let userData = {};
            let user = await  Account.findOne( { email: email })
                if( user ){
                    // Compare password
                    let checkpass =  checkPassWord( password, user.password);
                    if( checkpass){
                        let payload = {
                            email: user.email,
                            roleId: user.roleId,
                            expiresIn: ex,
                        }
                        let payloadRefresh = {
                            email: user.email,
                            roleId: user.roleId,
                            expiresIn: Math.floor(Date.now() / 1000) + 30
                        }
                        
                        // tạo Access_Token và Refresh_Token
                        let accessToken = createAccessToken(payload);
                        let refreshToken = createRefreshToken(payloadRefresh);
                    
                        userData = {
                            errCode :0,
                            errMess : 'Đăng nhập thành công',
                            access_token:  accessToken,
                            refresh_token: refreshToken,
                        }     
                        // Kiểm tra errCode có đủ điều kiện
                        if( userData.errCode === 0 ){
                            Account.updateOne( {email:email},{
                                $set: {
                                    access_token: userData.access_token,
                                    refresh_token: userData.refresh_token
                                }
                            }) .catch( err => { console.error(err); })
                        }     
                    } else {
                        userData.errCode = 1;
                        userData.errMess = 'Email hoặc mật khẩu sai';
                        userData.data = '';
                    }
                } else {    
                    userData.errCode = 1;
                    userData.errMess = 'Email hoặc mật khẩu sai';
                    userData.data = '';
                }
            
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

function handlerRegister( username, userData ) {
    return new Promise( async ( resolve, reject) => {
        try{
            const result = {};
            let otp = await sendMail();
            let payload = {
                email: username,
                otpcode: otp,
                expiresIn: Math.floor(Date.now() / 1000) + 5*60
            }
            
            let access_token_otp = createAccessToken( payload);
            console.log("Đây là access_token_otp: ", access_token_otp);
            let otpdbs = await new OtpCode({
                email: username,
                access_token: access_token_otp
            }).save().then(() => console.log('Đã lưu OTP'))

            result.ER = 0;
            result.EM = 'OK!!!!';
            result.DT = '';
            resolve( result);
        } catch (e) {
            reject(e);
        }
    })
}


async function checkUserName ( email ){
    let user = await  Account.findOne( { email: email })
    if( user ){
        return true;
    } else {
        return false;
    }
}

const checkPassWord = (inputPass, hashPass) => {
    return bcryptjs.compareSync( inputPass, hashPass);
}

function sendMail (){
    let OTP = createOTPCode();
    console.log("OTP: ", OTP)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com, smtp.vaa.edu.vn',
        port: 587,
        secure: false,
        auth: {
             user: '2154810083@vaa.edu.vn',
            pass: 'kzud wupw sxll gant'
        }
    });
    const mailOptions = {
        from: '2154810083@vaa.edu.vn',
        to: 'vhieusinh2703@gmail.com',
        subject: 'Mã xác minh đăng kí',
        html: '<h1><%= OTP %></h1>'
    };
    const filledHtml = mailOptions.html.replace(/<%= OTP %>/g, OTP);
        mailOptions.html = filledHtml;
        transporter.sendMail( mailOptions, function(err, info){
        if( err){
            console.log( 'Error: ' , err);
        } else {
            console.log('Email sent: ', info.response);
            
        }
    });
    return OTP;
}

const createOTPCode = () => {
    let min = 100000;
    let max = 999999;
    let OTP = Math.floor( Math.random() * ( max - min)) + min;
    return OTP;
}

module.exports = {
    handlerLogin: handlerLogin,
    handlerRegister: handlerRegister,
    checkUserName: checkUserName,
}