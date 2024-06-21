import Layout from '../../component/layout'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertSlice';
import axios from 'axios'
import { Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom'
import Patient from '../../component/Patient';

const ApprovedPatients = () => {
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    console.log(user);

    const getApprovedPatients = async () => {
        try {
            dispatch(showLoading())
            const res = await axios.get('/api/doctor/get-approved-patients', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: { userIdDoctor: user._id },
            });

            dispatch(hideLoading())
            console.log("res.data ", res.data)
            if (res.data.success) {
                console.log("res.data.data", res.data.data);
                setPatients(res.data.data)
                console.log("patients ", patients);
            }
        } catch (e) {
            dispatch(hideLoading())
            console.log(e);
        }
    };

    useEffect(() => {
        if (user && user._id) {
            getApprovedPatients();
        }
    }, [user]);

    useEffect(() => {
        console.log('patients', patients);
    }, [patients])

    return (
        <Layout>
            <Row gutter={20}>
                {patients && patients.length > 0 && (
                    patients.map((patient) => (
                        <Col key={patient._id} span={8} xs={24} sm={24} lg={8}>
                            <Patient patient={patient} approved={true} />
                        </Col>
                    ))
                )}
            </Row>
        </Layout>
    )
}

export default ApprovedPatients
