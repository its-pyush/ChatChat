// function to send mail
const nodemailer = require("nodemailer");
exports.sendMail = async(email,subject,body)=>{
    try {
        const transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            auth : 
            {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS,
            }
        });
        let info = transporter.sendMail({
            from : "chatchat",
            to : email,
            subject : subject,
            html : body,  
        });
        return info;
    } catch (error) {
        console.log("Error during sending email",error);
    }
}
