import React from 'react'
import '../styles/frontpg.css'
// import doctor from './images'
const Frontpg = () => {
  return (
    <div className="container">
        <div className="logo">
            <img src={require('./images/doctor.jpg')} alt="img"/>
        </div>
        <div className="buttons">
            <button >Login</button>
            <button>Sign Up</button>
        </div>
    </div>
  )
}

export default Frontpg;
