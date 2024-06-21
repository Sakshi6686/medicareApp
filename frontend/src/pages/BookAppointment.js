import React from 'react'
import Layout from '../component/layout'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertSlice';
import DoctorForm from '../component/DoctorForm';
import { setUser } from '../redux/userSlice';
import moment from "moment"
import { Row,Col, DatePicker, TimePicker, Button } from 'antd';
 
 

const BookAppointment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user)
    
    const params = useParams();
    const [doctor, setDoctor] = useState(null);
    const [isAvailable,setIsAvailable]=useState(false);
    const [date,setDate]=useState(null);
    const [time,setTime]=useState(null);
    const [isBooked,setIsBooked]=useState(false);

    const bookNow=async()=>{
        try {
            dispatch(showLoading());
            console.log("usr",user);
            const res = await axios.post("/api/user/book-appointment", { doctorId: params.doctorId,doctorInfo:doctor,userInfo:user,date:date,time:time },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              console.log(res.data);
            dispatch(hideLoading())
            if (res.data.success) {
              setIsBooked(true);
             toast.success(res.data.message);
              
      
            }
      
      
          }
          catch (err) {
            console.log(err);
            toast.error("Error booking appointment")
            dispatch(hideLoading())
      
          }
    }

    const checkAvailability=async()=>{
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/user/check-booking-availability", { doctorId: params.doctorId,date:date,time:time },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              console.log(res.data);
            dispatch(hideLoading())
            if (res.data.success) {
                setIsAvailable(true)
             toast.success(res.data.message);
      
            }
            else{
                toast.error(res.data.message);
            }
      
      
          }
          catch (err) {
            console.log(err);
            toast.error("Error booking appointment")
            dispatch(hideLoading())
      
          }
    }

  const getDoctorData = async () => {

    try {
      dispatch(showLoading());
      const res = await axios.post("/api/doctor/get-doctor-info-by-id", { doctorId: params.doctorId },
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
   {doctor &&  (
    
    <div><h1 className="page-title">{doctor.firstName} {doctor.lastName}</h1>
    <hr />
   
   <Row gutter={20} className='mt-5' align="middle">
   <Col span={12} sm={24} xs={24} lg={8}>


<img src="https://media.istockphoto.com/id/1452772009/vector/book-now-button-with-cursor-pointer-click-vector-web-button.jpg?s=612x612&w=0&k=20&c=VNgrmxMVFaQjRzKYihiZKXqHUanMukhU1XryEex-Za8=" alt="" height="100%" width="400" />


 
    </Col>
    <Col span={12} sm={24} xs={24} lg={8}>
    <h1 className="normal-text"><b>Timings :</b>{doctor.timings[0]}-{doctor.timings[1]}</h1>
     
    <p  ><b>Phone Number: </b>{doctor.phoneNumber}</p>
<p  ><b>Address: </b>{doctor.address}</p>
<p  ><b>Fee per visit: </b>{doctor.feePerConsultation}</p>
<p  ><b>Website: </b>{doctor.website}</p>
<p  ><b>Speciality: </b>{doctor.specialization}</p>
<div className='d-flex flex-column pt-2 mt-2'>

    <DatePicker format="DD-MM-YYYY"  onChange={(value)=>{
        setIsAvailable(false)
        setDate(moment(value).format("DD-MM-YYYY"))}}/>
    <TimePicker format="HH:mm" className='mt-3' onChange={(value)=>{
        setIsAvailable(false)
        setTime(moment(value).format("HH:mm"),
    )}} />
   
    {!isAvailable && (<Button className='primary-button mt-3 full-width-button' onClick={checkAvailability}>Check Availability</Button>)}
    
    {isAvailable && (<Button className='primary-button mt-3 full-width-button' onClick={bookNow}>Book Now</Button>)}
   

</div>
    </Col>

    
   </Row>
    
    </div>
   )}
    
   </Layout>
  )
}

export default BookAppointment
