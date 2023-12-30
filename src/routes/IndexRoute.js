const siteRoute = require('./siteroute');
const courseRoute = require('./courseRoute');
const userRoute = require('./userRoute');

function route(app){
    
    app.use('/courses', courseRoute);
    app.use('/user', userRoute);
    app.use('/', siteRoute);
    
}
module.exports = route;