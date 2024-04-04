import React, { useEffect, useState } from 'react'
import Layout from '../../component/layout'
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertSlice';
import axios from 'axios';
import { Table } from 'antd';

import toast from "react-hot-toast";
import moment from 'moment';
const  DoctorAppointments = () => {
  const { user } = useSelector((state) => state.user)
  const [appointments,setAppointments]=useState([]);
  const dispatch=useDispatch();
  
  
  const getAppointmentsData=async()=>{
      try{
          dispatch(showLoading());
          const res=await axios.get("/api/doctor/get-appointments-doctor-user-id",{
              headers:{
                  Authorization:`Bearer ${localStorage.getItem("token")}`
              }
          })
          dispatch(hideLoading());
          if(res.data.success){
              console.log("doctor list",res.data.data);
              setAppointments(res.data.data);
          }
  
      }
      catch(err){
  dispatch(hideLoading());
      }
  }

  const changeAppointmentStatus=async(record,status)=>{
    try{
        dispatch(showLoading());
        const res=await axios.post("/api/doctor/change-appointment-status",{appointmentId:record._id,status:status, },
        {
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`,
        },
    })
    dispatch(hideLoading());
    if(res.data.success){
      getAppointmentsData();
   toast.success(res.data.message);
    }
    else{
        console.log(res.data.message);
    }
    
    }
    catch(err){
        console.log(err);
        toast.error("Error changing the doctor status");
        dispatch(hideLoading());
    }
}



  useEffect(()=>{
    getAppointmentsData()
},[])

const columns=[
  {
    title: "id",
    dataIndex:"_id",
   
  },
  {
    title: "Patient",
    dataIndex:"name",
    render:(text,record)=><span>{user.username}</span>

  },
     {
      title: "Phone",
      dataIndex:"phoneNumber",
      render:(text,record)=><span>{record.doctorInfo.phoneNumber}</span>

    },
    {
      title: "Date & Time",
      dataIndex:"createdAt",
      render:(text,record)=><span>
      {moment(record.date).format("DD-MM-YYYY")} { moment(record.time).format("HH:mm")}
      </span>

    },
    {
      title: "Status",
      dataIndex:"status",

    }
    ,
          {
            title: "Actions",
            dataIndex:"actions",
            render:(text,record)=>
         
                <div className="d-flex">
                   {record.status==="pending" &&( 
                    <div className="d-flex ">
                    <h1 className='anchor px-2' onClick={changeAppointmentStatus.bind(null, record, "Approved")}>Approve</h1>
                   <h1 className='anchor'  onClick={changeAppointmentStatus.bind(null, record, "Rejected")}>Reject</h1>
                   </div>
                   )
                  
                   }
                   
                  
                </div>
            
  
          },
   
]
  return (
    <Layout>
    <h1 className='page-header'>Appointments</h1>
    <hr />
    <Table columns={columns} dataSource={appointments}></Table>
  </Layout>
  )
}

export default DoctorAppointments
