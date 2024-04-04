import React, { useEffect, useState } from 'react'
import Layout from '../../component/layout'
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertSlice';
import axios from 'axios';
import { Table } from 'antd';
import moment from "moment"

const UsersList = () => {

const [users,setUsers]=useState([]);
const dispatch=useDispatch();


const getUserData=async()=>{
    try{
        dispatch(showLoading());
        const res=await axios.get("/api/admin/get-all-users",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        dispatch(hideLoading());
        if(res.data.success){
            console.log("user list",res.data.data);
            setUsers(res.data.data);
        }

    }
    catch(err){
dispatch(hideLoading())
    }
}




    useEffect(()=>{
        getUserData()
    },[])

    const columns=[
        {
          title: "Name",
          dataIndex:"username",

        },
        {
            title: "Email",
            dataIndex:"email",
  
          },  {
            title: "Created At",
            dataIndex:"createdAt",
            render:(record,text)=>moment(record.createdAt).format("DD-MM-YYYY")
  
          },
          {
            title: "Actions",
            dataIndex:"actions",
            render:(text,record)=>
                <div className="d-flex">
                    <h1 className='anchor'>Block</h1>
                </div>
            
  
          },
    ]
  return (
  <Layout>
    <h1 className='page-header'>Users List</h1>
    <hr />
    <Table columns={columns} dataSource={users}></Table>
  </Layout>
  )
}

export default UsersList
