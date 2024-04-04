import React from 'react'
import { Form, Row, Col, Input, TimePicker, Button } from 'antd';
import moment from 'moment';


const DoctorForm = ({ onFinish, initialValues }) => {
  return (
    <Form layout="vertical" onFinish={onFinish} initialValues={{ ...initialValues, ...(initialValues && {timings: [moment(initialValues.timings[0], "HH:mm"), moment(initialValues.timings[1], "HH:mm")]})}} >
      <h1 className="card-title mt-3">Personal Information </h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item required label="First Name" name="firstName" rules={[{ required: true }]}>
            <Input placeholder="First Name"></Input>
          </Form.Item>

        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item required label="Last Name" name="lastName" rules={[{ required: true }]}>
            <Input placeholder="Last Name"></Input>
          </Form.Item>

        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item required label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
            <Input placeholder="Phone Number"></Input>
          </Form.Item>

        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item required label="Website" name="website" rules={[{ required: true }]}>
            <Input placeholder="Website"></Input>
          </Form.Item>

        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item required label="Address" name="address" rules={[{ required: true }]}>
            <Input placeholder="Address"></Input>
          </Form.Item>

        </Col>


      </Row>
      <hr />
      <h1 className="card-title mt-3">Professional Information</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item required label="Specialization" name="specialization" rules={[{ required: true }]}>
            <Input placeholder="Specialization"></Input>
          </Form.Item>

        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item required label="Experience" name="experience" rules={[{ required: true }]}>
            <Input placeholder="Experience(year)" type='number'></Input>
          </Form.Item>

        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item required label="Fee Per Consultaion" name="feePerConsultation" rules={[{ required: true }]}>
            <Input placeholder="Fee Per Consultaion($)" type='number'></Input>
          </Form.Item>

        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item required label="Timings" name="timings" rules={[{required:true}]}>
                     <TimePicker.RangePicker format="HH:mm" /> 
            </Form.Item>
            
            </Col>


      </Row>

      <div className="d-flex justify-content-end">
        <Button className="primary-button" htmlType="submit">SUBMIT</Button>
      </div>
    </Form >
  )
}

export default DoctorForm
