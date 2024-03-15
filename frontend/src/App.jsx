import React from 'react'
import Login from './pages/Login';
import Register from './pages/Register';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import 'antd/dist/antd.css';
import "./styles/authentication.css"
 import {Toaster} from "react-hot-toast"
import Home from './pages/Home';
 
function App () {
  return (
  
   <BrowserRouter>
   <Toaster
  position="top-center"
  reverseOrder={false}
/>
   <Routes>
    <Route path="/login" element={<Login />} /> 
    <Route path="/register" element={<Register />} /> 
    <Route path="/home" element={<Home />} />
   </Routes>
   </BrowserRouter>
   
   
     
  )
}

export default App;
