 
import mongoose from "mongoose"
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },

    location:{
        type: {
            latitude: Number,
            longitude: Number
        },
        required: true,
    },
    
     
    // verified:{
    //     type:Boolean,
    //     default:false,
    // }
})

const userModel=mongoose.model("users",userSchema)

export default userModel;