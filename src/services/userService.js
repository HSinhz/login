require("dotenv").config();
const bcryptjs = require('bcryptjs');
const Account = require('../app/models/Account');
const JWTService = require('./JWTService');
const { createAccessToken, createRefreshToken, verifyToken } = require('../middleware/jwtacction');


async function handlerLogin(email, password) {
    return new Promise( async ( resolve, reject) => {
        try{
            let userData = {};
            let isExist = await checkUserName(email);
            if( isExist){
                let user = await Account.findOne({
                    email: email,
                });
                if( user ){
                    // Compare password
                    let checkpass =  bcryptjs.compareSync( password, user.password);
                    let ex = Math.floor(Date.now() / 1000) + 30;
                    if( checkpass){
                        let payload = {
                            email: user.email,
                            password: user.password,
                            roleId: user.roleId,
                            expiresIn: ex,
                        }
                        let payloadRefresh = {
                            email: user.email,
                            password: user.password,
                            roleId: user.roleId,
                            expiresIn: process.env.JWT_EXPIRES_REFRESH
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
                            })
                            .catch( err => {
                                console.error(err);
                            })
                        }     
                    } else {
                        userData.errCode = 3;
                        userData.errMess = 'Sai mật khẩu';
                    }
                } else {    
                    userData.errCode = 2;
                    userData.errMess = 'Email của bạn không tồn tại. Vui lòng nhập lại Email';
                }
            } else {
                // return error
                userData.errCode = 1;
                userData.errMess = 'Email của bạn không tồn tại. Vui lòng nhập lại Email';
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
            let isExist = await checkUserName( username );
            if( isExist ) {  
                result.errCode = 0;
                result.errMess = 'Email đã tồn tại';
            } else {
                const user =await new Account( userData );
                user
                    .save()
                    .then( 
                        result.errCode = 1,
                        result.errMess = 'Đăng kí thành công' 
                    )
            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserName = ( email ) => {
    return new Promise( async (resolve, reject) => {
        try{
            let user = await Account.findOne( 
                { email: email }
            )
            if( user ){
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e){
            reject(e);
        }
    })
}

let compareUserPassword =( password) => {
    return new Promise(( resolve, reject ) => {
        try{
            
        } catch (e){
            reject(e);
        }
    })
}
module.exports = {
    handlerLogin: handlerLogin,
    handlerRegister: handlerRegister
}