const jwt=require("jsonwebtoken")
const HttpError = require('../models/errorModel'); 
require('dotenv').config(); 



const verifyToken=(req,res,next)=>{
    const token=req.cookies.token; 
    if(!token){
        throw new HttpError("You are not authenticated!",401)
    }
    jwt.verify(token,process.env.JWT_SECRET,async(err,decoded)=>{
        if(err){
            throw new HttpError("Token is not valid!",403)
        }
        req.userId=decoded._id; //injecting the loggedIn user id in the req
        // console.log(req); 
        next(); 
    }); 
}

module.exports=verifyToken ; 