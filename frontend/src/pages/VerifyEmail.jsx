import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertSlice';
import "../styles/authentication.css"

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();  
 const url="https://medicareapp-backend.onrender.com"
  useEffect(() => {
    console.log("id:", id);  
  }, [id]);  

  const handleVerify = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(url+`/api/user/verifyemail/${id}`);
      dispatch(hideLoading());

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Something went wrong!');
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return (
    <div className="authentication-page">
    <div className="fullscreen-center">
      <div className="card-fixed">
        <h2>Verifying Email</h2>
        
      </div>
    </div>
</div>
  );
};

export default VerifyEmail;
