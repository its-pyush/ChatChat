// otp schema
const mongoose = require("mongoose");
const { sendMail } = require("../utils/mail");

// schema is a part of mongoose
// this help give structure to the document

const otpSchema = new mongoose.Schema({
    otp:
    {
        type : Number,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 5*60,
    }
})
// function for sending otp to a email
const otpSendMail = (otp,email)=>{
    sendMail(email,"chatchat verification OTP",`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ChatChat Verification Email</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f7;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .header {
    background-color: #4A90E2;
    color: white;
    padding: 20px;
    text-align: center;
    font-size: 24px;
  }
  .content {
    padding: 30px 20px;
    text-align: center;
    color: #333;
  }
  .content p {
    font-size: 16px;
    line-height: 1.6;
  }
  .btn {
    display: inline-block;
    padding: 12px 25px;
    margin: 20px 0;
    background-color: #4A90E2;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
  }
  .otp {
    font-size: 20px;
    font-weight: bold;
    color: #4A90E2;
    margin: 15px 0;
  }
  .footer {
    padding: 15px 20px;
    text-align: center;
    font-size: 12px;
    color: #888;
    background-color: #f4f4f7;
  }
  @media (max-width: 600px) {
    .container {
      margin: 20px;
    }
    .content {
      padding: 20px 15px;
    }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      ChatChat
    </div>
    <div class="content">
      <h2>Verify Your Email</h2>
      <p>Hello,</p>
      <p>Thank you for signing up for ChatChat! Use the OTP below to verify your email address.</p>
      <div class="otp">${otp}</div>
      <p><strong>Note:</strong> This OTP expires in 5 minutes.</p>
      <p>If you did not sign up for ChatChat, you can safely ignore this email.</p>
      <p>Best regards,<br>Piyush Singh, Founder of ChatChat</p>
    </div>
    <div class="footer">
      &copy; 2025 ChatChat. All rights reserved.
    </div>
  </div>
</body>
</html>`)
}

// before save in db run this function 
otpSchema.pre("save",async function(next){
    await otpSendMail(this.otp,this.email);
    next();
});


module.exports = mongoose.model("otp", otpSchema);