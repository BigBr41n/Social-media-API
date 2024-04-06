//http server
const http = require('http'); 
//import the main app 
const app = require('./app'); 
//env variables
require('dotenv').config(); 



//creating the server
const server = http.createServer(app); 

//PORT 
const PORT = process.env.PORT || 4000 ; 

//some important configs of the server :

server.keepAliveTimeout = 60000;
server.timeout = 5000; 
server.maxHeadersCount = 20;


//listen & 0.0.0.0 to allow all IPs accessing the server
server.listen (PORT , '0.0.0.0' , ()=>{
    console.log(`listen on port : ${PORT}`);
}); 


//if the server closed 
server.on('close', () => {
    console.log('Server closed');
});
