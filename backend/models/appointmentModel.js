import mongoose from "mongoose"
const appointmentSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    doctorId:{
        type:String,
        required:true,
    },
    userId:{
        type:Object,
        required:true,
    },
    doctorInfo:{
        type:Object,
        required:true,
    },
 date:{
        type:String,
        required:true,
    }, 
    time:{
        type:String,
        required:true,
    },
   status:{
        type:String,
        required:true,
        default:"pending"
    },
},
{
    timestamps:true,
}
)

const appointmentModel= mongoose.model("appointment",appointmentSchema)

export default appointmentModel;