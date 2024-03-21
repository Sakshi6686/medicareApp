import React from 'react'
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import 'antd/dist/antd.css';
import "./styles/authentication.css"
import "./index.css"
import { Toaster } from "react-hot-toast"
import Home from './pages/Home';
import Frontpg from './pages/frontpg';
import ProtectedRoute from './component/ProtectedRoute';
import PublicRoute from './component/PublicRoute';
import ApplyDoctor from "./pages/ApplyDoctor"
import Notifications from './pages/Notifications';
import { UseSelector, useSelector } from 'react-redux';

function App() {
  const {loading}=useSelector((state)=>state.alerts);
  return (

    <BrowserRouter>
    {loading && <div className="spinner-parent">
<div class="spinner-border" role="status">

</div>
</div> }
     
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login/></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register/></PublicRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/apply-doctor" element={<ProtectedRoute><ApplyDoctor/></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications/></ProtectedRoute>} />
        <Route path="/" element={<Frontpg />} />
      </Routes>
    </BrowserRouter>



  )
}

export default App;
