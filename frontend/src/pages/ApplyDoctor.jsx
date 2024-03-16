import React from 'react'
import Layout from '../component/layout'
import 'antd/dist/antd.css'
import { Form,Row,Col,Input, TimePicker,Button } from 'antd';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState,useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';

const ApplyDoctor = () => {
  const [user,setUser]=useState({
        
  });
  useEffect(() => {
    const getUser=async()=>{
                try{
                  const res=await axios.post("/api/user/get-user-info-by-id",{},{
                    headers:{
                      Authorization: 'Bearer '+localStorage.getItem("token")
                    }
                  });
                  console.log("res.data.data",res.data.data.user)
                    setUser(res.data.data.user)
                    console.log("user",user);
                    console.log("username",user.username);
              
                } catch(err){
                  console.log(err);
                }
              
              }
            getUser();
    
          }, []);
          const navigate=useNavigate()
  const onFinish=async (values)=>{
       // console.log("Success",values);
        console.log(values);
       try{
        console.log("user and userid",user);
        console.log("user id",user._id);
        console.log("token",localStorage.getItem("token"));
        //console.log({...values,userId:user._id});

      //  const dataTobeSent={...values,userId:user._id}
       // console.log(dataTobeSent);
        const res=await axios.post("/api/user/apply-doctor-account",
      values,
        {
          
        headers:{
          Authorization:'Bearer '+localStorage.getItem("token")
        },
         
        },
    
        );
        console.log("object gen",{...values,userId:user._id});
        console.log(res.data);
        if(res.data.success){
          console.log("toast",res.data.messge);
          toast.success(res.data.message);
          navigate("/home")
        }
        else{
          console.log("toast error",res.data.messge);
          toast.error(res.data.message);
        }
       }
       catch(err){
        console.log(err);
          toast.error("Something went wrong")
       }
  }
  return (
    <Layout>
        <h1 className='page-title'>Apply Doctor</h1>
        <hr />
        <Form layout="vertical" onFinish={onFinish} >
        <h1 className="card-title mt-3">Personal Information </h1>
          <Row gutter={20}>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item required label="First Name" name="firstName" rules={[{required:true}]}>
                      <Input placeholder="First Name"></Input>
            </Form.Item>
            
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item required label="Last Name" name="lastName" rules={[{required:true}]}>
                      <Input placeholder="Last Name"></Input>
            </Form.Item>
            
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item required label="Phone Number" name="phoneNumber" rules={[{required:true}]}>
                      <Input placeholder="Phone Number"></Input>
            </Form.Item>
            
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item required label="Website" name="website" rules={[{required:true}]}>
                      <Input placeholder="Website"></Input>
            </Form.Item>
            
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item required label="Address" name="address" rules={[{required:true}]}>
                      <Input placeholder="Address"></Input>
            </Form.Item>
            
            </Col>
            
          
          </Row>
          <hr />
          <h1 className="card-title mt-3">Professional Information</h1>
          <Row gutter={20}>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item required label="Specialization" name="specialization" rules={[{required:true}]}>
                      <Input placeholder="Specialization"></Input>
            </Form.Item>
            
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item required label="Experience" name="experience" rules={[{required:true}]}>
                      <Input placeholder="Experience(year)" type='number'></Input>
            </Form.Item>
            
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item required label="Fee Per Consultaion" name="feePerConsultation" rules={[{required:true}]}>
                      <Input placeholder="Fee Per Consultaion($)" type='number'></Input>
            </Form.Item>
            
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item required label="Timings" name="timings" rules={[{required:true}]}>
                     <TimePicker.RangePicker  /> 
            </Form.Item>
            
            </Col>
            
          
          </Row>

          <div className="d-flex justify-content-end">
            <Button className="primary-button" htmlType="submit">SUBMIT</Button>
          </div>
        </Form>
    </Layout>
  )
}

export default ApplyDoctor;
