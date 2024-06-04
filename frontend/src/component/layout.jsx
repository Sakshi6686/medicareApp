import React, { useState } from 'react';
import 'antd/dist/antd.css';
 
import { useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge } from 'antd';
import { useSelector } from 'react-redux';

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const userId = user && user._id;

  const userMenu = [
    { name1: 'Home', path: '/home', icon: 'ri-home-line' },
    { name1: 'Appointments', path: '/appointments', icon: 'ri-file-list-line' },
    { name1: 'Apply Doctor', path: '/apply-doctor', icon: 'ri-hospital-line' },
  ];

  const doctorMenu = [
    { name1: 'Home', path: '/home', icon: 'ri-home-line' },
    { name1: 'Appointments', path: '/doctor/appointments', icon: 'ri-file-list-line' },
    { name1: 'Profile', path: `/doctor/profile/${userId}`, icon: 'ri-user-line' },
  ];

  const adminMenu = [
    { name1: 'Home', path: '/home', icon: 'ri-home-line' },
    { name1: 'Users', path: '/admin/userslist', icon: 'ri-user-line' },
    { name1: 'Doctors', path: '/admin/doctorslist', icon: 'ri-user-star-line' },
    { name1: 'Profile', path: `/doctor/profile/${userId}`, icon: 'ri-user-line' },
  ];

  let menuToBeRendered = user && user.isAdmin ? adminMenu : user && user.isDoctor ? doctorMenu : userMenu;
  const role = user && user.isAdmin ? 'Admin' : user && user.isDoctor ? 'Doctor' : 'User';

  return (
    <div className='main'>
      <div className='d-flex layout'>
        <div className={`${collapsed ? 'collapsed-sidebar' : 'sidebar'}`}>
          <div className="sidebar-header">
            <h1 className="logo">MA</h1>
            <h1 className="role">{role}</h1>
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <div key={index} className={`d-flex menu-item ${isActive && 'active-menu-item'}`}>
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name1}</Link>}
                </div>
              );
            })}
            <div className={`d-flex menu-item`} onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}>
              <i className='ri-logout-circle-line'></i>
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>
        <div className='content'>
          <div className='header'>
            {collapsed ? (
              <i className="ri-menu-2-fill header-action-icon" onClick={() => setCollapsed(false)}></i>
            ) : (
              <i className="ri-close-fill header-action-icon" onClick={() => setCollapsed(true)}></i>
            )}
            <div className='d-flex align-items-center px-4'>
              <Badge count={user && user.unseenNotification ? user.unseenNotification.length : 0} onClick={() => navigate('/notifications')}>
                <i className="ri-notification-line header-action-icon px-3"></i>
              </Badge>
              <Link className='anchor mx-3' to="/profile">{user?.username}</Link>
            </div>
          </div>
          <div className='body'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
