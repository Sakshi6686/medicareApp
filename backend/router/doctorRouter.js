import express from "express";

import Doctor from "../models/doctorModel.js";
import authMiddleware from "../middlewares/authMiddlewares.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
const router=express.Router();

router.post("/get-doctor-info-by-user-id", authMiddleware, async (req,res) => {
    try {
        
         const doctor = await Doctor.findOne({userId:req.body.userId});
        
         res.status(200).send({
            message:"Doctor info fetched successfully",
            success:true,
            data:doctor,
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Error getting the doctor info", success: false });
    }
})


router.post("/update-doctor-profile", authMiddleware, async (req,res) => {
    try {
        
         const doctor = await Doctor.findOneAndUpdate({userId:req.body.userId},req.body);
        
         res.status(200).send({
            message:"Doctor profile updated successfully",
            success:true,
            data:doctor,
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Error getting the doctor info", success: false });
    }
})


router.post("/get-doctor-info-by-id", authMiddleware, async (req,res) => {
    try {
        
         const doctor = await Doctor.findOne({_id:req.body.doctorId});
        
         res.status(200).send({
            message:"Doctor info fetched successfully",
            success:true,
            data:doctor,
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Error getting the doctor info", success: false });
    }
})


router.get("/get-appointments-doctor-user-id",authMiddleware,async (req,res)=>{
    try{

        const doctor=await Doctor.findOne({userId:req.body.userId})
        const appointments=await Appointment.find({doctorId:doctor._id});
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

router.post("/change-appointment-status",authMiddleware,async (req,res)=>{
    try{
        const {appointmentId,status}=req.body;
 
        const appointment=await Appointment.findByIdAndUpdate(appointmentId,{status,})

        

        const user=await User.findOne({_id:appointment.userId});
        const unseenNotification=user.unseenNotification;

  unseenNotification.push({
                    type:"appointment-status-changed",
                    message:`Your status has been ${status}`,
                    
                    onClickPath:"/appointments",

                })
              
                await user.save();
                res.status(200).send({success:true,message:"Appointment status changed successfully"})



    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message:"Error changing the Appointment status",
            success:false,
            err,
        })
    }
})

router.post('/search', async (req, res) => {
    console.log("dhs");
    const { searchSpeciality, latitude, longitude, radius = 5000000 } = req.body;
  console.log("hsh");
  console.log(searchSpeciality, latitude, longitude);
    if (!searchSpeciality || !latitude || !longitude) {
      return res.status(400).json({ message: 'searchSpeciality, latitude, and longitude are required' });
    }
  console.log("hi");
    try { 
      const doctors = await Doctor.find({
        specialization: new RegExp(searchSpeciality, 'i'),
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: parseFloat(radius),
          },
        },
      });
  console.log(doctors);
      res.json({ doctors });
    } catch (error) {
      console.error('Error searching doctors:', error);
      res.status(500).json({ message: 'Error searching doctors', error });
    }
  });

export default router;