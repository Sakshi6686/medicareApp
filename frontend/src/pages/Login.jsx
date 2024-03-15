import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// import { useSelector,useDispatch } from 'react-redux';

const Login = () => {
    // const {loading}=useSelector(state=>state.alerts)
    // console.log(loading)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = async(e) => {
        setFormData(prevState=>({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };
    const navigate=useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
           
        try {
            console.log("in try");
            console.log(formData);
            const res=await axios.post("api/user/login",formData)
console.log("aftrer axios");
           
            if(res.data.success){
                toast.success(res.data.message)

                toast("redirect to home page")
<<<<<<< HEAD
=======
                localStorage.setItem("token",res.data.data);
>>>>>>> 8335195ade7c031769f8e4c68415dbf47a89acc8
                navigate("/")
            }
            else{
                toast.error(res.data.message);
            }
    
 //console.log(data);

} catch (error) {
console.log(error);
   toast.error("something went wrong!")
}
    };
  return (
    <div className='log'>
       <div className="authenticationContainer">
       <form  onSubmit={handleSubmit}>
       <div className="authentication">
                <h2>Sign In</h2>
                <div className="inputBox">
                    <input name="email"type="email" placeholder="email" value={formData.email} 
                                onChange={handleChange} />
                </div>
                <div className="inputBox">
                    <input name='password' type="password" placeholder="Password" value={formData.password} 
                                onChange={handleChange} />
                </div>
                <div className="inputBox">
 
                     <button type="submit" value="Login" id="btn">Login</button>
                </div>
                <div className="group">
                    <a >Forget Password</a>
                    <a href="/register">Sign Up</a>
                </div>
            </div>
       </form>
            
            
        </div>
    </div>
  )
}

export default Login