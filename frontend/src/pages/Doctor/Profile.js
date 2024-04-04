import React from 'react'
import Layout from '../../component/layout'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertSlice';
import DoctorForm from '../../component/DoctorForm';
import { setUser } from '../../redux/userSlice';
import moment from "moment"



const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user)
  console.log("user in doctor profile",user);
  const params = useParams();
   // const {userId}=useParams()
  const [doctor, setDoctor] = useState();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/doctor/update-doctor-profile", { ...values, userId: user._id, timings: [moment(values.timings[0]).format("HH:mm"), moment(values.timings[1]).format("HH:mm")] },
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

  const getDoctorData = async () => {

    try {
      dispatch(showLoading());
      const res = await axios.post("/api/doctor/get-doctor-info-by-user-id", { userId: params.userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      dispatch(hideLoading())
      if (res.data.success) {
        setDoctor(res.data.data)

      }


    }
    catch (err) {
      dispatch(hideLoading())

    }

  }
  useEffect(() => {

    getDoctorData();

  }, [])

  return (
    <Layout>
      <h1 className="page-title">Doctor Profile</h1>
      <hr />
      {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor} />}
    </Layout>
  )
}

export default Profile
