import express from "express";
import User from "../models/userModel.js";
import { getToken } from "../utils/helper.js";
import bcrypt from "bcrypt";
import verifyEmail from "../utils/verifyEmail.js";
import Token from "../models/Token.js";
import crypto from "crypto"
const router = express.Router();

router.post("/register",async(req,res) =>{
    try{
    const{username,email,password,confirmPassword,location}=req.body;
        console.log("data recieved");
    if(!username||!email||!password||!confirmPassword||!location){
        return res.status(400).json({err:"Invalid request body"});
    }
    console.log("yeah");
    const existingUser=await User.findOne({email:email});
    if(existingUser){
        return res.status(402).json({err:"A user with this email already exist"});
    }


    const hashedPassword=await bcrypt.hash(password,10);
    const newUserDetails={
        username,
        email,
         password:hashedPassword,
      location,
       
         
     };
    console.log(newUserDetails);
   
   
    const newUser=await User.create(newUserDetails);
    const token=await getToken(email,newUser);
console.log("user createdd",newUser);
  

    // const userToReturn = {
    //     _id: newUser._id,
    //     username: newUser.username,
    //     email: newUser.email,
       
    //     token: token,
    // };

    // delete userToReturn.password;
    // const tokenEmail=new Token({
    //     userId:newUser.id,
    //     token:crypto.randomBytes(16).toString("hex"),
    // })
//console.log(tokenEmail);
    

    // const link=`http://localhost:3000//api/user/confirm/${tokenEmail.token}`;
    // const  verification =await verifyEmail(email,link);
    // if(verification.success){
    //     return res.status(200).send({message:"Email sent ,check your mail",success:true});
    // }
    // else{
    //     return res.status(200).send({message:verification.message,success:false});
    // }
    
   

//     console.log("returning user");
//    // console.log(userToReturn);
   return res.status(200).send({message:"user created successfully",success:true});
    }
    catch(err){
console.log(err);
    }
})

// router.post("confirm/:token",async (req,res)=>{
//     try{
//         const token=await Token.findOne({
//             token:req.params.token,
//         })
//         console.log(token);
//         await User.updateOne({_id:token.userId},{$set:{verified:true}});
//         await Token.findByIdAndRemove(token._id);
//         res.send("email verified");
//     }
//     catch(error){
//         res.status(400).send("an error occured");
//     }
// }
// )
router.post("/login",async (req,res)=>{

    const {email,password}=req.body;
    
    console.log(req.body);
    if(!email||!password){
        return res.status(401).json({err:"Invalid email or password"});
    }
    const user=await User.findOne({email:email});

    if(!user){
        return res.status(200).send({ message:"user does not exist", success:false});
    }


    const isPasswordValid=await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(200).send({ message:"password is incorrect", success:false});
    }

    const token=await getToken(email,user);

    //const  userToReturn={...user.toJSON(),token};
    // const userToReturn = {
    //     _id: user._id,
    //     username: user.username,
    //     email: user.email,
       
    //     token: token,
    // };

   // delete userToReturn.password;
    //console.log(userToReturn);

    return res.status(200).send({message:"login successful", success:true,token});
    


})


export default router;