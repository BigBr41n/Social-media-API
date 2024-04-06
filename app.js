//imports
const express = require('express');
const cookieParser = require('cookie-parser'); 
const path = require('path'); 
 

//routes import




//middelware import 
const {errorHandler , notFound} = require('./api/middlewares/errorsMiddleware'); 


//app instance 
const app = express(); 


//connection DB 


//middlewares 
app.use(express.json())
app.use(cookieParser())
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

//routes 
//testing
app.get('/' , (req , res)=>{
    res.send('HOME here'); 
})


//404 & error handler 
app.use(notFound); 
app.use(errorHandler); 



//export the app 
module.exports = app ; 