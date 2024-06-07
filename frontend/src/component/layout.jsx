import React, { useState,   useEffect, useContext } from 'react';
import 'antd/dist/antd.css';
 
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge, Input, Button } from 'antd';
import { useSelector } from 'react-redux';
import { SearchContext } from '../context/SearchContext';
import toast from 'react-hot-toast';

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchSpeciality, setSearchSpeciality] = useState('');
  const { setSearchResults } = useContext(SearchContext);
   const location=useLocation();
  
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

  const [location2, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location: ", error);
      }
    );
  }, []);
  useEffect(() => {
    if (!searchSpeciality) {
      setSearchResults([]);
    }
  }, [searchSpeciality, setSearchResults]);
  const handleSearch = async () => {
    if (!location) {
      alert('Location not available');
      return;
    }
    try {
      console.log("hsh",searchSpeciality,location2.latitude,location2.longitude);
      const res = await axios.post(`/api/doctor/search`, {
        searchSpeciality: searchSpeciality,
        latitude: location2.latitude,
        longitude: location2.longitude,
      });

      setSearchResults(res.data.doctors);
      console.log(res.data.message);
    } catch (error) {
      toast.error("something went wrong")
      console.error("Error searching doctors: ", error);
    }
  };

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
            <div className='search-section'>
              <Input
                placeholder="Search speciality..."
                value={searchSpeciality}
                onChange={(e) => setSearchSpeciality(e.target.value)}
                className='search-input'
              />
              <Button onClick={handleSearch} className='search-button'>Search</Button>
            </div>
            <div className='d-flex align-items-center'>
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
