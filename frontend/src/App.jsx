import React from 'react'
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import 'antd/dist/antd.css';
import  "./styles/authentication.css"
import "./index.css"
import "./styles/layout.css"
import { Toaster } from "react-hot-toast"
import Home from './pages/Home';
import Frontpg from './pages/frontpg';
import ProtectedRoute from './component/ProtectedRoute';
import PublicRoute from './component/PublicRoute';
import ApplyDoctor from "./pages/ApplyDoctor"
import Notifications from './pages/Notifications';
import { UseSelector, useSelector } from 'react-redux';
import UsersList from './pages/Admin/UsersList';
import DoctorsList from './pages/Admin/DoctorsList';
import Profile from './pages/Doctor/Profile';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import { SearchProvider } from './context/SearchContext';
 

function App() {
  const {loading}=useSelector((state)=>state.alerts);
  return (

    <BrowserRouter>
    {loading && <div className="spinner-parent">
<div class="spinner-border" role="status">

</div>
</div> }
           <SearchProvider>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login/></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register/></PublicRoute>} />
        <Route path="/verifyemail/:id" element={<PublicRoute><VerifyEmail/></PublicRoute>} />
        <Route path="/resetpassword/:token" element={<PublicRoute><ResetPassword/></PublicRoute>} />
        <Route path="/forgotpassword" element={<PublicRoute><ForgotPassword/></PublicRoute>} />
         
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/apply-doctor" element={<ProtectedRoute><ApplyDoctor/></ProtectedRoute>} />
        <Route path="/admin/userslist" element={<ProtectedRoute><UsersList/></ProtectedRoute>} />
        <Route path="/admin/doctorslist" element={<ProtectedRoute><DoctorsList/></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications/></ProtectedRoute>} />
        <Route path="/doctor/profile/:userId" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/book-appointment/:doctorId" element={<ProtectedRoute><BookAppointment/></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments/></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute><DoctorAppointments/></ProtectedRoute>} />
        <Route path="/" element={<Frontpg />} />
      </Routes>
      </SearchProvider>
    </BrowserRouter>



  )
}

export default App;
