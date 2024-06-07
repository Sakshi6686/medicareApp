import React, { useState, useEffect } from 'react';
import Layout from '../component/layout';
import 'antd/dist/antd.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertSlice';
import DoctorForm from '../component/DoctorForm';
import moment from 'moment';

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location: ", error);
      }
    );
  }, []);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      console.log("loc",location);
      if (location) {
        const res = await axios.post("/api/user/apply-doctor-account", 
          { 
            ...values, 
            userId: user._id, 
            timings: [moment(values.timings[0]).format("HH:mm"), moment(values.timings[1]).format("HH:mm")],
            location 
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("loc2",location);
        dispatch(hideLoading());
        
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/home");
        } else {
          toast.error(res.data.message);
        }
      } else {
        
        toast.error("Location data is not available. Please allow location access.");
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <h1 className='page-title'>Apply Doctor</h1>
      <hr />
      <DoctorForm onFinish={onFinish} />
    </Layout>
  );
};

export default ApplyDoctor;
