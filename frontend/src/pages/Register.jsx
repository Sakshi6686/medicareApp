// Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
 

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
   

   
 const url="https://medicareapp-backend.onrender.com"
  const onFinish = async (e) => {
    e.preventDefault();
     
    const formData = new FormData(e.target);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    console.log('Received form data:', formDataObject);
    if (formDataObject.password !== formDataObject.confirmPassword) {
      console.error('Error: Passwords do not match');
      return;
    }
    

    try {
      dispatch(showLoading());
      const res = await axios.post(url+'api/user/register', formDataObject);
      dispatch(hideLoading());

      if (res.data.success) {
        toast('Please check your email to verify your account');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="authentication-page">
      <div className="fullscreen-center">
        <div className="card-fixed"> 
          <form onSubmit={onFinish}>
            <div className="mb-3">
              <h2 className="text-center">Sign Up</h2>
            </div>
            <div className="mb-3">
              <input name="username" type="text" className="form-control" placeholder="Username" required />
            </div>
            <div className="mb-3">
              <input name="email" type="email" className="form-control" placeholder="Email" required />
            </div>
            <div className="mb-3">
              <input name="password" type="password" className="form-control" placeholder="Password" required />
            </div>
            <div className="mb-3">
              <input name="confirmPassword" type="password" className="form-control" placeholder="Confirm Password" required />
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary w-100">Submit</button>
            </div>
            <div className="text-center">
              <a href="/login">Sign in</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
