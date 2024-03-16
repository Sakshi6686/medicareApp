import React from 'react'
import { Navigate } from 'react-router-dom';
const ProtectedRoute = (props) => {
    console.log(localStorage.getItem("token"));
    if(localStorage.getItem("token")){
        return props.children;
    }
    else{
    return <Navigate to="/login"/>
    }
  
  
}

export default ProtectedRoute;
