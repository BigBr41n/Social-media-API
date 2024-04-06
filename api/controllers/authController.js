const User=require("../models/User");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const HttpError = require("../models/errorModel");
require('dotenv').config(); 



//====== POST 
//====== /api/v1/auth/register
//====== UNPROTECTED
//====== TESTED USING POSTAMN 
module.exports.register= async (req,res,next)=>{
    try{
       const {password:reqPassword,username,email}=req.body; 

       //check if user exists
       const existingUser=await User.findOne({ $or: [{username},{email}] }); 
       if(existingUser){
         throw new HttpError("Username or email already exists!",400); 
       }



       //hashing the password 
       const hashedPassword= await bcrypt.hash(reqPassword,10); 


       //creating the user
       const newUser=new User({...req.body,password:hashedPassword}); 
       const savedUser=await newUser.save(); 

       //return without password for security 
       const { password, ...userWithoutPassword } = savedUser._doc;
       res.status(201).json(userWithoutPassword);       
    }
    catch(error){
        console.log(error); 
        next(error); 
    }
}


//====== POST 
//====== /api/v1/auth/login
//====== UNPROTECTED
//====== TESTED USING POSTAMN 
module.exports.login = async (req,res,next)=>{
    try{
        let user;

        // user can login using email or username 
        if(req.body.email){
            user=await User.findOne({email:req.body.email}); 
        }
        else{
            user=await User.findOne({username:req.body.username}); 
        }

        //if user does not exist
        if(!user){
            throw new HttpError("User not found!",404); 
        }

        //match the passowrds
        const match=await bcrypt.compare(req.body.password,user.password);

        if(!match){
            throw new HttpError("Wrong Credentials!",401); 
        }

        const {password,...data}=user._doc ; 

        //generate unique JWT using the user id
        const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE}); 
        res.cookie("token",token).status(200).json(data); 

    }
    catch(error){
        next(error)
    }
}



//====== GET
//====== /api/v1/auth/logout
//====== UNPROTECTED
//====== TESTED USING POSTAMN 
module.exports.logout = async(req,res,next)=>{
    try{
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).json("user logged out successfully!"); 
    }
    catch(error){
        next(error)
    }
}