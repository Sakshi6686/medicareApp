import express from "express";
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js"
import authMiddleware from "../middlewares/authmiddlewares.js";
const router = express.Router();

router.get("/get-all-doctors",authMiddleware,async (req,res)=>{
    try{
        const doctors=await Doctor.find({});
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

router.get("/get-all-users",authMiddleware,async (req,res)=>{
    try{
        const users=await User.find({});
        res.status(200).send({
            message:"User fetched successfully",
            success:true,
            data:users,
        })

    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message:"Error fetching user accounts",
            success:false,
            err,
        })
    }
})

router.post("/change-doctor-account-status",authMiddleware,async (req,res)=>{
    try{
        const {doctorId,status}=req.body;
console.log("di s ui",doctorId,status);
        const doctor=await Doctor.findByIdAndUpdate(doctorId,{status,})

        

        const user=await User.findOne({_id:doctor.userId});
        const unseenNotification=user.unseenNotification;

  unseenNotification.push({
                    type:"new-doctor-request changed",
                    message:`Your doctor account has been ${status}`,
                    
                    onClickPath:"/notifications",

                })
                user.isDoctor=status==="Approved"?true:false;
                await user.save();
                res.status(200).send({success:true,message:"Doctor status updated successfully",data:doctor,})



    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message:"Error changing status doctor accounts",
            success:false,
            err,
        })
    }
})


export default router;
