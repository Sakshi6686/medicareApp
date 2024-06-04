 
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
    isEmailVerified:{
        type:Boolean,
        default:false,
    }
     
}
,
{timestamps:true,}
)

const userModel=mongoose.model("users",userSchema)

export default userModel;