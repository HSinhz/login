const { createAccessToken, createRefreshToken, verifyToken } = require('./jwtacction');


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

// Xin Cấp lại Access_Token
const ReAccessToken = (req, res, next) => {
    let refresh_token = req.headers.token;
    if( !refresh_token){
        console.log('Refresh Token not exist')
        return res.status(401).json("Refresh Token not exist");
    }
    
}


module.exports = {
    checkUserLogin,
    ReAccessToken

}