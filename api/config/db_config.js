const mongoose = require('mongoose'); 
require('dotenv').config(); 


//function to connect the database
module.exports.dataBaseConnect = async()=>{
    await mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("database connected successfully!")
    }).catch((err)=>{
        console.log("database is not connected! "+err); 
    }); 
}