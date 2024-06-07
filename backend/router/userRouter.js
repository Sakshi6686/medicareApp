import express from "express";
import User from "../models/userModel.js";
import { getToken, sendVerifyEmail, sendResetPasswordEmail } from "../utils/helper.js";
 
import bcrypt from "bcrypt";
 
import jwt from "jsonwebtoken";
 
import crypto from "crypto"
import Doctor from "../models/doctorModel.js"
import authMiddleware from "../middlewares/authMiddlewares.js";
import { rootCertificates } from "tls";
import { log } from "console";
import Appointment from "../models/appointmentModel.js";
import moment from "moment"
import axios from "axios"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        console.log("data recieved");
        if (!username || !email || !password || !confirmPassword ) {
            return res.status(400).json({ err: "Invalid request body" });
        }
        console.log("yeah");
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ err: "A user with this email already exist" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserDetails = {
            username,
            email,
            password: hashedPassword,
         


        };
        //console.log(newUserDetails);


        const newUser = await User.create(newUserDetails);
        console.log(`user id in reg back ${newUser._id}`);
                if(newUser){
                  await sendVerifyEmail(username,email,newUser._id)
                    res.status(200).send({ message: "user created successfully", success: true });
                }
                else{
                    res.status(200).send({ message: "user registration failed", success: false });
                }
        
         
    }
    catch (err) {
        console.log(err);
    }
})

router.post("/verifyemail/:id",async (req,res)=>{
    try{
        console.log(`user id in router get ${req.params.id}`);
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { isEmailVerified: true } },
            { new: true } // This option returns the modified document
          );
            console.log(updatedUser);
        console.log(`email verified and userUpdated ${updatedUser}`);
        return res.status(200).send({ message: "Email verified successfully", success: true });
    }
    catch(e){
        console.log(e.message);
        return res.status(500).json({ err: "Internal server error" });
    }
})



router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        console.log(req.body);
        if (!email || !password) {
            return res.status(401).json({ err: "Invalid email or password" });
        }
        const user = await User.findOne({ email: email });
        console.log(user);

        if (!user) {
            return res.status(200).send({ message: "user does not exist", success: false });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(200).send({ message: "password is incorrect", success: false });
        }

        const token = await getToken(email, user);
        console.log(token);

         

        return res.status(200).send({ message: "login successful", success: true, data:token });

    } catch (err) {
        console.log(err);
    }

})

router.post("/forgotpassword", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ err: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).send({ message: "this email does not exit", success: false });
        }

        const token = await getToken(email, user);
        console.log(`token in fp ${token}`);
       
        const resetLink = `http://localhost:3000/resetpassword/${token}`;  
        await sendResetPasswordEmail(user.username, email, resetLink);

        return res.status(200).send({ message: "Password reset link sent to your email",success:true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: "Internal server error" });
    }
});
router.post("/resetpassword/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ err: "New password and confirm password are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ err: "Passwords do not match" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ err: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: "Internal server error" });
    }
});




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
                success: true, data: 
                      user 
                
                ,
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Error getting the user info", success: false });
    }
})

router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
    try {
        const existingDoctor = await Doctor.findOne({ userId: req.body.userId });
        if (existingDoctor) {
            return res.status(200).json({ success: false, message: "A Doctor with this account already exists" });
        }
           
        const { location, ...doctorData } = req.body;
      

        const longitude=location.longitude;
        const latitude=location.latitude;
        console.log("lati, longi",longitude,latitude);
        const newDoctor = new Doctor({ ...doctorData, location: { type: "Point", coordinates: [longitude, latitude] }, status: "pending" });

        await newDoctor.save();

        const adminUser = await User.findOne({ isAdmin: true });
        const unseenNotification = adminUser.unseenNotification;
        unseenNotification.push({
            type: "new-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newDoctor.id,
                name: `${newDoctor.firstName} ${newDoctor.lastName}`,
            },
            onClickPath: "/admin/doctorslist",
        });
        await User.findByIdAndUpdate(adminUser.id, { unseenNotification });

        res.status(200).json({ success: true, message: "Doctor account applied successfully" });
    } catch (err) {
        console.error("Error applying doctor account: ", err);
        res.status(500).json({ message: "Error applying doctor account", success: false, err });
    }
});

  


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


router.get("/get-all-approved-doctors",authMiddleware,async (req,res)=>{
    try{
        const doctors=await Doctor.find({status:"Approved"});
        res.status(200).send({
            message:"Doctors fetched successfully",
            success:true,
            data:doctors,
        })

    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message:"Error fetching doctors accounts",
            success:false,
            err,
        })
    }
})


router.post("/book-appointment",authMiddleware,async (req,res)=>{
    try{
        console.log("in book");
       req.body.status="pending";
        req.body.date=moment(req.body.date,"DD-MM-YYYY").toISOString()
        req.body.time=moment(req.body.time,"HH:mm").toISOString()
        console.log("usriNfo",req.body.userInfo);
        const newAppointment = new Appointment({
            ...req.body, // Spread the request body
            userInfo: req.body.userInfo // Include userInfo separately
        });
            await newAppointment.save();
            console.log(newAppointment);
            const user=await User.findOne({_id:req.body.doctorInfo.userId})
            user.unseenNotification.push({
                type:"new-appointment-request",
                message:`A new appointment request has been made by ${req.body.userInfo.username}`,
                onClickPath:"/doctor/appointments"
            }
                
            )
            await user.save();
            res.status(200).send({
                message:"appointment booked successfully",
                success:true,
            })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message:"Error booking appointment",
            success:false,
            err,
        })
    }
})


router.post("/check-booking-availability",authMiddleware,async (req,res)=>{
    try{
         const date=moment(req.body.date,"DD-MM-YYYY").toISOString();
         const fromTime=moment(req.body.time,"HH:mm").subtract(1,"hours").toISOString();
         const toTime=moment(req.body.time,"HH:mm").add(1,"hours").toISOString();
         const doctorId=req.body.doctorId;

         console.log(doctorId,date,fromTime,toTime);
         const appointments=await Appointment.find({
            doctorId,
            date,
            time:{$gte:fromTime,$lte:toTime},
          

         })
         console.log("appoint",appointments);
         if(appointments.length>0){
            return res.status(200).send({
                message:"Appointments is not available ",
                success:false,
            })
         }
         else{
            return res.status(200).send({
                message:"Appointments is available ",
                success:true,
            })
         }
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message:"Error booking appointment",
            success:false,
            err,
        })
    }
})


router.get("/get-appointments-by-user-id",authMiddleware,async (req,res)=>{
    try{
        const appointments=await Appointment.find({userId:req.body.userId});
        res.status(200).send({
            message:"appointments fetched successfully",
            success:true,
            data:appointments,
        })

    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message:"Error getting appointments",
            success:false,
            err,
        })
    }
})
 


  

export default router;