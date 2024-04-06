//imports
const express = require('express');
const cookieParser = require('cookie-parser'); 
const path = require('path'); 
 

//routes import
const userRoute = require('./api/routes/user'); 
const authRoute = require('./api/routes/auth');



//middelware import 
const {errorHandler , notFound} = require('./api/middlewares/errorsMiddleware'); 



//app instance 
const app = express(); 



//connection DB 
const {dataBaseConnect} = require('./api/config/db_config'); 
dataBaseConnect(); 




//middlewares 
app.use(express.json())
app.use(cookieParser())
app.use("/uploads",express.static(path.join(__dirname,"uploads")))



//routes 
app.use('/api/v1/auth' , authRoute); 
app.use('/api/v1/users' , userRoute); 



//404 & error handler 
app.use(notFound); 
app.use(errorHandler); 



//export the app 
module.exports = app ; 