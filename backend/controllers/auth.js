//otpSave API function

const OTP = require("../models/otp"); // otp schema
const User = require("../models/user"); // user schema
const otpGenerator = require("otp-generator");// package for otp generation
const bcrypt = require("bcrypt"); //. for hashing password
const jwt = require("jsonwebtoken"); // token for the frontend
exports.otpSave = async(req,res)=>
    {
    try {
        //fetch email
        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                success : false,
                message : "Something went wrong while fetching email",
            });
        }
        // check if acount exists already
        const userExist = await User.findOne({email});


        if(userExist){
            return res.status(400).json({
                success : false,
                message : "User already exists!",

            });
        }


        // generate otp of 4 digits
         const otp = otpGenerator.generate(4,{
            lowerCaseAlphabets : false,
            upperCaseAlphabets : false,
            specialChars : false,
         });


         //  a variable and save in db
         const newOtp = await OTP.create({
            otp : otp,
            email : email,
         });


         // return response about otp sent.
         return res.status(200).json({
            success : true,
            message : "Check for OTP in your email",
            newOtp : newOtp,
         });

    }
     catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Internal server issue"
        });

    }
}

//signup function
exports.signUp = async(req,res)=>{
    try {
        //fetch data
        const {userName,email,password,otp} = req.body;
        // validate 
        // data entry?
        if(!userName || !password){
            return res.status(400).json({
                success : false,
                message : " Fill all the Fields",
            })
        }
        // user already exists
        const userExists = await User.findOne({email : email});
        if(userExists)
        {
            return res.status(400).json({
                success : false,
                message : "Email  already used for an account",
            })
        }

        const latestOtp = await OTP.findOne({email : email}).sort({createdAt: -1});
        
        if(!latestOtp)
        {
            return res.status(404).json({
                success : false,
                message : " OTP not Found",
            })
        }
        if(latestOtp.otp !== otp)
        {
            return res.status(400).json({
                success : false,
                message : " OTP didn't match",
            })
        }
        
        
        const hashPass = await bcrypt.hash(password,10);
        const newUser = await User.create({
            userName : userName,
            email : email,
            password : hashPass,
        })
    return res.status(200).json({
        success : true,
        message : "Account created Succesfully",
    })
        


    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
        success : false,
        message : "Internal Server Issue",
    })
}
}

//login function
exports.logIn = async(req,res)=>{
    try {
        //fetch data from the request body
        const {email,password} = req.body;
        if(!email || ! password)
        {
            return res.status(400).json({
                success : false,
                message : "email or password not found!"
            })
        }
        // validate user account
        const user = await User.findOne({email : email});
        if(!user){
            return res.status(400).json({
                success : false,
                message : "Account not found !"
            })
        }
        const payload = {
            userId : user._id,
            userName : user.userName,
            email : user.email,

        }


        // validate password
        if(await bcrypt.compare(password,user.password))
        {

            // make token and send to frontend
        const token = jwt.sign(payload,process.env.JWT_SECRETKEY,{expiresIn:"7d"});
        user.password = undefined; //security...
        return res.status(200).json({
            success : true,
            message : "Logged In Successfully !",
            user : user,
            token : token,


        })

        }
        else{
            return res.status(403).json({
                success : false,
                message : "password didn't match !"
            })
        }
    } catch (error) 
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "error with Server !"
        })
    }
}