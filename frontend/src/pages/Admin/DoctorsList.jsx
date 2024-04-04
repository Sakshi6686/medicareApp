import React, { useEffect, useState } from 'react'
import Layout from '../../component/layout'
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertSlice';
import axios from 'axios';
import { Table } from 'antd';
import moment from "moment"
import toast from "react-hot-toast";

const DoctorsList = () => {
    const [doctors,setDoctors]=useState([]);
const dispatch=useDispatch();


const getDoctorData=async()=>{
    try{
        dispatch(showLoading());
        const res=await axios.get("/api/admin/get-all-doctors",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        dispatch(hideLoading());
        if(res.data.success){
            console.log("doctor list",res.data.data);
            setDoctors(res.data.data);
        }

    }
    catch(err){
dispatch(hideLoading());
    }
}

const changeDoctorStatus=async(record,status)=>{
            try{
                dispatch(showLoading());
                const res=await axios.post("/api/admin/change-doctor-account-status",{doctorId:record._id,userId:record.userId,status:status},
                {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`,
                },
            })
            dispatch(hideLoading());
            if(res.data.success){
           getDoctorData();
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
        getDoctorData()
    },[])

    const columns=[
        {
          title: "Name",
          dataIndex:"name",
          render:(text,record)=><span>{record.firstName} {record.lastName}</span>

        },
           {
            title: "Phone",
            dataIndex:"phoneNumber",
  
          },
          {
            title: "Created At",
            dataIndex:"createdAt",
            render:(record,text)=>moment(record.createdAt).format("DD-MM-YYYY")
  
          },
          {
            title: "Status",
            dataIndex:"status",
  
          },
          {
            title: "Actions",
            dataIndex:"actions",
            render:(text,record)=>
                <div className="d-flex">
                   {record.status==="pending" && <h1 className='anchor' onClick={changeDoctorStatus.bind(null, record, "Approved")}>Approved</h1>}
                   {record.status==="approved" && <h1 className='anchor'  onClick={changeDoctorStatus.bind(null, record, "Blocked")}>Block</h1>}
                </div>
            
  
          },
    ]
  return (
    <Layout>
    <h1 className='page-header'>Users List</h1>
    <hr/>
    <Table columns={columns} dataSource={doctors}></Table>
  </Layout>
  )
}

export default DoctorsList
