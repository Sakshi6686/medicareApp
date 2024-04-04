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
import Appointment from "../models/appointmentModel.js";
import moment from "moment"
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

router.post("/apply-doctor-account",authMiddleware,async (req,res)=>{
    try{
        const existingDoctor = await Doctor.findOne({ userId: req.body.userId });
        console.log(existingDoctor);
        if (existingDoctor) {
            return res.status(200).json({ success:false,message:"A Doctor with this account already exist"});
        }

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
                    onClickPath:"/admin/doctorslist"

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

router.get("/get-near-by-doctors",authMiddleware,async(req,res)=>{
   // const { latitude, longitude } = req.body;
    const latitude=  37.7833
  
    const longitude=   -122.4167
    const radius = 5000; // Specify the search radius in meters (max: 50000 meters)
  
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${latitude},${longitude}`,
          radius: radius,
          type: 'doctor',
          key: 'YOUR_GOOGLE_API_KEY', // Replace with your actual Google API key
        },
      });
  
      // Filter places to include only those with type 'doctor'
      const nearbyDoctors = response.data.results.filter(place =>
        place.types.includes('doctor')
      );
  console.log(nearbyDoctors);
     // res.json({ nearbyDoctors });
    } catch (error) {
      console.error('Error searching for nearby doctors:', error);
      res.status(500).json({ error: 'An error occurred while searching for nearby doctors.' });
    }
})

export default router;