const userService = require('../../services/userService');
const otpService = require('../../services/OTPService');
const { mongooseToObject } = require('../../util/mongoose');


class UserController {
    // [POST] /api/login
    async handlerLogin(req, res , next){
        try{
            let email = req.body.email;
            let password = req.body.password ;
            let data = await userService.handlerLogin( email, password );
            if( !data ){
                return res.status(500).json({
                    EM: 'error form user',
                    EC: '-1',
                    DT: ''
                })
            }
            return res.status(200).json({
                errCode: data.errCode,
                message: data.errMess,
                data : {
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    roles: data.roles  
                }
                
            });
        } catch (error) {
            return res.status(500).json({
                EM: 'error form user',
                EC: '-1',
                DT: ''
            })
        }
        
        /* Các bước của BA khi xử lý đăng nhập
            Kiểm tra xem Email có tồn tài hay chưa
            kiểm tra mật khẩu 
            return userInfo ( roleId)
            access Token ( Json web Token )
        */
    }

    // [POST] /api/signin
    async handlerRegister(req, res, next){
            let userData = req.body;
            let email = req.body.email;
            let data = await userService.handlerRegister( email, userData );
            console.log('data: ', data)
            res.render('account/formotp');
    }

    async handlerOTPRegister( req, res, next){
        let userData = req.body;
        let otp = req.body.otpcode
        let data = await otpService.handlerOTPRegister(userData );
        if( data.ER == 1){
            // Trở về trang nhập mã, ở trang nhập mã có yêu câu gửi lại mã
            return res.status(500).json( {data: data})
        } else if( data.ER == 0) {
            return res.status(500).json( {data: data})
        }
    }
    
}

module.exports = new UserController();