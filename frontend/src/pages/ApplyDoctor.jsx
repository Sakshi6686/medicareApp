import React from 'react'
import Layout from '../component/layout'
import 'antd/dist/antd.css'
import { Form,Row,Col,Input, TimePicker,Button } from 'antd';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState,useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertSlice';


const ApplyDoctor = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {user}=useSelector((state)=>state.user)
  const onFinish=async(values)=>{
    try{
        dispatch(showLoading());
        const res=await axios.post("/api/user/apply-doctor-account",{...values,userId:user._id},
        {headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`,
      },
  }
        );
        dispatch(hideLoading());
        if(res.data.success){
          toast.success(res.data.message)
          navigate("/home")
        }
        else{
          toast.error(res.data.message)
        }


    }
    catch(err){
      dispatch(hideLoading());
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
