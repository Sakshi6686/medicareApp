 
import nodemailer from "nodemailer";
const verifyEmail=async(email,link)=>{
    try{
        let transporter=nodemailer.createTransport(
            {
                service:"Gmail",
                auth:{
                    user:process.env.USER,
                    pass:process.env.PASSWORD,
                },
            }
        );
        let info=await transporter.sendMail({
            from:process.env.USER,
            to:email,
            subject:"Account Verification",
            text:"Welcome",
            html:`<div>
            <a href=${link}>Click here to activate your account </a>
            </div>
            `
        });
        console.log("mail send successfully");
        return res.status(200).send({message:"Email sent ,check your mail",success:true});
    }
    catch(err){
        return res.status(200).send({message:"Email is not valid",success:false});
    }

}
export default verifyEmail;