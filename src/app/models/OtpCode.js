const  mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OtpCode = new Schema({
    otpcode: { type: Number, require: true},
    email: { type: String, require: true},
    access_token: { type: String, require: true},   
})

module.exports = mongoose.model('OtpCode', OtpCode);
