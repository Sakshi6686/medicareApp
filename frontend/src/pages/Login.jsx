// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
 

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(showLoading());
      const res = await axios.post('api/user/login', formData);
      dispatch(hideLoading());

      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem('token', res.data.data);
        navigate('/home');
      } else {
        toast.error(res.data.message);
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
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <h2 className="text-center">Sign In</h2>
            </div>
            <div className="mb-3">
              <input name="email" type="email" className="form-control" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <input name="password" type="password" className="form-control" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </div>
            <div className="text-center">
              <a href="/forgotpassword">Forgot Password</a> | <a href="/register">Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
