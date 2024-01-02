require("dotenv").config();
const jwt = require('jsonwebtoken');
const Account = require('../app/models/Account');

const createAccessToken = ( payload ) => {
    let keyAccess = process.env.JWT_SECRET;
    let accessToken = null;
    try{
        accessToken = jwt.sign(payload, keyAccess);
    } catch ( err ){
        console.log(err);
    }
    return accessToken;
}

const createRefreshToken = ( payload ) => {
    let keyRefresh = process.env.JWT_SECRET;
    let refreshToken = null;
    try{
        refreshToken = jwt.sign(payload, keyRefresh);
    } catch ( err ){   
        console.log(err);
    }
    return refreshToken;
}

const verifyToken = (token) => {
    let key = process.env.JWT_SECRET;
    let decoded = null;
    try{
        decoded = jwt.verify(token, key);
    } catch (err) {
        console.log(err);
    }
    return decoded;
}

// Kiểm tra JWT 
const checkUserJWT = (req, res, next )=> {
    let access_token_client = req.headers.accesstoken;
    let refresh_token_client = req.headers.refreshtoken;
    let decodeAccessToken = verifyToken(access_token_client);
    let decodeRefreshToken = verifyToken(refresh_token_client);
    
    let expiresIn = decodeAccessToken.expiresIn;
    let ck = checkExpiredJWT(expiresIn)
    // console.log("ck = " , ck);

    console.log("Expires time ", expiresIn);
    if(decodeAccessToken){  // Kiểm tra AccessToken có tồn tại
        if( ck ){ // Kiểm tra thời gian của AccessToken
            req.user = decodeAccessToken;
            // console.log("Token còn thời hạn")
            next();
        } else {
            if( decodeRefreshToken ){ // Kiểm tra RefreshToken có tồn tại
                let expiresInRefresh = decodeRefreshToken.expiresIn;
                if( checkExpiredJWT(expiresInRefresh)) {
                    let ex = Math.floor(Date.now() / 1000) +120;
                    let payload = {
                        email: decodeAccessToken.email,
                        roleId: decodeAccessToken.roleId,
                        expiresIn: ex
                        // expiresIn: process.env.JWT_EXPIRES_IN
                    }
                    let newAccessToken = createAccessToken(payload);
                    req.user = newAccessToken;
                    Account.updateOne( {email:payload.email},{
                        $set: {
                            access_token: newAccessToken,
                        }
                    }). then(() => "a").catch(() => console.log( "Thêm thất bại"))
                    console.log("Đây alf token mới: ",newAccessToken);
                    next();
                } else {

                }
            } else {
                return res.status(401).json({
                    errCode: -1,
                    data: null,
                    messErr: "Refresh Token không tồn tại"
                })
            }
        }
    } else {
        return res.status(401).json({
            errCode: -1,
            data: null,
            messErr: "Access Token không tồn tại"
        })
    }
   
}

// Kiểm tra JWT có còn hạn sử dụng
const checkExpiredJWT = (expiresIn) => {
    let currentTimes = Math.floor(Date.now() / 1000);
    console.log("Time now: " ,currentTimes - expiresIn);
    
    if( currentTimes > expiresIn ){
        // hết hạn
    //    console.log("Hết hạn")
       return false;
    } else {
        // console.log("còn hạn")
        // còn hạn
        return true;
    }
}


module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyToken,
    checkUserJWT,
    checkExpiredJWT
}