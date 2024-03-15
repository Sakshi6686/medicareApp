import React from 'react'
import '../styles/frontpg.css'
// import doctor from './images'
import { useNavigate } from 'react-router-dom';
const Frontpg = () => {
  const navigate=useNavigate();
  const handleClickLogin=()=>{
    navigate("/login")
  }
  const handleClickRegister=()=>{
    navigate("/register")
  }
  return (
    <div className="container">
        <div className="logo">
            <img src={require('../pages/images/medi3.jpg')} alt="img"/>
        </div>
        <div className="buttons">
            <button onClick={handleClickLogin}>Login</button>
            <button onClick={handleClickRegister}>Sign Up</button>
        </div>
    </div>
  )
}

export default Frontpg;
