 
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
    isDoctor:{
        type:Boolean,
        default:false,
    },
    
    isAdmin:{
        type:Boolean,
        default:false,
    },
    seenNotification:{
        type:Array,
        default:[],
    },
    unseenNotification:{
        type:Array,
        default:[],
    },
     
}
,
{timestamps:true,}
)

const userModel=mongoose.model("users",userSchema)

export default userModel;