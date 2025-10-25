const express = require('express');
const dbConnect = require('./config/database');
const app = express();
const userRoute = require("./routes/user");
const { otpSave } = require('./controllers/auth');
require("dotenv").config();


const PORT = process.env.PORT;


// parsers
app.use(express.json());
// mounting route
app.use("/api/v1",userRoute);

dbConnect(); // imported func to connect the db and server




// connection to a port...
app.listen(PORT,()=>{
    console.log(`Server successfully running at PORT ${PORT}`);
})



