const { createAccessToken, createRefreshToken, verifyToken } = require('../middleware/jwtacction');
const nodemailer = require('nodemailer');
const Account = require('../app/models/Account');
const OtpCode = require('../app/models/OtpCode');
const { checkExpiredJWT } = require('../middleware/jwtacction');

function handlerOTPRegister (userData){
    return new Promise ( async ( resolve, reject ) => {
        try{
            let data = {};
            let email = userData.email;
            let jwtOtp = await OtpCode.findOne({ email: email});
            if( jwtOtp ){
                let dataOtp = verifyToken(jwtOtp.access_token );
                console.log('dataOtp: ', dataOtp);
                if( userData.otpcode == dataOtp.otpcode ){
                    let checkExpired = checkExpiredJWT( dataOtp.expiresIn);
                    console.log('Result: ', checkExpired);
                    if( !checkExpired ){
                        data.ER = 1;
                        data.EM = 'Mã đã hết hạn';
                        // Xóa mã trong DBS nếu mã đã hết hạn
                        OtpCode.deleteOne({ email: email });
                    } else {
                        const newUser = new Account( userData);
                        console.log( "UserData: ", userData );
                        // Tạo khách hàng mới nếu người dùng nhập đúng mã và mã còn hiệu lực
                        newUser.save().then( () => console.log('Lưu khách hàng mời thành công')).catch( () => console.log('Lưu khách hang mới thất bại'))
                        //Sau khi tạo người dùng sẽ xóa mã OTP khỏi DBS
                        OtpCode.deleteOne({ email: email }).then(() => console.log("Đã xóa mã OTP") );
                            
                       
                        // let payload = {
                        //     email: user.email,
                        //     roleId: user.roleId,
                        //     expiresIn: ex,
                        // }
                        // let payloadRefresh = {
                        //     email: user.email,
                        //     roleId: user.roleId,
                        //     expiresIn: Math.floor(Date.now() / 1000) + 30
                        // }
                        data.ER = 0,
                        data.EM = 'Success !!!!!!!!' 
                    }
                } else {
                    data.ER = 1,
                    data.EM = 'Mã không hơp lệ'
                }
            } else {
                data.ER = 1,
                data.EM = 'Mã không hơp lệ'
            }
        
            resolve(data)
            
        } catch ( e ){
            reject( e);
        }
    })
}

module.exports = {
    handlerOTPRegister: handlerOTPRegister
}
