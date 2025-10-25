// used to connect the server to mongodb using mongoose

const mongoose = require("mongoose");

const dbConnect = ()=>{ // a function to connect db to server
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("Database connected succcessfully");}
    )
    .catch((error)=>{
        console.log(error);
        console.log("Database Connection failed");
    });
}
module.exports = dbConnect;  // exporting func to be used in server.js for calling