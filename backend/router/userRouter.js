import express from "express";
import User from "../models/userModel.js";
import  getToken  from "../utils/helper.js";
import bcrypt from "bcrypt";
import verifyEmail from "../utils/verifyEmail.js";
import Token from "../models/Token.js";
import crypto from "crypto"
import Doctor from "../models/doctorModel.js"
import authMiddleware from "../middlewares/authMiddlewares.js";
import { rootCertificates } from "tls";
import { log } from "console";
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, email, password, confirmPassword, location } = req.body;
        console.log("data recieved");
        if (!username || !email || !password || !confirmPassword || !location) {
            return res.status(400).json({ err: "Invalid request body" });
        }
        console.log("yeah");
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(402).json({ err: "A user with this email already exist" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserDetails = {
            username,
            email,
            password: hashedPassword,
            location,


        };
        //console.log(newUserDetails);


        const newUser = await User.create(newUserDetails);
        // const token = await getToken(email, newUser);
        // console.log("user createdd", newUser);


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
        return res.status(200).send({ message: "user created successfully", success: true });
    }
    catch (err) {
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
router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        console.log(req.body);
        if (!email || !password) {
            return res.status(401).json({ err: "Invalid email or password" });
        }
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(200).send({ message: "user does not exist", success: false });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(200).send({ message: "password is incorrect", success: false });
        }

        const token = await getToken(email, user);
        console.log(token);

        //const  userToReturn={...user.toJSON(),token};
        // const userToReturn = {
        //     _id: user._id,
        //     username: user.username,
        //     email: user.email,

        //     token: token,
        // };

        // delete userToReturn.password;
        //console.log(userToReturn);

        return res.status(200).send({ message: "login successful", success: true, data:token });

    } catch (err) {
        console.log(err);
    }

})


router.post("/get-user-info-by-id", authMiddleware, async (req,res) => {
    try {
       // console.log("try get");
         const user = await User.findById(req.body.userId);
        // const user = await User.findById(req.userId);
        user.password=undefined
        console.log(user);
        if (!user) {
          //  console.log("not user get");
            return res.status(200).send({ message: "User does not exist", success: false });
        }
        else {
          //  console.log("in else get-user");


            // console.log(user.username);
            // console.log(user.unseenNotification);
            return res.status(200).send({
                success: true, data: {
                      user 
                },
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Error getting the user info", success: false });
    }
})

router.post("/apply-doctor-account",authMiddleware,async (req,res)=>{
    try{
       

                const newDoctor=new Doctor({...req.body,status:"pending"});
                
                await newDoctor.save();
                const adminUser=await User.findOne({isAdmin:true});
                const unseenNotification=adminUser.unseenNotification
                unseenNotification.push({
                    type:"new-doctor-request",
                    message:`${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
                    data:{
                        doctorId:newDoctor.id,
                        name:newDoctor.firstName + " " +newDoctor.lastName
                    },
                    onClickPath:"/admin/doctors"

                })
                await User.findByIdAndUpdate(adminUser.id,{unseenNotification});
                res.status(200).send({success:true,message:"Doctor account applied successfully"})
    }
    catch (err) {
        console.log(err);
        res.status(500).send({message:"Error applying doctor account",success:false,err})
    }
    
})


router.post("/mark-all-notifications-as-seen",authMiddleware,async (req,res)=>{
    try{
       
        const user=await User.findOne({_id:req.body.userId});
        const unseenNotification=user.unseenNotification;
        const seenNotification=user.seenNotification;
        seenNotification.push(...unseenNotification);
        user.seenNotification==unseenNotification;
        user.unseenNotification=[];
        user.seenNotification=seenNotification;
        const updatedUser = await user.save();
        updatedUser.password=undefined;
        console.log("updateduser in mark all",updatedUser);
        res.status(200).send({
            success:true,
            message:"All notifications have been seen",
            data:{updatedUser},
        })


                
    }
    catch (err) {
        console.log(err);
        res.status(500).send({message:"Error applying doctor account",success:false,err})
    }
    
})



router.post("/delete-all-notifications",authMiddleware,async (req,res)=>{
    try{
       
        const user=await User.findOne({_id:req.body.userId});
        
        user.unseenNotification=[];
        user.seenNotification=[];
        const updatedUser = await user.save();
        updatedUser.password=undefined;
        res.status(200).send({
            success:true,
            message:"All notifications are deleted",
            data:{updatedUser},
        })


                
    }
    catch (err) {
        console.log(err);
        res.status(500).send({message:"Error applying doctor account",success:false,err})
    }
    
})
export default router;