import React, { useEffect, useState } from 'react'
import Layout from '../component/layout'
import { useSelector, useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../redux/alertSlice'
import axios from 'axios'
import { Col, Row } from 'antd'
import Doctor from '../component/Doctor'

const ApprovedDoctors = () => {
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [doctors, setDoctors] = useState([])
 const url="https://medicareapp-backend.onrender.com"
  const getApprovedDoctors = async () => {
    try {
      dispatch(showLoading())
      const res = await axios.get(url+'/api/user/get-approved-doctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: { userId: user._id },
      })

      dispatch(hideLoading())
      if (res.data.success) {
        setDoctors(res.data.data)
      }
    } catch (e) {
      dispatch(hideLoading())
      console.log(e)
    }
  }

  useEffect(() => {
    if (user && user._id) {
      getApprovedDoctors()
    }
  }, [user])
  useEffect(() => {
   console.log(doctors);
  }, [doctors])

  return (
    <Layout>
      <Row gutter={20}>
        {doctors && doctors.map((doctor) => (
          <Col key={doctor.doctorInfo._id} span={8} xs={24} sm={24} lg={8}>
            <Doctor doctor={doctor.doctorInfo} appointment={doctor.appointment} approved={true} />
          </Col>
        ))}
      </Row>
    </Layout>
  )
}

export default ApprovedDoctors
