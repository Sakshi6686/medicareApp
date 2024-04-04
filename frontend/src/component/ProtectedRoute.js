import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios"
import { setUser} from '../redux/userSlice';
import { hideLoading, showLoading } from '../redux/alertSlice';


const ProtectedRoute = (props) => {
const {user}=useSelector((state)=>state.user)
console.log(user);
const navigate=useNavigate();
const dispatch=useDispatch();;
const getUser=async()=>{

    try{
        dispatch(showLoading());
        const res=await axios.post("/api/user/get-user-info-by-id",{token:localStorage.getItem("token")},
        {headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`,
        },
    })
dispatch(hideLoading())
    if(res.data.success){
            dispatch(setUser(res.data.data))
            console.log("user in protected route res.data.data",user);
          
    }
    else{
        localStorage.clear()
        navigate("/login")
    }

    }
    catch(err){
        dispatch(hideLoading())
        localStorage.clear()
        navigate("/login")
    }

}
    useEffect(()=>{
            if(!user){
                getUser();
            }
    },[user])
    console.log(localStorage.getItem("token"));
    if(localStorage.getItem("token")){
        return props.children;
    }
    else{
    return <Navigate to="/login"/>
    }
  
  
}

export default ProtectedRoute;
