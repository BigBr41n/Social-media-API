const HttpError = require("../models/errorModel");

const notFound = ((req, res , next)=>{
    const error = new HttpError(`Not Found - ${req.originalUrl}` , 404);
    next(error); 
}); 



const errorHandler = ((err, req, res, next) => {
    if(res.headerSent){
        return res.status(500).json({error : "Internal server Error !"}); 
    }
    if(err instanceof HttpError){
       return res.status(err.code).json({message : err.message }); 
    }
    return res.status(500).json({error : "Internal server Error !"});
}); 

module.exports = {notFound , errorHandler}; 