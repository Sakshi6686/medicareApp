import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertSlice';
import "../styles/authentication.css"
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url="https://medicareapp-backend.onrender.com"
  const [email, setEmail] = useState('');
 

  const handleEmail = async (e) => {
    e.preventDefault();

    if (!email ) {
      toast.error('Please enter the email');
      return;
    }

     

    try {
      dispatch(showLoading());
      const res = await axios.post(url+`/api/user/forgotpassword`, { email });
      dispatch(hideLoading());

      if (res.data.message) {
        toast.success(res.data.message);
        console.log(res.data.message);
        
      }  
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="authentication-page">
    <div className="fullscreen-center">
      <div className="card-fixed">
        <form onSubmit={handleEmail}>
          <h2>Enter Your Email</h2>
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="mb-3">
            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </div>
        </form>
        <div className="text-center">
          <span>Remember your password? </span>
          <a href="/login">Sign in</a>
          <span> or </span>
          <a href="/register">Sign up</a>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
