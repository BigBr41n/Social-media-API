class HttpError extends Error {
    constructor(message , errorCode=500){
        super(message); 
        this.code = errorCode; 
        this.name=this.constructor.name
    }
}


module.exports = HttpError ; 