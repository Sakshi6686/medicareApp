import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertSlice';
import "../styles/authentication.css"
const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
 const url="https://medicareapp-backend.onrender.com"
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please enter new password and confirm password');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      dispatch(showLoading());
      const res = await axios.post(url+`/api/user/resetpassword/${token}`, { newPassword, confirmPassword });
      dispatch(hideLoading());

      if (res.data.message) {
        toast.success(res.data.message);
        navigate('/login');
      } else {
        toast.error('Failed to reset password');
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
        <form onSubmit={handleResetPassword}>
          <h2>Reset Password</h2>
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control" 
              placeholder="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary w-100">Reset Password</button>
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

export default ResetPassword;
