import React, { useEffect, useState } from 'react'
import Layout from '../component/layout'
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertSlice';
import axios from 'axios';
import { Table } from 'antd';

import toast from "react-hot-toast";
import moment from 'moment';
const Appointments = () => {
  const [appointments,setAppointments]=useState([]);
  const dispatch=useDispatch();
  
   const url="https://medicareapp-backend.onrender.com"
  const getAppointmentsData=async()=>{
      try{
          dispatch(showLoading());
          const res=await axios.get(url+"/api/user/get-appointments-by-user-id",{
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

  useEffect(()=>{
    getAppointmentsData()
},[])

const columns=[
  {
    title: "id",
    dataIndex:"_id",
   
  },
  {
    title: "Doctor",
    dataIndex:"name",
    render:(text,record)=><span>{record.doctorInfo.firstName} {record.doctorInfo.lastName}</span>

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

    },
   
]
  return (
    <Layout>
    <h1 className='page-title'>Appointments</h1>
    <hr/>
    <Table columns={columns} dataSource={appointments}></Table>
  </Layout>
  )
}

export default Appointments
