import React,{useState} from 'react'
import 'antd/dist/antd.css';
import '../layout.css'
import {Link,useLocation} from "react-router-dom";
function Layout ({children}){
    const[collapsed,setCollapsed]=useState(false);
    const location =useLocation()
    const userMenu=[
      {  name1: 'Home',
        path: '/home',
        icon: 'ri-home-line'
    },
    {
        name1:'Appointments',
        path:'./appointments',
        icon:'ri-file-list-line',
    },
    {
        name1:'Apply Doctor',
        path:'./apply-doctor',
        icon:'ri-hospital-line',
    },
    {
        name1:'Profile',
        path:'./profile',
        icon:'ri-user-line',
    },
    {
        name1:'Logout',
        path:'./logout',
        icon:'ri-logout-box-line',
    },
    ];
    const menuToBeRendered= userMenu
  return (
    <div className='main'>
        <div className='d-flex layout'>
            <div className={`${collapsed?'collapsed-sidebar':'sidebar'}`}>
               <div className="sidebar-header">
                <h1 className="logo">MA</h1>
               </div>
               <div className="menu">
                {menuToBeRendered.map((menu)=>{
                    const isActive=location.pathname===menu.path
                    return <div className={`d-flex menu-item ${isActive && 'active-menu-item'}`}>
                        <i className={menu.icon}></i>
                        {!collapsed && <Link to={menu.path}>{menu.name1}</Link> }
                        </div>
                })}

               </div>
            </div>
            <div className='content'>
                <div className='header'>
                  {collapsed?  <i className="ri-menu-2-fill header-action-icon" onClick={()=>setCollapsed(false)}></i>: <i className="ri-close-fill header-action-icon" onClick={()=>setCollapsed(true)}></i>}
                  <div className='d-flex'>
                        <i className="ri-notification-line header-action-icon"></i>
                  </div>
                </div>
                <div className='body'>
                    {children}
                </div>
            </div>
        </div>
      
    </div>
  )
}
export default Layout;


 
