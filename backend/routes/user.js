const express = require("express");
const router = express.Router();


const {otpSave,signUp} = require("../controllers/auth")
;
router.post("/otp-create",otpSave); 
router.post("/signUp",signUp); 


module.exports = router;