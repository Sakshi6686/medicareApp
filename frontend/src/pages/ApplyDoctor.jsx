import React from 'react'
import Layout from '../component/layout'
import 'antd/dist/antd.css'

import toast from 'react-hot-toast';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertSlice';
import DoctorForm from '../component/DoctorForm';
import moment from 'moment';

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user)
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/user/apply-doctor-account", { ...values, userId: user._id, timings: [moment(values.timings[0]).format("HH:mm"), moment(values.timings[1]).format("HH:mm")] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success(res.data.message)
        navigate("/home")
      }
      else {
        toast.error(res.data.message)
      }


    }
    catch (err) {
      dispatch(hideLoading());
      toast.error("Something went wrong")
      // toast.error(err)


    }
  }

  return (
    <Layout>
      <h1 className='page-title'>Apply Doctor</h1>
      <hr />
      <DoctorForm onFinish={onFinish} />


    </Layout>
  )
}

export default ApplyDoctor;
