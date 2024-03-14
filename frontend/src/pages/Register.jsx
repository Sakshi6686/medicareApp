 
import React ,{useState} from 'react'
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom';
 
 
const Register = () => {
   const navigate=useNavigate();
   const [locationErr, setLocationErr] = useState(false);
    const [location,setLocation]=useState({
        latitude:"",
        longitude:"",
    })
    const getLocaion = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({latitude:pos.coords.latitude,longitude:pos.coords.longitude})
                    console.log('User location:', pos.coords.latitude, pos.coords.longitude);
                },
                (err) => {
                  
                    console.error('Error getting user location:', err);
                    setLocationErr(true);
                }
            );
        }
    }
    const onFinish=async (e)=>{
        e.preventDefault();
        getLocaion();
        if (locationErr) {
            window.location.reload();
        }
        const formData = new FormData(e.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        console.log("Received form data:", formDataObject);
        if (formDataObject.password !== formDataObject.confirmPassword) {
            console.error('Error: Passwords do not match');
            return; 
        }
        formDataObject["location"] = location ;

        console.log(formDataObject);

        try {
            const res=await axios.post("api/user/register",formDataObject)
console.log(res.data);
            if(res.data.success){
                toast.success(res.data.message)
                console.log(res.data.message);
                toast("redirecting to login page")
                navigate("/login")
            }
            else{
                console.log(res.data.message);
                toast.error(res.data.message)
            }

        }
        catch(err){
            
                toast.error("something went wrong")
        }
    }
  return (
    <div>
        
        <div className="authenticationContainer">
       <form onSubmit={onFinish} >
       <div className="authentication">
                <h2>Sign Up</h2>
                <div className="inputBox">
                    <input name="username" type="text" placeholder="Username"/>
                </div>
                <div className="inputBox">
                    <input name="email" type="email" placeholder="Email"/>
                </div>
                <div className="inputBox">
                    <input name="password" type="password" placeholder="Password"/>
                </div>
                <div className="inputBox">
                    <input name="confirmPassword" type="password" placeholder="confirmPassword"/>
                </div>
                
                <div className="inputBox">
 
                     <button   type="submit" value="Register" id="btn">Submit</button>
                </div>
                <div className="group">
                    <a href="/login" >Sign in</a>
                    
                </div>
            </div>
       </form>
            
            
        </div>
    
    </div>
  )
}

export default Register
