//imports
const express = require('express');
const cookieParser = require('cookie-parser'); 
const path = require('path'); 
 

//routes import


//app instance 
const app = express(); 


//connection DB 


//middlewares 
app.use(express.json())
app.use(cookieParser())
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

//routes 



//404 & error handler 




//export the app 
module.exports = app ; 